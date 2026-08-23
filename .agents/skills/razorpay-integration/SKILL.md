---
name: razorpay-integration
description: Razorpay payment gateway integration for Orders, Payments, Webhooks, Signature Verification, and Test-Mode Rails.
---

# Razorpay Integration Skill

Comprehensive reference for integrating Razorpay APIs with Python, Node.js, and AI agents.

## Core API Workflows
1. **Order Creation**: Create an order on Razorpay servers before initiating checkout.
2. **Payment Authorization & Capture**: Capture payments automatically or manually.
3. **Webhook Verification**: Verify HMAC SHA-256 signatures on payment events.
4. **Refunds & Settlements**: Programmatically issue full or partial refunds.

## Python SDK Reference Example

```python
import razorpay
import hmac
import hashlib

# 1. Initialize Client
client = razorpay.Client(auth=("rzp_test_xxxx", "secret_xxxx"))

# 2. Create Order
order_data = {
    "amount": 79900, # ₹799.00 in paise
    "currency": "INR",
    "receipt": "rcpt_12345",
    "notes": {"agent_id": "paynode_buyer_01"}
}
order = client.order.create(data=order_data)
order_id = order["id"]

# 3. Verify Signature
def verify_payment_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret):
    msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8")
    generated_sig = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(generated_sig, razorpay_signature)
```

## Security Best Practices
- Never expose `RAZORPAY_KEY_SECRET` in frontend code.
- Always verify webhook signatures before modifying order/payment states in your database.
