'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, RefreshCw, Server, ShieldCheck, Cpu } from 'lucide-react';

interface SystemLog {
  id: string;
  action: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | string;
  service: string;
  status: number;
  message: string;
  user: string;
  timestamp: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Log Streaming dari Firestore
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      if (!res.ok) throw new Error("Gagal melakukan fetch log runtime");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data konsol log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Log & Status Sistem</h1>
          <p className="text-sm text-slate-500">Monitor performa API server backend dan status integrasi platform.</p>
        </div>
        <Button 
          onClick={fetchLogs} 
          disabled={loading}
          variant="outline" 
          className="border-slate-200 bg-white gap-2 rounded-xl text-xs h-10 font-semibold shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} /> 
          {loading ? "Syncing..." : "Refresh Monitor"}
        </Button>
      </div>

      {/* Grid Pemantau Status Infrastruktur Aplikasi */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-100 bg-white shadow-sm">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next.js Server</p>
              <p className="text-base font-bold text-slate-800">Online (Turbopack)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gemini Studio AI API</p>
              <p className="text-base font-bold text-slate-800">Connected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database State</p>
              <p className="text-base font-bold text-slate-800">Memory Sync Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tampilan Konsol Terminal Log Gelap */}
      <Card className="border border-slate-800 bg-[#0f172a] shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#1e293b]/50 border-b border-slate-800/80 px-5 py-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-xs font-bold text-slate-300 font-mono tracking-wide">raihan@jasanet-backend:~</CardTitle>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
        </CardHeader>
        <CardContent className="p-5 font-mono text-xs leading-relaxed space-y-2 text-slate-300 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-slate-500 animate-pulse py-2">
              $ tail -n 50 /var/log/jasanet/syslog...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-slate-500 py-2">
              No cluster logs stream captured from database server.
            </div>
          ) : (
            logs.map((log) => {
              // Parsing timestamp ISO string ke format Waktu Jam Lokal (HH:MM:SS)
              const logTime = log.timestamp 
                ? new Date(log.timestamp).toLocaleTimeString('id-ID') 
                : '00:00:00';

              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 hover:bg-slate-800/50 p-1 rounded transition">
                  {/* TIMESTAMP */}
                  <span className="text-slate-500 select-none">[{logTime}]</span>
                  
                  {/* LEVEL BADGE DENGAN KONDISI WARNA KOMPLIT */}
                  <span className={`font-bold text-[10px] uppercase tracking-wider px-1.5 py-px rounded min-w-[75px] text-center shrink-0 ${
                    log.action === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.action === 'INFO' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                    log.action === 'WARN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    log.action === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-slate-700/30 text-slate-400'
                  }`}>
                    {log.action}
                  </span>

                  {/* IDENTITAS SERVICE DAN ISI PESAN LOG */}
                  <span className="text-slate-200 flex-1 break-all sm:break-normal">
                    <span className="text-slate-500 text-[11px] mr-1">[{log.service.toUpperCase()}]</span> 
                    {log.message} 
                    <span className="text-slate-600 text-[10px] ml-1.5">({log.user})</span>
                  </span>
                </div>
              );
            })
          )}
          <div className="text-blue-400 pt-2 animate-pulse">■ Listening for live system execution on platform clusters...</div>
        </CardContent>
      </Card>
    </div>
  );
}