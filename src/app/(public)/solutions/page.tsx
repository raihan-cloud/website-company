// src/app/(public)/solutions/page.tsx
//
// Standalone Solutions Page — JasaNet Enterprise Network Agency
// Next.js 14+ App Router · Tailwind CSS · Lucide React
// Server Component — no "use client" required.
//
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Factory,
  Wifi,
  Lock,
  Database,
  Radio,
  Cable,
  Router,
  Search,
  GitBranch,
  Wrench,
  FlaskConical,
  FileCheck,
  CheckCircle2,
  Terminal,
  ChevronRight,
} from "lucide-react";
import Features from "../components/Features";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:       "Solutions — JasaNet Enterprise Network Infrastructure",
  description:
    "Enterprise network solutions for corporate offices, industrial facilities, and multi-site operations. Physical installation, topology design, and 24/7 NOC support.",
  openGraph: {
    title:       "Solutions — JasaNet",
    description: "Precision-engineered network solutions for enterprise B2B environments.",
    url:         "https://jasanet.id/solutions",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC DATA — all arrays declared outside render tree
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Sector solution definitions ──────────────────────────────────────────────
interface SectorSpec {
  id:          string;
  index:       string;
  icon:        React.ElementType;
  classification: string;
  title:       string;
  subtitle:    string;
  description: string;
  specs:       { label: string; value: string }[];
  services:    { icon: React.ElementType; text: string }[];
  metrics:     { value: string; label: string }[];
  cta:         string;
  href:        string;
}

const SECTORS: SectorSpec[] = [
  {
    id:             "corporate",
    index:          "SEC-01",
    icon:           Building2,
    classification: "Corporate & UKM",
    title:          "Kantor Korporat &",
    subtitle:       "Usaha Skala Menengah",
    description:
      "Arsitektur jaringan untuk lingkungan perkantoran modern — dari gedung tunggal hingga multi-lantai. Dirancang untuk produktivitas tinggi dengan keamanan internal berlapis.",
    specs: [
      { label: "Coverage",    value: "Up to 50,000 m²" },
      { label: "Client Load", value: "500+ concurrent"  },
      { label: "Redundancy",  value: "N+1 uplink"       },
      { label: "Auth",        value: "802.1X / RADIUS"  },
    ],
    services: [
      { icon: Wifi,     text: "High-density Wi-Fi 6E roaming (WPA3-Enterprise)"     },
      { icon: Lock,     text: "Zero-trust internal VLAN segmentation & micro-NAC"   },
      { icon: Database, text: "Automated local storage backup dengan link failover"  },
      { icon: Radio,    text: "QoS policy untuk VoIP, video conference & SaaS apps" },
    ],
    metrics: [
      { value: "< 2ms",  label: "Inter-VLAN latency"  },
      { value: "WPA3",   label: "Auth standard"        },
      { value: "99.95%", label: "Uptime SLA"           },
    ],
    cta:  "Lihat Paket Korporat",
    href: "/services?sector=corporate",
  },
  {
    id:             "industrial",
    index:          "SEC-02",
    icon:           Factory,
    classification: "Industrial & Warehouse",
    title:          "Pabrik, Gudang &",
    subtitle:       "Fasilitas Industri",
    description:
      "Infrastruktur jaringan ruggedized untuk lingkungan dengan interferensi tinggi, debu, dan getaran. Backbone fiber jarak jauh untuk konektivitas antar-gedung dalam satu kawasan industri.",
    specs: [
      { label: "Fiber Range",  value: "Up to 80km OS2"  },
      { label: "EMI Rating",   value: "IEC 61000-4"     },
      { label: "IP Rating",    value: "IP67 enclosures" },
      { label: "Temp Range",   value: "-40°C to +85°C"  },
    ],
    services: [
      { icon: Cable,  text: "Long-range OS2 fiber optic backbone antar gedung"        },
      { icon: Cable,  text: "Armored Cat6A immune terhadap interferensi elektromagnetik" },
      { icon: Router, text: "Industrial-grade routing (Cisco IE / Hirschmann)"         },
      { icon: Wifi,   text: "Wi-Fi ruggedized untuk AGV, forklift & barcode scanner"   },
    ],
    metrics: [
      { value: "80km",  label: "Max fiber reach"  },
      { value: "IP67",  label: "Enclosure rating" },
      { value: "10GbE", label: "Backbone speed"   },
    ],
    cta:  "Lihat Paket Industri",
    href: "/services?sector=industrial",
  },
] as const;

// ─── Methodology process steps ────────────────────────────────────────────────
interface ProcessStep {
  index:       string;
  icon:        React.ElementType;
  phase:       string;
  title:       string;
  description: string;
  tools:       string[];
  output:      string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    index:       "P-01",
    icon:        Search,
    phase:       "Discovery",
    title:       "Site Survey & Audit",
    description: "Pemetaan topografi gedung, audit infrastruktur eksisting, dan analisis kebutuhan bandwidth per departemen.",
    tools:       ["Ekahau Site Survey", "Fluke LinkIQ", "NetAlly"],
    output:      "Site Assessment Report",
  },
  {
    index:       "P-02",
    icon:        GitBranch,
    phase:       "Simulation",
    title:       "Topology Simulation",
    description: "Desain arsitektur L2/L3 dan simulasi penuh sebelum satu kabel pun dipasang di lapangan.",
    tools:       ["GNS3", "Cisco Packet Tracer", "EVE-NG"],
    output:      "Validated Network Blueprint",
  },
  {
    index:       "P-03",
    icon:        Wrench,
    phase:       "Deployment",
    title:       "Deployment & Rigging",
    description: "Instalasi terstruktur — structured cabling, rack-and-stack, fiber splicing, dan konfigurasi device.",
    tools:       ["ANSI/TIA-568", "ISO/IEC 11801", "BICSI"],
    output:      "Live Network Environment",
  },
  {
    index:       "P-04",
    icon:        FlaskConical,
    phase:       "Assurance",
    title:       "Fluke Testing & QA",
    description: "Sertifikasi setiap link dengan Fluke DSX2-8000 — mengukur atenuasi, NEXT, return loss, dan propagation delay.",
    tools:       ["Fluke DSX2-8000", "OTDR Yokogawa", "LinkSprinter"],
    output:      "Certified Test Report",
  },
  {
    index:       "P-05",
    icon:        FileCheck,
    phase:       "Handover",
    title:       "As-Built Documentation",
    description: "Serah terima lengkap: as-built drawing, label skema, runbook NOC, dan onboarding tim IT klien.",
    tools:       ["AutoCAD LT", "Visio Pro", "Confluence"],
    output:      "Full Documentation Package",
  },
] as const;

