'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, CreditCard, Wrench, Bell, LogOut,
  CheckCircle2, Clock, ClipboardList, Plus, ChevronRight,
  Wifi, MapPin, Activity, ArrowUpRight, Menu, X, Calendar,
  AlertCircle, Filter, Download, Send, RotateCcw, Receipt,
  Inbox,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type OrderStatus = 'Selesai' | 'Diproses' | 'Menunggu' | 'Survei';
type TabId = 'dasbor' | 'pesanan' | 'pembayaran' | 'tiket' | 'notifikasi';

interface ClientUser { name: string; company: string; email: string; }
interface ServiceOrder { id: string; service: string; location: string; date: string; status: OrderStatus; amount: string; }
interface Invoice { id: string; desc: string; date: string; amount: string; paid: boolean; }
interface Ticket { id: string; title: string; date: string; priority: 'Tinggi' | 'Sedang' | 'Rendah'; open: boolean; }
interface Notif { id: string; title: string; body: string; time: string; read: boolean; }

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const DEFAULT_USER: ClientUser = {
  name: 'Bapak Hendra',
  company: 'PT. Maju Bersama Tbk.',
  email: 'hendra@majubersama.co.id',
};

const ORDERS: ServiceOrder[] = [
  { id: 'JN-0041', service: 'Instalasi Fiber Optik',        location: 'Gedung A Lt.3, Banda Aceh',  date: '14 Mei 2026', status: 'Selesai',  amount: 'Rp 4.500.000' },
  { id: 'JN-0042', service: 'Audit Jaringan MikroTik',      location: 'Kantor Pusat, Lhokseumawe',  date: '16 Mei 2026', status: 'Diproses', amount: 'Rp 1.200.000' },
  { id: 'JN-0043', service: 'Maintenance Bulanan',          location: 'Cabang Bireuen',             date: '19 Mei 2026', status: 'Menunggu', amount: 'Rp 800.000'   },
  { id: 'JN-0044', service: 'Konfigurasi VPN Site-to-Site', location: 'HQ · Remote',                date: '20 Mei 2026', status: 'Survei',   amount: 'Rp 3.200.000' },
  { id: 'JN-0038', service: 'Instalasi CCTV + NVR',         location: 'Gudang Utara, Aceh Utara',  date: '2 Mei 2026',  status: 'Selesai',  amount: 'Rp 7.800.000' },
];

const INVOICES: Invoice[] = [
  { id: 'INV-2026-041', desc: 'Instalasi Fiber Optik · Gedung A',    date: '14 Mei 2026', amount: 'Rp 4.500.000', paid: true  },
  { id: 'INV-2026-038', desc: 'Instalasi CCTV + NVR · Gudang Utara', date: '2 Mei 2026',  amount: 'Rp 7.800.000', paid: true  },
  { id: 'INV-2026-042', desc: 'Audit Jaringan MikroTik',             date: '16 Mei 2026', amount: 'Rp 1.200.000', paid: false },
  { id: 'INV-2026-043', desc: 'Maintenance Bulanan · Bireuen',        date: '19 Mei 2026', amount: 'Rp 800.000',   paid: false },
];

const TICKETS: Ticket[] = [
  { id: 'TKT-091', title: 'Internet putus setelah hujan deras',  date: '18 Mei 2026', priority: 'Tinggi', open: true  },
  { id: 'TKT-087', title: 'Kecepatan upload di bawah SLA',       date: '10 Mei 2026', priority: 'Sedang', open: true  },
  { id: 'TKT-079', title: 'Router restart sendiri setiap malam', date: '1 Mei 2026',  priority: 'Sedang', open: false },
];

