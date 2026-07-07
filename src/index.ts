/**
 * Worker entry point.
 *
 *   GET  /          → human-facing landing page
 *   ALL  /mcp       → MCP over Streamable HTTP (recommended for agents)
 *   ALL  /sse       → MCP over SSE (legacy clients)
 *   GET  /health    → liveness check
 *
 * Runs on Cloudflare Workers via the `agents` McpAgent (Durable Object-backed
 * sessions). Local demo: `npm run dev` (wrangler dev). See README for Vercel.
 */

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools.js";
import { landingPage } from "./landing.js";

export class ClientMCP extends McpAgent {
  server = new McpServer({
    name: "twistednail-mcp",
    version: "1.0.0",
  });

  async init() {
    registerTools(this.server);
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return ClientMCP.serve("/mcp").fetch(request, env as never, ctx);
    }
    if (url.pathname === "/sse") {
      return ClientMCP.serveSSE("/sse").fetch(request, env as never, ctx);
    }
    if (url.pathname === "/health") {
      return new Response("ok", { headers: { "content-type": "text/plain" } });
    }
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(landingPage(url.origin), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
