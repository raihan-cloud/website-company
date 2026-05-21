// src/app/(public)/components/Portfolio.tsx
//
// Server Component — runs exclusively on the server.
// Fetches exactly 2 projects from the internal API route /api/projects.
// Never exposes raw fetch errors to the client.
//
import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

// ─── Type definitions ─────────────────────────────────────────────────────────
export interface Project {
  id:          string;
  title:       string;
  client:      string;
  sector:      string;
  location:    string;
  year:        string;
  summary:     string;
  tags:        string[];
  scope:       string[];
  outcome:     { value: string; label: string }[];
  href:        string;
  coverAlt:    string;
  /** Optional hex accent used for the card's structural rule */
  accentClass?: string;
}

interface ApiResponse {
  projects: Project[];
}

// ─── Data fetcher — safe, typed, with revalidation ───────────────────────────
async function fetchProjects(): Promise<Project[]> {
  try {
    // Using an absolute URL pattern compatible with Next.js server components.
    // In production, NEXT_PUBLIC_BASE_URL should be set (e.g. https://jasanet.id).
    // Falls back to localhost for local dev.
    const base =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
      `http://localhost:${process.env.PORT ?? 3000}`;

    const res = await fetch(`${base}/api/projects`, {
      // ISR — revalidate every 60 seconds so the section stays fresh
      // without being a blocking dynamic render on every request.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Log server-side; surface nothing sensitive to the client.
      console.error(
        `[Portfolio] /api/projects responded ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data: ApiResponse = await res.json();

    // Guard: ensure the shape we expect
    if (!Array.isArray(data?.projects)) {
      console.error("[Portfolio] Unexpected API shape:", data);
      return [];
    }

    // Take exactly 2 items — contract with the section design
    return data.projects.slice(0, 2);
  } catch (err) {
    // Network failures, JSON parse errors, etc. — never throw upward
    console.error("[Portfolio] Fetch failed:", err);
    return [];
  }
}

// ─── Fallback UI — shown when fetch returns empty ────────────────────────────
function PortfolioEmpty() {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-4",
        "border border-slate-800/60 rounded-sm",
        "py-20 px-8 text-center",
        "bg-slate-900/20",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <AlertTriangle
        className="h-5 w-5 text-slate-700"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="font-mono text-xs tracking-wider text-slate-700">
        Project data unavailable — check back shortly.
      </p>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <article
      className={[
        "group relative",
        // Even card: image-left / text-right split
        // Odd card: text-left / image-right split — visual alternation
        "grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]",
        isEven ? "" : "lg:[direction:rtl]",
        "border border-slate-800/60",
        "bg-[#020617]",
        "transition-colors duration-300 ease-out hover:bg-slate-900/30",
        "hover:border-slate-700/70",
      ].join(" ")}
      aria-label={`Case study: ${project.title}`}
    >
      {/* Top accent hairline */}
      <span
        className="absolute top-0 inset-x-0 h-px bg-slate-400 opacity-30 group-hover:opacity-70 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* ── Left / Main panel ───────────────────────────────────────── */}
      <div
        className={[
          "flex flex-col justify-between",
          "p-8 lg:p-10",
          isEven ? "" : "lg:[direction:ltr]",
        ].join(" ")}
      >
        {/* Header — index + metadata */}
        <header>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-slate-700 uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-slate-800/60" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-slate-700">
              {project.year}
            </span>
          </div>

          {/* Sector chip */}
          <div className="mb-5 inline-flex items-center border border-slate-800/70 px-2.5 py-1 rounded-sm">
            <span className="font-mono text-[9px] tracking-widest uppercase text-slate-600">
              {project.sector}
            </span>
          </div>

          {/* Title */}
          <h3
            className={[
              "font-serif text-[clamp(1.5rem,2.5vw,2rem)]",
              "leading-[1.1] tracking-tight text-slate-100 mb-4",
              "transition-colors duration-200 group-hover:text-slate-50",
            ].join(" ")}
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {project.title}
          </h3>

          {/* Client + location */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[11px] text-slate-500">
              {project.client}
            </span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-600">
              {project.location}
            </span>
          </div>

          {/* Summary */}
          <p className="text-sm leading-7 text-slate-500">
            {project.summary}
          </p>
        </header>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={[
                "inline-flex items-center",
                "border border-slate-800/60 px-2.5 py-1 rounded-sm",
                "font-mono text-[9px] tracking-widest uppercase text-slate-600",
                "transition-colors duration-150 group-hover:border-slate-700/60",
              ].join(" ")}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={project.href}
          className={[
            "group/cta mt-8 inline-flex items-center gap-1.5 self-start",
            "font-mono text-[11px] tracking-wider uppercase",
            "text-slate-600 hover:text-slate-300",
            "transition-colors duration-200",
          ].join(" ")}
          aria-label={`Read case study: ${project.title}`}
        >
          Read case study
          <ArrowUpRight
            className="h-3 w-3 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* ── Internal vertical divider ────────────────────────────────── */}
      <div
        className="hidden lg:block w-px bg-slate-800/60 self-stretch"
        style={isEven ? {} : { direction: "ltr" }}
        aria-hidden="true"
      />

      {/* ── Right / Detail panel ─────────────────────────────────────── */}
      <div
        className={[
          "flex flex-col justify-between",
          "border-t lg:border-t-0 border-slate-800/60",
          "p-8 lg:p-10",
          isEven ? "" : "lg:[direction:ltr]",
        ].join(" ")}
      >
        {/* Scope list */}
        <div>
          <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-5">
            Scope of Work
          </h4>
          <ul className="space-y-3" role="list">
            {project.scope.map((item, i) => (
              <li key={item} className="flex items-start gap-4">
                <span className="font-mono text-[9px] text-slate-700 tabular-nums pt-0.5 w-4 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] tracking-wide leading-relaxed text-slate-500">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outcome metrics */}
        <div className="mt-10 border-t border-slate-800/50 pt-6">
          <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-700 mb-5">
            Outcomes
          </h4>
          <div className="grid grid-cols-3 gap-px">
            {project.outcome.map(({ value, label }) => (
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

// ─── Component (async Server Component) ──────────────────────────────────────
export default async function Portfolio() {
  const projects = await fetchProjects();

  return (
    <section
      className="relative bg-[#020617] border-t border-slate-800/60"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Section header ───────────────────────────────────────────── */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20 border-b border-slate-800/50">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600">
                Selected Work
              </span>
            </div>
            <h2
              id="portfolio-heading"
              className={[
                "font-serif text-[clamp(2rem,4vw,3.25rem)]",
                "leading-[1.05] tracking-tighter text-slate-50",
              ].join(" ")}
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Infrastructure
              <br />
              <span className="text-slate-400">shipped in the field.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-6">
            <p className="text-sm leading-7 text-slate-500 max-w-sm">
              Every engagement is a reference architecture — documented,
              measured, and available for technical review by prospective clients.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800/60" aria-hidden="true" />
              <Link
                href="/projects"
                className={[
                  "group inline-flex items-center gap-1.5",
                  "font-mono text-[11px] tracking-wider uppercase text-slate-600",
                  "hover:text-slate-300 transition-colors duration-200",
                ].join(" ")}
              >
                View all projects
                <ArrowUpRight
                  className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>
        </header>

        {/* ── Project cards or fallback ─────────────────────────────────── */}
        <div className="py-12 space-y-px">
          {projects.length === 0 ? (
            <PortfolioEmpty />
          ) : (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}