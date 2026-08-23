---
name: api-integration
description: REST, GraphQL, SSE streaming, WebSockets, rate limiting, and robust third-party API integration patterns.
---

# API Integration & Resilience Skill

Comprehensive patterns for integrating external REST APIs, payment gateways, and real-time streaming endpoints.

## Core Rules
1. **Exponential Backoff & Jitter**: Retry failed transient requests with jittered exponential backoff.
2. **Circuit Breakers**: Prevent cascade failures when upstream services experience degradation.
3. **Structured Error Handling**: Normalize upstream error payloads into standardized client-friendly error objects.
4. **Timeouts**: Always set explicit connect and read timeouts on all HTTP requests.
