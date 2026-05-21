// src/app/(public)/projects/page.tsx
// JasaNet — Project Showcase / Case Studies
// Next.js 14+ App Router | Tailwind CSS | Inline SVG icons (Turbopack-safe)

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Showcase — JasaNet",
  description:
    "Studi kasus infrastruktur jaringan enterprise dan arsitektur cloud yang telah JasaNet selesaikan untuk klien korporat di seluruh Indonesia.",
};

// ─── Types ──────────────────────────────────────────────────────────────────────

interface MetricItem {
  value: string;
  label: string;
}

interface ProjectItem {
  id: string;
  title: string;
  clientSector: string;
  year: number;
  challenge: string;
  solution: string;
  metrics: [MetricItem, MetricItem];
  techStack: string[];
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const projects: ProjectItem[] = [
  {
    id: "prj-001",
    title: "Data Centre Migration for National Manufacturer",
    clientSector: "Manufacturing / Industrial",
    year: 2023,
    challenge:
      "Legacy on-premise server rack infrastructure causing 14-hour monthly downtime windows and unsustainable OPEX growth.",
    solution:
      "Full colocation migration with redundant 10G fibre uplinks, automated failover orchestration, and out-of-band management plane.",
    metrics: [
      { value: "99.99%", label: "Core Uptime Post-Migration" },
      { value: "−62%",   label: "Infrastructure OPEX Reduction" },
    ],
    techStack: [
      "Fiber Optic Backbone",
      "Cisco Nexus 9K",
      "VMware vSphere",
      "OOB Management",
      "BGP Routing",
      "LACP Bonding",
    ],
  },
  {
    id: "prj-002",
    title: "High-Density Wi-Fi 6E Deployment — Corporate HQ",
    clientSector: "Financial Services / Insurance",
    year: 2024,
    challenge:
      "Existing 802.11ac infrastructure failing under 1,200+ concurrent endpoints, producing sub-5 Mbps per-device throughput at peak occupancy.",
    solution:
      "Greenfield Wi-Fi 6E survey, AP placement heat-mapping, and centralised Aruba Central cloud controller rollout across 12 office floors.",
    metrics: [
      { value: "1.2 Gbps", label: "Stable Aggregate Throughput" },
      { value: "−45ms",    label: "Average Latency Reduction" },
    ],
    techStack: [
      "Wi-Fi 6E (802.11ax)",
      "Aruba AP-635",
      "Aruba Central",
      "RF Heat Mapping",
      "RADIUS / 802.1X",
      "QoS Policy",
    ],
  },
  {
    id: "prj-003",
    title: "Zero-Trust VLAN Segmentation — Fintech Core Network",
    clientSector: "Fintech / Digital Banking",
    year: 2024,
    challenge:
      "Flat Layer-2 network topology presenting critical lateral-movement attack surface during mandatory OJK security audit.",
    solution:
      "Micro-segmented VLAN architecture with Fortinet FortiGate inter-VLAN firewall policies, zero-trust NAC, and real-time SIEM integration.",
    metrics: [
      { value: "0",       label: "Critical Vulnerabilities Post-Audit" },
      { value: "100%",    label: "OJK Compliance Score Achieved" },
    ],
    techStack: [
      "Fortinet FortiGate",
      "VLAN Micro-Segmentation",
      "Zero-Trust NAC",
      "FortiSIEM",
      "802.1X EAP-TLS",
      "SD-WAN",
    ],
  },
  {
    id: "prj-004",
    title: "Multi-Site AWS Direct Connect Fabric",
    clientSector: "Retail / E-Commerce",
    year: 2023,
    challenge:
      "Public internet connectivity to AWS causing 180ms+ latency spikes and packet-loss events during seasonal 10× traffic surges.",
    solution:
      "Dual 1G AWS Direct Connect circuits across two PoPs with BGP route optimisation, CloudWatch telemetry, and automatic failover to backup VPN.",
    metrics: [
      { value: "−73%",  label: "Cloud Egress Latency Reduction" },
      { value: "99.97%", label: "Hybrid Cloud Link Availability" },
    ],
    techStack: [
      "AWS Direct Connect",
      "BGP Route Optimisation",
      "Transit Gateway",
      "CloudWatch",
      "IPsec VPN Fallback",
      "Cisco ASR",
    ],
  },
  {
    id: "prj-005",
    title: "Campus IP Telephony & UCaaS Rollout",
    clientSector: "Higher Education / University",
    year: 2022,
    challenge:
      "Aging PSTN PBX system with 40+ analog trunk lines creating maintenance debt and zero integration with hybrid collaboration platforms.",
    solution:
      "Full IP telephony migration to Cisco CUCM cluster with Microsoft Teams Direct Routing, SBC deployment, and SIP trunking via local carrier.",
    metrics: [
      { value: "−58%", label: "Telephony OPEX Reduction" },
      { value: "2,400", label: "Extensions Migrated Seamlessly" },
    ],
    techStack: [
      "Cisco CUCM",
      "MS Teams Direct Routing",
      "SIP Trunking",
      "AudioCodes SBC",
      "QoS / DSCP",
      "VLAN Voice Segmentation",
    ],
  },
  {
    id: "prj-006",
    title: "SD-WAN Overlay for Distributed Retail Branches",
    clientSector: "Retail / Fast-Moving Consumer Goods",
    year: 2024,
    challenge:
      "68 geographically dispersed retail branches operating on isolated MPLS circuits with no centralised visibility or unified policy control.",
    solution:
      "Fortinet Secure SD-WAN overlay unifying all branch uplinks under a single management pane with application-aware routing and integrated NGFW.",
    metrics: [
      { value: "68",    label: "Branches Unified Under Single Pane" },
      { value: "−41%",  label: "WAN Connectivity Cost Reduction" },
    ],
    techStack: [
      "Fortinet SD-WAN",
      "FortiManager",
      "NGFW",
      "Application-Aware Routing",
      "Dual ISP Failover",
      "Zero-Touch Provisioning",
    ],
  },
];

// ─── Inline SVG icons (Turbopack / Next 16 safe) ────────────────────────────────

function IconActivity() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

// ─── Shared primitives ───────────────────────────────────────────────────────────

function MonoLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 ${className}`}
    >
      {children}
    </span>
  );
}

function GridRule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-slate-100 ${className}`} />;
}

