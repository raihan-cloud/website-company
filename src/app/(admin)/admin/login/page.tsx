'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
// PERBAIKAN: Import auth dari konfigurasi firebase kita, dan fungsi signIn resmi Firebase
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // Mengubah username menjadi email agar sesuai standar Firebase
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // State baru untuk menampung pesan error
  const [loading, setLoading] = useState(false); // State baru untuk animasi loading tombol

  // PERBAIKAN: Fungsi login yang terhubung ke Firebase Auth & mengamankan Cookie
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Kirim data email dan password ke Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Simpan token ke cookie agar terbaca oleh Next.js Middleware di sisi Server
      document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;

      // 3. Masuk ke halaman dashboard utama admin secara aman
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      setError('Akses ditolak. Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0f172a] text-white font-sans overflow-x-hidden">
      
      {/* BAGIAN KIRI: Welcome Banner dengan Background Gambar Pemandangan */}
      <div 
        className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between relative bg-cover bg-center min-h-[40vh] md:min-h-screen"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')` 
        }}
      >
        {/* Konten Teks Welcome */}
        <div className="my-auto max-w-md space-y-4 z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
            Welcome <br />Back
          </h1>
          <p className="text-sm md:text-base text-slate-200/90 font-medium leading-relaxed">
            Sistem Informasi Manajemen Infrastruktur Jaringan JasaNet. Pantau performa bisnis dan leads konversi klien Anda dengan mudah dalam satu panel terpusat.
          </p>
        </div>

        {/* Ikon Media Sosial Menggunakan SVG Murni (Bebas Error Package) */}
        <div className="flex items-center gap-4 pt-6 z-10 border-t border-white/10">
          {/* Facebook */}
          <a href="#" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3l.5-3H13V6c0-.5.5-1 1-1h2V1H13c-3 0-4 2-4 4v3z"/></svg>
          </a>
          {/* Twitter / X */}
          <a href="#" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.2 2.4h3.3l-7.2 8.2L22.8 22h-6.6l-5.2-6.8L5.1 22H1.8l7.7-8.8L1.2 2.4h6.8l4.7 6.2 5.5-6.2zm-1.2 17.6h1.8L7.1 4.3H5.1L17 20z"/></svg>
          </a>
          {/* Instagram */}
          <a href="#" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          {/* Youtube */}
          <a href="#" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>
      </div>

      {/* BAGIAN KANAN: Form Sign In */}
      <div className="w-full md:w-1/2 bg-[#121824] px-8 py-12 md:p-24 flex flex-col justify-center items-center min-h-[60vh] md:min-h-screen">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="space-y-2 text-left w-full">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Sign in</h2>
            <p className="text-xs text-slate-400 font-medium">Gunakan akun administrator JasaNet Portal Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 w-full">
            {/* PERBAIKAN: Kotak info error UI jika salah password (menggantikan alert jelek browser) */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold p-3.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0 stroke-[2.5]" />
                <span>{error}</span>
              </div>
            )}

            {/* Input Email / Username */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@jasanet.com" 
                className="bg-[#1e2638] border-slate-700 text-white placeholder-slate-500 rounded-xl h-11 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-[#1e2638] border-slate-700 text-white placeholder-slate-500 rounded-xl h-11 pr-10 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Opsi Tambahan */}
            <div className="flex items-center justify-between text-xs font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input type="checkbox" className="accent-orange-600 h-4 w-4 rounded-md border-slate-700 bg-[#1e2638]" />
                Remember Me
              </label>
              <a href="#" className="text-slate-400 hover:text-white hover:underline transition">
                Lost your password?
              </a>
            </div>

            {/* Tombol Sign In Jingga dengan proteksi Loading */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#cc4e25] hover:bg-[#b5411d] disabled:opacity-50 text-white font-bold rounded-xl h-11 transition shadow-lg shadow-orange-950/20 mt-4 tracking-wide text-sm"
            >
              {loading ? "Memproses Verifikasi..." : "Sign in now"}
            </Button>

            {/* Footer */}
            <div className="text-[11px] text-center text-slate-500 pt-6 border-t border-slate-800/60 leading-relaxed">
              By clicking on &quot;Sign in now&quot; you agree to <br />
              <a href="#" className="hover:underline text-slate-400">Terms of Service</a> | <a href="#" className="hover:underline text-slate-400">Privacy Policy</a>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}