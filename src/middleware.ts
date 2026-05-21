import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil token admin dari cookie
  const token = request.cookies.get('admin_token')?.value;

  // 1. Jika user mencoba membuka root "/admin", arahkan langsung ke dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 2. Jika user BELUM login dan mencoba mengakses rute internal /admin (kecuali halaman login itu sendiri)
  if (!token && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 3. Jika user SUDAH login tapi malah mencoba membuka kembali halaman login
  if (token && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi URL mana saja yang harus dijaga oleh Middleware ini
export const config = {
  matcher: ['/admin/:path*', '/admin'],
};