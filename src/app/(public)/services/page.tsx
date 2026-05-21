"use client";

// src/app/(public)/services/page.tsx
// JasaNet — Premium Services Marketplace dengan Integrasi Booking Gateway
// Next.js 14+ App Router | Tailwind CSS | Client Component

import { useState, useEffect, useMemo, useCallback } from "react";
import Script from "next/script";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  availability: string; // "Tersedia" | "Terbatas"
  description?: string;
}

type FetchStatus = "loading" | "error" | "success";

// ─── Constants ──────────────────────────────────────────────────────────────────

const ALL = "Semua";

// ─── Utilities ──────────────────────────────────────────────────────────────────

function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function isAvailable(availability: string | undefined | null): boolean {
  return availability?.toLowerCase() === "tersedia";
}

// ─── Inline SVG Icons ────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconLoader() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────────

function MonoLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 ${className}`}>
      {children}
    </span>
  );
}

function AvailabilityBadge({ availability }: { availability: string | undefined | null }) {
  const ready = isAvailable(availability);
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {ready ? (
          <>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </>
        ) : (
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        )}
      </span>
      <MonoLabel className={ready ? "!text-emerald-600" : "!text-amber-600"}>
        {ready ? "Slot Ready" : "Terbatas"}
      </MonoLabel>
    </div>
  );
}

function ServiceCard({ item, onSelect }: { item: ServiceItem; onSelect: (item: ServiceItem) => void }) {
  return (
    <article className="group flex flex-col border border-slate-100 bg-white transition-colors duration-300 hover:border-slate-200">
      <div className="h-px w-full bg-slate-100 transition-colors duration-500 group-hover:bg-blue-200" />

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="border border-slate-100 bg-slate-50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
            {item.category}
          </span>
          <AvailabilityBadge availability={item.availability} />
        </div>

        <h3 className="text-xl font-medium leading-tight tracking-tight text-slate-900 lg:text-2xl">
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-3 flex-1 text-[13px] leading-[1.75] text-slate-400">
            {item.description}
          </p>
        )}

        <div className="mb-6 mt-7 h-px bg-slate-100" />

        <div className="mb-6">
          <MonoLabel>Harga dasar / baseline</MonoLabel>
          <p className="mt-2 text-3xl font-light tracking-tighter text-slate-900 lg:text-4xl">
            {formatIDR(item.price)}
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-300">
            Final price via BoQ survey
          </p>
        </div>

        <button
          onClick={() => onSelect(item)}
          className="group/btn flex w-full items-center justify-between border border-slate-900 bg-slate-950 px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          aria-label={`Pesan paket ${item.name}`}
        >
          <span>Pesan & Jadwalkan</span>
          <span className="flex items-center gap-2 opacity-70 transition-opacity group-hover/btn:opacity-100">
            <IconArrow />
          </span>
        </button>
      </div>
    </article>
  );
}

// ─── Modal Booking Component ──────────────────────────────────────────────────────

function BookingModal({ item, onClose }: { item: ServiceItem; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: item.id,
          serviceName: item.name,
          servicePrice: item.price, // 🛠️ FIX: Mengirim harga etalase agar sinkron dinamis dengan backend
          clientName: form.name,
          clientEmail: form.email,
          clientPhone: form.phone,
          surveyDate: form.date,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Trigger pop-up Midtrans Snap
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function (result: unknown) {
          alert("Booking Sukses! Tim JasaNet akan segera memverifikasi jadwal survei Anda.");
          console.log("Midtrans Success:", result);
          onClose();
        },
        onPending: function (result: unknown) {
          alert("Menunggu penyelesaian pembayaran booking fee Anda.");
          console.log("Midtrans Pending:", result);
        },
        onError: function (result: unknown) {
          alert("Pembayaran gagal, silakan periksa kembali saldo atau metode pembayaran Anda.");
          console.log("Midtrans Error:", result);
        },
        onClose: function () {
          alert("Sesi pembayaran dibatalkan.");
        }
      });

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem saat menghubungi payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl lg:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <MonoLabel className="!text-blue-600">// Konfirmasi Pemesanan</MonoLabel>
            <h4 className="mt-1 text-lg font-medium text-slate-900">{item.name}</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-mono text-sm focus:outline-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">Nama Lengkap</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 p-2.5 text-sm outline-none focus:border-slate-900 transition-colors" placeholder="Raihan Muzaffar" />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">Email Perusahaan / Pribadi</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-slate-200 p-2.5 text-sm outline-none focus:border-slate-900 transition-colors" placeholder="raihan@jasanet.com" />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">Nomor WhatsApp</label>
            <input required type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-slate-200 p-2.5 text-sm outline-none focus:border-slate-900 transition-colors" placeholder="62812345678" />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-wider text-slate-400 mb-1">Rencana Tanggal Survei Lapangan</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 p-2.5 text-sm font-mono outline-none focus:border-slate-900 transition-colors" />
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-100 text-[12px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Biaya Paket (Etalase):</span>
              <span className="font-medium text-slate-900">{formatIDR(item.price)}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">*Pembayaran penuh sesuai dengan tarif nominal katalog marketplace.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-slate-950 text-white font-mono text-[10px] uppercase tracking-widest py-3.5 hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Preparing Gateway..." : "Lanjutkan ke Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col border border-slate-100 bg-white p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse bg-slate-100" />
        <div className="h-4 w-16 animate-pulse bg-slate-100" />
      </div>
      <div className="mb-2 h-6 w-3/4 animate-pulse bg-slate-100" />
      <div className="mb-1 h-4 w-full animate-pulse bg-slate-100" />
      <div className="mb-8 h-4 w-2/3 animate-pulse bg-slate-100" />
      <div className="mb-5 h-px bg-slate-100" />
      <div className="mb-1 h-3 w-24 animate-pulse bg-slate-100" />
      <div className="mb-6 h-8 w-44 animate-pulse bg-slate-100" />
      <div className="h-11 w-full animate-pulse bg-slate-100" />
    </div>
  );
}

function LoadingView() {
  const steps = [
    { code: "01", text: "Connecting to service registry cluster..." },
    { code: "02", text: "Authenticating API endpoint..." },
    { code: "03", text: "Streaming infrastructure package manifest..." },
    { code: "04", text: "Compiling availability matrix..." },
  ];
  return (
    <div className="py-20 text-center">
      <div className="mb-8 flex justify-center">
        <IconLoader />
      </div>
      <div className="mx-auto max-w-xs border border-slate-100 bg-slate-50 p-5 text-left">
        <MonoLabel className="mb-4 block">// cluster.sys.log</MonoLabel>
        {steps.map(({ code, text }) => (
          <div key={code} className="flex gap-3 py-1.5">
            <span className="font-mono text-[10px] text-slate-300">{code}</span>
            <span className="font-mono text-[10px] text-slate-500">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 text-slate-300"><IconAlert /></div>
      <p className="text-2xl font-light tracking-tight text-slate-600">Registry unavailable.</p>
      <p className="mt-2 font-mono text-[11px] text-slate-400">Failed to stream package manifest from cluster endpoint.</p>
      <button
        onClick={onRetry}
        className="mt-8 flex items-center gap-2 border border-slate-200 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 transition-colors duration-200 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      >
        <IconRefresh />
        Retry Connection
      </button>
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const fetchServices = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ServiceItem[] = await res.json();
      setServices(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const categories = useMemo<string[]>(() => {
    const cleaned = services.map((s) => s.category?.trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned)).sort();
    return [ALL, ...unique];
  }, [services]);

  const filtered = useMemo<ServiceItem[]>(() => {
    const q = query.toLowerCase().trim();
    return services.filter((s) => {
      const matchCat = category === ALL || s.category?.trim() === category;
      const matchQ = !q || s.name.toLowerCase().includes(q) || (s.description?.toLowerCase().includes(q) ?? false);
      return matchCat && matchQ;
    });
  }, [services, query, category]);

  const hasFilters = query || category !== ALL;

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Inject SDK Snap Midtrans */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&display=swap');
        :root { --font-sans:'Geist',system-ui,sans-serif; --font-mono:'Geist Mono',monospace; }
        body { font-family:var(--font-sans); }
        .font-mono { font-family:var(--font-mono); }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-900/10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-28 lg:px-14 lg:pb-20 lg:pt-36">
          <div className="mb-10 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 bg-blue-500" />
            <MonoLabel className="!text-slate-500">Infrastructure Marketplace — Registry v2.0</MonoLabel>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="text-5xl font-light leading-[1.0] tracking-tighter text-white lg:text-[5rem]">
                On-demand<br /><span className="text-slate-500">infrastructure</span><br />packages.
              </h1>
            </div>
            <div className="flex items-end lg:col-span-5">
              <div className="border-l border-slate-800 pl-7">
                <p className="text-[13px] leading-7 text-slate-500">
                  Pilih paket infrastruktur jaringan dan cloud enterprise yang sesuai kebutuhan Anda. Booking slot survei BoQ teknisi lapangan sekarang melalui gateway terintegrasi aman kami.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-900 pt-8">
            <MonoLabel className="!text-slate-600">{status === "success" ? `${services.length} Packages` : "Loading..."}</MonoLabel>
            <span className="h-3 w-px bg-slate-800" />
            <MonoLabel className="!text-slate-600">Secure Payment Gateway</MonoLabel>
            <span className="h-3 w-px bg-slate-800" />
            <MonoLabel className="!text-slate-600">Automated BoQ Scheduling</MonoLabel>
            <span className="h-3 w-px bg-slate-800" />
            <MonoLabel className="!text-slate-600">Jakarta, Indonesia</MonoLabel>
          </div>
        </div>
      </header>

      {/* Filter Dock (Sticky) */}
      {status === "success" && (
        <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-6 lg:px-14">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              <label className="relative flex flex-1 items-center border-r border-slate-100" htmlFor="pkg-search">
                <span className="pointer-events-none absolute left-4 text-slate-300"><IconSearch /></span>
                <input id="pkg-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau deskripsi paket..." className="w-full bg-transparent py-5 pl-10 pr-4 font-mono text-[12px] text-slate-700 placeholder-slate-300 outline-none" />
              </label>

              <div className="flex items-center overflow-x-auto border-t border-slate-100 sm:border-t-0" role="tablist" aria-label="Filter kategori">
                {categories.map((cat, idx) => {
                  const active = category === cat;
                  return (
                    <button
                      key={`${cat}-${idx}`}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(cat)}
                      className={`shrink-0 border-r border-slate-100 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-150 last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${active ? "bg-slate-950 text-white" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-14 lg:py-20">
        {status === "loading" && (
          <>
            <LoadingView />
            <div className="mt-10 grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {status === "error" && <ErrorView onRetry={fetchServices} />}

        {status === "success" && (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <MonoLabel>
                {filtered.length} paket {category !== ALL ? ` dalam "${category}"` : " tersedia"} {query ? ` · filter: "${query}"` : ""}
              </MonoLabel>
              {hasFilters && (
                <button onClick={() => { setQuery(""); setCategory(ALL); }} className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 underline underline-offset-2 transition-colors hover:text-slate-900">
                  Reset Filter
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-2xl font-light tracking-tight text-slate-400">No packages found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <ServiceCard key={item.id} item={item} onSelect={(srv) => setSelectedService(srv)} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer Notice */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="border border-amber-100 bg-amber-50/40 p-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="text-amber-500"><IconAlert /></span>
                  <MonoLabel className="!text-amber-600">Catatan Teknis Pengadaan / BoQ Notice</MonoLabel>
                </div>
                <p className="text-[13px] leading-7 text-amber-800/80">
                  Seluruh harga yang ditampilkan merupakan <strong className="font-medium">harga dasar instalasi (baseline)</strong>. Penetapan nilai anggaran resmi proyek korporasi dilakukan mutlak setelah pelaksanaan peninjauan lapangan dan penyusunan berkas <strong className="font-medium">Bill of Quantities (BoQ)</strong> resmi oleh tim insinyur JasaNet.
                </p>
              </div>
            </div>
            <div className="flex items-end justify-start lg:col-span-4 lg:justify-end">
              <div className="border border-slate-100 p-5 text-right">
                <MonoLabel className="block">JasaNet Enterprise</MonoLabel>
                <MonoLabel className="mt-1 block">Infrastructure & Cloud Division</MonoLabel>
                <MonoLabel className="mt-1 block !text-blue-400">Certified · Trusted · Enterprise-Grade</MonoLabel>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-8">
            <MonoLabel>© 2026 JasaNet. All rights reserved.</MonoLabel>
            <MonoLabel>Registry endpoint: /api/services</MonoLabel>
          </div>
        </div>
      </footer>

      {/* Booking Form Modal Handler */}
      {selectedService && (
        <BookingModal item={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </main>
  );
}