// ─── CLI log lines ────────────────────────────────────────────────────────────
interface LogLine {
  prefix:  string;
  text:    string;
  status:  "ok" | "warn" | "info" | "run";
}

const CLI_LINES: LogLine[] = [
  { prefix: "INIT",  text: "jasanet-validator v3.2.1 — link assurance mode",        status: "info" },
  { prefix: "SCAN",  text: "Discovering network topology... 24 nodes found",         status: "run"  },
  { prefix: "LINK",  text: "GE0/0 ↔ GE0/1  attenuation: 1.2dB  [PASS]",            status: "ok"   },
  { prefix: "LINK",  text: "GE0/2 ↔ GE0/3  attenuation: 0.9dB  [PASS]",            status: "ok"   },
  { prefix: "STP",   text: "Spanning-tree root: SW-CORE-01  priority: 4096",         status: "ok"   },
  { prefix: "STP",   text: "All ports: Forwarding — no TCN events in 72h",           status: "ok"   },
  { prefix: "BGP",   text: "AS65001 peer 203.0.113.1 — state: Established",         status: "ok"   },
  { prefix: "BGP",   text: "Prefixes received: 142  advertised: 8  MED: 0",          status: "ok"   },
  { prefix: "QoS",   text: "Policy VoIP-EF — DSCP EF (46) marking confirmed",        status: "ok"   },
  { prefix: "WARN",  text: "Port Gi1/0/22 — CRC errors: 14  (threshold: 10)",        status: "warn" },
  { prefix: "SNMP",  text: "Trap receiver 10.0.0.5:162 — reachable",                status: "ok"   },
  { prefix: "UPTIME",text: "Core stack uptime: 187d 14h 22m 09s",                   status: "info" },
  { prefix: "SLA",   text: "Measured availability last 30d: 99.983%  [COMPLIANT]",  status: "ok"   },
  { prefix: "DONE",  text: "Validation complete — 1 warning  0 critical",            status: "info" },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Section label + headline reusable header ─────────────────────────────────
function SectionHeader({
  tag,
  headlineTop,
  headlineBottom,
  descriptor,
}: {
  tag:            string;
  headlineTop:    string;
  headlineBottom: string;
  descriptor:     string;
}) {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20 border-b border-slate-800/50">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
            {tag}
          </span>
        </div>
        <h2
          className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tighter text-slate-50"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {headlineTop}
          <br />
          <span className="text-slate-400">{headlineBottom}</span>
        </h2>
      </div>
      <div className="flex flex-col justify-end">
        <p className="text-sm leading-7 text-slate-500 max-w-sm">{descriptor}</p>
      </div>
    </header>
  );
}

