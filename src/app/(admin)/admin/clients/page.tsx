'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Tambahan impor ikon untuk interaksi CRUD
import { Search, UserPlus, Phone, Mail, Building2, Trash2, AlertCircle } from 'lucide-react';

interface Client {
  id: string;
  name: string;      // Nama PIC Pelanggan
  company: string;   // Nama Perusahaan / Instansi (kita mapping dari 'name' jika di DB lama)
  email: string;
  phone: string;
  service: string;   // Paket Layanan Jaringan
  status: string;    // Active Contract / Maintenance / Completed
  joinedAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // State Kontrol Tampilan Form Tambah Klien (Toggle)
  const [showForm, setShowForm] = useState(false);

  // State Form Data
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    status: 'Active Contract'
  });

  // 1. Ambil Data Klien dari Backend (READ)
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error(`Status error: ${res.status}`);
      const data = await res.json();
      
      // Menyelaraskan struktur data firestore dengan UI CRM
      if (Array.isArray(data)) {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name || '-',
          company: item.company || item.service || '-', // fallback ke service jika company kosong
          email: item.email || '-',
          phone: item.phone || '-',
          service: item.service || '-',
          status: item.status === 'Active' ? 'Active Contract' : item.status || 'Active Contract',
          joinedAt: item.joinedAt || new Date().toISOString()
        }));
        setClients(mappedData);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data klien:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Tambah Klien ke Backend (CREATE)
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          service: formData.service || formData.company, // Set service sama dengan company untuk simplifikasi
          status: formData.status
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan data mitra baru");

      // Reset form dan refresh data
      setFormData({ name: '', company: '', email: '', phone: '', service: '', status: 'Active Contract' });
      setShowForm(false);
      fetchClients();
      alert("Mitra Klien sukses didaftarkan!");
    } catch (err) {
      alert("Error gagal mendaftarkan pelanggan.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Mengubah Status Klien secara Siklis (UPDATE)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    let nextStatus = 'Active Contract';
    if (currentStatus === 'Active Contract') nextStatus = 'Maintenance';
    else if (currentStatus === 'Maintenance') nextStatus = 'Completed';

    setActionLoading(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });

      if (!res.ok) throw new Error("Gagal mengupdate status");
      setClients(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    } catch (err) {
      alert("Gagal merubah status kontrak.");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Hapus Data Klien (DELETE)
  const handleDeleteClient = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus permanen klien ini dari database CRM?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Gagal menghapus");
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Gagal menghapus data dari Firestore.");
    } finally {
      setActionLoading(false);
    }
  };

  // Logika Pencarian / Live Filter Klien
  const filteredClients = clients.filter((client) => {
    return (
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Database Klien (CRM)</h1>
          <p className="text-sm text-slate-500">Kelola direktori data pelanggan dan riwayat kontrak kerja sama.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl text-xs h-10 font-semibold"
        >
          <UserPlus className="h-4 w-4" /> {showForm ? "Tutup Form" : "Tambah Klien"}
        </Button>
      </div>

      {/* FORM INPUT TOGGLE (CREATE SECTION) */}
      {showForm && (
        <Card className="border border-slate-200/60 shadow-md bg-white rounded-2xl max-w-2xl transition-all">
          <CardContent className="p-6">
            <form onSubmit={handleAddClient} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Nama Pelanggan (PIC)</Label>
                <Input placeholder="Ahmad Fauzi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Perusahaan / Instansi</Label>
                <Input placeholder="PT Nexus Solusi Data" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Email Utama</Label>
                <Input type="email" placeholder="fauzi@nexus.id" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">No. HP / WhatsApp</Label>
                <Input placeholder="081234567xxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold text-slate-500">Deskripsi Paket Jaringan / Project</Label>
                <Input placeholder="Instalasi Fiber Optic Core & Splicing Backbone" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
              </div>
              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs">
                  {actionLoading ? "Menyimpan Data..." : "Simpan ke Database CRM"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* BAR PENCARIAN */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama klien atau perusahaan..." 
          className="pl-9 bg-white rounded-xl border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABEL DATA UTAMA */}
      <Card className="border border-slate-200/60 shadow-md bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="font-bold text-slate-600 pl-6 py-3.5">Nama Pelanggan</TableHead>
                <TableHead className="font-bold text-slate-600 py-3.5">Perusahaan / Instansi</TableHead>
                <TableHead className="font-bold text-slate-600 py-3.5">Kontak</TableHead>
                <TableHead className="font-bold text-slate-600 py-3.5">Status Kontrak</TableHead>
                <TableHead className="font-bold text-slate-600 text-center pr-6 py-3.5">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-mono text-xs">
                    Mengambil data klien dari Firebase Cloud...
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    Tidak ditemukan kecocokan data klien.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50/50 transition border-b border-slate-100 last:border-none">
                    <TableCell className="font-bold text-slate-900 pl-6 py-4">{client.name}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {client.company}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 font-medium italic">{client.service}</span>
                      </div>
                    </TableCell>
                    <TableCell className="space-y-1 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Mail className="h-3 w-3 text-slate-400" /> {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Phone className="h-3 w-3 text-slate-400" /> {client.phone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* Klik Badge Status untuk mengubah status siklus secara dinamis */}
                      <Badge 
                        onClick={() => handleToggleStatus(client.id, client.status)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition select-none ${
                          client.status === 'Active Contract' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          client.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center pr-6 py-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={actionLoading}
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-8 w-8 transition"
                        title="Hapus Klien"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}