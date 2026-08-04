# mcp-jsonplaceholder

JSONPlaceholder MCP — wraps JSONPlaceholder fake REST API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_posts` | Fetch all fake blog posts for testing and prototyping. Returns post ID, user ID, title, and body text. |
| `get_post` | Fetch a single fake blog post by ID (e.g., "1"). Returns post ID, user ID, title, and body text. |
| `get_users` | Fetch all fake users for testing. Returns name, username, email, address, phone, website, and company details. |
| `get_comments` | Fetch comments for a specific post by post ID (e.g., "1"). Returns comment ID, commenter name, email, and body text. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "jsonplaceholder": {
      "url": "https://gateway.pipeworx.io/jsonplaceholder/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Jsonplaceholder data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