// ─── Project Card ────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const pad = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex flex-col border border-slate-100 bg-white transition-colors duration-300 hover:border-slate-200">
      {/* Top accent — animates to blue on hover */}
      <div className="h-px w-full bg-slate-100 transition-colors duration-500 group-hover:bg-blue-200" />

      <div className="flex flex-1 flex-col p-7 lg:p-8">

        {/* ── Header row ── */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            {/* Sector tag */}
            <span className="inline-flex items-center gap-1.5 border border-slate-100 bg-slate-50 px-2.5 py-1">
              <span className="text-slate-300"><IconServer /></span>
              <MonoLabel>{project.clientSector}</MonoLabel>
            </span>
          </div>

          {/* Year + index */}
          <div className="flex items-center gap-3 shrink-0">
            <MonoLabel className="!text-slate-300">{pad}</MonoLabel>
            <span className="h-3 w-px bg-slate-200" />
            <MonoLabel className="!text-slate-500">{project.year}</MonoLabel>
          </div>
        </div>

        {/* ── Title ── */}
        <h3 className="text-xl font-medium leading-snug tracking-tight text-slate-900 lg:text-[1.35rem]">
          {project.title}
        </h3>

        <GridRule className="my-6" />

        {/* ── Challenge / Solution ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-amber-400"><IconActivity /></span>
              <MonoLabel className="!text-slate-500">Challenge</MonoLabel>
            </div>
            <p className="text-[13px] leading-[1.75] text-slate-500">{project.challenge}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-emerald-500"><IconCheck /></span>
              <MonoLabel className="!text-slate-500">Solution</MonoLabel>
            </div>
            <p className="text-[13px] leading-[1.75] text-slate-500">{project.solution}</p>
          </div>
        </div>

        <GridRule className="my-6" />

        {/* ── Metrics bar ── */}
        <div className="grid grid-cols-2 gap-px bg-slate-100">
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-white px-4 py-4">
              <p className="font-mono text-2xl font-light tracking-tighter text-slate-900">
                {m.value}
              </p>
              <MonoLabel className="mt-1 block leading-[1.6]">{m.label}</MonoLabel>
            </div>
          ))}
        </div>

        <GridRule className="my-6" />

        {/* ── Tech stack tags ── */}
        <div className="mb-7 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="border border-slate-100 bg-slate-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── CTA anchor ── */}
        <a
          href={`/projects/${project.id}`}
          className="group/link mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition-colors duration-200 hover:text-slate-900"
          aria-label={`View network blueprint for ${project.title}`}
        >
          <span>View Network Blueprint</span>
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
            <IconArrowRight />
          </span>
        </a>
      </div>
    </article>
  );
}

// ─── Summary strip ───────────────────────────────────────────────────────────────

