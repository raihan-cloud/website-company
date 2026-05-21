import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  orderBy, 
  query, 
  limit 
} from 'firebase/firestore';

// 1. GET: Ambil 50 log aktivitas terbaru
export async function GET() {
  try {
    const logsRef = collection(db, 'system_logs');
    // Batasi 50 log teratas agar query tetap enteng dan cepat
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    
    const logs: any[] = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Error GET Logs:", error);
    return NextResponse.json({ message: 'Gagal memuat log sistem.' }, { status: 500 });
  }
}

// 2. POST: Fungsi internal untuk mencatat log aktivitas baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, service, status, message, user } = body;

    if (!action || !service || !status) {
      return NextResponse.json({ message: 'Payload log tidak lengkap.' }, { status: 400 });
    }

    const newLog = {
      action, // INFO, WARN, ERROR, SUCCESS
      service, // E.g., "Gemini API", "Firestore CRM", "Auth"
      status, // 200, 500, 403, dll.
      message, // Detail pesan log
      user: user || 'System', // Aktor pelaksana
      timestamp: new Date().toISOString()
    };

    await addDoc(collection(db, 'system_logs'), newLog);
    return NextResponse.json({ message: 'Log berhasil direkam.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal merekam log.' }, { status: 500 });
  }
}