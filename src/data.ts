/**
 * KNOWLEDGE BASE — Twisted Nail.
 *
 * This is the ONLY file that holds client content. Everything else is plumbing.
 * Drafted from https://twistednail.com (homepage, services, materials, FAQ).
 * Content is quoted/paraphrased from on-site copy — no invented prices, specs,
 * hours, or credentials. Gaps that need the client are marked NEEDS CLIENT INPUT.
 */

export type Offering = {
  /** stable url-safe id, e.g. "heavy-haul" */
  id: string;
  name: string;
  /** one-line summary an agent can quote */
  summary: string;
  /** full description, 1–3 short paragraphs */
  description: string;
  /** optional tags for filtering/search; every offering is tagged "service" or "material" */
  tags?: string[];
  /** optional, only if the client publishes it on-site (Twisted Nail is quote-based) */
  price?: string;
  /** canonical page on the client site */
  url?: string;
};

export type Faq = {
  question: string;
  answer: string;
  /** optional grouping, e.g. "ordering", "hauling" */
  category?: string;
};

export type Overview = {
  /** 2–4 sentences. What the org is, who it serves, what makes it distinct. */
  description: string;
  /** quick facts an agent can cite: founded, model, service area, etc. */
  facts: { label: string; value: string }[];
  /** the single best next action for a visitor, in plain language */
  primaryCta: { label: string; url: string };
};

/** Twisted Nail hauls — no storefront. Coverage is a set of cities, not addresses. */
export type ServiceAreas = {
  region: string;
  cities: string[];
  dispatchPhone: string;
  contactUrl: string;
  note?: string;
};

export type KnowledgeBase = {
  overview: Overview;
  offerings: Offering[];
  serviceAreas: ServiceAreas;
  faqs: Faq[];
};

/* ──────────────────────────────────────────────────────────────────────── */

