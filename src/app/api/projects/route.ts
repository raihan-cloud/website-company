// src/app/api/projects/route.ts
//
// Internal API route — consumed by Portfolio server component.
// Replace the MOCK_PROJECTS array with a real DB query (Prisma, Supabase, etc.)
// when ready. The response shape must remain stable.
//
import { NextResponse } from "next/server";
import type { Project } from "@/app/(public)/components/Portfolio";

// ─── Mock dataset — replace with DB layer ───────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    id:       "jasanet-bsi-2024",
    title:    "Core Network Redesign — 48-Branch Rollout",
    client:   "Bank Syariah Indonesia",
    sector:   "Financial Services",
    location: "Jakarta & Aceh",
    year:     "2024",
    summary:
      "Full L2/L3 network refresh across 48 branch offices — replacing legacy hub-and-spoke MPLS with a modern SD-WAN overlay, achieving sub-5ms inter-branch latency and a documented 40% reduction in WAN operating costs.",
    tags:     ["SD-WAN", "MPLS Migration", "BGP", "Cisco Catalyst", "Fortinet"],
    scope: [
      "Site survey & network audit across 48 locations",
      "SD-WAN design with active/active failover",
      "Structured cabling refresh (Cat6A) per branch",
      "Firewall policy migration & hardening",
      "NOC monitoring integration & runbook delivery",
    ],
    outcome: [
      { value: "< 5ms",  label: "Avg. latency"    },
      { value: "−40%",   label: "WAN opex"         },
      { value: "99.98%", label: "Uptime post-go"   },
    ],
    href:       "/projects/bsi-core-network-2024",
    coverAlt:   "Network rack installation at BSI branch — Jakarta",
    accentClass: "bg-slate-300",
  },
  {
    id:       "jasanet-pertamina-2023",
    title:    "Fiber Backbone — Refinery Campus",
    client:   "PT. Pertamina Digital",
    sector:   "Energy & Industrial",
    location: "Dumai, Riau",
    year:     "2023",
    summary:
      "Designed and terminated 18km of OS2 single-mode fiber across an active refinery campus, delivering a fully redundant 10GbE backbone that replaced aging coaxial infrastructure — with zero planned-downtime cut-overs.",
    tags:     ["OS2 Fiber", "10GbE", "Industrial LAN", "OTDR Testing", "Redundancy"],
    scope: [
      "18km OS2 fiber route planning & conduit survey",
      "Fusion splicing & OTDR certification",
      "10GbE core switch stack design (Juniper EX)",
      "Redundant ring topology with RSTP failover",
      "Full as-built documentation & IDF labeling",
    ],
    outcome: [
      { value: "18km",   label: "Fiber laid"       },
      { value: "0",      label: "Downtime events"  },
      { value: "10GbE",  label: "Backbone speed"   },
    ],
    href:       "/projects/pertamina-fiber-backbone-2023",
    coverAlt:   "OS2 fiber termination panel — Pertamina Dumai refinery",
    accentClass: "bg-slate-500",
  },
];

// ─── GET handler ─────────────────────────────────────────────────────────────
export async function GET() {
  // Simulate a short DB latency in dev (remove in production)
  if (process.env.NODE_ENV === "development") {
    await new Promise((r) => setTimeout(r, 80));
  }

  return NextResponse.json(
    { projects: MOCK_PROJECTS },
    {
      status: 200,
      headers: {
        // Cache at the CDN edge for 60s; match the ISR revalidation window
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}