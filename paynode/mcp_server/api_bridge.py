import os
import sys
import json
import csv
import io
import time
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from database.db import (
    get_all_products, search_products_db, get_product_by_id,
    save_product, delete_product, get_recent_audit_logs, log_audit_db
)
from mcp_server.main import (
    search_products, get_details, create_order,
    initiate_payment, check_status, negotiate_price
)

# Load environment
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI(
    title="PayNode MCP & REST Gateway",
    description="Bridge server connecting FastMCP tools, Supabase catalog, Razorpay rails, and React Frontend",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# Pydantic Request Models
# ==============================================================================
class ProductCreateModel(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    price: int # in paise
    category: Optional[str] = "Electronics"
    stock: Optional[int] = 10
    image_url: Optional[str] = ""
    sku: Optional[str] = None

class ToolExecutionRequest(BaseModel):
    tool_name: str
    arguments: dict

class AgentRunRequest(BaseModel):
    intent: str
    model_provider: Optional[str] = "gemini" # "gemini", "claude", or "simulation"
    budget_limit: Optional[int] = 100000 # in paise (default ₹1000)

# ==============================================================================
# Product Endpoints (Merchant UI)
# ==============================================================================
@app.get("/api/products")
def list_products(query: Optional[str] = None, category: Optional[str] = None):
    if query or category:
        return search_products_db(query=query or "", category=category)
    return get_all_products()

@app.get("/api/products/{product_id}")
def get_single_product(product_id: str):
    prod = get_product_by_id(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@app.post("/api/products")
def create_or_update_product(product: ProductCreateModel):
    saved = save_product(product.model_dump())
    log_audit_db(
        tool_name="merchant_product_upsert",
        arguments=product.model_dump(),
        result={"status": "saved", "id": saved["id"]},
        status="success",
        actor="merchant_admin"
    )
    return saved

@app.delete("/api/products/{product_id}")
def remove_product(product_id: str):
    success = delete_product(product_id)
    log_audit_db(
        tool_name="merchant_product_delete",
        arguments={"product_id": product_id},
        result={"status": "deleted"},
        status="success",
        actor="merchant_admin"
    )
    return {"success": success, "deleted_id": product_id}

@app.post("/api/products/upload-csv")
async def upload_csv_catalog(file: UploadFile = File(...)):
    """Upload and bulk import CSV catalog"""
    contents = await file.read()
    text = contents.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    
    imported = []
    for row in reader:
        # Expected headers: name, description, price, category, stock, image_url, sku
        price_val = row.get("price", "0")
        try:
            price_paise = int(float(price_val) * 100) if float(price_val) < 2000 else int(float(price_val))
        except ValueError:
            price_paise = 0
            
        prod_data = {
            "name": row.get("name", "Imported Item"),
            "description": row.get("description", ""),
            "price": price_paise,
            "category": row.get("category", "Electronics"),
            "stock": int(row.get("stock", 10)),
            "image_url": row.get("image_url", ""),
            "sku": row.get("sku")
        }
        saved = save_product(prod_data)
        imported.append(saved)
        
    log_audit_db(
        tool_name="bulk_catalog_import",
        arguments={"filename": file.filename, "count": len(imported)},
        result={"imported_count": len(imported)},
        status="success",
        actor="merchant_admin"
    )
    return {"count": len(imported), "products": imported}

# ==============================================================================
# Audit Logs & Analytics
# ==============================================================================
@app.get("/api/audit-logs")
def get_audit_trail(limit: int = 50):
    return get_recent_audit_logs(limit=limit)

@app.get("/api/analytics")
def get_analytics():
    logs = get_recent_audit_logs(limit=200)
    
    total_calls = len(logs)
    success_count = sum(1 for l in logs if l.get("status") == "success")
    failed_count = sum(1 for l in logs if l.get("status") == "failed")
    guardrail_count = sum(1 for l in logs if l.get("status") == "blocked_by_guardrail")
    
    # Tool breakdown
    tool_counts = {}
    for l in logs:
        t = l.get("tool_name", "unknown")
        tool_counts[t] = tool_counts.get(t, 0) + 1
        
    tool_distribution = [{"name": k, "count": v} for k, v in tool_counts.items()]
    
    # Success rate
    success_rate = round((success_count / total_calls * 100), 1) if total_calls > 0 else 100.0
    
    return {
        "total_calls": total_calls,
        "success_count": success_count,
        "failed_count": failed_count,
        "guardrail_blocked": guardrail_count,
        "success_rate": success_rate,
        "tool_distribution": tool_distribution,
        "guardrail_limit_inr": 1000
    }

# ==============================================================================
# Direct MCP Execution
# ==============================================================================
@app.post("/api/mcp/execute")
def execute_tool(req: ToolExecutionRequest):
    tool_map = {
        "search_products": search_products,
        "get_details": get_details,
        "create_order": create_order,
        "initiate_payment": initiate_payment,
        "check_status": check_status,
        "negotiate_price": negotiate_price
    }
    
    if req.tool_name not in tool_map:
        raise HTTPException(status_code=400, detail=f"Tool '{req.tool_name}' not recognized")
        
    fn = tool_map[req.tool_name]
    try:
        res = fn(**req.arguments)
        return {"tool": req.tool_name, "result": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================================================================
# Agent Execution Endpoint
# ==============================================================================
@app.post("/api/agent/run")
def run_agent_endpoint(req: AgentRunRequest):
    from buyer_agent.main import run_agent_trace
    trace_result = run_agent_trace(req.intent, model_provider=req.model_provider)
    return trace_result

# ==============================================================================
# Health Check
# ==============================================================================
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PayNode MCP Gateway",
        "razorpay_mode": "test",
        "guardrails": {"max_limit_inr": 1000, "price_floor_percent": 80},
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
