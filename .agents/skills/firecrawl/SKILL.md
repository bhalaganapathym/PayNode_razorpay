---
name: firecrawl
description: Web scraping, crawling, and clean markdown/structured data extraction using Firecrawl.
---

# Firecrawl Web Scraping & Crawling Skill

This skill provides expert workflows and patterns for extracting clean markdown, metadata, and structured JSON from dynamic web pages and multi-page websites using Firecrawl.

## Core Capabilities
1. **Single Page Scraping**: Convert dynamic JS-heavy websites into clean LLM-ready markdown.
2. **Deep Crawling**: Crawl entire documentation sites and domains with path depth limits and regex filters.
3. **Structured Extraction**: Extract schema-compliant JSON data from unstructured web content using LLM extractors.

## Python Integration Example

```python
import os
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# 1. Scrape Single URL
scraped_data = app.scrape_url(
    url="https://docs.razorpay.com",
    params={"formats": ["markdown", "html"]}
)
print(scraped_data["markdown"])

# 2. Crawl Sub-domain
crawl_result = app.crawl_url(
    url="https://example.com/docs",
    params={
        "limit": 50,
        "scrapeOptions": {"formats": ["markdown"]}
    },
    wait_until_done=True
)
```

## Best Practices
- Always sanitize and deduplicate crawled text before passing to LLM context.
- Respect robots.txt and apply rate limits when crawling merchant sites.
- Use `onlyMainContent: true` to strip headers, footers, and cookie banners.