// ─── Sector docket card ────────────────────────────────────────────────────────
function SectorCard({ sector }: { sector: SectorSpec }) {
  const Icon = sector.icon;
  return (
    <article
      className={[
        "group relative",
        "grid grid-cols-1 lg:grid-cols-[1fr_1px_340px]",
        "border border-slate-800/60 bg-[#020617]",
        "transition-colors duration-300 ease-out hover:border-slate-700/70 hover:bg-slate-900/20",
      ].join(" ")}
    >
      {/* Classification stamp — top-right corner element */}
      <div
        className="absolute top-5 right-5 hidden lg:flex items-center gap-2 border border-slate-800/60 px-2.5 py-1 rounded-sm"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        <span className="font-mono text-[9px] tracking-widest uppercase text-slate-700">
          {sector.index}
        </span>
      </div>

      {/* Accent hairline */}
      <span
        className="absolute top-0 inset-x-0 h-px bg-slate-300 opacity-30 group-hover:opacity-70 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* ── Left panel ──────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between p-8 lg:p-10">
        <div>
          {/* Icon + classification */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-800/60 bg-slate-900/60 group-hover:border-slate-700 transition-all duration-300">
              <Icon className="h-4.5 w-4.5 text-slate-400" strokeWidth={1.5} />
            </div>
            <span className="inline-flex items-center border border-slate-800/70 px-2.5 py-1 rounded-sm font-mono text-[9px] tracking-widest uppercase text-slate-600">
              {sector.classification}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-serif text-[clamp(1.6rem,2.5vw,2.25rem)] leading-[1.05] tracking-tight text-slate-100 mb-1 group-hover:text-slate-50 transition-colors duration-200"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {sector.title}
          </h3>
          <h3
            className="font-serif text-[clamp(1.6rem,2.5vw,2.25rem)] leading-[1.05] tracking-tight text-slate-400 mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {sector.subtitle}
          </h3>

          <p className="text-sm leading-7 text-slate-500 mb-8 max-w-sm">
            {sector.description}
          </p>

          {/* Service list */}
          <ul className="space-y-3" role="list">
            {sector.services.map(({ icon: SvcIcon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <SvcIcon
                  className="h-3.5 w-3.5 text-slate-600 shrink-0 mt-0.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] tracking-wide leading-relaxed text-slate-500">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={sector.href}
          className="group/cta mt-10 inline-flex items-center gap-1.5 self-start font-mono text-[11px] tracking-wider uppercase text-slate-600 hover:text-slate-300 transition-colors duration-200"
        >
          {sector.cta}
          <ArrowUpRight
            className="h-3 w-3 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* ── Vertical divider ─────────────────────────────────────────── */}
      <div className="hidden lg:block w-px bg-slate-800/60 self-stretch" aria-hidden="true" />

      {/* ── Right panel — specs + metrics ─────────────────────────────── */}
      <div className="flex flex-col justify-between p-8 lg:p-10 border-t lg:border-t-0 border-slate-800/60">

        {/* Spec table */}
        <div>
          <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-5">
            Technical Specs
          </h4>
          <dl className="space-y-0 border border-slate-800/50 rounded-sm overflow-hidden">
            {sector.specs.map(({ label, value }) => (
              <div
                key={label}
                className="group/row grid grid-cols-2 border-b border-slate-800/40 last:border-b-0 hover:bg-slate-900/40 transition-colors duration-150"
              >
                <dt className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-slate-700 uppercase border-r border-slate-800/40">
                  {label}
                </dt>
                <dd className="px-4 py-2.5 font-mono text-[11px] text-slate-400 tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Outcome metrics */}
        <div className="mt-8 border-t border-slate-800/50 pt-6">
          <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-5">
            Performance Targets
          </h4>
          <div className="grid grid-cols-3 gap-px">
            {sector.metrics.map(({ value, label }) => (
              <div key={label}>
                <div className="font-mono text-lg font-semibold text-slate-200 tabular-nums tracking-tight">
                  {value}
                </div>
                <div className="font-mono text-[9px] tracking-widest uppercase text-slate-700 mt-0.5 leading-relaxed">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Process step (horizontal timeline node) ─────────────────────────────────
function ProcessNode({
  step,
  isLast,
}: {
  step:   ProcessStep;
  isLast: boolean;
}) {
  const Icon = step.icon;
  return (
    <div className="group relative flex flex-col items-start lg:items-center lg:flex-1">

      {/* ── Desktop connector line ────────────────────────────────────── */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-[22px] left-1/2 w-full h-px bg-slate-800/60"
          aria-hidden="true"
        />
      )}

      {/* Node circle */}
      <div
        className={[
          "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          "border border-slate-800/70 bg-[#020617]",
          "transition-all duration-300 ease-out",
          "group-hover:border-slate-600 group-hover:bg-slate-900",
        ].join(" ")}
      >
        <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors duration-300" strokeWidth={1.5} />
      </div>

      {/* Step content */}
      <div className="mt-5 lg:mt-4 lg:text-center px-0 lg:px-2">
        <div className="flex items-center gap-2 mb-1.5 lg:justify-center">
          <span className="font-mono text-[9px] tracking-widest uppercase text-slate-700">
            {step.index}
          </span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-emerald-600">
            {step.phase}
          </span>
        </div>
        <h4
          className="font-serif text-base tracking-tight text-slate-200 mb-2 group-hover:text-slate-50 transition-colors duration-200"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {step.title}
        </h4>
        <p className="text-[11px] leading-relaxed text-slate-600 max-w-[180px] lg:mx-auto mb-3">
          {step.description}
        </p>

        {/* Tool chips */}
        <div className="flex flex-wrap gap-1 lg:justify-center">
          {step.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center border border-slate-800/60 px-2 py-0.5 rounded-sm font-mono text-[8px] tracking-wider uppercase text-slate-700"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Output label */}
        <div className="mt-3 flex items-center gap-1.5 lg:justify-center">
          <CheckCircle2 className="h-3 w-3 text-emerald-600/70 shrink-0" strokeWidth={1.5} />
          <span className="font-mono text-[9px] tracking-wider text-emerald-700">
            {step.output}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── CLI log widget ────────────────────────────────────────────────────────────
const LOG_STATUS_STYLES: Record<LogLine["status"], string> = {
  ok:   "text-emerald-500",
  warn: "text-amber-400",
  info: "text-slate-500",
  run:  "text-sky-400",
};

const LOG_PREFIX_STYLES: Record<LogLine["status"], string> = {
  ok:   "text-emerald-700",
  warn: "text-amber-600",
  info: "text-slate-700",
  run:  "text-sky-700",
};

function CLIWidget() {
  return (
    <div
      className="rounded-sm border border-slate-800/70 bg-slate-950 overflow-hidden"
      role="img"
      aria-label="Network validation log output — JasaNet automated QA"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-slate-600" strokeWidth={1.5} />
          <span className="font-mono text-[10px] tracking-wider text-slate-600">
            jasanet-validator — network-qa@core-01
          </span>
        </div>
        {/* Fake traffic lights */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* Log body */}
      <div className="px-4 py-5 space-y-1.5 overflow-hidden">
        {/* Shell prompt */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-[11px] text-emerald-600">
            jasanet@noc-01
          </span>
          <span className="font-mono text-[11px] text-slate-700">:</span>
          <span className="font-mono text-[11px] text-sky-700">~/validation</span>
          <span className="font-mono text-[11px] text-slate-500">$</span>
          <span className="font-mono text-[11px] text-slate-300">
            ./run-validator.sh --mode=full --site=all
          </span>
        </div>

        {/* Log lines */}
        {CLI_LINES.map((line, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Prefix badge */}
            <span
              className={[
                "shrink-0 font-mono text-[9px] tracking-widest w-12 pt-0.5",
                LOG_PREFIX_STYLES[line.status],
              ].join(" ")}
            >
              [{line.prefix}]
            </span>
            {/* Log text */}
            <span
              className={[
                "font-mono text-[10px] leading-relaxed tracking-wide",
                LOG_STATUS_STYLES[line.status],
              ].join(" ")}
            >
              {line.text}
            </span>
          </div>
        ))}

        {/* Blinking cursor line */}
        <div className="flex items-center gap-2 pt-2">
          <span className="font-mono text-[11px] text-emerald-600">
            jasanet@noc-01
          </span>
          <span className="font-mono text-[11px] text-slate-700">:</span>
          <span className="font-mono text-[11px] text-sky-700">~/validation</span>
          <span className="font-mono text-[11px] text-slate-500">$</span>
          {/* CSS-only blinking cursor */}
          <span
            className="inline-block h-3 w-1.5 bg-slate-400 animate-pulse"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SolutionsPage() {
  return (
    <>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 01 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-[#020617] overflow-hidden"
        aria-label="Solutions page hero"
      >
        {/* Structural horizontal rule grid */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 h-px bg-slate-800/30"
              style={{ top: `${20 + i * 18}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_360px] min-h-[480px]">

            {/* Left — headline block */}
            <div className="flex flex-col justify-center py-24 pr-0 lg:pr-16">

              {/* Code-style label */}
              <div className="flex items-center gap-3 mb-8">
                <ChevronRight className="h-3 w-3 text-slate-700" strokeWidth={2} />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
                  // NETWORK BLUEPRINT
                </span>
              </div>

              <h1
                className="font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[0.93] tracking-tighter text-slate-50 mb-8"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Solusi jaringan
                <br />
                <span className="text-slate-400">dirancang untuk</span>
                <br />
                skala enterprise.
              </h1>

              <p className="text-sm leading-7 text-slate-500 max-w-md mb-10">
                Setiap arsitektur yang kami rancang dimulai dari data —
                bukan asumsi. Survey lapangan, simulasi topologi, dan
                pengujian terserfikasi Fluke mendahului setiap deployment.
              </p>

              {/* Philosophy pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Survey-first",
                  "Simulation-validated",
                  "Fluke-certified",
                  "SLA-backed",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 border border-slate-800/70 px-3 py-1.5 rounded-sm"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-mono text-[9px] tracking-widest uppercase text-slate-600">
                      {pill}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-slate-800/60 self-stretch" aria-hidden="true" />

            {/* Right — manifest panel */}
            <div className="hidden lg:flex flex-col justify-center pl-10 py-24">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-6">
                Engineering Principles
              </p>
              <ol className="space-y-0 border border-slate-800/50 rounded-sm overflow-hidden" role="list">
                {[
                  "Tidak ada asumsi — semua dimulai dari audit",
                  "Simulasi wajib sebelum deployment",
                  "Setiap kabel disertifikasi Fluke DSX2",
                  "Dokumentasi as-built diserahkan pada hari H",
                  "SLA tertulis, bukan janji lisan",
                ].map((principle, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 px-4 py-3.5 border-b border-slate-800/40 last:border-b-0 hover:bg-slate-900/40 transition-colors duration-150 group"
                  >
                    <span className="font-mono text-[9px] text-slate-700 tabular-nums shrink-0 pt-0.5 w-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] tracking-wide leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors duration-150">
                      {principle}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800/60" aria-hidden="true" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 02 — CORE CAPABILITIES (Features component re-use)
      ══════════════════════════════════════════════════════════════════ */}
      <Features />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 03 — ENTERPRISE SECTOR SOLUTIONS
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-[#020617] border-t border-slate-800/60"
        aria-labelledby="sectors-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            tag="Sektor Industri"
            headlineTop="Solusi untuk setiap"
            headlineBottom="skala operasi."
            descriptor="Arsitektur kami disesuaikan dengan kompleksitas lingkungan — dari gedung perkantoran modern hingga kawasan industri dengan interferensi elektromagnetik tinggi."
          />

          <div id="sectors-heading" className="sr-only">
            Solusi per Sektor Enterprise
          </div>

          <div className="pb-12 space-y-px">
            {SECTORS.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 04 & 05 — METHODOLOGY TIMELINE + CLI WIDGET
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-[#020617] border-t border-slate-800/60"
        aria-labelledby="methodology-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <SectionHeader
            tag="Engineering Methodology"
            headlineTop="Proses yang bisa"
            headlineBottom="Anda audit sendiri."
            descriptor="Lima fase yang kami jalankan di setiap engagement — dari survey awal hingga serah terima dokumentasi. Tidak ada yang kami sembunyikan dari klien."
          />

          <div id="methodology-heading" className="sr-only">
            Engineering Methodology & Process
          </div>

          {/* ── Asymmetric layout: timeline (8/12) + CLI widget (4/12) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_380px] gap-0 pb-16">

            {/* Timeline column */}
            <div className="py-12 pr-0 lg:pr-12">

              {/* Mobile: vertical stack / Desktop: horizontal row */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessNode
                    key={step.index}
                    step={step}
                    isLast={i === PROCESS_STEPS.length - 1}
                  />
                ))}
              </div>

              {/* Completion strip — appears below timeline */}
              <div className="mt-14 flex items-center gap-4 border-t border-slate-800/50 pt-8">
                <div className="flex items-center gap-2 border border-slate-800/60 px-3 py-2 rounded-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                    Setiap proyek selesai dengan dokumentasi lengkap
                  </span>
                </div>
                <div className="h-px flex-1 bg-slate-800/50" aria-hidden="true" />
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-slate-600 hover:text-slate-300 transition-colors duration-200"
                >
                  Lihat portofolio
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-slate-800/60 self-stretch" aria-hidden="true" />

            {/* CLI Widget column */}
            <div className="lg:pl-10 py-12 border-t lg:border-t-0 border-slate-800/60">
              <div className="mb-5">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-1">
                  Phase P-04 output — live validation
                </p>
                <p className="font-mono text-[9px] tracking-wider text-slate-800 uppercase">
                  Fluke DSX2-8000 · Network QA · SLA Check
                </p>
              </div>

              <CLIWidget />

              {/* Caption below CLI */}
              <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-wide text-slate-800">
                Output di atas merepresentasikan hasil validasi otomatis
                yang digenerate saat fase QA — laporan asli dikirim dalam
                format PDF tersertifikasi kepada klien.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 06 — CLOSING CTA STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="border-t border-slate-800/60 bg-[#020617]"
        aria-label="Solutions page call to action"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-12">

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-2">
                Siap memulai?
              </p>
              <p
                className="font-serif text-xl tracking-tight text-slate-200"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Diskusikan kebutuhan infrastruktur Anda bersama engineer kami.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/services"
                className={[
                  "group inline-flex items-center gap-1.5",
                  "h-9 px-5 rounded-sm",
                  "bg-slate-50 text-[#020617]",
                  "font-mono text-xs font-medium tracking-wider uppercase",
                  "transition-all duration-200 ease-out hover:bg-slate-200",
                ].join(" ")}
              >
                Buka Etalase
                <ArrowUpRight
                  className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "inline-flex items-center gap-1.5",
                  "h-9 px-5 rounded-sm",
                  "border border-slate-800 text-slate-400",
                  "font-mono text-xs tracking-wider uppercase",
                  "transition-colors duration-200 hover:border-slate-600 hover:text-slate-200",
                ].join(" ")}
              >
                WhatsApp
              </a>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}