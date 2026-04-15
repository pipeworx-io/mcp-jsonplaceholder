# mcp-jsonplaceholder

JSONPlaceholder MCP — wraps JSONPlaceholder fake REST API (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "jsonplaceholder": {
      "url": "https://gateway.pipeworx.io/jsonplaceholder/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use jsonplaceholder
```

## License

MIT
