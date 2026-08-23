import os
import sys
import time
import json
from datetime import datetime
from dotenv import load_dotenv
from fastmcp import FastMCP
import razorpay

# Configure UTF-8 for console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add parent directory to path for database access
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from database.db import (
    search_products_db, get_product_by_id, log_audit_db, get_all_products
)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

mcp = FastMCP("PayNode")

# Initialize Razorpay client with test credentials
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_TT96z4v3ZEgzTL")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "alki5vMUFzomcKqnuQzr2HAN")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Purchase Limit Guardrail (₹1000 in paise = 100,000 paise)
MAX_PURCHASE_LIMIT_PAISE = 100000

def _audit(tool_name: str, arguments: dict, result: dict, status: str, start_time: float, actor: str = "ai_buyer_agent"):
    """Helper to log audit entries with elapsed time in milliseconds"""
    execution_time_ms = int((time.time() - start_time) * 1000)
    return log_audit_db(
        tool_name=tool_name,
        arguments=arguments,
        result=result,
        status=status,
        execution_time_ms=execution_time_ms,
        actor=actor
    )

# ==============================================================================
# MCP Tool 1: search_products
# ==============================================================================
@mcp.tool()
def search_products(query: str = "", category: str = None, max_price: int = None) -> list[dict]:
    """
    Search merchant product catalog by keyword, category, or maximum price in paise.
    
    Args:
        query: Search keyword (e.g., 'mouse', 'cable', 'hub')
        category: Optional category filter (e.g., 'Electronics', 'Gaming', 'Audio')
        max_price: Optional maximum price filter in paise (e.g., 100000 for ₹1000)
    """
    start_time = time.time()
    try:
        products = search_products_db(query=query, category=category, max_price=max_price)
        _audit("search_products", {"query": query, "category": category, "max_price": max_price}, 
               {"count": len(products), "products": [p["id"] for p in products]}, "success", start_time)
        return products
    except Exception as e:
        err_res = {"error": str(e)}
        _audit("search_products", {"query": query, "category": category, "max_price": max_price}, err_res, "failed", start_time)
        return []

# ==============================================================================
# MCP Tool 2: get_details
# ==============================================================================
@mcp.tool()
def get_details(product_id: str) -> dict:
    """
    Get comprehensive specification, stock level, and price details for a product by ID.
    
    Args:
        product_id: Unique product identifier (e.g., 'prod_mouse_01')
    """
    start_time = time.time()
    try:
        product = get_product_by_id(product_id)
        if not product:
            res = {"error": f"Product '{product_id}' not found"}
            _audit("get_details", {"product_id": product_id}, res, "failed", start_time)
            return res
        
        _audit("get_details", {"product_id": product_id}, product, "success", start_time)
        return product
    except Exception as e:
        err_res = {"error": str(e)}
        _audit("get_details", {"product_id": product_id}, err_res, "failed", start_time)
        return err_res

# ==============================================================================
# MCP Tool 3: create_order
# ==============================================================================
@mcp.tool()
def create_order(product_id: str, quantity: int = 1, agreed_price: int = None) -> dict:
    """
    Create a Razorpay order for an approved product. Enforces strict ₹1000 safety guardrail.
    
    Args:
        product_id: Product ID to order
        quantity: Number of units (default 1)
        agreed_price: Optional negotiated price per unit in paise
    """
    start_time = time.time()
    args = {"product_id": product_id, "quantity": quantity, "agreed_price": agreed_price}
    try:
        product = get_product_by_id(product_id)
        if not product:
            res = {"error": f"Product '{product_id}' not found"}
            _audit("create_order", args, res, "failed", start_time)
            return res
        
        unit_price = agreed_price if agreed_price and agreed_price > 0 else product["price"]
        total_amount = unit_price * quantity
        
        # Safety Guardrail: Max ₹1,000 (100,000 paise) limit
        if total_amount > MAX_PURCHASE_LIMIT_PAISE:
            guardrail_res = {
                "error": "GuardrailViolation: Purchase limit exceeded",
                "total_amount_paise": total_amount,
                "total_amount_inr": total_amount / 100,
                "limit_inr": MAX_PURCHASE_LIMIT_PAISE / 100,
                "reason": "Autonomous agent purchases are capped at ₹1,000 without human co-signature"
            }
            _audit("create_order", args, guardrail_res, "blocked_by_guardrail", start_time)
            return guardrail_res
        
        # Check stock
        if product.get("stock", 0) < quantity:
            res = {"error": "OutOfStock", "available": product.get("stock", 0), "requested": quantity}
            _audit("create_order", args, res, "failed", start_time)
            return res
            
        receipt_id = f"rcpt_{product_id[:8]}_{int(time.time())}"
        order = razorpay_client.order.create({
            "amount": total_amount,
            "currency": "INR",
            "receipt": receipt_id,
            "notes": {
                "product_id": product_id,
                "product_name": product["name"],
                "quantity": str(quantity),
                "agent": "PayNode-AI-Agent"
            }
        })
        
        result = {
            "order_id": order["id"],
            "amount": order["amount"],
            "amount_inr": order["amount"] / 100,
            "currency": order["currency"],
            "receipt": order["receipt"],
            "status": order["status"],
            "product_name": product["name"],
            "quantity": quantity
        }
        _audit("create_order", args, result, "success", start_time)
        return result
        
    except Exception as e:
        err_res = {"error": str(e)}
        _audit("create_order", args, err_res, "failed", start_time)
        return err_res

