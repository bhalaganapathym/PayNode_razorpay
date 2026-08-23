import os
import sys
import pytest

# Add paths
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from mcp_server.main import (
    search_products, get_details, create_order,
    initiate_payment, check_status, negotiate_price,
    MAX_PURCHASE_LIMIT_PAISE
)
from database.db import get_all_products

def test_search_products():
    """Test product catalog search returns active items"""
    results = search_products(query="mouse")
    assert isinstance(results, list)
    assert len(results) > 0
    assert any("mouse" in p["name"].lower() for p in results)

def test_get_details():
    """Test retrieving product details by valid ID"""
    products = get_all_products()
    assert len(products) > 0
    target = products[0]
    
    details = get_details(target["id"])
    assert details["id"] == target["id"]
    assert details["price"] == target["price"]
    assert "name" in details

def test_get_details_nonexistent():
    """Test retrieving details for non-existent product ID returns error dictionary"""
    details = get_details("non_existent_id_12345")
    assert "error" in details

def test_create_order_under_budget():
    """Test creating a Razorpay order within ₹1,000 budget"""
    # Mouse is ₹799 (79900 paise)
    res = create_order("prod_mouse_01", quantity=1)
    assert "order_id" in res
    assert res["order_id"].startswith("order_")
    assert res["amount"] == 79900
    assert res["status"] == "created"

def test_guardrail_purchase_limit_violation():
    """Test ₹1,000 purchase limit strictly blocks over-budget orders"""
    # Keychron Keyboard is ₹4,499 (449900 paise)
    res = create_order("prod_keyboard_05", quantity=1)
    assert "error" in res
    assert "GuardrailViolation" in res["error"]
    assert res["total_amount_inr"] == 4499.0
    assert res["limit_inr"] == 1000.0

def test_negotiate_price_accept_counter_reject():
    """Test price negotiation rules (accept >=90%, counter 80-90%, reject <80%)"""
    # Mouse is ₹799 (79900 paise)
    
    # 1. Offer 95% (₹760 / 76000 paise) -> Should be ACCEPTED
    accept_res = negotiate_price("prod_mouse_01", 76000)
    assert accept_res["status"] == "accepted"
    assert accept_res["final_agreed_price"] == 76000
    
    # 2. Offer 82% (₹655 / 65500 paise) -> Should be COUNTERED
    counter_res = negotiate_price("prod_mouse_01", 65500)
    assert counter_res["status"] == "countered"
    assert counter_res["counter_price"] > 65500
    
    # 3. Offer 50% (₹400 / 40000 paise) -> Should be REJECTED (below 80% floor)
    reject_res = negotiate_price("prod_mouse_01", 40000)
    assert reject_res["status"] == "rejected"
    assert "below" in reject_res["reason"].lower()

def test_payment_initiation_and_status():
    """Test Razorpay payment initiation and status check"""
    order = create_order("prod_cable_03", quantity=1) # ₹299
    assert "order_id" in order
    order_id = order["order_id"]
    
    # Initiate payment
    pay = initiate_payment(order_id, payment_method="card")
    assert pay["status"] == "captured"
    assert pay["payment_id"].startswith("pay_test_")
    
    # Check status
    status = check_status(order_id)
    assert status["order_id"] == order_id
    assert "status" in status

def test_payment_simulated_failure():
    """Test graceful handling when payment is declined"""
    order = create_order("prod_cable_03", quantity=1)
    order_id = order["order_id"]
    
    fail_res = initiate_payment(order_id, payment_method="card", simulate_failure=True)
    assert fail_res["status"] == "failed"
    assert "suggestion" in fail_res
    assert "UPI" in fail_res["suggestion"]
