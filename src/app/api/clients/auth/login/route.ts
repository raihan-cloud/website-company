import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Adjust to your actual Firebase config path
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // 1. Cari data client di koleksi 'users' atau 'clients' berdasarkan email
    const clientsRef = collection(db, 'clients'); 
    const q = query(clientsRef, where('email', '==', email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'Akun tidak ditemukan. Gunakan email saat Anda memesan.' }, { status: 401 });
    }

    const clientDoc = querySnapshot.docs[0];
    const clientData = clientDoc.data();

    // 2. Verifikasi Password 
    // SANGAT DIREKOMENDASIKAN menggunakan bcrypt/argon2. Ini simulasi pencocokan text/hash:
    if (clientData.password !== password) { 
      return NextResponse.json({ message: 'Kata sandi yang Anda masukkan salah.' }, { status: 401 });
    }

    // 3. Jika valid, buat response dan tanam HttpOnly Cookie agar session aman dari XSS
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login berhasil',
      client: {
        name: clientData.name,
        email: clientData.email
      }
    }, { status: 200 });

    // Tanam session cookie cadangan untuk client gate (berlaku 7 hari)
    response.cookies.set('client_token', clientDoc.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Auth Client Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server internal' }, { status: 500 });
  }
}