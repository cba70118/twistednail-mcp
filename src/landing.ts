/**
 * Landing page served at "/" — the human-facing face of the MCP server.
 * Tells a person what this is, how an agent connects, and what it can do.
 * No framework, no build step.
 *
 * NOTE: brand colors below are an industrial placeholder (charcoal + safety
 * orange). Confirm Twisted Nail's real brand hex codes before go-live.
 */

import { KB } from "./data.js";

export function landingPage(origin: string): string {
  const tools = [
    ["search_knowledge", "Search everything by keyword"],
    ["get_overview", "About Twisted Nail at a glance"],
    ["list_services", "Browse services (supply, trucking, brokering, heavy haul)"],
    ["list_materials", "Browse aggregate materials"],
    ["get_offering", "Full detail on one service or material"],
    ["get_service_areas", "Central Texas cities served & dispatch"],
    ["get_faqs", "Frequently asked questions"],
    ["request_quote", "Request a quote / reach dispatch"],
  ];
  const toolRows = tools
    .map(([n, d]) => `<tr><td><code>${n}</code></td><td>${d}</td></tr>`)
    .join("");
  const offeringsCount = KB.offerings.length;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Twisted Nail — MCP Server</title>
<meta name="description" content="Model Context Protocol server for Twisted Nail. Lets AI agents query services, aggregate materials, service areas, and FAQs." />
<style>
  :root { --brand: #1F2A33; --accent: #E8792B; --ink:#1a1a1a; --muted:#666; --line:#e6e6e6; --bg:#fff; }
  * { box-sizing: border-box; }
  body { margin:0; font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:var(--ink); background:var(--bg); }
  .wrap { max-width:760px; margin:0 auto; padding:48px 24px 80px; }
  header { border-bottom:3px solid var(--brand); padding-bottom:20px; margin-bottom:32px; }
  .badge { display:inline-block; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); }
  h1 { font-size:30px; margin:8px 0 4px; }
  .tagline { color:var(--muted); margin:0; }
  h2 { font-size:18px; margin:36px 0 12px; }
  p { margin:12px 0; }
  code { background:#f4f4f5; padding:2px 6px; border-radius:4px; font-size:14px; }
  pre { background:#1a1a1a; color:#f4f4f5; padding:16px; border-radius:8px; overflow:auto; font-size:13px; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  td { padding:8px 0; border-bottom:1px solid var(--line); vertical-align:top; }
  td:first-child { width:42%; white-space:nowrap; }
  .cta { display:inline-block; margin-top:8px; background:var(--brand); color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; font-weight:600; }
  footer { margin-top:48px; padding-top:20px; border-top:1px solid var(--line); color:var(--muted); font-size:13px; }
  a { color:var(--accent); }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="badge">MCP Server</span>
    <h1>Twisted Nail</h1>
    <p class="tagline">One-Call Construction Trucking &amp; Wholesale Aggregate Supply</p>
  </header>

  <p>This is a <strong>Model Context Protocol</strong> server for Twisted Nail. It lets AI assistants
  and agents query our ${offeringsCount > 0 ? `${offeringsCount} ` : ""}services and aggregate materials, Central Texas
  service area, and FAQs directly — accurate, first-party answers instead of guesses.</p>

  <a class="cta" href="${KB.overview.primaryCta.url}">${KB.overview.primaryCta.label} &rarr;</a>

  <h2>Connect an agent</h2>
  <p>Point any MCP-compatible client at the endpoint below (Streamable HTTP):</p>
  <pre>${origin}/mcp</pre>
  <p>For clients that use Server-Sent Events, the SSE endpoint is <code>${origin}/sse</code>.</p>

  <h2>What agents can do</h2>
  <table>${toolRows}</table>

  <footer>
    <p>Twisted Nail · <a href="https://twistednail.com">twistednail.com</a> · Dispatch 254-651-3597<br/>
    MCP server built by Search Influence.</p>
  </footer>
</div>
</body>
</html>`;
}
