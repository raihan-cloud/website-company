// src/app/(public)/components/Features.tsx
import { Cable, GitBranch, Wrench, ArrowUpRight } from "lucide-react";

// ─── Type definitions ────────────────────────────────────────────────────────
interface Feature {
  index:       string;
  icon:        React.ElementType;
  category:    string;
  title:       string;
  description: string;
  points:      string[];
  span:        "wide" | "narrow" | "full";
  accent:      string; // border-top accent color class
  href:        string;
}

// ─── Feature data — declared outside render tree ────────────────────────────
const FEATURES: Feature[] = [
  {
    index:    "01",
    icon:     Cable,
    category: "Physical Layer",
    title:    "Installation & Cabling",
    span:     "wide",
    accent:   "bg-slate-300",
    href:     "/services/installation",
    description:
      "Precision structured cabling, rack-and-stack deployment, and fiber termination for mission-critical enterprise environments — executed to ANSI/TIA-568 standards.",
    points: [
      "Cat6A / Fiber optic structured cabling",
      "Server rack design & cable management",
      "Site survey & capacity planning",
      "Documentation & as-built drawings",
    ],
  },
  {
    index:    "02",
    icon:     GitBranch,
    category: "Network Design",
    title:    "Topology & Architecture",
    span:     "narrow",
    accent:   "bg-slate-500",
    href:     "/services/topology",
    description:
      "Layer 2/3 network design, VLAN segmentation, BGP/OSPF routing architecture, and SD-WAN deployment for multi-site enterprise operations.",
    points: [
      "L2/L3 network design & segmentation",
      "BGP, OSPF, MPLS routing",
      "SD-WAN & failover architecture",
      "Firewall policy & ACL design",
    ],
  },
  {
    index:    "03",
    icon:     Wrench,
    category: "Operations",
    title:    "Diagnostics & Troubleshooting",
    span:     "full",
    accent:   "bg-slate-400",
    href:     "/services/support",
    description:
      "24/7 NOC-backed incident response, root-cause analysis, and proactive monitoring across your entire network stack — from edge to core.",
    points: [
      "24/7 NOC monitoring & incident response",
      "Packet capture & traffic analysis",
      "Performance baseline & SLA reporting",
      "On-site rapid response — SLA < 4hr",
    ],
  },
] as const;

