// src/app/(public)/about/page.tsx
// JasaNet — Premium About Page
// Next.js 14+ App Router | Tailwind CSS | No external icon lib dependency

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — JasaNet",
  description:
    "JasaNet adalah agensi infrastruktur jaringan enterprise dan arsitektur cloud yang membangun fondasi digital kelas korporat.",
};

// ─── Types ──────────────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
  sub: string;
}

interface Leader {
  id: string;
  roleCode: string;
  roleFull: string;
  name: string;
  title: string;
  ethos: string;
  linkedinHref: string;
  flip: boolean;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const stats: StatItem[] = [
  { value: "99.9%", label: "Network Uptime SLA", sub: "Core infrastructure guarantee" },
  { value: "100+",  label: "Nodes Under Management", sub: "Enterprise-grade deployments" },
  { value: "ISO",   label: "Certified Engineers", sub: "CCNP / CCNA / AWS certified staff" },
];

const leaders: Leader[] = [
  {
    id: "pimpinan",
    roleCode: "CEO-001",
    roleFull: "Pimpinan — Chief Executive & Principal Architect",
    name: "Mohd Raihan Muzhaffar",
    title: "CEO & Principal Network Architect",
    ethos:
      "Infrastructure is not a cost centre — it is the competitive moat every enterprise deserves to engineer.",
    linkedinHref: "https://linkedin.com/",
    flip: false,
  },
  {
    id: "wakil",
    roleCode: "COO-001",
    roleFull: "Wakil Pimpinan — VP of Operations & Infrastructure Delivery",
    name: "Rezatul Maulana",
    title: "COO & Infrastructure Delivery Lead",
    ethos:
      "Reliable delivery is the product. Every SLA is a commitment written in engineering discipline.",
    linkedinHref: "https://linkedin.com/",
    flip: true,
  },
];

// ─── Inline SVG icons (avoids Turbopack/Next 16 export-map issues) ─────────────

function IconLinkedIn() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconAward() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

const statIcons = [IconShield, IconServer, IconAward];

// ─── Components ─────────────────────────────────────────────────────────────────

function GridRule() {
  return <div className="h-px w-full bg-slate-100" />;
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
      {children}
    </span>
  );
}

