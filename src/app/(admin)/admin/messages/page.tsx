'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, AlertCircle, Check, Trash2, Mail } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  status: string; // Diwajibkan string (bukan opsional) agar tipe data konsisten
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Ambil Data (READ) dengan normalisasi data status
  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/contact')
      .then((res) => {
        if (!res.ok) throw new Error(`Server mengembalikan status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // PERBAIKAN: Normalisasi data mentah dari Firestore agar selalu memiliki field status 'unread' jika kosong
          const normalizedData: Message[] = data.map((msg: any) => ({
            ...msg,
            status: msg.status || 'unread'
          }));

          setMessages(normalizedData);
          
          if (normalizedData.length > 0) {
            setSelectedMessage(normalizedData[0]);
          } else {
            setSelectedMessage(null);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data pesan:", err);
        setError(err.message || "Gagal memuat data dari server.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Fungsi Mengubah Status (UPDATE) dengan sinkronisasi state ganda yang aman
  const handleMarkAsRead = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' })
      });

      if (!res.ok) throw new Error("Gagal memperbarui status");

      // PERBAIKAN: Perbarui state array utama
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
      
      // PERBAIKAN: Perbarui juga state objek detail kanan secara eksplisit agar tombol langsung berganti/hilang
      setSelectedMessage(prev => prev && prev.id === id ? { ...prev, status: 'read' } : prev);
    } catch (err) {
      alert("Gagal merubah status pesan di server.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Fungsi Hapus Data (DELETE)
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus permanen pesan ini?")) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      const updatedMessages = messages.filter(msg => msg.id !== id);
      setMessages(updatedMessages);
      
      // Mengalihkan fokus detail dengan aman setelah data dihapus
      if (updatedMessages.length > 0) {
        setSelectedMessage(updatedMessages[0]);
      } else {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert("Gagal menghapus pesan dari database.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pesan Masuk & Prospek</h1>
        <p className="text-sm text-slate-500">
          Monitor pengajuan konsultasi jaringan dan pertanyaan yang dikirimkan calon klien melalui website.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* KOLOM KIRI: DAFTAR INBOX PESAN */}
        <Card className="lg:col-span-2 border border-slate-200/60 shadow-md shadow-slate-100/40 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800">Kotak Masuk</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/60">
                <TableRow>
                  <TableHead className="font-bold text-slate-600 text-xs py-3.5 pl-6">Pengirim</TableHead>
                  <TableHead className="font-bold text-slate-600 text-xs py-3.5">Layanan</TableHead>
                  <TableHead className="font-bold text-slate-600 text-xs py-3.5 text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-slate-400 font-mono text-xs">
                      Menghubungkan ke database Firebase...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-rose-500 text-xs font-mono">
                      <AlertCircle className="h-5 w-5 mx-auto mb-2 text-rose-400" />
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-slate-400 text-sm font-medium">
                      Belum ada pesan konsultasi yang masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg) => (
                    <TableRow 
                      key={msg.id} 
                      className={`hover:bg-slate-50/60 transition border-b border-slate-100/80 last:border-none cursor-pointer ${
                        selectedMessage?.id === msg.id ? 'bg-blue-50/40 hover:bg-blue-50/50' : ''
                      }`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                          {msg.name}
                          {msg.status === 'unread' && (
                            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shrink-0" title="Belum dibaca" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{msg.email}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-blue-50/60 font-semibold text-blue-700 text-[10px] rounded-md border-blue-100 px-2 py-0.5">
                          {msg.service}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <Badge className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                          msg.status === 'unread' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {msg.status === 'unread' ? 'Baru' : 'Terbaca'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* KOLOM KANAN: DETAIL ISI PESAN YANG DIKLIK */}
        <Card className="border border-slate-200/60 shadow-md shadow-slate-100/40 bg-white rounded-2xl p-6 h-fit sticky top-20">
          {selectedMessage ? (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
                <div>
                  <Badge className="bg-blue-600 text-white text-[9px] uppercase font-bold tracking-wider rounded-md mb-2">
                    Detail Prospek
                  </Badge>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{selectedMessage.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedMessage.email}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={actionLoading}
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 h-9 w-9"
                  title="Hapus Pesan"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                  <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu Masuk</p>
                    <p className="mt-0.5 text-slate-700">
                      {isNaN(Date.parse(selectedMessage.createdAt)) 
                        ? selectedMessage.createdAt 
                        : new Date(selectedMessage.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                  <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kebutuhan Solusi</p>
                    <p className="mt-0.5 text-slate-700 font-bold">{selectedMessage.service}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Isi Pesan/Keluhan:</p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    "{selectedMessage.message}"
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                {selectedMessage.status === 'unread' && (
                  <Button 
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full border-emerald-200 bg-emerald-50/30 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold h-10 flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    Tandai Sudah Dibaca
                  </Button>
                )}

                <a 
                  href={`mailto:${selectedMessage.email}?subject=Balasan Konsultasi JasaNet - Jasa Jaringan`}
                  className="block w-full"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-10 shadow-sm flex items-center justify-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    Hubungi Klien via Email
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 space-y-3">
              <AlertCircle className="h-8 w-8 text-slate-300 stroke-[1.5]" />
              <div className="text-xs font-medium max-w-[200px]">
                {loading ? "Sedang memuat..." : "Pilih salah satu pesan di sebelah kiri untuk melihat detail isi konsultasi."}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}