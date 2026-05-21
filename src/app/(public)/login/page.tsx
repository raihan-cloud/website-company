'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
// 🚀 Import modul Firebase Client SDK untuk Google Auth
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function ClientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── HANDLER 1: EMAIL & PASSWORD LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Proteksi double submit
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/client/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.message || 'Gagal masuk ke portal');
      }

      localStorage.setItem('client_user', JSON.stringify(resData.client));
      router.replace('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Email atau kata sandi Anda salah.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── HANDLER 2: GOOGLE SIGN IN ──
  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 💡 Mencegah event bubbling agar tidak mentrigger form onSubmit konvensional
    e.preventDefault();
    if (isLoading) return; 

    setIsLoading(true);
    setError('');
    try {
      // Memicu jendela pop-up otentikasi Google bawaan Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Teruskan data payload profil Google ke API router backend kita
      const res = await fetch('/api/clients/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid
        })
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Gagal sinkronisasi data dengan sistem JasaNet');
      }

      // Simpan session temporer yang divalidasi ke local storage
      localStorage.setItem('client_user', JSON.stringify(resData.client));
      
      router.replace('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      // Deteksi jika user sengaja menutup jendela pop-up login Google sebelum selesai
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Proses login Google dibatalkan oleh pengguna.');
      } else {
        setError(err.message || 'Gagal masuk menggunakan Akun Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex antialiased selection:bg-blue-500/10 selection:text-blue-600 bg-[#f7f7f6]">
      
      {/* ── LEFT PANEL (decorative, hidden on mobile) ─────────────── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative bg-zinc-900 flex-col justify-between p-12 overflow-hidden">
        
        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Soft blue glow — bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
        {/* Soft indigo glow — top-left corner */}
        <div className="absolute top-0 left-0 w-56 h-56 rounded-full bg-indigo-500/8 blur-[70px] pointer-events-none" />

        {/* Logo mark */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tight">J</span>
          </div>
          <span className="text-white font-bold text-[15px] tracking-tight">
            JasaNet<span className="text-blue-400 font-normal">.client</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              Network Infrastructure Portal
            </p>
            <h1 className="text-[28px] xl:text-[32px] font-extrabold text-white leading-[1.15] tracking-[-0.03em]">
              Monitor jaringan Anda<br />
              dari satu dasbor.
            </h1>
            <p className="text-[13px] text-zinc-400 font-normal leading-relaxed max-w-xs">
              Pantau status instalasi, akses laporan teknis, dan kelola tiket support secara real-time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-2">
            {[
              'Monitoring infrastruktur real-time',
              'Riwayat tiket & audit log',
              'Laporan SLA bulanan otomatis',
            ].map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2.5 text-[12px] font-medium text-zinc-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footnote */}
        <p className="relative z-10 text-[10px] text-zinc-600 font-medium tracking-wide">
          © 2026 JasaNet · Enterprise Network Solutions
        </p>
      </div>

      {/* ── RIGHT PANEL (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[380px] space-y-7">

          {/* Mobile-only logo */}
          <div className="flex flex-col items-center text-center space-y-2 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-base">J</span>
            </div>
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
              JasaNet<span className="text-blue-600 font-normal">.client</span>
            </h2>
          </div>

          {/* Form heading */}
          <div className="space-y-1 lg:pt-2">
            <h2 className="text-[22px] font-extrabold text-zinc-900 tracking-[-0.03em] leading-tight">
              Selamat datang kembali
            </h2>
            <p className="text-[13px] text-zinc-500 font-normal">
              Gunakan akun yang terdaftar saat mengajukan layanan.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_4px_0_rgba(0,0,0,0.04),0_4px_24px_0_rgba(0,0,0,0.05)]">
            {/* Blue top accent */}
            <div className="h-[2px] bg-blue-600 w-full" />

            <div className="px-6 pt-6 pb-7">
              <form onSubmit={handleLogin} className="space-y-5">

                {/* ERROR STATE */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 text-[12px] font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-xl leading-snug">
                    <span className="mt-px text-rose-400 shrink-0">✕</span>
                    {error}
                  </div>
                )}

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400"
                  >
                    Alamat Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@perusahaan.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-10 rounded-xl text-[13px] font-medium border-zinc-200 bg-zinc-50/50 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400"
                    >
                      Kata Sandi
                    </Label>
                    <a
                      href="#"
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-10 rounded-xl text-[13px] font-medium border-zinc-200 bg-zinc-50/50 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 mt-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[13px] tracking-tight flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer disabled:opacity-60 shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Memverifikasi…
                    </>
                  ) : (
                    <>
                      Masuk ke Portal
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>

                {/* ── SEPARATOR LINE ── */}
                <div className="relative my-2 pt-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                    <span className="bg-white px-3 text-zinc-400">Atau gunakan</span>
                  </div>
                </div>

                {/* ── GOOGLE SIGN IN BUTTON ── */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                  className="w-full h-10 rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer disabled:opacity-60 bg-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Menghubungkan...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.28 1.845 15.548 1 12.24 1 5.482 1 0 6.482 0 13.24s5.482 12.24 12.24 12.24c7.055 0 11.75-4.945 11.75-11.936 0-.807-.087-1.423-.193-1.964H12.24z"
                        />
                      </svg>
                      Masuk dengan Google
                    </>
                  )}
                </Button>

              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>
              Butuh bantuan akses?{' '}
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Hubungi Support
              </a>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}