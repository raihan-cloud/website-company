import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from 'firebase/firestore';

// 1. GET: Ambil semua daftar layanan jasa
export async function GET() {
  try {
    const servicesRef = collection(db, 'services');
    // Urutkan berdasarkan waktu pembuatan agar rapi
    const q = query(servicesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const services: any[] = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error GET Services:", error);
    return NextResponse.json({ message: 'Gagal memuat katalog layanan.' }, { status: 500 });
  }
}

// 2. POST: Tambah paket layanan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, badge, status } = body;

    if (!title || !price) {
      return NextResponse.json({ message: 'Nama layanan dan Harga wajib diisi!' }, { status: 400 });
    }

    const newService = {
      title,
      description: description || '',
      price: Number(price),
      badge: badge || 'Stable', // Stable / High Demand / Popular
      status: status || 'Active', // Active / Inactive
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'services'), newService);
    return NextResponse.json({ id: docRef.id, ...newService }, { status: 201 });
  } catch (error) {
    console.error("Error POST Service:", error);
    return NextResponse.json({ message: 'Gagal menambah layanan baru.' }, { status: 500 });
  }
}

// 3. PATCH: Update data layanan atau toggle badge status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID layanan wajib disertakan!' }, { status: 400 });
    }

    const serviceDocRef = doc(db, 'services', id);
    await updateDoc(serviceDocRef, updateData);

    return NextResponse.json({ message: 'Katalog layanan berhasil diperbarui.' }, { status: 200 });
  } catch (error) {
    console.error("Error PATCH Service:", error);
    return NextResponse.json({ message: 'Gagal memperbarui katalog.' }, { status: 500 });
  }
}

// 4. DELETE: Hapus paket layanan dari katalog
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID layanan wajib disertakan!' }, { status: 400 });
    }

    const serviceDocRef = doc(db, 'services', id);
    await deleteDoc(serviceDocRef);

    return NextResponse.json({ message: 'Layanan berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    console.error("Error DELETE Service:", error);
    return NextResponse.json({ message: 'Gagal menghapus layanan.' }, { status: 500 });
  }
}