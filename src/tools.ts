/**
 * TOOLS — the agentic surface AI agents use to query Twisted Nail.
 *
 * Adapted from the kit's default 7. Twisted Nail supplies both SERVICES
 * (aggregate supply, trucking, freight brokering, heavy haul) and MATERIALS
 * (limestone, river rock, granite, sand, fill & soil, recycled), so
 * list_offerings is split into list_services + list_materials. It hauls with no
 * storefront, so get_locations becomes get_service_areas. submit_inquiry becomes
 * request_quote, capturing the material/service + quantity + delivery location a
 * dispatcher actually needs.
 *
 * Tool names are snake_case and stable. Each returns plain text plus a trailing
 * source URL when one exists, so agents can cite Twisted Nail.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KB, buildSearchIndex, type SearchRecord, type Offering } from "./data.js";

const INDEX = buildSearchIndex(KB);

/** Tiny keyword scorer — no embeddings, no runtime AI, no external calls. */
function search(query: string, limit: number): SearchRecord[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return INDEX.map((r) => {
    const hay = `${r.title}\n${r.text}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (r.title.toLowerCase().includes(t)) score += 3;
      if (hay.includes(t)) score += 1;
    }
    return { r, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r);
}

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function withSource(body: string, url?: string) {
  return text(url ? `${body}\n\nSource: ${url}` : body);
}

const services = () => KB.offerings.filter((o) => o.tags?.includes("service"));
const materials = () => KB.offerings.filter((o) => o.tags?.includes("material"));

function listBlock(items: Offering[]): string {
  return items.map((o) => `- ${o.name} (id: ${o.id}) — ${o.summary}`).join("\n");
}

export function registerTools(server: McpServer) {
  // 1 ─ search_knowledge ────────────────────────────────────────────────
  server.tool(
    "search_knowledge",
    "Search everything Twisted Nail publishes — services, aggregate materials, service area, and FAQs — by keyword. Use this first when you don't know which specific tool to call.",
    {
      query: z.string().describe("What the user is looking for, in their own words."),
      limit: z.number().int().min(1).max(20).default(5).describe("Max results."),
    },
    async ({ query, limit }) => {
      const hits = search(query, limit);
      if (hits.length === 0) {
        return text(`No matches for "${query}" in Twisted Nail's knowledge base.`);
      }
      const body = hits
        .map((h, i) => `${i + 1}. [${h.type}] ${h.title}\n   ${h.text.split("\n")[0]}${h.url ? `\n   ${h.url}` : ""}`)
        .join("\n\n");
      return text(`Top ${hits.length} results for "${query}":\n\n${body}`);
    },
  );

  // 2 ─ get_overview ────────────────────────────────────────────────────
  server.tool(
    "get_overview",
    "Get a concise overview of Twisted Nail: what it is, who it serves, key facts (founded, fleet model, service area, minimum order, track record), and the primary next step.",
    {},
    async () => {
      const o = KB.overview;
      const facts = o.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n");
      return withSource(
        `${o.description}\n\nKey facts:\n${facts}\n\nNext step: ${o.primaryCta.label}`,
        o.primaryCta.url,
      );
    },
  );

  // 3 ─ list_services ───────────────────────────────────────────────────
  server.tool(
    "list_services",
    "List Twisted Nail's services — aggregate supply, trucking, freight brokering, and heavy haul — optionally filtered by keyword.",
    {
      filter: z.string().optional().describe("Optional keyword to narrow the list, e.g. 'heavy haul'."),
    },
    async ({ filter }) => {
      let items = services();
      if (filter) {
        const f = filter.toLowerCase();
        items = items.filter(
          (o) =>
            o.name.toLowerCase().includes(f) ||
            o.summary.toLowerCase().includes(f) ||
            (o.tags ?? []).some((t) => t.toLowerCase().includes(f)),
        );
      }
      if (items.length === 0) return text(`No services found${filter ? ` matching "${filter}"` : ""}.`);
      return text(
        `Twisted Nail services${filter ? ` matching "${filter}"` : ""}:\n\n${listBlock(items)}\n\nUse get_offering with an id for full details.`,
      );
    },
  );

  // 4 ─ list_materials ──────────────────────────────────────────────────
  server.tool(
    "list_materials",
    "List the aggregate materials Twisted Nail supplies (limestone, river rock, granite, sand, fill & soil, recycled). Grades, sizing, and pricing are quote-based — use request_quote for a price.",
    {
      filter: z.string().optional().describe("Optional keyword to narrow the list, e.g. 'limestone'."),
    },
    async ({ filter }) => {
      let items = materials();
      if (filter) {
        const f = filter.toLowerCase();
        items = items.filter(
          (o) =>
            o.name.toLowerCase().includes(f) ||
            o.summary.toLowerCase().includes(f) ||
            (o.tags ?? []).some((t) => t.toLowerCase().includes(f)),
        );
      }
      if (items.length === 0) return text(`No materials found${filter ? ` matching "${filter}"` : ""}.`);
      return text(
        `Aggregate materials${filter ? ` matching "${filter}"` : ""}:\n\n${listBlock(items)}\n\nUse get_offering with an id for details, or request_quote for pricing.`,
      );
    },
  );

  // 5 ─ get_offering ────────────────────────────────────────────────────
  server.tool(
    "get_offering",
    "Get full details for one service or material by its id (from list_services or list_materials).",
    {
      id: z.string().describe("The offering id, e.g. 'heavy-haul' or 'limestone'."),
    },
    async ({ id }) => {
      const o = KB.offerings.find((x) => x.id === id);
      if (!o) {
        const ids = KB.offerings.map((x) => x.id).join(", ");
        return text(`No service or material with id "${id}". Available ids: ${ids || "(none)"}.`);
      }
      const parts = [`${o.name}\n`, o.description];
      if (o.price) parts.push(`\nPrice: ${o.price}`);
      if (o.tags?.length) parts.push(`Tags: ${o.tags.join(", ")}`);
      return withSource(parts.join("\n"), o.url);
    },
  );

  // 6 ─ get_service_areas ───────────────────────────────────────────────
  server.tool(
    "get_service_areas",
    "Get the Central Texas cities Twisted Nail serves and how to reach dispatch. Twisted Nail hauls — there is no retail storefront.",
    {},
    async () => {
      const s = KB.serviceAreas;
      const body = [
        `Region: ${s.region}`,
        `Cities served: ${s.cities.join(", ")}`,
        `Dispatch: ${s.dispatchPhone}`,
        s.note ? `\n${s.note}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      return withSource(body, s.contactUrl);
    },
  );

  // 7 ─ get_faqs ────────────────────────────────────────────────────────
  server.tool(
    "get_faqs",
    "Get frequently asked questions for Twisted Nail, optionally filtered by category or keyword.",
    {
      filter: z.string().optional().describe("Optional category or keyword, e.g. 'ordering'."),
    },
    async ({ filter }) => {
      let items = KB.faqs;
      if (filter) {
        const f = filter.toLowerCase();
        items = items.filter(
          (q) =>
            q.question.toLowerCase().includes(f) ||
            q.answer.toLowerCase().includes(f) ||
            (q.category ?? "").toLowerCase().includes(f),
        );
      }
      if (items.length === 0) return text(`No FAQs found${filter ? ` matching "${filter}"` : ""}.`);
      const body = items.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
      return text(body);
    },
  );

  // 8 ─ request_quote ───────────────────────────────────────────────────
  // No backend by default: it validates, then hands back Twisted Nail's real
  // contact channels so the agent can close the loop. Wire to a CRM/webhook in
  // the playbook's optional "go live" step.
  server.tool(
    "request_quote",
    "Request an aggregate/hauling quote on behalf of a user, or get the right way to reach Twisted Nail. By default this confirms the request and returns the official contact channels (no message is sent until a backend is connected). Note the 10-yard / 1-tandem-load minimum for aggregate.",
    {
      name: z.string().describe("The person's name."),
      contact: z.string().describe("Their email or phone."),
      material: z.string().optional().describe("Material or service needed, e.g. 'limestone' or 'heavy haul'."),
      quantity: z.string().optional().describe("Amount needed, e.g. '20 yards'. Aggregate minimum is 10 yards (1 tandem load)."),
      deliveryLocation: z.string().optional().describe("Delivery city/site in Central Texas."),
      details: z.string().optional().describe("Any other details about the job."),
    },
    async ({ name, contact, material, quantity, deliveryLocation, details }) => {
      const s = KB.serviceAreas;
      const summary = [
        `- Contact: ${contact}`,
        material ? `- Material/service: ${material}` : null,
        quantity ? `- Quantity: ${quantity}` : null,
        deliveryLocation ? `- Delivery: ${deliveryLocation}` : null,
        details ? `- Details: ${details}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      const channels = [`Phone (dispatch): ${s.dispatchPhone}`, `Online: ${s.contactUrl}`].join("\n");
      return text(
        `Thanks, ${name}. Here's the quote request I have:\n${summary}\n\n` +
          `No automated submission is connected yet, so reach Twisted Nail directly to confirm and price it:\n${channels}`,
      );
    },
  );
}
