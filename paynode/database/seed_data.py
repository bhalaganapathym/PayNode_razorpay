import os
import sys

# Configure UTF-8 for windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from database.db import save_product, log_audit_db

SAMPLE_PRODUCTS = [
    {
        "id": "prod_mouse_01",
        "name": "Logitech M330 Silent Wireless Mouse",
        "description": "2.4GHz Wireless optical mouse with 90% noise reduction, 1000 DPI sensor, and 24-month battery life.",
        "price": 79900, # ₹799.00
        "category": "Electronics",
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
        "sku": "LOGI-M330-SIL"
    },
    {
        "id": "prod_hub_02",
        "name": "Anker 5-in-1 USB-C Hub Adapter",
        "description": "Compact multiport adapter with 4K HDMI, 3 USB 3.0 ports, and 100W Power Delivery pass-through.",
        "price": 89900, # ₹899.00
        "category": "Electronics",
        "stock": 14,
        "image_url": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&auto=format&fit=crop&q=60",
        "sku": "ANK-HUB-5IN1"
    },
    {
        "id": "prod_cable_03",
        "name": "Braided Type-C Fast Charging Cable 2M",
        "description": "Heavy-duty nylon braided 100W fast charging cable with reinforced connectors.",
        "price": 29900, # ₹299.00
        "category": "Accessories",
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
        "sku": "CBL-TC-100W-2M"
    },
    {
        "id": "prod_pad_04",
        "name": "Razer Goliathus Speed Gaming Mousepad",
        "description": "Micro-textured cloth surface for speed and control, anti-fraying stitched frame.",
        "price": 49900, # ₹499.00
        "category": "Gaming",
        "stock": 30,
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60",
        "sku": "RZR-GLTH-MED"
    },
    {
        "id": "prod_keyboard_05",
        "name": "Keychron K2 Mechanical Keyboard (Hot-swappable)",
        "description": "75% Wireless Mechanical Keyboard with Gateron G Pro Brown switches and RGB backlighting.",
        "price": 449900, # ₹4,499.00 (Above limit for test guardrails)
        "category": "Electronics",
        "stock": 8,
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
        "sku": "KEY-K2-RGB-BRN"
    },
    {
        "id": "prod_headset_06",
        "name": "Sony WH-CH520 Wireless Bluetooth Headphones",
        "description": "Lightweight on-ear headphones with 50-hour battery life and DSEE sound upscaling.",
        "price": 99900, # ₹999.00
        "category": "Audio",
        "stock": 12,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        "sku": "SNY-WH520-BLK"
    }
]

def seed_database():
    print("[INIT] Seeding PayNode database with initial tech catalog...")
    for prod in SAMPLE_PRODUCTS:
        saved = save_product(prod)
        print(f"  + Added: {saved['name']} (INR {saved['price']/100:.2f}) [ID: {saved['id']}]")
        
    # Initial audit log
    log_audit_db(
        tool_name="catalog_bootstrap",
        arguments={"count": len(SAMPLE_PRODUCTS)},
        result={"status": "initialized", "merchant": "PayNode Tech Hub"},
        status="success",
        execution_time_ms=12,
        actor="system_bootstrap"
    )
    print("[SUCCESS] Catalog seeded successfully!")

if __name__ == "__main__":
    seed_database()