function StatBar() {
  return (
    <div className="border-y border-slate-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-slate-100 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-14">
        {stats.map(({ value, label, sub }, i) => {
          const Icon = statIcons[i];
          return (
            <div
              key={label}
              className="flex items-start gap-4 px-0 py-9 sm:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-slate-100 text-slate-400">
                <Icon />
              </div>
              <div>
                <p className="text-2xl font-light tracking-tight text-slate-900">
                  {value}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-slate-700">{label}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
                  {sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div
      className={`flex flex-col lg:flex-row ${
        leader.flip ? "lg:flex-row-reverse" : ""
      } border-t border-slate-100 first:border-t-0`}
    >
      {/* ── Image column ── */}
      <div className="relative w-full overflow-hidden bg-slate-50 lg:w-[38%]">
        <div className="aspect-[3/4] overflow-hidden">
          <div className="group relative h-full w-full transition-transform duration-700 ease-out hover:scale-[1.02]">
            {/* Placeholder frame */}
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50">
              {/* Initials medallion */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center border border-slate-200 bg-white">
                <span className="text-xl font-light tracking-widest text-slate-400">
                  {leader.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <MonoLabel>Photo Placeholder</MonoLabel>
            </div>

            {/* Overlay micro-border */}
            <div className="pointer-events-none absolute inset-0 border border-slate-200/50" />

            {/* Corner registration marks */}
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r border-slate-300/60" />
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t border-slate-300/60" />
          </div>
        </div>

        {/* Role code watermark */}
        <div className="absolute left-4 top-4">
          <MonoLabel>{leader.roleCode}</MonoLabel>
        </div>
      </div>

      {/* ── Content column ── */}
      <div
        className={`flex w-full flex-col justify-center py-14 lg:w-[62%] lg:py-20 ${
          leader.flip ? "lg:pr-16 pl-8 lg:pl-14" : "lg:pl-16 pr-8 lg:pr-14"
        } px-8`}
      >
        {/* Role label */}
        <div className="mb-7 flex items-center gap-3">
          <div className="h-px w-8 bg-blue-200" />
          <MonoLabel>{leader.roleFull}</MonoLabel>
        </div>

        {/* Name */}
        <h3 className="text-4xl font-light leading-[1.06] tracking-tighter text-slate-900 lg:text-5xl">
          {leader.name}
        </h3>

        {/* Title */}
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-600">
          {leader.title}
        </p>

        {/* Rule */}
        <GridRule />
        <div className="my-8" />

        {/* Ethos */}
        <blockquote className="border-l-2 border-slate-200 pl-5 text-[15px] font-light italic leading-8 text-slate-500">
          &ldquo;{leader.ethos}&rdquo;
        </blockquote>

        {/* LinkedIn */}
        <a
          href={leader.linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex w-fit items-center gap-2.5 border-b border-slate-200 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition-all duration-300 hover:border-slate-900 hover:text-slate-900"
        >
          <IconLinkedIn />
          <span>LinkedIn Profile</span>
          <span className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px">
            <IconArrowUpRight />
          </span>
        </a>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&display=swap');
        :root { --font-sans: 'Geist', system-ui, sans-serif; --font-mono: 'Geist Mono', monospace; }
        body { font-family: var(--font-sans); }
        .font-mono { font-family: var(--font-mono); }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-28 lg:px-14 lg:pb-28 lg:pt-40">
        <div className="mb-10 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 bg-blue-500" />
          <MonoLabel>JasaNet / Tentang Kami / v24.1</MonoLabel>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Headline */}
          <div className="lg:col-span-7">
            <h1 className="text-5xl font-light leading-[1.02] tracking-tighter text-slate-900 lg:text-[5.5rem]">
              We build the{" "}
              <span className="text-slate-400">infrastructure</span>
              <br />
              enterprises trust.
            </h1>
          </div>

          {/* Body */}
          <div className="flex flex-col justify-end lg:col-span-5">
            <div className="border-l border-slate-100 pl-8">
              <p className="text-[14px] leading-7 text-slate-500">
                JasaNet adalah agensi infrastruktur jaringan korporat dan
                arsitektur cloud kelas enterprise. Kami merancang, membangun,
                dan mengelola fondasi digital yang menjadi tulang punggung
                operasional bisnis berskala besar di seluruh Indonesia.
              </p>
              <p className="mt-5 text-[14px] leading-7 text-slate-500">
                Dari data centre backbone hingga multi-cloud orchestration —
                setiap solusi kami hadir dengan presisi teknis tertinggi,
                memastikan keandalan dan skalabilitas yang tak pernah menjadi
                hambatan pertumbuhan Anda.
              </p>
            </div>
          </div>
        </div>

        <GridRule />
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <StatBar />

      {/* ── Leadership ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-32 pt-24 lg:px-14 lg:pb-40 lg:pt-32">
        {/* Section header */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:mb-20 lg:grid-cols-12">
          <div className="flex items-start gap-3 lg:col-span-4">
            <span className="inline-block h-1.5 w-1.5 mt-1 bg-blue-500" />
            <MonoLabel>Executive Leadership / Kepemimpinan</MonoLabel>
          </div>
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-light leading-snug tracking-tighter text-slate-900 lg:text-4xl">
              The principals architecting
              <br />
              <span className="text-slate-400">JasaNet&rsquo;s engineering vision.</span>
            </h2>
          </div>
        </div>

        {/* Cards container */}
        <div className="border border-slate-100">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </section>

      {/* ── Footer strip ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 lg:px-14">
          <MonoLabel>JasaNet — Network & Cloud Infrastructure</MonoLabel>
          <MonoLabel>Indonesia / Enterprise Division</MonoLabel>
        </div>
      </div>
    </main>
  );
}