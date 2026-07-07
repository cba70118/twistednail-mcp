# Twisted Nail — MCP Server

A remote [Model Context Protocol](https://modelcontextprotocol.io) server that lets
AI assistants and agents query Twisted Nail's services, aggregate materials, Central
Texas service area, and FAQs directly — first-party answers instead of guesses.

> This folder is generated from the **mcp-client-kit** template. All client
> content lives in [`src/data.ts`](src/data.ts); everything else is plumbing.

## Run locally

```bash
npm install
npm run dev        # wrangler dev → http://localhost:8787
```

- Landing page: <http://localhost:8787/>
- MCP endpoint (Streamable HTTP): `http://localhost:8787/mcp`
- SSE endpoint (legacy clients): `http://localhost:8787/sse`

Type-check before shipping:

```bash
npm run typecheck
```

## Connect it to Claude

Add a remote MCP server pointing at `http://localhost:8787/mcp` (local) or your
deployed URL. In `claude_desktop_config.json` you can bridge a remote server with:

```jsonc
{
  "mcpServers": {
    "twistednail": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:8787/mcp"]
    }
  }
}
```

## The 8 tools

Adapted from the kit's default 7: `list_offerings` is split into `list_services` +
`list_materials` (Twisted Nail supplies both), `get_locations` becomes
`get_service_areas` (it hauls — no storefront), and `submit_inquiry` becomes
`request_quote` (captures material + quantity + delivery city).

| Tool | What it does |
| --- | --- |
| `search_knowledge` | Keyword search across the whole knowledge base |
| `get_overview` | About Twisted Nail + key facts + primary CTA |
| `list_services` | Browse services: supply, trucking, brokering, heavy haul |
| `list_materials` | Browse aggregate materials (limestone, granite, sand…) |
| `get_offering` | Full detail on one service or material by id |
| `get_service_areas` | Central Texas cities served + dispatch |
| `get_faqs` | FAQs (optional category/keyword filter) |
| `request_quote` | Confirms a quote request + returns official contact channels |

## Deploy (only when the client signs off)

**Cloudflare Workers** (default):

```bash
npx wrangler login
npm run deploy
```

**Vercel** (alternative): the MCP wiring uses the standard SDK + a Fetch handler,
so it ports to a Vercel Function with [`mcp-handler`](https://www.npmjs.com/package/mcp-handler).
See the kit's BUILD-PLAYBOOK for the swap.

---
MCP server built by Search Influence.
