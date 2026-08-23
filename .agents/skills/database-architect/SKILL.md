---
name: database-architect
description: Enterprise database architecture, connection pooling, multi-tenant isolation, caching, and data modeling.
---

# Database Architect Skill

Guidelines for designing high-throughput, resilient database architectures combining relational storage (PostgreSQL/Supabase), caching (Redis), and local embedded storage (SQLite).

## Architectural Patterns
1. **Hybrid Persistence**: Multi-tier architecture utilizing Supabase for cloud sync and SQLite/in-memory buffers for offline fallback.
2. **Connection Pooling**: Use PgBouncer or Supabase poolers to manage connection spikes from serverless agents.
3. **Partitioning**: Partition massive audit log and timeseries tables by date range (e.g. monthly partitions).
4. **Data Integrity**: Enforce foreign keys, check constraints, and atomic transactions for financial mutations.
