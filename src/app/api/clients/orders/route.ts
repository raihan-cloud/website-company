import { NextResponse } from 'next/server';
// import { db } from '@/lib/firebase'; // Sesuaikan dengan setup Firebase-mu
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // 💡 LOGIC UTAMA:
    // const ordersRef = collection(db, 'orders'); // atau nama koleksi 'transactions' Anda
    // const q = query(ordersRef, where('clientEmail', '==', email), orderBy('createdAt', 'desc'));
    // const querySnapshot = await getDocs(q);
    // const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sementara kita return array kosong dulu agar tidak crash sebelum Firebase dicolok
    const mockOrdersFromFirebase = []; 

    return NextResponse.json(mockOrdersFromFirebase, { status: 200 });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}