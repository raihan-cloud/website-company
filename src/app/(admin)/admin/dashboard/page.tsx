'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, Zap, ArrowUpRight, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status?: string;
  createdAt: string;
}

const chartData = [
  { name: 'Jan', 'Pesan Masuk': 12 },
  { name: 'Feb', 'Pesan Masuk': 18 },
  { name: 'Mar', 'Pesan Masuk': 25 },
  { name: 'Apr', 'Pesan Masuk': 20 },
  { name: 'Mei', 'Pesan Masuk': 32 },
];

export default function PremiumDashboard() {
  const [data, setData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data dashboard:", err);
        setLoading(false);
      });
  }, []);

  const unreadCount = data.filter(item => item.status === 'unread' || !item.status).length;

  return (
    <div className="min-h-screen bg-[#f8f8f7] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="space-y-1">
            {/* Eyebrow label */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 select-none">
              Network Ops · Dashboard
            </p>
            <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-[-0.03em] leading-none text-zinc-900">
              Selamat Datang,{' '}
              <span className="text-blue-600">Raihan</span>
            </h1>
            <p className="text-[13px] text-zinc-500 font-normal leading-relaxed pt-0.5">
              Performa konversi leads jasa network Anda hari ini.
            </p>
          </div>

          {/* Date pill — ghost style */}
          <div className="inline-flex items-center gap-2 self-start md:self-auto border border-zinc-200 bg-white rounded-lg px-3.5 py-2 text-[11px] font-semibold text-zinc-500 shadow-none">
            <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="tracking-tight">Mei 2026 · Real-time</span>
          </div>
        </header>

        {/* ── METRIC CARDS ───────────────────────────────────────────── */}
        <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">

          {/* CARD 1 — Total Leads */}
          <div className="group relative bg-white border border-zinc-200/80 rounded-xl p-5 transition-all duration-200 hover:border-blue-200 hover:shadow-[0_2px_16px_0_rgba(37,99,235,0.07)]">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Total Leads
              </span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>

            <div className="text-[38px] font-black tracking-[-0.04em] text-zinc-900 leading-none tabular-nums">
              {loading ? (
                <span className="text-zinc-300">—</span>
              ) : data.length}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5">
                <ArrowUpRight className="h-2.5 w-2.5 stroke-[3]" />
                +12% MoM
              </span>
            </div>
          </div>

          {/* CARD 2 — Follow Up */}
          <div className="group relative bg-white border border-zinc-200/80 rounded-xl p-5 transition-all duration-200 hover:border-amber-200 hover:shadow-[0_2px_16px_0_rgba(245,158,11,0.07)]">
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Butuh Follow Up
              </span>
              <div className="relative p-2 bg-amber-50 rounded-lg">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
            </div>

            <div className="text-[38px] font-black tracking-[-0.04em] text-amber-500 leading-none tabular-nums">
              {loading ? (
                <span className="text-zinc-300">—</span>
              ) : unreadCount}
            </div>

            <p className="mt-3 text-[11px] text-zinc-400 font-medium leading-snug">
              Menunggu konfirmasi arsitektur jaringan
            </p>
          </div>

          {/* CARD 3 — Conversion Rate */}
          <div className="group relative bg-white border border-zinc-200/80 rounded-xl p-5 transition-all duration-200 hover:border-indigo-200 hover:shadow-[0_2px_16px_0_rgba(99,102,241,0.07)] sm:col-span-2 md:col-span-1">
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Conversion Rate
              </span>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Users className="h-3.5 w-3.5 text-indigo-500" />
              </div>
            </div>

            <div className="text-[38px] font-black tracking-[-0.04em] text-zinc-900 leading-none tabular-nums">
              84.2%
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">
                <TrendingUp className="h-2.5 w-2.5" />
                High Conversion
              </span>
            </div>
          </div>
        </section>

        {/* ── CHART + SERVICE STATUS ─────────────────────────────────── */}
        <section className="grid gap-4 lg:grid-cols-3">

          {/* Area Chart */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-xl overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-zinc-100">
              <h2 className="text-[13px] font-bold text-zinc-800 tracking-tight">
                Tren Konsultasi Masuk
              </h2>
              <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                Volume pengajuan infrastruktur · 5 bulan terakhir
              </p>
            </div>
            <div className="h-[260px] pr-4 pt-4 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPesan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.10} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.00} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis
                    dataKey="name"
                    stroke="#a1a1aa"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    fontWeight={600}
                    letterSpacing={1}
                  />
                  <YAxis
                    stroke="#a1a1aa"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dx={-4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e4e4e7',
                      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.06)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#18181b', marginBottom: 2 }}
                    cursor={{ stroke: '#e4e4e7', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Pesan Masuk"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPesan)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-white border border-zinc-200/80 rounded-xl flex flex-col">
            <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
              <h2 className="text-[13px] font-bold text-zinc-800 tracking-tight">
                Status Layanan Jasa
              </h2>
              <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                Beban kerja network engineer
              </p>
            </div>

            <div className="p-4 space-y-2 flex-1">
              {/* Service item */}
              {[
                { label: 'Instalasi Kabel FO', badge: 'High Demand', hot: true },
                { label: 'Audit Mikrotik/Cisco', badge: 'High Demand', hot: true },
                { label: 'Maintenance Bulanan', badge: 'Stable', hot: false },
              ].map((svc) => (
                <div
                  key={svc.label}
                  className="flex items-center justify-between px-3 py-3 rounded-lg bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/60 transition-colors duration-150 cursor-default"
                >
                  <span className="text-[12px] font-semibold text-zinc-700 tracking-tight">
                    {svc.label}
                  </span>
                  {svc.hot ? (
                    <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5">
                      {svc.badge}
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500 bg-zinc-100 border border-zinc-200 rounded-md px-2 py-0.5">
                      {svc.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <button className="w-full flex items-center justify-between text-[12px] font-semibold text-blue-600 border border-blue-100 bg-blue-50/50 hover:bg-blue-50 rounded-lg px-3.5 py-2.5 transition-colors duration-150 group">
                Kelola Katalog Jasa
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── INBOX TABLE ────────────────────────────────────────────── */}
        <section className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-zinc-800 tracking-tight">
                Inbox Konsultasi Terbaru
              </h2>
              <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                Antrean leads masuk · Diperbarui otomatis
              </p>
            </div>
            {!loading && data.length > 0 && (
              <span className="text-[10px] font-bold text-zinc-400 tabular-nums">
                {Math.min(data.length, 5)} dari {data.length} entri
              </span>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50/60">
                <TableHead className="w-[220px] pl-6 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">
                  Klien
                </TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">
                  Kebutuhan Jasa
                </TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">
                  Detail Masalah
                </TableHead>
                <TableHead className="py-3 pr-6 text-right text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16">
                    <span className="text-[11px] font-mono font-medium text-zinc-300 tracking-widest animate-pulse">
                      LOADING DATASET…
                    </span>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16">
                    <p className="text-[13px] font-medium text-zinc-400">
                      Belum ada antrean pesan konsultasi masuk.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                data.slice(0, 5).map((item, i) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-zinc-100/80 last:border-none hover:bg-zinc-50/40 transition-colors duration-100 group"
                  >
                    {/* Klien */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        {/* Avatar monogram */}
                        <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black text-blue-600 uppercase">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-zinc-800 tracking-tight leading-none">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-normal mt-0.5 leading-none">
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Service badge */}
                    <TableCell className="py-4">
                      <span className="inline-flex items-center text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 tracking-tight">
                        {item.service}
                      </span>
                    </TableCell>

                    {/* Message truncated */}
                    <TableCell className="py-4 max-w-[280px]">
                      <p className="text-[12px] text-zinc-500 font-normal truncate leading-relaxed">
                        {item.message}
                      </p>
                    </TableCell>

                    {/* CTA */}
                    <TableCell className="py-4 pr-6 text-right">
                      <button className="text-[11px] font-semibold text-blue-600 border border-blue-100 bg-transparent hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors duration-150 opacity-0 group-hover:opacity-100">
                        Proses Prospek
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>

      </div>
    </div>
  );
}