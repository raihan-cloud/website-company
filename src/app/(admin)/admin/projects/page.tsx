'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Briefcase, ExternalLink, Calendar, Trash2, Eye, EyeOff, Layers } from 'lucide-react';

interface Project {
  id: string;
  projectTitle: string;
  clientName: string;
  category: string;
  year: string;
  tags?: string; // string dipisah koma dari DB, misal: "Fiber Optic, Splicing"
  img?: string;
  status: 'Published' | 'Archived';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // State Form Input Tambah Portofolio
  const [formData, setFormData] = useState({
    projectTitle: '',
    clientName: '',
    category: 'Infrastruktur Jaringan',
    year: new Date().getFullYear().toString(),
    tags: '', // Diisi teks pisah koma oleh admin
    img: ''
  });

  // 1. Ambil Data dari API (READ)
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error("Gagal mengambil data portofolio");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Tambah Portofolio Baru ke Firestore (CREATE)
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectTitle || !formData.clientName) return;

    setActionLoading(true);
    try {
      // Masukkan fallback image jika admin mengosongkan link gambar
      const finalPayload = {
        ...formData,
        img: formData.img.trim() || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan portofolio");

      setFormData({
        projectTitle: '',
        clientName: '',
        category: 'Infrastruktur Jaringan',
        year: new Date().getFullYear().toString(),
        tags: '',
        img: ''
      });
      setShowForm(false);
      fetchProjects(); // Refresh list kartu
    } catch (err) {
      alert("Gagal menambahkan dokumen proyek baru.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Toggle Visibilitas Publik (UPDATE - Status)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Published' ? 'Archived' : 'Published';
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus as any } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Hapus Portofolio (DELETE)
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Hapus projek ini dari portofolio selamanya?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus portofolio.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Portofolio Proyek</h1>
          <p className="text-sm text-slate-500">Kelola galeri bukti kerja lapangan instalasi jaringan untuk memikat klien korporat.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl text-xs h-10 font-semibold shadow-sm shadow-blue-100"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Tutup Form" : "Tambah Portofolio"}
        </Button>
      </div>

      {/* FORM INPUT COMPONENT (CREATOR DOCK) */}
      {showForm && (
        <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl max-w-xl transition-all">
          <CardContent className="p-6">
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Judul Implementasi / Nama Proyek</Label>
                <Input placeholder="E.g., Migrasi & Penarikan Kabel Backbone FO 10Gbps" value={formData.projectTitle} onChange={e => setFormData({...formData, projectTitle: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Nama Perusahaan Klien</Label>
                <Input placeholder="E.g., ISP Lokal Net" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Kebutuhan Tags / Label Teknis (Pisahkan dengan koma)</Label>
                <Input placeholder="E.g., Fiber Optic, Splicing, Cisco Core" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">URL Gambar Dokumentasi Lapangan</Label>
                <Input placeholder="E.g., https://images.unsplash.com/... (Bisa dikosongkan)" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Kategori</Label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white rounded-xl border border-slate-200 h-10 px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Infrastruktur Jaringan">Infrastruktur</option>
                    <option value="Keamanan & Optimasi">Keamanan & Optimasi</option>
                    <option value="Langganan">Langganan SLA</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Waktu / Tahun Selesai</Label>
                  <Input placeholder="E.g., Mei 2026" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                </div>
              </div>
              <Button type="submit" disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs">
                {actionLoading ? "Mengunggah Studi Kasus..." : "Publish ke Galeri Publik"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* RENDER GRID KARTU KONTEN DARI BACKEND */}
      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 text-center py-14 text-slate-400 font-mono text-xs">
            Menghubungkan ke pusat berkas arsip portofolio Firestore...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-2 text-center py-14 text-slate-400 text-sm font-medium">
            Belum ada dokumentasi proyek yang dipublikasikan.
          </div>
        ) : (
          projects.map((proj) => {
            // Konversi teks koma dari database menjadi array tag siap pakai
            const tagArray = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [proj.category];
            const defaultImage = proj.img || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80';

            return (
              <Card key={proj.id} className={`border border-slate-200/60 bg-white overflow-hidden shadow-md rounded-2xl flex flex-col md:flex-row transition ${
                proj.status === 'Archived' ? 'opacity-65 bg-slate-50/50' : ''
              }`}>
                {/* Sisi Kiri: Preview Image Project */}
                <div 
                  className="w-full md:w-44 h-48 md:h-auto min-h-[180px] bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url('${defaultImage}')` }}
                />
                
                {/* Sisi Kanan: Detail Konten */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Calendar className="h-3 w-3 text-blue-500" /> {proj.year}
                      </div>
                      {/* Badge Indikator Status internal Admin */}
                      <Badge className={`text-[9px] font-extrabold rounded-md px-1.5 py-0.5 ${
                        proj.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {proj.status}
                      </Badge>
                    </div>
                    <h3 className="text-base font-black text-slate-800 leading-snug tracking-tight">{proj.projectTitle}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-slate-400" /> Klien: <span className="text-slate-700 font-bold">{proj.clientName}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Badges Teknis Dinamis */}
                    <div className="flex flex-wrap gap-1.5">
                      {tagArray.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md px-2 py-0.5 border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Tombol Aksi Mutasi */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      {/* Tombol Toggle Visibilitas */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(proj.id, proj.status)}
                        className={`w-full text-xs h-8 font-bold rounded-xl flex items-center justify-center gap-1 ${
                          proj.status === 'Published' ? 'text-slate-600 border-slate-200' : 'text-blue-600 border-blue-200 bg-blue-50/20'
                        }`}
                      >
                        {proj.status === 'Published' ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Archive
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Publish
                          </>
                        )}
                      </Button>

                      {/* Tombol Hapus */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={actionLoading}
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-xs h-8 px-3 border-slate-200 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}