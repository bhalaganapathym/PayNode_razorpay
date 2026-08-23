---
name: postgresql-schema-design
description: Relational database schema design, indexing, migrations, and Row Level Security (RLS) for PostgreSQL & Supabase.
---

# PostgreSQL & Supabase Schema Design Skill

Architectural principles for production-grade PostgreSQL schemas, optimized indexes, constraints, and Row Level Security (RLS) policies.

## Key Rules
1. **Money & Precision**: Never use floating point for monetary amounts. Always store in integer currency units (paise, cents) with an explicit `currency` column.
2. **Primary Keys**: Use `UUID` (`gen_random_uuid()`) or `BIGINT IDENTITY` for distributed scalability.
3. **Indexing Strategy**:
   - Create B-tree indexes for foreign keys, lookups, and sorting (`timestamp DESC`).
   - Use GIN indexes for `JSONB` payloads and full-text search columns.
4. **Audit Logs & Immutability**: For compliance/audit trails, use append-only tables with no update triggers.

## Standard Agentic Commerce Schema Pattern

```sql
-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL CHECK (price >= 0), -- Amount in paise
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category_price ON products(category, price) WHERE is_active = TRUE;

-- Immutable Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tool_name VARCHAR(100) NOT NULL,
    arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL,
    execution_time_ms INT DEFAULT 0
);

CREATE INDEX idx_audit_logs_time ON audit_logs(timestamp DESC);
```
