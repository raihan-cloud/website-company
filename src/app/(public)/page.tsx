// src/app/(public)/page.tsx
import type { Metadata } from "next";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Portfolio from "./components/Portfolio";
import CTA from "./components/CTA";

// ─── SEO metadata for the home route ────────────────────────────────────────
export const metadata: Metadata = {
  title: "JasaNet — Enterprise Network Infrastructure & Cloud Agency",
  description:
    "JasaNet delivers precision-engineered network infrastructure, cloud architecture, and enterprise connectivity solutions for B2B operations across Indonesia.",
  openGraph: {
    title: "JasaNet — Enterprise Network Infrastructure",
    description:
      "Precision-engineered network infrastructure and cloud solutions for modern B2B enterprises.",
    url: "https://jasanet.id",
    siteName: "JasaNet",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JasaNet — Enterprise Network Infrastructure",
    description:
      "Precision-engineered network infrastructure and cloud solutions for modern B2B enterprises.",
  },
};

// ─── Page component ──────────────────────────────────────────────────────────
//
// This file is intentionally thin — it is a strict orchestrator.
// No layout logic, no data fetching, no styling decisions live here.
// Each section is fully self-contained within its own module.
//
export default function HomePage() {
  return (
    <>
      {/* 01 — Above-the-fold premium headline and context metadata */}
      <Hero />

      {/* 02 — Core solutions grid: installation, topology, troubleshooting */}
      <Features />

      {/* 03 — Selected work fetched from /api/projects (server component) */}
      <Portfolio />

      {/* 04 — Conversion closure: Marketplace and WhatsApp CTA */}
      <CTA />
    </>
  );
}