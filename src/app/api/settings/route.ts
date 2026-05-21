import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CONFIG_DOC_ID = 'global_config';

// 1. GET: Ambil konfigurasi global aplikasi
export async function GET() {
  try {
    const docRef = doc(db, 'settings', CONFIG_DOC_ID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      // Setup data default jika dokumen belum ada di Firestore
      const defaultConfig = {
        companyName: 'JasaNet',
        contactEmail: 'support@jasanet.com',
        whatsappNumber: '6281234567890',
        geminiPrompt: 'Anda adalah NexusAI, asisten virtual ahli infrastruktur IT dan jaringan dari JasaNet...',
        isBotActive: true,
        isMaintenance: false
      };
      return NextResponse.json(defaultConfig, { status: 200 });
    }

    return NextResponse.json(snapshot.data(), { status: 200 });
  } catch (error) {
    console.error("Error GET Settings:", error);
    return NextResponse.json({ message: 'Gagal memuat pengaturan.' }, { status: 500 });
  }
}

// 2. POST/PUT: Simpan perubahan konfigurasi terbaru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = doc(db, 'settings', CONFIG_DOC_ID);

    // setDoc dengan opsi merge agar field lain tidak hilang jika parsial update
    await setDoc(docRef, body, { merge: true });

    return NextResponse.json({ message: 'Konfigurasi berhasil disimpan ke Firestore.' }, { status: 200 });
  } catch (error) {
    console.error("Error POST Settings:", error);
    return NextResponse.json({ message: 'Gagal menyimpan perubahan.' }, { status: 500 });
  }
}