const INITIAL_NOTIFS: Notif[] = [
  { id: 'n1', title: 'Jadwal Maintenance Dikonfirmasi',  body: 'Tim kami akan hadir Kamis 22 Mei 2026, pukul 09.00 WIB.',            time: '2 jam lalu',  read: false },
  { id: 'n2', title: 'Invoice INV-2026-042 Jatuh Tempo', body: 'Invoice senilai Rp 1.200.000 belum terbayar.',                       time: '5 jam lalu',  read: false },
  { id: 'n3', title: 'Pesanan JN-0042 Sedang Diproses',  body: 'Teknisi kami sedang mengerjakan audit MikroTik Anda.',               time: '1 hari lalu', read: true  },
  { id: 'n4', title: 'Tiket TKT-091 Diterima',           body: 'Laporan gangguan Anda sudah kami terima dan sedang ditindaklanjuti.', time: '2 hari lalu', read: true  },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<OrderStatus, { dot: string; bg: string; text: string }> = {
  Selesai:  { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Diproses: { dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
  Menunggu: { dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
  Survei:   { dot: 'bg-violet-500',  bg: 'bg-violet-50',  text: 'text-violet-700'  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
      {status}
    </span>
  );
}

// ─── ORDER TABLE (shared between Dasbor and Pesanan panels) ──────────────────

function OrderTable({ orders }: { orders: ServiceOrder[] }) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              {['No. Pesanan', 'Layanan', 'Lokasi', 'Tanggal', 'Status', 'Jumlah'].map(col => (
                <th key={col} className="text-left text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400 px-6 py-3 last:text-right">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/80">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[13px] text-zinc-400 font-medium">
                  Tidak ada data untuk filter ini.
                </td>
              </tr>
            ) : orders.map(order => (
              <tr key={order.id} className="group hover:bg-zinc-50/40 transition-colors duration-100">
                <td className="px-6 py-4 font-mono text-[11px] font-semibold text-zinc-400">{order.id}</td>
                <td className="px-6 py-4 text-[13px] font-semibold text-zinc-800 tracking-tight">{order.service}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <MapPin className="h-3 w-3 text-zinc-300 shrink-0" />{order.location}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-zinc-500 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                <td className="px-6 py-4 text-right font-semibold text-[13px] text-zinc-800 tabular-nums">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-zinc-100">
        {orders.map(order => (
          <div key={order.id} className="px-5 py-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-zinc-800">{order.service}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{order.id}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <MapPin className="h-3 w-3 shrink-0" />{order.location}
              </span>
              <span className="text-[12px] font-semibold text-zinc-800 tabular-nums">{order.amount}</span>
            </div>
            <p className="text-[10px] text-zinc-400">{order.date}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── NEW ORDER MODAL ──────────────────────────────────────────────────────────

function NewOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ service: '', location: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200)); // replace with real fetch
    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    setForm({ service: '', location: '', description: '' });
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl border border-zinc-200 p-0 overflow-hidden">
        <div className="h-[3px] bg-blue-600 w-full" />
        <div className="px-6 pt-5 pb-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[18px] font-extrabold tracking-tight text-zinc-900">
              Pesan Layanan Baru
            </DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-500 font-normal mt-1">
              Isi detail kebutuhan Anda. Tim kami akan menghubungi dalam 1×24 jam.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-zinc-900">Pengajuan Diterima!</p>
                <p className="text-[12px] text-zinc-500 font-normal mt-1">
                  Kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.
                </p>
              </div>
              <Button onClick={handleClose} className="mt-2 h-9 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold">
                Tutup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Nama / Jenis Layanan</Label>
                <Input required placeholder="Cth: Instalasi Fiber Optik, Konfigurasi MikroTik..."
                  value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  className="h-10 rounded-xl border-zinc-200 text-[13px] focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 bg-zinc-50/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Lokasi Pemasangan</Label>
                <Input required placeholder="Cth: Gedung B Lt.2, Jl. Merdeka No.10..."
                  value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="h-10 rounded-xl border-zinc-200 text-[13px] focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 bg-zinc-50/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Deskripsi Kebutuhan</Label>
                <textarea required rows={3}
                  placeholder="Jelaskan secara singkat kebutuhan atau kondisi jaringan saat ini..."
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-[13px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <DialogFooter className="pt-2 gap-2">
                <Button type="button" variant="ghost" onClick={handleClose}
                  className="h-10 px-5 rounded-xl text-[13px] font-medium text-zinc-500 hover:bg-zinc-100">
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold flex items-center gap-2 transition-colors">
                  {submitting ? (
                    <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mengirim...</>
                  ) : (
                    <><Send className="h-3.5 w-3.5" />Kirim Pengajuan</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── TAB PANELS ───────────────────────────────────────────────────────────────

function DashboardPanel({ user, statusFilter, setStatusFilter, onNewOrder, onViewAll }: {
  user: ClientUser; statusFilter: OrderStatus | null;
  setStatusFilter: (s: OrderStatus | null) => void;
  onNewOrder: () => void; onViewAll: () => void;
}) {
  const total      = ORDERS.length;
  const completed  = ORDERS.filter(o => o.status === 'Selesai').length;
  const inProgress = ORDERS.filter(o => o.status === 'Diproses').length;
  const pending    = ORDERS.filter(o => o.status === 'Menunggu' || o.status === 'Survei').length;

  const filteredOrders = statusFilter
    ? ORDERS.filter(o => statusFilter === 'Menunggu' ? (o.status === 'Menunggu' || o.status === 'Survei') : o.status === statusFilter)
    : ORDERS;

  const metrics: { label: string; value: number; sub: string; icon: React.ElementType; iconBg: string; iconColor: string; filter: OrderStatus | null; accent?: boolean }[] = [
    { label: 'Total Proyek', value: total,      sub: 'Semua pesanan aktif',                                icon: ClipboardList, iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    filter: null,       accent: true },
    { label: 'Selesai',      value: completed,  sub: `${Math.round((completed / total) * 100)}% completion rate`, icon: CheckCircle2,  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', filter: 'Selesai'  },
    { label: 'Diproses',     value: inProgress, sub: 'Sedang dikerjakan',                                 icon: Activity,      iconBg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  filter: 'Diproses' },
    { label: 'Menunggu',     value: pending,    sub: 'Perlu konfirmasi',                                  icon: Clock,         iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   filter: 'Menunggu' },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Ringkasan Akun</p>
          <h1 className="text-[24px] md:text-[28px] font-extrabold tracking-[-0.03em] text-zinc-900 leading-tight">
            Halo, {user.name} 👋
          </h1>
          <p className="text-[13px] text-zinc-500 font-normal">
            Berikut adalah status terkini seluruh layanan infrastruktur jaringan Anda.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 border border-zinc-200 bg-white rounded-lg px-3 py-2 self-start sm:self-auto whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          20 Mei 2026
        </div>
      </div>

      {/* Metric Cards — clickable with filter state */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(({ label, value, sub, icon: Icon, iconBg, iconColor, filter, accent }) => {
          const isActive = statusFilter === filter || (filter === null && statusFilter === null && accent);
          const isFiltered = filter !== null && statusFilter === filter;
          return (
            <button
              key={label}
              onClick={() => setStatusFilter(isFiltered ? null : filter)}
              className={`group relative bg-white border rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]
                ${isFiltered ? 'border-blue-300 ring-1 ring-blue-300 shadow-[0_4px_20px_rgba(37,99,235,0.10)]' : accent ? 'border-blue-100/80' : 'border-zinc-100/80'}`}
            >
              <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl transition-opacity duration-200
                ${isFiltered ? 'opacity-100 bg-blue-600' : 'opacity-0 group-hover:opacity-100 bg-zinc-300'}`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
                </div>
                {isFiltered
                  ? <Filter className="h-3.5 w-3.5 text-blue-400" />
                  : <ArrowUpRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
                }
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">{label}</p>
                <p className="text-[30px] font-extrabold tracking-[-0.04em] text-zinc-900 leading-none tabular-nums">{value}</p>
                <p className="text-[11px] text-zinc-400 font-normal pt-0.5">{sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-blue-800">Jadwal Maintenance Terjadwal</p>
          <p className="text-[11px] text-blue-600 font-normal mt-0.5">
            Tim kami akan melakukan kunjungan maintenance rutin pada <strong>Kamis, 22 Mei 2026</strong> pukul 09.00–12.00 WIB di lokasi Anda.
          </p>
        </div>
      </div>

      {/* Service History Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-zinc-900 tracking-tight">Riwayat Aktivitas Layanan</h2>
            <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
              {filteredOrders.length} entri ditampilkan{statusFilter ? ` · Filter: ${statusFilter}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusFilter && (
              <button onClick={() => setStatusFilter(null)}
                className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded-lg transition-colors">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
            <button onClick={onViewAll}
              className="text-[11px] font-semibold text-blue-600 border border-blue-100 bg-blue-50/60 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
              Lihat Semua <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <OrderTable orders={filteredOrders} />
        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-between">
          <p className="text-[10px] font-medium text-zinc-400">
            Menampilkan <strong className="text-zinc-600">{filteredOrders.length}</strong> dari <strong className="text-zinc-600">{ORDERS.length}</strong> entri
          </p>
          <div className="h-6 w-6 rounded-md text-[11px] font-bold bg-blue-600 text-white flex items-center justify-center">1</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4">
        {[
          { icon: Plus,       label: 'Pesan Layanan Baru', desc: 'Ajukan permintaan instalasi atau konfigurasi', onClick: onNewOrder },
          { icon: CreditCard, label: 'Lihat Tagihan',       desc: 'Cek invoice dan riwayat pembayaran',          onClick: () => {} },
          { icon: Wrench,     label: 'Buka Tiket Support',  desc: 'Laporkan kendala jaringan atau gangguan',     onClick: () => {} },
        ].map(({ icon: Icon, label, desc, onClick }) => (
          <button key={label} onClick={onClick}
            className="group flex items-center gap-4 bg-white border border-zinc-100 rounded-2xl px-5 py-4 text-left hover:border-zinc-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[1px]">
            <div className="p-2.5 rounded-xl bg-blue-50 shrink-0"><Icon className="h-4 w-4 text-blue-600" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-zinc-800 tracking-tight leading-none">{label}</p>
              <p className="text-[11px] text-zinc-400 font-normal mt-1 line-clamp-1">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function OrdersPanel({ onNewOrder }: { onNewOrder: () => void }) {
  const [filter, setFilter] = useState<OrderStatus | 'Semua'>('Semua');
  const statuses: (OrderStatus | 'Semua')[] = ['Semua', 'Diproses', 'Menunggu', 'Selesai', 'Survei'];
  const visible = filter === 'Semua' ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Portal Client</p>
          <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-zinc-900">Pesanan Saya</h1>
        </div>
        <button onClick={onNewOrder}
          className="self-start sm:self-auto flex items-center gap-1.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Pesan Baru
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-150
              ${filter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <OrderTable orders={visible} />
      </div>
    </div>
  );
}

function PaymentPanel() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Portal Client</p>
        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-zinc-900">Pembayaran & Invoice</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-zinc-100 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">Belum Terbayar</p>
          <p className="text-[28px] font-extrabold tracking-[-0.04em] text-amber-600 tabular-nums">Rp 2.000.000</p>
          <p className="text-[11px] text-zinc-400 mt-1">2 invoice outstanding</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">Total Terbayar</p>
          <p className="text-[28px] font-extrabold tracking-[-0.04em] text-emerald-600 tabular-nums">Rp 12.300.000</p>
          <p className="text-[11px] text-zinc-400 mt-1">2 invoice lunas</p>
        </div>
      </div>
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h2 className="text-[14px] font-bold text-zinc-900">Daftar Invoice</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {INVOICES.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/40 transition-colors">
              <div className={`p-2.5 rounded-xl shrink-0 ${inv.paid ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                <Receipt className={`h-4 w-4 ${inv.paid ? 'text-emerald-600' : 'text-amber-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-zinc-800 truncate">{inv.desc}</p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{inv.id} · {inv.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-bold text-zinc-800 tabular-nums">{inv.amount}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${inv.paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {inv.paid ? 'Lunas' : 'Belum Bayar'}
                </span>
              </div>
              <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketPanel() {
  const priorityCfg = {
    Tinggi: { bg: 'bg-rose-50',   text: 'text-rose-700'  },
    Sedang: { bg: 'bg-amber-50',  text: 'text-amber-700' },
    Rendah: { bg: 'bg-zinc-50',   text: 'text-zinc-600'  },
  };
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Portal Client</p>
        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-zinc-900">Tiket Support</h1>
      </div>
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-zinc-900">Tiket Aktif & Riwayat</h2>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="h-3 w-3" /> Tiket Baru
          </button>
        </div>
        <div className="divide-y divide-zinc-100">
          {TICKETS.map(t => {
            const pc = priorityCfg[t.priority];
            return (
              <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/40 transition-colors cursor-pointer group">
                <div className={`p-2.5 rounded-xl shrink-0 ${t.open ? 'bg-rose-50' : 'bg-zinc-50'}`}>
                  <Wrench className={`h-4 w-4 ${t.open ? 'text-rose-500' : 'text-zinc-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 truncate">{t.title}</p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{t.id} · {t.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>{t.priority}</span>
                  <span className={`text-[10px] font-semibold ${t.open ? 'text-rose-500' : 'text-zinc-400'}`}>{t.open ? 'Terbuka' : 'Ditutup'}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotifPanel() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Portal Client</p>
          <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-zinc-900">Notifikasi</h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-[11px] font-semibold text-blue-600 hover:underline">
            Tandai semua dibaca
          </button>
        )}
      </div>
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden divide-y divide-zinc-100">
        {notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-zinc-50/40 cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
            <div className={`mt-0.5 p-2.5 rounded-xl shrink-0 ${!n.read ? 'bg-blue-100' : 'bg-zinc-100'}`}>
              <Bell className={`h-4 w-4 ${!n.read ? 'text-blue-600' : 'text-zinc-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-[13px] font-semibold tracking-tight ${!n.read ? 'text-zinc-900' : 'text-zinc-600'}`}>{n.title}</p>
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />}
              </div>
              <p className="text-[12px] text-zinc-400 font-normal mt-0.5 leading-snug">{n.body}</p>
              <p className="text-[10px] text-zinc-400 font-medium mt-1">{n.time}</p>
            </div>
          </div>
        ))}
        {notifs.every(n => n.read) && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Inbox className="h-8 w-8 text-zinc-200" />
            <p className="text-[13px] font-medium text-zinc-400">Semua notifikasi sudah dibaca.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose, activeTab, setActiveTab, user, onLogout, unreadNotif }: {
  open: boolean; onClose: () => void; activeTab: TabId;
  setActiveTab: (t: TabId) => void; user: ClientUser;
  onLogout: () => void; unreadNotif: number;
}) {
  const NAV: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'dasbor',     icon: LayoutDashboard, label: 'Dasbor'        },
    { id: 'pesanan',    icon: FileText,        label: 'Pesanan Saya'  },
    { id: 'pembayaran', icon: CreditCard,      label: 'Pembayaran'    },
    { id: 'tiket',      icon: Wrench,          label: 'Tiket Support' },
    { id: 'notifikasi', icon: Bell,            label: 'Notifikasi'    },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-30 h-full w-[232px] bg-white border-r border-zinc-100 flex flex-col transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-5 border-b border-zinc-100">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Wifi className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[14px] font-bold tracking-tight text-zinc-900">JasaNet</span>
            <span className="text-[14px] font-normal text-blue-500">.client</span>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-zinc-400 hover:text-zinc-600"><X className="h-4 w-4" /></button>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 px-3 pb-2 pt-1">Menu Utama</p>
          {NAV.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => { setActiveTab(id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                  ${isActive ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)]' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'}`}>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                {label}
                {id === 'notifikasi' && unreadNotif > 0 && (
                  <span className={`ml-auto h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center
                    ${isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'}`}>
                    {unreadNotif}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        {/* User + logout */}
        <div className="px-3 pb-5 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl">
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-blue-700">
                {user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-zinc-800 truncate leading-none">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5 leading-none">{user.company}</p>
            </div>
            <button onClick={onLogout} title="Keluar"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function ClientDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [activeTab, setActiveTab]         = useState<TabId>('dasbor');
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [user, setUser]                   = useState<ClientUser>(DEFAULT_USER);
  const [notifs, setNotifs]               = useState(INITIAL_NOTIFS);

  // Safe localStorage read — must be in useEffect to avoid hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem('client_user');
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ClientUser>;
        setUser({
          name:    parsed.name    ?? DEFAULT_USER.name,
          company: parsed.company ?? DEFAULT_USER.company,
          email:   parsed.email   ?? DEFAULT_USER.email,
        });
      }
    } catch {
      // Malformed JSON — silently fall back to DEFAULT_USER
    }
  }, []);

  // Logout: clear storage + auth cookie, then redirect
  const handleLogout = () => {
    localStorage.removeItem('client_user');
    document.cookie = 'client_token=; Max-Age=0; path=/';
    router.replace('/login');
  };

  // "Lihat Semua" resets filter and switches to Pesanan tab
  const handleViewAll = () => {
    setStatusFilter(null);
    setActiveTab('pesanan');
  };

  const unreadNotif = notifs.filter(n => !n.read).length;

  const TAB_LABELS: Record<TabId, string> = {
    dasbor: 'Dasbor', pesanan: 'Pesanan Saya',
    pembayaran: 'Pembayaran', tiket: 'Tiket Support', notifikasi: 'Notifikasi',
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f5] font-sans antialiased">
      <Sidebar
        open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        activeTab={activeTab} setActiveTab={setActiveTab}
        user={user} onLogout={handleLogout} unreadNotif={unreadNotif}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-5 lg:px-8 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-400 font-medium">
              <span className="text-zinc-600 font-semibold">Portal Client</span>
              <ChevronRight className="h-3 w-3" />
              <span>{TAB_LABELS[activeTab]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 border border-zinc-200 rounded-full px-3 py-1.5 bg-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-zinc-600">Client Portal Active</span>
            </div>
            <button onClick={() => setOrderModalOpen(true)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-3.5 py-2 rounded-xl transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Pesan Layanan Baru</span>
              <span className="sm:hidden">Pesan</span>
            </button>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 px-5 lg:px-8 py-8 max-w-6xl w-full mx-auto">
          {activeTab === 'dasbor' && (
            <DashboardPanel
              user={user}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onNewOrder={() => setOrderModalOpen(true)}
              onViewAll={handleViewAll}
            />
          )}
          {activeTab === 'pesanan'    && <OrdersPanel onNewOrder={() => setOrderModalOpen(true)} />}
          {activeTab === 'pembayaran' && <PaymentPanel />}
          {activeTab === 'tiket'      && <TicketPanel />}
          {activeTab === 'notifikasi' && <NotifPanel />}
        </div>
      </main>

      <NewOrderModal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} />
    </div>
  );
}