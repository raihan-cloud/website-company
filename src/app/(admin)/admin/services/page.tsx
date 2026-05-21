'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Server, Wifi, ShieldAlert, ToggleLeft, ToggleRight, Layers } from 'lucide-react';

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  badge: 'High Demand' | 'Stable' | 'Popular';
  status: 'Active' | 'Inactive';
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  // State Form Input Tambah Jasa
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    badge: 'Stable'
  });

  // 1. Ambil Data dari API (READ)
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error("Gagal memuat katalog layanan");
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Tambah Jasa Baru ke Firestore (CREATE)
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Gagal menyimpan paket");

      setFormData({ title: '', description: '', price: '', badge: 'Stable' });
      setShowForm(false);
      fetchServices(); // Refresh data otomatis
    } catch (err) {
      alert("Gagal menambahkan layanan baru.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Ubah Tingkat Demand Jasa secara Siklis (UPDATE - Badge)
  const handleToggleDemand = async (id: string, currentBadge: string) => {
    let nextBadge = 'Stable';
    if (currentBadge === 'Stable') nextBadge = 'High Demand';
    else if (currentBadge === 'High Demand') nextBadge = 'Popular';

    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, badge: nextBadge })
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, badge: nextBadge as any } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Aktifkan / Nonaktifkan Tampilan Jasa (UPDATE - Status)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus as any } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Hapus Paket Jasa (DELETE)
  const handleDeleteService = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini dari katalog publik?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Gagal menghapus");
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Gagal menghapus layanan.");
    } finally {
      setActionLoading(false);
    }
  };

  // 6. LIVE SEARCH FILTERING (Berdasarkan Judul & Deskripsi)
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Katalog Jasa</h1>
          <p className="text-sm text-slate-500">Atur paket layanan infrastruktur IT, sesuaikan harga, dan kontrol penampilannya di landing page.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl text-xs h-10 font-semibold shadow-sm shadow-blue-100"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Tutup Form" : "Tambah Layanan Baru"}
        </Button>
      </div>

      {/* FORM INPUT COMPONENT (CREATOR DOCK) */}
      {showForm && (
        <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl max-w-xl transition-all">
          <CardContent className="p-6">
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Nama Layanan Jasa</Label>
                <Input placeholder="E.g., Instalasi Kabel Fiber Optic (FO)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Deskripsi / Ruang Lingkup</Label>
                <Input placeholder="E.g., Splicing core, testing OTDR, penarikan kabel backbone" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Base Price (IDR)</Label>
                  <Input type="number" placeholder="3500000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Status Operasional</Label>
                  <select 
                    value={formData.badge} 
                    onChange={e => setFormData({...formData, badge: e.target.value})}
                    className="w-full bg-white rounded-xl border border-slate-200 h-10 px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Stable">Stable</option>
                    <option value="High Demand">High Demand</option>
                    <option value="Popular">Popular</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs">
                {actionLoading ? "Menyimpan ke Firestore..." : "Publish Layanan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama layanan atau deskripsi..." 
          className="pl-9 bg-white rounded-xl border-slate-200 focus-visible:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABEL LAYANAN PREMIUM */}
      <Card className="border border-slate-200/60 shadow-md shadow-slate-100/40 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-slate-100">
                <TableHead className="font-bold text-slate-700 py-3.5 pl-6">Detail Layanan</TableHead>
                <TableHead className="font-bold text-slate-700 py-3.5">Base Price</TableHead>
                <TableHead className="font-bold text-slate-700 py-3.5">Status Operasional</TableHead>
                <TableHead className="font-bold text-slate-700 py-3.5 text-center">Visibilitas</TableHead>
                <TableHead className="font-bold text-slate-700 py-3.5 text-center pr-6 w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-14 text-slate-400 font-mono text-xs">
                    Sinkronisasi katalog langsung dari cluster database Firestore...
                  </TableCell>
                </TableRow>
              ) : filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-slate-50/40 transition border-b border-slate-100/80 last:border-none">
                  {/* DETAIL LAYANAN DENGAN DINAMIS IKON */}
                  <TableCell className="py-4 pl-6 max-w-[320px]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        service.badge === 'High Demand' ? 'bg-emerald-50 text-emerald-600' :
                        service.badge === 'Popular' ? 'bg-purple-50 text-purple-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {service.badge === 'High Demand' ? <Wifi className="h-4 w-4" /> : 
                         service.badge === 'Popular' ? <ShieldAlert className="h-4 w-4" /> : 
                         <Server className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm leading-snug">{service.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]">{service.description || 'Tanpa keterangan'}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* BASE PRICE CONVERTED */}
                  <TableCell className="py-4 font-mono text-xs font-bold text-slate-700">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(service.price)}
                  </TableCell>

                  {/* STATUS OPERASIONAL INTERAKTIF (BISA DIKLIK UNTUK TOGGLE) */}
                  <TableCell className="py-4">
                    <Badge 
                      onClick={() => handleToggleDemand(service.id, service.badge)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md cursor-pointer select-none hover:opacity-85 transition ${
                        service.badge === 'High Demand' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        service.badge === 'Popular' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                      title="Klik untuk ubah status demand"
                    >
                      {service.badge}
                    </Badge>
                  </TableCell>

                  {/* TOGGLE AKTIF SWITCH (VISIBILITAS PUBLIK) */}
                  <TableCell className="text-center py-4">
                    <button 
                      onClick={() => handleToggleStatus(service.id, service.status)}
                      className="transition focus:outline-none"
                      title={service.status === 'Active' ? "Sembunyikan dari Landing Page" : "Tampilkan ke Landing Page"}
                    >
                      {service.status === 'Active' ? (
                        <ToggleRight className="h-6 w-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-300" />
                      )}
                    </button>
                  </TableCell>

                  {/* TOMBOL DELETE DATA */}
                  <TableCell className="text-center py-4 pr-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={actionLoading}
                      onClick={() => handleDeleteService(service.id)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-8 w-8 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredServices.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-14 text-slate-400 text-sm font-medium">
                    Layanan Jasa yang Anda cari tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}