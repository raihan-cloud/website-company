import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  QueryDocumentSnapshot,
  doc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';

// 1. GET: Mengambil semua data klien untuk ditampilkan di tabel admin
export async function GET() {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('joinedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    // Jika data di Firestore masih kosong, berikan data dummy awal
    if (querySnapshot.empty) {
      const dummyClients = [
        { id: 'c1', name: 'PT Multi Solusindo', email: 'info@multisolusindo.co.id', phone: '021-555621', service: 'Maintenance Ruang Server & Mikrotik', status: 'Active', joinedAt: new Date().toISOString() },
        { id: 'c2', name: 'Cafe Kopi Kenangan (Cabang Kota)', email: 'cafe.kenangan@gmail.com', phone: '08123456789', service: 'Setup Load Balancing & Voucher Wi-Fi', status: 'Pending', joinedAt: new Date().toISOString() }
      ];
      return NextResponse.json(dummyClients, { status: 200 });
    }

    const data = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error GET Clients:", error);
    return NextResponse.json({ message: 'Gagal mengambil data klien.' }, { status: 500 });
  }
}

// 2. POST: Menambahkan klien baru secara manual dari panel admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, status } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ message: 'Nama, Email, dan Layanan wajib diisi!' }, { status: 400 });
    }

    const newClient = {
      name,
      email,
      phone: phone || '-',
      service,
      status: status || 'Active',
      joinedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'clients'), newClient);
    return NextResponse.json({ message: 'Klien berhasil ditambahkan!', id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error POST Client:", error);
    return NextResponse.json({ message: 'Gagal menambahkan klien.' }, { status: 500 });
  }
}

// 3. PATCH: Mengubah status klien (Active / Non-Active / Pending)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: 'ID dan Status baru wajib diisi!' }, { status: 400 });
    }

    const clientDocRef = doc(db, 'clients', id);
    await updateDoc(clientDocRef, { status });

    return NextResponse.json({ message: 'Status klien berhasil diperbarui.' }, { status: 200 });
  } catch (error) {
    console.error("Error PATCH Client:", error);
    return NextResponse.json({ message: 'Gagal memperbarui status klien.' }, { status: 500 });
  }
}

// 4. DELETE: Menghapus data klien
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID klien wajib disertakan!' }, { status: 400 });
    }

    const clientDocRef = doc(db, 'clients', id);
    await deleteDoc(clientDocRef);

    return NextResponse.json({ message: 'Klien berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    console.error("Error DELETE Client:", error);
    return NextResponse.json({ message: 'Gagal menghapus data klien.' }, { status: 500 });
  }
}