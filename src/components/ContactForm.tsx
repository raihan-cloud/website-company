'use client';
import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    service: 'Instalasi Jaringan (LAN/WAN/WiFi)', // Disamakan dengan isi opsi pertama agar valid
    message: '' 
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // PERBAIKAN: Menambahkan tipe data untuk event submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: data.message });
        // Reset form setelah sukses
        setFormData({ name: '', email: '', service: 'Instalasi Jaringan (LAN/WAN/WiFi)', message: '' }); 
      } else {
        setStatus({ type: 'error', text: data.message || 'Terjadi kesalahan.' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Gagal tersambung ke server. Coba lagi nanti.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold mb-2 text-gray-900 text-center">Mulai Konsultasi Jaringan</h3>
      <p className="text-gray-500 text-sm text-center mb-6">Diskusikan kebutuhan infrastruktur IT atau masalah network Anda bersama tim ahli kami.</p>
      
      {status.text && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {status.text}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Nama Lengkap</label>
        {/* PERBAIKAN: Type-safe handler menggunakan HTMLInputElement */}
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} 
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-gray-50" 
          placeholder="Contoh: Raihan" 
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Alamat Email</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})} 
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-gray-50" 
          placeholder="raihan@example.com" 
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Jenis Layanan</label>
        {/* PERBAIKAN: Type-safe handler menggunakan HTMLSelectElement */}
        <select 
          value={formData.service} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, service: e.target.value})} 
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-gray-50"
        >
          <option value="Instalasi Jaringan (LAN/WAN/WiFi)">Instalasi Jaringan (LAN/WAN/WiFi)</option>
          <option value="Konsultasi & Audit Jaringan">Konsultasi & Audit Jaringan</option>
          <option value="Troubleshooting & Pemeliharaan Jaringan">Troubleshooting & Pemeliharaan Jaringan</option>
          <option value="Konfigurasi Router & Server (Mikrotik/Cisco)">Konfigurasi Router & Server (Mikrotik/Cisco)</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Detail Masalah / Spesifikasi Project</label>
        {/* PERBAIKAN: Type-safe handler menggunakan HTMLTextAreaElement */}
        <textarea 
          value={formData.message} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, message: e.target.value})} 
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-gray-50 h-32 resize-none" 
          placeholder="Jelaskan kendala atau spesifikasi jaringan yang ingin dibangun..." 
          required
        ></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md disabled:bg-gray-400">
        {loading ? 'Sedang Memproses...' : 'Kirim Pengajuan'}
      </button>
    </form>
  );
}