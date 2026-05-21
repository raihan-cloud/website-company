// src/app/(public)/components/CTA.tsx
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Clock, ShieldCheck, Users } from "lucide-react";

// ─── Type definitions ─────────────────────────────────────────────────────────
interface TrustSignal {
  icon:  React.ElementType;
  value: string;
  label: string;
}

interface ActionLink {
  label:    string;
  sub:      string;
  href:     string;
  external: boolean;
  variant:  "primary" | "outline";
}

// ─── Static data — outside render tree ───────────────────────────────────────
const TRUST_SIGNALS: TrustSignal[] = [
  {
    icon:  Clock,
    value: "< 15 menit",
    label: "Rata-rata waktu respons engineer pada jam kerja",
  },
  {
    icon:  ShieldCheck,
    value: "SLA Tertulis",
    label: "Setiap engagement dilindungi kontrak SLA formal",
  },
  {
    icon:  Users,
    value: "200+ Klien",
    label: "Enterprise B2B yang telah mempercayakan infrastruktur mereka",
  },
] as const;

const ACTIONS: ActionLink[] = [
  {
    label:    "Buka Etalase Jasa",
    sub:      "Jelajahi seluruh layanan & paket",
    href:     "/services",
    external: false,
    variant:  "primary",
  },
  {
    label:    "Hubungi Tim Ahli",
    sub:      "Respons langsung via WhatsApp",
    href:     "https://wa.me/6281234567890?text=Halo%20JasaNet%2C%20saya%20ingin%20konsultasi%20infrastruktur%20jaringan.",
    external: true,
    variant:  "outline",
  },
] as const;

// ─── Structural grid background ───────────────────────────────────────────────
// A pure SVG grid of fine 1px lines — no gradients, no glow.
// Creates depth and technical character without any color.
function StructuralGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Repeating cell pattern */}
        <pattern
          id="cta-grid"
          x="0" y="0"
          width="80" height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="0.5"
          />
        </pattern>
        {/* Radial vignette — darkens corners, keeps center breathable */}
        <radialGradient id="cta-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="#020617" stopOpacity="0"   />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#cta-grid)" />
      <rect width="100%" height="100%" fill="url(#cta-vignette)" />
    </svg>
  );
}