export const KB: KnowledgeBase = {
  overview: {
    description:
      "Twisted Nail is a Central Texas construction trucking and wholesale aggregate supply company — \"One-Call Construction Trucking & Wholesale Aggregate Supply.\" Founded in 2014, it connects contractors to a network of 140+ local quarries and 150+ owner-operator trucks, handling both material supply and hauling on a single call. Its focus is straightforward, transparent, owner-direct operations.",
    facts: [
      { label: "Industry", value: "Construction trucking & wholesale aggregate supply" },
      { label: "Founded", value: "2014" },
      { label: "Fleet model", value: "100% owner-operator (150+ local operators)" },
      { label: "Supplier network", value: "140+ quarries & aggregate suppliers" },
      { label: "Service area", value: "Central Texas — Austin, Bryan, Killeen, Round Rock, San Antonio, Temple, Waco" },
      { label: "Minimum order", value: "10 yards of aggregate (1 full tandem load)" },
      { label: "Track record", value: "1M+ tons delivered · 175+ 5-star Google reviews" },
      { label: "Website", value: "https://twistednail.com" },
    ],
    primaryCta: {
      label: "Let's Talk — request a quote",
      url: "https://twistednail.com/contact-us/",
    },
  },

  offerings: [
    // ── Services ──────────────────────────────────────────────────────────
    {
      id: "aggregate-supply",
      name: "Aggregate Supply",
      summary: "Wholesale aggregate sourced from a 140+ quarry supplier network at competitive prices.",
      description:
        "\"Our network of 140+ local quarries and aggregate suppliers ensures access to the materials you need at a competitive price.\" Twisted Nail sources limestone, river rock, granite, sand, fill & soil, and recycled materials — native to the area or shipped in as needed.",
      tags: ["service", "aggregate", "supply", "wholesale"],
      url: "https://twistednail.com",
    },
    {
      id: "trucking",
      name: "Trucking Provider",
      summary: "Daily fleet of 150+ local owner-operators for material import and export.",
      description:
        "\"Our industry-leading daily fleet of 150+ local owner-operators are experts in material import and export.\" Twisted Nail runs a 100% owner-operator model across Central Texas.",
      tags: ["service", "trucking", "hauling"],
      url: "https://twistednail.com",
    },
    {
      id: "freight-brokering",
      name: "Freight Brokering",
      summary: "Broker services backed by guaranteed pay, competitive rates, and honest operations.",
      description:
        "\"Guaranteed pay, competitive rates from our large customer network, & our unshakable commitment to honest operations.\" Customers choose Twisted Nail as a freight broker because it is straightforward, transparent, and has an industry-leading track record of success.",
      tags: ["service", "freight", "brokering"],
      url: "https://twistednail.com",
    },
    {
      id: "heavy-haul",
      name: "Heavy Haul Services",
      summary: "Full-service specialized and super heavy haul through top carrier partners.",
      description:
        "Twisted Nail partners with top heavy haul carriers and offers full-service specialized projects: \"We have hauled super heavy haul and highly specialized projects… you just point us to what you would like moved and tell us where to put it.\"",
      tags: ["service", "heavy-haul", "specialized"],
      url: "https://twistednail.com",
    },

    // ── Materials ─────────────────────────────────────────────────────────
    // Site lists these material types by name. Grades, sizing, and pricing are
    // quote-based — omitted here rather than guessed.
    {
      id: "limestone",
      name: "Limestone",
      summary: "Limestone aggregate available through the Twisted Nail supplier network.",
      description:
        "Limestone aggregate. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "limestone"],
      url: "https://twistednail.com",
    },
    {
      id: "river-rock",
      name: "River Rock",
      summary: "River rock aggregate available through the Twisted Nail supplier network.",
      description:
        "River rock. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "river-rock"],
      url: "https://twistednail.com",
    },
    {
      id: "granite",
      name: "Granite",
      summary: "Granite aggregate available through the Twisted Nail supplier network.",
      description:
        "Granite. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "granite"],
      url: "https://twistednail.com",
    },
    {
      id: "sand",
      name: "Sand",
      summary: "Sand available through the Twisted Nail supplier network.",
      description:
        "Sand. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "sand"],
      url: "https://twistednail.com",
    },
    {
      id: "fill-soil",
      name: "Fill & Soil",
      summary: "Fill and soil available through the Twisted Nail supplier network.",
      description:
        "Fill & soil. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "fill", "soil"],
      url: "https://twistednail.com",
    },
    {
      id: "recycled-materials",
      name: "Recycled Materials",
      summary: "Recycled aggregate available through the Twisted Nail supplier network.",
      description:
        "Recycled materials. Sourced through Twisted Nail's 140+ quarry and supplier network; grades, sizing, and pricing are quote-based — contact Twisted Nail for specifics.",
      tags: ["material", "aggregate", "recycled"],
      url: "https://twistednail.com",
    },
  ],

  serviceAreas: {
    region: "Central Texas",
    cities: ["Austin", "Bryan", "Killeen", "Round Rock", "San Antonio", "Temple", "Waco"],
    dispatchPhone: "254-651-3597",
    contactUrl: "https://twistednail.com/contact-us/",
    note: "Twisted Nail is a trucking and aggregate supply company (no retail storefront). Materials can be native to the area or shipped in from elsewhere.",
  },

  faqs: [
    {
      question: "Can Twisted Nail find the aggregate I need?",
      answer:
        "Yes. The material you're looking for may be native to the area or may need to be shipped in from elsewhere — either way, we're happy to get you on the right path through our 140+ quarry and supplier network.",
      category: "ordering",
    },
    {
      question: "What's the minimum order?",
      answer:
        "10 yards of aggregate (1 full tandem load). For quantities smaller than 10 yards it's more cost efficient for the customer to arrange pickup.",
      category: "ordering",
    },
    {
      question: "Do you assist with heavy hauls?",
      answer:
        "Yes. We have hauled super heavy haul and highly specialized projects — you just point us to what you'd like moved and tell us where to put it.",
      category: "hauling",
    },
    {
      question: "Why choose Twisted Nail as a freight broker?",
      answer:
        "Customers choose Twisted Nail because we are straightforward, transparent, and have an industry-leading track record of success — with guaranteed pay and competitive rates from our large customer network.",
      category: "freight",
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────
 * Search index — flattens the KB into searchable records so search_knowledge
 * works out of the box. No need to edit.
 * ──────────────────────────────────────────────────────────────────────── */

export type SearchRecord = {
  type: "overview" | "offering" | "service-areas" | "faq";
  id: string;
  title: string;
  text: string;
  url?: string;
};

export function buildSearchIndex(kb: KnowledgeBase): SearchRecord[] {
  const records: SearchRecord[] = [];

  records.push({
    type: "overview",
    id: "overview",
    title: "About Twisted Nail",
    text: [kb.overview.description, ...kb.overview.facts.map((f) => `${f.label}: ${f.value}`)].join("\n"),
    url: kb.overview.primaryCta.url,
  });

  for (const o of kb.offerings) {
    records.push({
      type: "offering",
      id: o.id,
      title: o.name,
      text: [o.summary, o.description, (o.tags ?? []).join(" "), o.price ?? ""].join("\n"),
      url: o.url,
    });
  }

  records.push({
    type: "service-areas",
    id: "service-areas",
    title: `Service area — ${kb.serviceAreas.region}`,
    text: [kb.serviceAreas.cities.join(", "), kb.serviceAreas.dispatchPhone, kb.serviceAreas.note ?? ""].join("\n"),
    url: kb.serviceAreas.contactUrl,
  });

  for (const [i, f] of kb.faqs.entries()) {
    records.push({
      type: "faq",
      id: `faq-${i}`,
      title: f.question,
      text: f.answer,
    });
  }

  return records;
}