// ─── Metric strip per feature ─────────────────────────────────────────────
const FEATURE_METRICS: Record<string, { value: string; label: string }[]> = {
  "01": [
    { value: "10GbE",  label: "Max link speed"    },
    { value: "OS2",    label: "Fiber grade"        },
    { value: "99.9%",  label: "Termination pass"  },
  ],
  "02": [
    { value: "< 5ms",  label: "Design latency"    },
    { value: "BGP4",   label: "Routing protocol"  },
    { value: "N+1",    label: "Redundancy model"  },
  ],
  "03": [
    { value: "< 4hr",  label: "On-site SLA"       },
    { value: "24/7",   label: "NOC coverage"      },
    { value: "100%",   label: "RCA delivery"      },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: Feature }) {
  const { index, icon: Icon, category, title, description, points, accent, href } = feature;
  const metrics = FEATURE_METRICS[index];

  return (
    <article
      className={[
        "group relative flex flex-col",
        "border border-slate-800/60 bg-[#020617]",
        "transition-all duration-300 ease-out",
        "hover:border-slate-700/80 hover:bg-slate-900/30",
        // wide card gets more horizontal padding
        feature.span === "wide" ? "p-8 lg:p-10" : "p-8",
      ].join(" ")}
    >
      {/* Accent top border — replaces generic gradient */}
      <span
        className={[
          "absolute top-0 inset-x-0 h-px",
          accent,
          "opacity-40 group-hover:opacity-80",
          "transition-opacity duration-300",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Header row — index + icon */}
      <header className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Index */}
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-700 uppercase">
            {index}
          </span>
          {/* Category chip */}
          <span
            className={[
              "inline-flex items-center",
              "border border-slate-800/70 px-2.5 py-1 rounded-sm",
              "font-mono text-[9px] tracking-widest uppercase text-slate-600",
            ].join(" ")}
          >
            {category}
          </span>
        </div>

        {/* Icon box */}
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-sm shrink-0",
            "border border-slate-800/60 bg-slate-900/60",
            "transition-all duration-300 ease-out",
            "group-hover:border-slate-700 group-hover:bg-slate-800/60",
          ].join(" ")}
        >
          <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        </div>
      </header>

      {/* Title */}
      <h3
        className={[
          "font-serif text-2xl tracking-tight text-slate-100 mb-4",
          "transition-colors duration-200 group-hover:text-slate-50",
        ].join(" ")}
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-7 text-slate-500 mb-8">
        {description}
      </p>

      {/* Points list — minimal tick style */}
      <ul className="space-y-2.5 mb-10 flex-1" role="list">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <span
              className="mt-2.5 h-px w-4 bg-slate-700 shrink-0 transition-colors duration-200 group-hover:bg-slate-500"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] tracking-wide leading-relaxed text-slate-500">
              {point}
            </span>
          </li>
        ))}
      </ul>

      {/* Metric strip — bottom panel */}
      <div className="grid grid-cols-3 gap-px border-t border-slate-800/50 pt-6">
        {metrics.map(({ value, label }) => (
          <div key={label}>
            <div
              className="font-mono text-base font-semibold text-slate-300 tabular-nums tracking-tight"
            >
              {value}
            </div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-slate-700 mt-0.5 leading-relaxed">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA link — appears on hover */}
      <a
        href={href}
        className={[
          "mt-6 inline-flex items-center gap-1.5",
          "font-mono text-[11px] tracking-wider uppercase text-slate-600",
          "transition-colors duration-200 hover:text-slate-300",
          "group/link",
        ].join(" ")}
      >
        Learn more
        <ArrowUpRight
          className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          strokeWidth={2}
        />
      </a>
    </article>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Features() {
  const [wide, narrow, full] = FEATURES;

  return (
    <section
      className="relative bg-[#020617] border-t border-slate-800/60"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────── */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20 border-b border-slate-800/50">

          {/* Left — label + headline */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
                Core Capabilities
              </span>
            </div>
            <h2
              id="features-heading"
              className={[
                "font-serif text-[clamp(2rem,4vw,3.25rem)]",
                "leading-[1.05] tracking-tighter text-slate-50",
              ].join(" ")}
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Three pillars of
              <br />
              <span className="text-slate-400">network excellence.</span>
            </h2>
          </div>

          {/* Right — descriptor + SLA badge */}
          <div className="flex flex-col justify-end gap-6">
            <p className="text-sm leading-7 text-slate-500 max-w-sm">
              From first-mile cabling to cloud-edge routing — every engagement is scoped,
              engineered, and delivered under a signed SLA with zero ambiguity.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800/60" aria-hidden="true" />
              <div
                className={[
                  "inline-flex items-center gap-2.5",
                  "border border-slate-800/70 px-4 py-2 rounded-sm",
                ].join(" ")}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500">
                  99.97% uptime SLA guaranteed
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* ── Asymmetric feature grid ─────────────────────────────────── */}
        {/*
            Desktop layout:
            Row 1: [wide — col-span-7] [narrow — col-span-5]
            Row 2: [full — col-span-12]

            This avoids the lazy 3-equal-column grid.
            Each card has a distinct proportion and visual weight.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-800/50">

          {/* Card 01 — Wide (7/12 columns) */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-800/60">
            <FeatureCard feature={wide} />
          </div>

          {/* Card 02 — Narrow (5/12 columns) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 border-slate-800/60">
            <FeatureCard feature={narrow} />
          </div>

          {/* Card 03 — Full width (12/12 columns) — staggered lower row */}
          <div className="lg:col-span-12 border-t border-slate-800/60">
            {/*
              The full-width card uses a different internal layout:
              two-column split — text left, points + metrics right.
            */}
            <article
              className={[
                "group relative",
                "grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]",
                "bg-[#020617]",
                "transition-all duration-300 ease-out",
                "hover:bg-slate-900/20",
              ].join(" ")}
            >
              {/* Full-card accent */}
              <span
                className="absolute top-0 inset-x-0 h-px bg-slate-400 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Left panel — identity + description */}
              <div className="p-8 lg:p-10 flex flex-col justify-between">
                <header className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-slate-700 uppercase">
                      {full.index}
                    </span>
                    <span className="inline-flex items-center border border-slate-800/70 px-2.5 py-1 rounded-sm font-mono text-[9px] tracking-widest uppercase text-slate-600">
                      {full.category}
                    </span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-800/60 bg-slate-900/60 group-hover:border-slate-700 transition-all duration-300">
                    <Wrench className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                  </div>
                </header>

                <div>
                  <h3
                    className="font-serif text-2xl tracking-tight text-slate-100 mb-4"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {full.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-500 max-w-sm">
                    {full.description}
                  </p>
                  <a
                    href={full.href}
                    className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-slate-600 hover:text-slate-300 transition-colors duration-200 group/link"
                  >
                    Learn more
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </a>
                </div>
              </div>

              {/* Internal vertical divider */}
              <div className="hidden lg:block w-px bg-slate-800/60 self-stretch" aria-hidden="true" />

              {/* Right panel — points + metric strip */}
              <div className="p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 border-slate-800/60">
                <ul className="space-y-3 mb-8" role="list">
                  {full.points.map((point, i) => (
                    <li key={point} className="flex items-start gap-4">
                      <span className="font-mono text-[9px] text-slate-700 tabular-nums pt-0.5 w-4 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[11px] tracking-wide leading-relaxed text-slate-500">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Metric strip */}
                <div className="grid grid-cols-3 gap-px border-t border-slate-800/50 pt-6">
                  {FEATURE_METRICS[full.index].map(({ value, label }) => (
                    <div key={label}>
                      <div className="font-mono text-base font-semibold text-slate-300 tabular-nums tracking-tight">
                        {value}
                      </div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-slate-700 mt-0.5 leading-relaxed">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

        </div>

      </div>
    </section>
  );
}