// ─── Primary action button ────────────────────────────────────────────────────
function PrimaryButton({ action }: { action: ActionLink }) {
  const Wrapper = action.external ? "a" : Link;
  const externalProps = action.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      href={action.href}
      {...externalProps}
      className={[
        "group relative flex flex-col justify-between",
        "h-full min-h-[120px] w-full",
        "border border-slate-100/90 bg-slate-50",
        "px-7 py-6 rounded-sm overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:bg-white hover:border-white",
      ].join(" ")}
    >
      {/* Animated background fill on hover — dark sweep from left */}
      <span
        className={[
          "absolute inset-0 -translate-x-full",
          "bg-[#020617]",
          "transition-transform duration-500 ease-out",
          "group-hover:translate-x-0",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Content — sits above the sweep */}
      <div className="relative flex flex-col justify-between h-full gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p
              className={[
                "font-mono text-[10px] tracking-[0.2em] uppercase mb-1",
                "text-slate-500 transition-colors duration-300 group-hover:text-slate-600",
              ].join(" ")}
            >
              {action.sub}
            </p>
            <span
              className={[
                "font-serif text-xl tracking-tight",
                "text-[#020617] transition-colors duration-300 group-hover:text-slate-50",
              ].join(" ")}
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {action.label}
            </span>
          </div>

          {/* Arrow icon — diagonal nudge on hover */}
          <span
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm",
              "border border-slate-200 bg-transparent",
              "transition-all duration-300",
              "group-hover:border-slate-700 group-hover:bg-slate-800",
            ].join(" ")}
          >
            <ArrowUpRight
              className={[
                "h-4 w-4",
                "text-[#020617] transition-all duration-300",
                "group-hover:text-slate-50",
                "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              ].join(" ")}
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

// ─── Outline action button ────────────────────────────────────────────────────
function OutlineButton({ action }: { action: ActionLink }) {
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "group relative flex flex-col justify-between",
        "h-full min-h-[120px] w-full",
        "border border-slate-800/80 bg-transparent",
        "px-7 py-6 rounded-sm overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:border-slate-700",
        "hover:bg-slate-900/40",
      ].join(" ")}
    >
      <div className="flex items-start justify-between h-full">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1 text-slate-700">
            {action.sub}
          </p>
          <span
            className={[
              "font-serif text-xl tracking-tight",
              "text-slate-300 transition-colors duration-200 group-hover:text-slate-50",
            ].join(" ")}
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {action.label}
          </span>
        </div>

        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm",
            "border border-slate-800 bg-transparent",
            "transition-all duration-200 group-hover:border-slate-600 group-hover:bg-slate-800/60",
          ].join(" ")}
        >
          <MessageCircle
            className="h-4 w-4 text-slate-600 transition-colors duration-200 group-hover:text-slate-300"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </a>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CTA() {
  const [primary, outline] = ACTIONS;

  return (
    <section
      className="relative bg-[#020617] border-t border-slate-800/60 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Structural grid background */}
      <StructuralGrid />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/*
          ── Asymmetric 2-column split ─────────────────────────────────────
          Left  col: 7/12 — authoritative headline + descriptor
          Right col: 5/12 — action panel (buttons + trust footnote)
          Separated by a structural 1px vertical rule.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_420px]">

          {/* ── LEFT — Headline column ─────────────────────────────────── */}
          <div className="flex flex-col justify-center py-20 pr-0 lg:pr-16">

            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
                Mulai Proyek
              </span>
            </div>

            {/* Headline */}
            <h2
              id="cta-heading"
              className={[
                "font-serif text-[clamp(2.4rem,5vw,4.25rem)]",
                "leading-[0.95] tracking-tighter text-slate-50 mb-8",
              ].join(" ")}
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Infrastruktur
              <br />
              <span className="text-slate-400">yang Anda butuhkan,</span>
              <br />
              dikerjakan
              <br />
              <em className="not-italic text-slate-50">dengan presisi.</em>
            </h2>

            {/* Descriptor */}
            <p className="text-sm leading-7 text-slate-500 max-w-sm mb-10">
              Dari satu titik instalasi hingga desain topologi multi-site
              — JasaNet menangani kompleksitas teknis agar tim Anda
              bisa fokus pada bisnis inti.
            </p>

            {/* Inline trust strip — horizontal on desktop left col */}
            <div className="hidden lg:grid grid-cols-3 gap-px border border-slate-800/50 rounded-sm overflow-hidden max-w-lg">
              {TRUST_SIGNALS.map(({ icon: Icon, value, label }) => (
                <div
                  key={value}
                  className={[
                    "flex flex-col gap-2 px-4 py-4",
                    "bg-slate-900/30",
                    "border-r border-slate-800/50 last:border-r-0",
                  ].join(" ")}
                >
                  <Icon
                    className="h-3.5 w-3.5 text-slate-600"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-mono text-sm font-semibold text-slate-200 tabular-nums tracking-tight">
                      {value}
                    </div>
                    <div className="font-mono text-[9px] tracking-widest uppercase text-slate-700 mt-0.5 leading-relaxed">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── Vertical divider ───────────────────────────────────────── */}
          <div
            className="hidden lg:block w-px bg-slate-800/60 self-stretch"
            aria-hidden="true"
          />

          {/* ── RIGHT — Action panel ───────────────────────────────────── */}
          <div
            className={[
              "flex flex-col justify-center gap-4",
              "py-20 pl-0 lg:pl-12",
              "border-t lg:border-t-0 border-slate-800/60",
            ].join(" ")}
          >

            {/* Index label */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-700 uppercase">
                Pilih jalur Anda
              </span>
              <span className="h-px flex-1 bg-slate-800/50" aria-hidden="true" />
            </div>

            {/* Primary button */}
            <PrimaryButton action={primary} />

            {/* Outline button */}
            <OutlineButton action={outline} />

            {/* ── Trust footnote ──────────────────────────────────────── */}
            <div
              className={[
                "mt-2 flex items-start gap-3",
                "border border-slate-800/50 rounded-sm px-4 py-3.5",
                "bg-slate-900/20",
              ].join(" ")}
            >
              <Clock
                className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-mono text-[10px] leading-relaxed tracking-wide text-slate-600">
                Rata-rata tim engineer kami merespons dalam waktu{" "}
                <span className="text-slate-400 font-medium">
                  kurang dari 15 menit
                </span>{" "}
                pada jam kerja (Senin–Jumat, 08.00–17.00 WIB).
              </p>
            </div>

            {/* Mobile-only trust strip */}
            <div className="lg:hidden grid grid-cols-1 gap-px border border-slate-800/50 rounded-sm overflow-hidden mt-2">
              {TRUST_SIGNALS.map(({ icon: Icon, value, label }) => (
                <div
                  key={value}
                  className="flex items-center gap-4 px-4 py-3.5 bg-slate-900/30 border-b border-slate-800/50 last:border-b-0"
                >
                  <Icon
                    className="h-3.5 w-3.5 text-slate-600 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-300 tabular-nums">
                      {value}
                    </span>
                    <span className="font-mono text-[9px] tracking-widest uppercase text-slate-700">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ── Bottom rule + legal ────────────────────────────────────────── */}
        <div className="border-t border-slate-800/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-wider text-slate-800 uppercase">
            JasaNet © {new Date().getFullYear()} — Layanan Jaringan Enterprise
          </p>
          <div className="flex items-center gap-4">
            <span className="h-1 w-1 rounded-full bg-slate-800" aria-hidden="true" />
            <p className="font-mono text-[10px] tracking-wider text-slate-800 uppercase">
              Berlisensi & Terdaftar di Kominfo RI
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}