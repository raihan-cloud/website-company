'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase"; // Pastikan path ekspor auth firebase kamu sudah benar
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ShieldCheck, Lock, KeyRound } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle Perubahan Form Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value
    });
  };

  // Eksekusi Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("Sesi Anda tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password baru minimal harus terdiri dari 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      // 1. Jalankan Re-autentikasi (Aturan wajib Firebase Auth untuk operasi sensitif)
      const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Update password ke pusat auth Firebase
      await updatePassword(user, passwordData.newPassword);

      // 3. Tembak System Log Auditor (Audit Trail)
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUCCESS',
          service: 'Auth Security',
          status: 200,
          message: `Password berhasil diperbarui untuk user administrator: ${user.email}`,
          user: user.email || 'Admin'
        })
      });

      alert("Password admin berhasil diperbarui!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      let errorMsg = "Gagal memperbarui password. Pastikan password sekarang yang Anda masukkan benar.";
      if (error.code === 'auth/wrong-password') {
        errorMsg = "Password sekarang yang Anda masukkan salah!";
      }

      // Catat kegagalan ke Log Auditor
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ERROR',
          service: 'Auth Security',
          status: 400,
          message: `Percobaan gagal mengubah password admin: ${error.message}`,
          user: user?.email || 'System'
        })
      });

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-slate-700" /> Pengaturan Akun
        </h1>
        <p className="text-sm text-slate-500">Perbarui kata sandi dan kredensial pengelola platform JasaNet.</p>
      </div>

      <form onSubmit={handleUpdatePassword}>
        <Card className="border border-slate-200/60 bg-white shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Ubah Kata Sandi Admin</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Pastikan gunakan kombinasi sandi yang kuat agar panel kontrol infrastruktur tidak mudah ditembus.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-500">Password Sekarang</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.currentPassword}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-500">Password Baru</Label>
              <Input 
                id="newPassword" 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.newPassword}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500">Konfirmasi Password Baru</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.confirmPassword}
                onChange={handleChange}
                required
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end">
            <Button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 font-bold px-5 shadow-sm shadow-blue-100 flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {loading ? "Memproses Kredensial..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}