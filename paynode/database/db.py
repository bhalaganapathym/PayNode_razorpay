import os
import json
import sqlite3
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"⚠️ Supabase initialization note: {e}")

# Local SQLite fallback database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'paynode_local.db')

def init_local_db():
    """Initialize local SQLite tables for robust local/fallback storage"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS merchants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        razorpay_account_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        merchant_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        category TEXT DEFAULT 'Electronics',
        stock INTEGER DEFAULT 10,
        image_url TEXT,
        sku TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        tool_name TEXT NOT NULL,
        arguments TEXT NOT NULL,
        result TEXT NOT NULL,
        status TEXT NOT NULL,
        execution_time_ms INTEGER DEFAULT 0,
        actor_type TEXT DEFAULT 'ai_buyer_agent'
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize immediately
init_local_db()

# ==============================================================================
# Products CRUD
# ==============================================================================

def get_all_products():
    """Retrieve all active products from Supabase with SQLite fallback"""
    if supabase:
        try:
            res = supabase.table("products").select("*").eq("is_active", True).execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception:
            pass
            
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE is_active = 1")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def search_products_db(query: str, category: str = None, max_price: int = None):
    """Search products with query matching, optional category & price filters"""
    query_clean = query.lower().strip()
    
    # Try Supabase first
    if supabase:
        try:
            query_builder = supabase.table("products").select("*").eq("is_active", True)
            if query:
                query_builder = query_builder.ilike("name", f"%{query}%")
            if category:
                query_builder = query_builder.eq("category", category)
            if max_price:
                query_builder = query_builder.lte("price", max_price)
            res = query_builder.execute()
            if res.data is not None and len(res.data) > 0:
                return res.data
        except Exception:
            pass
            
    # SQLite search fallback
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    sql = "SELECT * FROM products WHERE is_active = 1"
    params = []
    
    if query_clean:
        sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)"
        term = f"%{query_clean}%"
        params.extend([term, term, term])
    if category:
        sql += " AND category = ?"
        params.append(category)
    if max_price:
        sql += " AND price <= ?"
        params.append(max_price)
        
    cursor.execute(sql, params)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def get_product_by_id(product_id: str):
    """Fetch product by ID"""
    if supabase:
        try:
            res = supabase.table("products").select("*").eq("id", product_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass
            
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def save_product(product_data: dict):
    """Save or update product in both Supabase and Local SQLite"""
    product_id = product_data.get("id") or str(uuid.uuid4())
    product = {
        "id": product_id,
        "name": product_data.get("name", "Unnamed Product"),
        "description": product_data.get("description", ""),
        "price": int(product_data.get("price", 0)),
        "category": product_data.get("category", "Electronics"),
        "stock": int(product_data.get("stock", 10)),
        "image_url": product_data.get("image_url", ""),
        "sku": product_data.get("sku", f"SKU-{product_id[:8]}"),
        "is_active": 1 if product_data.get("is_active", True) else 0,
        "created_at": product_data.get("created_at") or datetime.now().isoformat()
    }
    
    # Save to local SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
    INSERT OR REPLACE INTO products (id, name, description, price, category, stock, image_url, sku, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        product["id"], product["name"], product["description"], product["price"],
        product["category"], product["stock"], product["image_url"], product["sku"],
        product["is_active"], product["created_at"]
    ))
    conn.commit()
    conn.close()
    
    # Attempt Supabase sync
    if supabase:
        try:
            supabase_payload = dict(product)
            supabase_payload["is_active"] = bool(product["is_active"])
            supabase.table("products").upsert(supabase_payload).execute()
        except Exception:
            pass
            
    return product

def delete_product(product_id: str):
    """Delete or deactivate product"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    
    if supabase:
        try:
            supabase.table("products").delete().eq("id", product_id).execute()
        except Exception:
            pass
    return True

# ==============================================================================
# Audit Logs
# ==============================================================================

def log_audit_db(tool_name: str, arguments: dict, result: dict, status: str, execution_time_ms: int = 0, actor: str = "ai_buyer_agent"):
    """Log an audit entry for agent/MCP actions"""
    log_id = str(uuid.uuid4())
    now_iso = datetime.now().isoformat()
    
    args_json = json.dumps(arguments) if not isinstance(arguments, str) else arguments
    res_json = json.dumps(result) if not isinstance(result, str) else result
    
    # Insert to local SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO audit_logs (id, timestamp, tool_name, arguments, result, status, execution_time_ms, actor_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (log_id, now_iso, tool_name, args_json, res_json, status, execution_time_ms, actor))
    conn.commit()
    conn.close()
    
    # Attempt Supabase insert
    if supabase:
        try:
            supabase.table("audit_logs").insert({
                "id": log_id,
                "timestamp": now_iso,
                "tool_name": tool_name,
                "arguments": arguments if isinstance(arguments, dict) else json.loads(arguments),
                "result": result if isinstance(result, dict) else json.loads(result),
                "status": status,
                "execution_time_ms": execution_time_ms,
                "actor_type": actor
            }).execute()
        except Exception:
            pass
            
    return {
        "id": log_id,
        "timestamp": now_iso,
        "tool_name": tool_name,
        "arguments": arguments,
        "result": result,
        "status": status,
        "execution_time_ms": execution_time_ms,
        "actor_type": actor
    }

def get_recent_audit_logs(limit: int = 50):
    """Fetch recent audit log items"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = []
    for r in cursor.fetchall():
        d = dict(r)
        try:
            d["arguments"] = json.loads(d["arguments"])
        except Exception:
            pass
        try:
            d["result"] = json.loads(d["result"])
        except Exception:
            pass
        rows.append(d)
    conn.close()
    return rows
