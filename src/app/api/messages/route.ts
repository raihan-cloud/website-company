import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

// 1. PATCH: Menandai pesan sudah dibaca / difollow up
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body; // status: 'read' atau 'unread'

    if (!id || !status) {
      return NextResponse.json({ message: 'ID dan Status wajib disertakan!' }, { status: 400 });
    }

    const messageDocRef = doc(db, 'messages', id);
    await updateDoc(messageDocRef, { status });

    return NextResponse.json({ message: 'Status pesan berhasil diperbarui.' }, { status: 200 });
  } catch (error) {
    console.error("Error PATCH Message:", error);
    return NextResponse.json({ message: 'Gagal memperbarui status pesan.' }, { status: 500 });
  }
}

// 2. DELETE: Menghapus pesan (Spam/Lama)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID pesan wajib disertakan!' }, { status: 400 });
    }

    const messageDocRef = doc(db, 'messages', id);
    await deleteDoc(messageDocRef);

    return NextResponse.json({ message: 'Pesan berhasil dihapus dari database.' }, { status: 200 });
  } catch (error) {
    console.error("Error DELETE Message:", error);
    return NextResponse.json({ message: 'Gagal menghapus pesan.' }, { status: 500 });
  }
}