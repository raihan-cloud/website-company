// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Network } from "lucide-react";

export const metadata: Metadata = {
  title: "JasaNet — Enterprise Network Infrastructure",
  description:
    "Premium B2B network infrastructure, cloud architecture, and enterprise connectivity solutions.",
};

// ─── Nav link configuration ────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Marketplace", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
] as const;

// ─── Footer column configuration ───────────────────────────────────────────
const FOOTER_COLUMNS = [
  {
    heading: "Services",
    links: [
      { label: "Physical Installation", href: "/services/installation" },
      { label: "Network Topology", href: "/services/topology" },
      { label: "Cloud Infrastructure", href: "/services/cloud" },
      { label: "Troubleshooting", href: "/services/support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About JasaNet", href: "/about" },
      { label: "Case Studies", href: "/projects" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "SLA Agreement", href: "/sla" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;

// ─── Component ──────────────────────────────────────────────────────────────
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 antialiased">

      {/* ── Sticky Header ────────────────────────────────────────────────── */}
      <header
        className={[
          "fixed top-0 inset-x-0 z-50",
          "border-b border-slate-800/50",
          "bg-[#020617]/70 backdrop-blur-xl",
        ].join(" ")}
      >
        <nav
          className="mx-auto max-w-7xl px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          <div className="flex h-14 items-center justify-between gap-8">

            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 shrink-0"
              aria-label="JasaNet home"
            >
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-sm",
                  "bg-slate-50 text-[#020617]",
                  "transition-transform duration-200 ease-out group-hover:scale-95",
                ].join(" ")}
              >
                <Network className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-mono text-sm font-semibold tracking-widest uppercase text-slate-50">
                JasaNet
              </span>
            </Link>

            {/* Center nav links — hidden on mobile */}
            <ul className="hidden md:flex items-center gap-0.5" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "px-3.5 py-1.5 rounded-sm",
                      "font-mono text-xs tracking-wider text-slate-400",
                      "transition-colors duration-150 hover:text-slate-50",
                      "hover:bg-slate-800/50",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA cluster */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className={[
                  "hidden sm:inline-flex items-center gap-1",
                  "font-mono text-xs tracking-wider text-slate-400",
                  "transition-colors duration-150 hover:text-slate-50",
                ].join(" ")}
              >
                Get in touch
              </Link>

              <Link
                href="/services"
                className={[
                  "group inline-flex items-center gap-1.5",
                  "h-8 px-4 rounded-sm",
                  "bg-slate-50 text-[#020617]",
                  "font-mono text-xs font-medium tracking-wider",
                  "transition-all duration-200 ease-out",
                  "hover:bg-slate-200",
                ].join(" ")}
              >
                Marketplace
                <ArrowUpRight
                  className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </Link>
            </div>

          </div>
        </nav>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="pt-14">{children}</main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-slate-800/50 bg-[#020617]"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Upper footer */}
          <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4 lg:gap-16">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="group inline-flex items-center gap-2.5 mb-5"
                aria-label="JasaNet home"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-50 text-[#020617]">
                  <Network className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="font-mono text-sm font-semibold tracking-widest uppercase text-slate-50">
                  JasaNet
                </span>
              </Link>

              <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Enterprise-grade network infrastructure and cloud architecture for B2B operations.
              </p>

              {/* Certification badge */}
              <div className="mt-6 inline-flex items-center gap-2 border border-slate-800/70 px-3 py-1.5 rounded-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
                  ISO 27001 Certified
                </span>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="font-mono text-[10px] tracking-widest uppercase text-slate-600 mb-4">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5" role="list">
                  {col.links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-xs text-slate-500 transition-colors duration-150 hover:text-slate-300"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Lower footer — divider + legal */}
          <div className="border-t border-slate-800/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-wider text-slate-700 uppercase">
              © {new Date().getFullYear()} JasaNet. All rights reserved.
            </p>
            <p className="font-mono text-[10px] tracking-wider text-slate-700 uppercase">
              Jakarta · Aceh · Remote
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}