function SummaryStrip() {
  const sectors = Array.from(new Set(projects.map((p) => p.clientSector.split(" / ")[0])));
  const years   = Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => a - b);

  return (
    <div className="border-y border-slate-100">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-100 px-6 sm:grid-cols-4 lg:px-14">
        {[
          { value: String(projects.length), label: "Completed Architectures" },
          { value: sectors.length + "+",    label: "Industry Sectors Served" },
          { value: `${years[0]}–${years[years.length - 1]}`, label: "Active Deployment Period" },
          { value: "100%",                  label: "Client Retention Rate" },
        ].map(({ value, label }) => (
          <div key={label} className="px-6 py-8 first:pl-0 last:pr-0">
            <p className="text-2xl font-light tracking-tight text-slate-900">{value}</p>
            <MonoLabel className="mt-1 block leading-[1.6]">{label}</MonoLabel>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&display=swap');
        :root { --font-sans:'Geist',system-ui,sans-serif; --font-mono:'Geist Mono',monospace; }
        body { font-family:var(--font-sans); }
        .font-mono { font-family:var(--font-mono); }
      `}</style>

      {/* ── Editorial Header ──────────────────────────────────────────── */}
      <header className="mx-auto max-w-6xl px-6 pb-20 pt-28 lg:px-14 lg:pb-24 lg:pt-40">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">

          {/* Left: monospace label column */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-4">
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 bg-blue-500" />
                <MonoLabel>JasaNet / Case Studies</MonoLabel>
              </div>

              {/* Vertical index list */}
              <div className="hidden space-y-3 border-l border-slate-100 pl-5 lg:block">
                {projects.map((p, i) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className="group flex items-center gap-3 transition-colors duration-200 hover:text-slate-900"
                  >
                    <MonoLabel className="!text-slate-300">
                      {String(i + 1).padStart(2, "0")}
                    </MonoLabel>
                    <MonoLabel className="truncate group-hover:!text-slate-700">
                      {p.title.split(" ").slice(0, 4).join(" ")}…
                    </MonoLabel>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact nudge */}
            <a
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 border-b border-slate-200 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition-all duration-200 hover:border-slate-900 hover:text-slate-900"
            >
              <span>Discuss Your Project</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px">
                <IconArrowUpRight />
              </span>
            </a>
          </div>

          {/* Right: headline column */}
          <div className="lg:col-span-8">
            {/* Monospace eyebrow */}
            <p className="mb-6 font-mono text-[11px] tracking-[0.1em] text-blue-500">
              // COMPLETED ARCHITECTURES
            </p>

            <h1 className="text-5xl font-light leading-[1.02] tracking-tighter text-slate-900 lg:text-[4.5rem]">
              Proven infrastructures,
              <br />
              <span className="text-slate-400">deployed at scale.</span>
            </h1>

            <div className="mt-8 border-l-2 border-slate-100 pl-6">
              <p className="max-w-lg text-[14px] leading-7 text-slate-500">
                Setiap arsitektur yang kami hadirkan merupakan hasil rekayasa teknis yang
                terukur dan bertujuan — bukan solusi generik. Berikut adalah portofolio
                infrastruktur enterprise yang telah JasaNet selesaikan untuk klien korporat
                lintas sektor di seluruh Indonesia.
              </p>
            </div>

            {/* Inline stats */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { v: `${projects.length} Projects`, l: "Delivered" },
                { v: "100%", l: "On-Time Completion" },
                { v: "ISO", l: "Certified Engineering" },
              ].map(({ v, l }) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="text-emerald-500"><IconCheck /></span>
                  <span className="font-mono text-[11px] tracking-[0.1em] text-slate-500">
                    <strong className="font-medium text-slate-900">{v}</strong> {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GridRule className="mt-16" />
      </header>

      {/* ── Summary Strip ─────────────────────────────────────────────── */}
      <SummaryStrip />

      {/* ── Case Study Grid ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-14 lg:py-20">
        {/* Section meta */}
        <div className="mb-10 flex items-center justify-between">
          <MonoLabel>{projects.length} architectures · sorted by recency</MonoLabel>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <MonoLabel className="!text-emerald-600">All Projects Verified</MonoLabel>
          </div>
        </div>

        {/* Grid — gap-px with bg-slate-100 produces hairline gutters */}
        <div
          id="project-grid"
          className="grid grid-cols-1 gap-px bg-slate-100 md:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project, i) => (
            <div key={project.id} id={project.id}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer Strip ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* CTA block */}
            <div>
              <p className="text-lg font-light tracking-tight text-slate-900">
                Ready to architect your infrastructure?
              </p>
              <p className="mt-1 font-mono text-[11px] text-slate-400">
                Schedule a BoQ consultation with our engineering team.
              </p>
            </div>
            <a
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-3 border border-slate-900 bg-slate-950 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-white hover:text-slate-900"
            >
              <span>Start a Project</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <IconArrowUpRight />
              </span>
            </a>
          </div>

          <GridRule className="mt-10" />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <MonoLabel>© {new Date().getFullYear()} JasaNet. All rights reserved.</MonoLabel>
            <MonoLabel>Infrastructure & Cloud Architecture · Jakarta, Indonesia</MonoLabel>
          </div>
        </div>
      </footer>
    </main>
  );
}