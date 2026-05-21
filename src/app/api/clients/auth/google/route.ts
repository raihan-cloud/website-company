import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    // 1. Validasi isi body untuk memastikan data yang dikirim frontend adalah JSON valid
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: 'Format request body harus berupa JSON valid' }, 
        { status: 400 }
      );
    }

    const { email, name, uid } = body;

    // 2. Validasi kelengkapan parameter data Google
    if (!email || !uid) {
      return NextResponse.json(
        { message: 'Data Google tidak valid atau parameter tidak lengkap (email/uid kosong)' }, 
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 3. Ambil data atau daftarkan ke Firestore
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('email', '==', cleanEmail));
    const querySnapshot = await getDocs(q);

    let clientPayload = { 
      name: name || 'Client JasaNet', 
      email: cleanEmail 
    };

    if (querySnapshot.empty) {
      // Jika email belum ada di Firestore, daftarkan sebagai dokumen baru
      const newClientRef = doc(db, 'clients', uid);
      await setDoc(newClientRef, {
        name: clientPayload.name,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        role: 'client'
      });
    } else {
      // Jika sudah terdaftar, ambil data asli yang ada di DB
      const existingClient = querySnapshot.docs[0].data();
      clientPayload.name = existingClient.name || clientPayload.name;
    }

    // 4. Buat Response JSON terstruktur
    const response = NextResponse.json({
      success: true,
      message: 'Login Google berhasil',
      client: clientPayload
    }, { status: 200 });

    // 5. Tanam Session Cookie secara aman (HttpOnly)
    response.cookies.set('client_token', uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // Berlaku selama 7 Hari
      path: '/',
    });

    return response;

  } catch (error: any) {
    // Mencetak log detail eror di terminal server untuk mempermudah debugging kamu
    console.error('🔴 Error pada API Rute Google Auth:', error);
    
    return NextResponse.json(
      { 
        message: 'Terjadi kesalahan internal server', 
        error: error?.message || String(error)
      }, 
      { status: 500 }
    );
  }
}