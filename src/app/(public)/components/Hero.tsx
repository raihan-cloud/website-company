// src/app/(public)/components/Hero.tsx
import Link from "next/link";
import { ArrowUpRight, Radio, Wifi, Server, Shield } from "lucide-react";

// ─── Static metadata — rendered as instrument labels ───────────────────────
const STAT_LABELS = [
  { id: "uptime",   value: "99.97%",  label: "Network Uptime SLA"     },
  { id: "latency",  value: "<2ms",    label: "Avg. Backbone Latency"  },
  { id: "clients",  value: "200+",    label: "Enterprise Clients"     },
  { id: "pops",     value: "14",      label: "Points of Presence"     },
] as const;

// ─── Live status feed — simulates terminal readout ──────────────────────────
const STATUS_FEED = [
  { icon: Radio,  text: "BGP sessions nominal",          status: "ok"   },
  { icon: Wifi,   text: "All uplinks operational",        status: "ok"   },
  { icon: Server, text: "Core router cluster healthy",    status: "ok"   },
  { icon: Shield, text: "Threat detection — 0 alerts",   status: "ok"   },
] as const;

// ─── SVG network grid — pure structural decoration ─────────────────────────
function NetworkGrid() {
  // 7×5 node positions on a normalized 700×400 viewBox
  const cols = 7;
  const rows = 5;
  const nodes: { cx: number; cy: number }[] = [];
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

  const xStep = 700 / (cols - 1);
  const yStep = 400 / (rows - 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // slight jitter to feel organic, not mechanical
      const jx = (((r * 7 + c) * 31) % 40) - 20;
      const jy = (((r * 3 + c) * 17) % 30) - 15;
      nodes.push({ cx: c * xStep + jx, cy: r * yStep + jy });
    }
  }

  // Connect horizontally and diagonally (sparse)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (c < cols - 1) {
        edges.push({
          x1: nodes[i].cx, y1: nodes[i].cy,
          x2: nodes[i + 1].cx, y2: nodes[i + 1].cy,
        });
      }
      if (r < rows - 1 && c < cols - 1) {
        edges.push({
          x1: nodes[i].cx, y1: nodes[i].cy,
          x2: nodes[i + cols + 1].cx, y2: nodes[i + cols + 1].cy,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 700 400"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="grid-fade" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#0f172a" stopOpacity="0"   />
          <stop offset="100%" stopColor="#020617" stopOpacity="1"   />
        </radialGradient>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => (
        <line
          key={`e-${i}`}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="#1e293b"
          strokeWidth="0.6"
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`n-${i}`}
          cx={n.cx} cy={n.cy} r="2.2"
          fill="#334155"
        />
      ))}

      {/* Radial fade overlay to bleed into background */}
      <rect x="0" y="0" width="700" height="400" fill="url(#grid-fade)" />
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[#020617]"
      aria-label="Hero — JasaNet enterprise network infrastructure"
    >

      {/* ── Background network grid ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <NetworkGrid />
      </div>

      {/* ── Horizontal hairline rule — structural anchor ───────────────── */}
      <div className="absolute top-0 inset-x-0 h-px bg-slate-800/60" aria-hidden="true" />

      {/* ── Main layout grid ───────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_400px] min-h-[calc(100svh-3.5rem)]">

          {/* ── LEFT COLUMN — Editorial headline ─────────────────────── */}
          <div className="flex flex-col justify-between py-16 pr-0 lg:pr-14">

            {/* Top — index label */}
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
                Enterprise Network Agency — Est. 2018
              </span>
            </div>

            {/* Center — headline block */}
            <div className="mt-12 lg:mt-0">

              {/* Eyebrow */}
              <div
                className="mb-7 inline-flex items-center gap-2 border border-slate-800/80 px-3 py-1.5 rounded-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400">
                  Infrastructure Operational
                </span>
              </div>

              {/* Main headline — DM Serif Display via next/font or Google Fonts */}
              <h1
                className={[
                  "font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.92]",
                  "tracking-tighter text-slate-50",
                ].join(" ")}
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Network
                <br />
                <span className="text-slate-400">infrastructure</span>
                <br />
                built for
                <br />
                <em className="not-italic text-slate-50">enterprise.</em>
              </h1>

              {/* Sub-copy */}
              <p className="mt-8 max-w-md text-sm leading-7 text-slate-500">
                JasaNet engineers precision-grade network topology, physical
                installation, and cloud connectivity for B2B operations that
                cannot afford downtime.
              </p>

              {/* CTA cluster */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className={[
                    "group inline-flex items-center gap-2",
                    "h-10 px-6 rounded-sm",
                    "bg-slate-50 text-[#020617]",
                    "font-mono text-xs font-semibold tracking-wider uppercase",
                    "transition-all duration-200 ease-out hover:bg-slate-200",
                  ].join(" ")}
                >
                  Browse Marketplace
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </Link>

                <Link
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "inline-flex items-center gap-2",
                    "h-10 px-6 rounded-sm",
                    "border border-slate-800 text-slate-300",
                    "font-mono text-xs tracking-wider uppercase",
                    "transition-colors duration-200 hover:border-slate-600 hover:text-slate-50",
                  ].join(" ")}
                >
                  Talk to an Engineer
                </Link>
              </div>
            </div>

            {/* Bottom — stat strip */}
            <div className="mt-16 lg:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-px border border-slate-800/50 rounded-sm overflow-hidden">
              {STAT_LABELS.map(({ id, value, label }) => (
                <div
                  key={id}
                  className="bg-slate-900/40 px-4 py-4 border-r border-slate-800/50 last:border-r-0"
                >
                  <div
                    className="font-mono text-xl font-semibold tracking-tight text-slate-100"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {value}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-wider text-slate-600 uppercase leading-relaxed">
                    {label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── VERTICAL DIVIDER — structural separator ───────────────── */}
          <div
            className="hidden lg:block w-px bg-slate-800/60 self-stretch"
            aria-hidden="true"
          />

          {/* ── RIGHT COLUMN — Terminal status panel ──────────────────── */}
          <div className="hidden lg:flex flex-col justify-between py-16 pl-10">

            {/* Panel header */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-600">
                  System Status
                </span>
                <span className="font-mono text-[10px] text-slate-700 tabular-nums">
                  NOC — Live
                </span>
              </div>

              {/* Status feed */}
              <ul className="space-y-0 border border-slate-800/60 rounded-sm overflow-hidden" role="list">
                {STATUS_FEED.map(({ icon: Icon, text }, i) => (
                  <li
                    key={i}
                    className={[
                      "group flex items-center gap-3 px-4 py-3.5",
                      "border-b border-slate-800/50 last:border-b-0",
                      "bg-slate-900/20 hover:bg-slate-900/60",
                      "transition-colors duration-150",
                    ].join(" ")}
                  >
                    <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-sm bg-slate-800/60">
                      <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.5} />
                    </span>
                    <span className="flex-1 font-mono text-[11px] text-slate-400 tracking-wide">
                      {text}
                    </span>
                    <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </li>
                ))}
              </ul>

              {/* Pseudo terminal output block */}
              <div className="mt-4 border border-slate-800/60 rounded-sm bg-slate-900/30 px-4 py-4">
                <p className="font-mono text-[10px] text-slate-700 mb-2 tracking-widest uppercase">
                  // last deployment log
                </p>
                <div className="space-y-1.5">
                  {[
                    "> Provisioning edge node — JKT-02",
                    "> BGP peer established (AS65001)",
                    "> VLAN trunk configured — ports 1–24",
                    "> Monitoring handshake complete ✓",
                  ].map((line, i) => (
                    <p key={i} className="font-mono text-[11px] text-slate-500 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column bottom — trust signal */}
            <div className="space-y-3">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-4">
                Trusted by
              </p>
              {[
                "PT. Pertamina Digital",
                "Bank Syariah Indonesia",
                "Telkom Enterprise",
                "Kementerian Kominfo",
              ].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 border-b border-slate-800/30 pb-3 last:border-b-0"
                >
                  <span className="h-px flex-1 bg-slate-800/60" aria-hidden="true" />
                  <span className="font-mono text-[10px] text-slate-600 tracking-wider">
                    {name}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ── Bottom hairline ────────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800/60" aria-hidden="true" />

    </section>
  );
}