'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 🛠️ Tambahkan useRouter untuk navigasi terstruktur
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  LogOut, 
  Users, 
  Briefcase, 
  Terminal,
  Grid,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // 🛠️ Instansiasi router Next.js
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Jika berada di halaman login, tampilkan layout polos tanpa sidebar & header
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</div>;
  }

  // 🛠️ RESTRUKTURISASI ALUR LOGOUT (Lebih Aman & Bebas 404)
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); 

    try {
      // 1. Panggil API backend menggunakan FETCH (Bukan ganti window.location secara kasar)
      const response = await fetch('/api/admin/logout', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      // 2. Setelah Server sukses menghapus HttpOnly Cookie, bersihkan data di Client
      if (typeof window !== 'undefined') {
        // Hancurkan database lokal browser (IndexedDB)
        if (window.indexedDB && typeof window.indexedDB.databases === 'function') {
          try {
            const databases = await window.indexedDB.databases();
            databases.forEach((db) => {
              if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
          } catch (dbError) {
            console.warn("IndexedDB gagal dibersihkan:", dbError);
          }
        }

        // Kosongkan storage client
        localStorage.clear();
        sessionStorage.clear();
        
        // Sikat sisa cookie cadangan di browser
        const commonCookies = ['token', 'session', 'next-auth.session-token', '__Secure-next-auth.session-token', 'admin_token'];
        commonCookies.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;`;
        });

        // 3. Alihkan navigasi secara terstruktur menggunakan Router bawaan Next.js
        // Menggunakan router.replace() agar halaman dashboard dihapus dari history tombol 'Back' browser
        router.replace('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error("Gagal melakukan penanganan keluar sistem:", error);
      // Jalankan fallback aman jika fetch gagal merespons
      window.location.replace('/admin/login');
    }
  };

  const menuGroups = [
    {
      label: 'Menu Utama',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
        { name: 'Database Klien', href: '/admin/clients', icon: Users },
      ]
    },
    {
      label: 'Katalog & Portofolio',
      items: [
        { name: 'Daftar Layanan', href: '/admin/services', icon: Grid },
        { name: 'Portofolio Proyek', href: '/admin/projects', icon: Briefcase },
      ]
    },
    {
      label: 'Sistem & Kontrol',
      items: [
        { name: 'Log Sistem', href: '/admin/system-logs', icon: Terminal },
        { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  // KOMPONEN SIDEBAR CONTENT
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Branding Logo JasaNet */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            J
          </div>
          <span className="text-base font-black text-slate-900 tracking-tight">
            JasaNet<span className="text-blue-600 font-medium">.admin</span>
          </span>
        </div>
        
        {/* Tombol Tutup (Hanya Muncul di Mobile) */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Konten Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {group.label}
            </p>
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all relative ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-700 shadow-sm shadow-blue-50/10'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span>{item.name}</span>
                    </div>

                    {isActive && (
                      <div className="absolute right-0 top-2.5 bottom-2.5 w-[3px] bg-blue-600 rounded-l-md" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Tombol Keluar */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40">
        <button 
          onClick={handleLogout} 
          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all border border-transparent hover:border-rose-100 text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 stroke-[2.5]" />
          Keluar Ke Web
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50/60 text-slate-900 m-0 p-0 antialiased selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 flex-col fixed inset-y-0 left-0 z-20 shadow-sm shadow-slate-100/50">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-50 transform transition-transform animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        
        {/* STICKY GLOBAL HEADER */}
        <header className="h-16 bg-white/80 border-b border-slate-200/60 sticky top-0 z-10 backdrop-blur-md flex items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                Secure Console
              </h2>
            </div>
          </div>
          
          {/* Identitas Profile Admin */}
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 tracking-tight">Raihan Muzaffar</p>
              <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 w-fit ml-auto">
                Super Admin
              </p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-blue-500/20 tracking-wider">
              RM
            </div>
          </div>
        </header>
        
        {/* MAIN CONTAINER */}
        <main className="p-4 sm:p-8 flex-1 w-full max-w-6xl mx-auto transition-all">
          {children}
        </main>
      </div>

    </div>
  );
}