// src/app/api/admin/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();

    // 1. Ambil semua cookie yang sedang aktif di website
    const allCookies = cookieStore.getAll();
    
    // 2. Paksa hapus semua cookie yang ditemukan di server
    // 🛠️ FIX: Gunakan loop standar for...of agar proses hapus sinkron dengan context async Next.js
    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name);
    }

    // 3. Cadangan: Hapus nama-nama cookie auth yang paling sering dipakai framework dengan path root
    const commonCookies = [
      "token",
      "session",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "admin_token" // Tambahan pengaman khusus admin token
    ];

    commonCookies.forEach((name) => {
      // 🛠️ FIX: Tambahkan opsi objek kosong jika framework membutuhkan trigger mutasi eksplisit
      cookieStore.set({
        name: name,
        value: "",
        expires: new Date(0),
        path: "/", // Mengunci penghapusan di seluruh root domain website
      });
    });

    // 4. Buat response redirect mutlak ke halaman login admin
    const loginUrl = new URL("/admin/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // 5. Matikan cache browser agar halaman admin tidak tersimpan di memori (Sangat Bagus!)
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("❌ Error pada API Logout:", error);
    // Jika gagal, pastikan tetap redirect ke login agar user tidak tertahan di halaman kosong
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}