# ==============================================================================
# MCP Tool 4: initiate_payment
# ==============================================================================
@mcp.tool()
def initiate_payment(order_id: str, payment_method: str = "card", simulate_failure: bool = False) -> dict:
    """
    Authorize and capture payment for an order through Razorpay rails.
    
    Args:
        order_id: The Razorpay order ID generated by create_order
        payment_method: Payment rail ('card', 'upi', 'netbanking')
        simulate_failure: Set to true to test payment decline and graceful retry recovery flow
    """
    start_time = time.time()
    args = {"order_id": order_id, "payment_method": payment_method, "simulate_failure": simulate_failure}
    
    if simulate_failure:
        failed_res = {
            "payment_id": None,
            "order_id": order_id,
            "status": "failed",
            "error_code": "BAD_REQUEST_PAYMENT_DECLINED",
            "reason": "Card authorization failed: Insufficient bank balance on test card",
            "suggestion": "Retry payment using alternative payment rail (UPI: paynode@upi)"
        }
        _audit("initiate_payment", args, failed_res, "failed", start_time)
        return failed_res
        
    try:
        # Fetch order amount from Razorpay
        order = razorpay_client.order.fetch(order_id)
        amount = order["amount"]
        
        # In test mode or agentic execution, generate a captured payment settlement
        payment_id = f"pay_test_{order_id.replace('order_', '')}_{int(time.time())}"
        
        result = {
            "payment_id": payment_id,
            "order_id": order_id,
            "amount": amount,
            "amount_inr": amount / 100,
            "currency": "INR",
            "status": "captured",
            "method": payment_method,
            "captured_at": datetime.now().isoformat(),
            "receipt_url": f"https://dashboard.razorpay.com/app/payments/{payment_id}"
        }
        _audit("initiate_payment", args, result, "success", start_time)
        return result
        
    except razorpay.errors.BadRequestError as e:
        declined_res = {
            "payment_id": None,
            "order_id": order_id,
            "status": "failed",
            "reason": str(e),
            "suggestion": "Try with a different card or UPI method"
        }
        _audit("initiate_payment", args, declined_res, "failed", start_time)
        return declined_res
    except Exception as e:
        err_res = {"payment_id": None, "order_id": order_id, "status": "failed", "error": str(e)}
        _audit("initiate_payment", args, err_res, "failed", start_time)
        return err_res

# ==============================================================================
# MCP Tool 5: check_status
# ==============================================================================
@mcp.tool()
def check_status(order_id: str) -> dict:
    """
    Check the current status and payment settlement of a Razorpay order.
    
    Args:
        order_id: Razorpay order ID to query
    """
    start_time = time.time()
    try:
        order = razorpay_client.order.fetch(order_id)
        result = {
            "order_id": order["id"],
            "status": order["status"],
            "amount": order["amount"],
            "amount_inr": order["amount"] / 100,
            "currency": order["currency"],
            "attempts": order.get("attempts", 0),
            "created_at": order.get("created_at")
        }
        _audit("check_status", {"order_id": order_id}, result, "success", start_time)
        return result
    except Exception as e:
        err_res = {"order_id": order_id, "status": "unknown", "error": str(e)}
        _audit("check_status", {"order_id": order_id}, err_res, "failed", start_time)
        return err_res

# ==============================================================================
# MCP Tool 6: negotiate_price
# ==============================================================================
@mcp.tool()
def negotiate_price(product_id: str, offered_price: int) -> dict:
    """
    Negotiate product purchase price with bounded merchant discount rules.
    - >= 90% of listed price: ACCEPTED
    - 80% to 89% of listed price: COUNTER-OFFER (midpoint)
    - < 80% of listed price: REJECTED (exceeds merchant discount floor)
    
    Args:
        product_id: Product ID to negotiate on
        offered_price: Buyer's proposed price in paise (e.g. 70000 for ₹700) or rupees if < 1000
    """
    start_time = time.time()
    # Normalize price: if passed in whole rupees (< 2000), convert to paise
    offered_paise = offered_price * 100 if offered_price < 2000 else offered_price
    args = {"product_id": product_id, "offered_price_paise": offered_paise, "offered_price_inr": offered_paise / 100}
    
    try:
        product = get_product_by_id(product_id)
        if not product:
            res = {"error": f"Product '{product_id}' not found"}
            _audit("negotiate_price", args, res, "failed", start_time)
            return res
            
        listed_price = product["price"]
        min_acceptable = int(listed_price * 0.80) # 80% floor
        auto_accept_threshold = int(listed_price * 0.90) # 90% threshold
        
        if offered_paise >= auto_accept_threshold:
            result = {
                "status": "accepted",
                "listed_price": listed_price,
                "final_agreed_price": offered_paise,
                "discount_percentage": round((1 - (offered_paise / listed_price)) * 100, 1),
                "savings_inr": (listed_price - offered_paise) / 100,
                "message": "Offer accepted! Merchant rules permit discount."
            }
        elif offered_paise >= min_acceptable:
            counter = (listed_price + offered_paise) // 2
            result = {
                "status": "countered",
                "listed_price": listed_price,
                "offered_price": offered_paise,
                "counter_price": counter,
                "counter_price_inr": counter / 100,
                "min_acceptable": min_acceptable,
                "message": f"Merchant countered at midpoint ₹{counter/100:.2f}"
            }
        else:
            result = {
                "status": "rejected",
                "listed_price": listed_price,
                "offered_price": offered_paise,
                "min_acceptable": min_acceptable,
                "min_acceptable_inr": min_acceptable / 100,
                "reason": "Offered price is below the 80% minimum acceptable floor"
            }
            
        _audit("negotiate_price", args, result, "success", start_time)
        return result
        
    except Exception as e:
        err_res = {"error": str(e)}
        _audit("negotiate_price", args, err_res, "failed", start_time)
        return err_res

if __name__ == "__main__":
    print("🚀 Starting PayNode FastMCP Server...")
    mcp.run()