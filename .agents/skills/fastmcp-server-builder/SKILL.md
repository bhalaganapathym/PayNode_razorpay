---
name: fastmcp-server-builder
description: Building high-performance Model Context Protocol (MCP) servers in Python using FastMCP.
---

# FastMCP Server Builder Skill

Patterns, best practices, and guidelines for developing Model Context Protocol (MCP) servers in Python using the `fastmcp` framework.

## Key Concepts
1. **Tools**: Functions decorated with `@mcp.tool()` exposed to LLMs for tool calling.
2. **Resources**: Static or dynamic context payloads exposed to LLMs via `@mcp.resource()`.
3. **Prompts**: Parameterized reusable prompts registered via `@mcp.prompt()`.
4. **Transport**: stdio (standard input/output) for local desktop agents or SSE/HTTP for remote gateway servers.

## FastMCP Server Blueprint

```python
from fastmcp import FastMCP
from typing import List, Optional

mcp = FastMCP("CommerceGateway")

@mcp.tool()
def search_catalog(query: str, max_price_paise: Optional[int] = None) -> List[dict]:
    """Search store products by keyword and price ceiling."""
    # Perform lookup logic
    return [{"id": "prod_1", "name": "Wireless Mouse", "price": 79900}]

@mcp.tool()
def checkout(product_id: str, quantity: int = 1) -> dict:
    """Create order and charge payment rails."""
    return {"order_id": "order_123", "status": "captured"}

if __name__ == "__main__":
    mcp.run()
```

## Production Guidelines
- Provide clear type annotations and comprehensive docstrings for every tool parameter.
- Return structured dictionaries/lists instead of raw unformatted strings.
- Gracefully handle exceptions and return error dictionaries with actionable suggestions.
