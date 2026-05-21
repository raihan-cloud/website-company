import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; 
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  QueryDocumentSnapshot,
  doc,          // <-- TAMBAHKAN IMPORT INI
  updateDoc,   // <-- TAMBAHKAN IMPORT INI
  deleteDoc    // <-- TAMBAHKAN IMPORT INI
} from 'firebase/firestore';

// =========================================================================
// 1. POST: Menerima kiriman form dari Landing Page depan pelanggan
// =========================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { message: 'Semua kolom formulir wajib diisi!' },
        { status: 400 }
      );
    }

    const newMessage = {
      name,
      email,
      service,
      message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    // Menyimpan ke koleksi 'messages' di Firestore
    const docRef = await addDoc(collection(db, 'messages'), newMessage);

    return NextResponse.json(
      { message: 'Permintaan konsultasi berhasil dikirim!', id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal pada server.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// 2. GET: Menarik data dari Firestore untuk Dashboard Admin
// =========================================================================
export async function GET() {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    // Jika koleksi di Firebase masih kosong, berikan data dummy agar dashboard tidak crash
    if (querySnapshot.empty) {
      const dummyData = [
        { id: '1', name: 'Budi Santoso', email: 'budi@PT-Maju.com', service: 'Instalasi Kabel Fiber Optic (FO)', message: 'Butuh audit network kantor cabang.', createdAt: new Date().toISOString(), status: 'unread' },
        { id: '2', name: 'Siti Rahma', email: 'siti@isp-lokal.net', service: 'Audit & Manajemen Mikrotik/Cisco', message: 'Setup BGP routing untuk core router.', createdAt: new Date().toISOString(), status: 'unread' }
      ];
      return NextResponse.json(dummyData, { status: 200 });
    }

    // Jika ada data di Firebase, petakan datanya
    const data = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json(
      { message: 'Gagal mengambil data dari server.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// 3. PATCH: Mengubah status pesan (dari 'unread' menjadi 'read')
// =========================================================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: 'ID pesan dan status baru wajib disertakan!' },
        { status: 400 }
      );
    }

    const messageDocRef = doc(db, 'messages', id);
    await updateDoc(messageDocRef, { status });

    return NextResponse.json(
      { message: `Status pesan berhasil diperbarui menjadi ${status}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error PATCH:", error);
    return NextResponse.json(
      { message: 'Gagal memperbarui status pesan.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// 4. DELETE: Menghapus data pesan dari Firestore
// =========================================================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID pesan wajib disertakan untuk menghapus!' },
        { status: 400 }
      );
    }

    const messageDocRef = doc(db, 'messages', id);
    await deleteDoc(messageDocRef);

    return NextResponse.json(
      { message: 'Pesan berhasil dihapus dari database.' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error DELETE:", error);
    return NextResponse.json(
      { message: 'Gagal menghapus pesan dari server.' },
      { status: 500 }
    );
  }
}