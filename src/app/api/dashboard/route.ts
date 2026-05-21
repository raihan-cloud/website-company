import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    // 1. Ambil semua dokumen dari koleksi messages
    const messagesSnapshot = await getDocs(collection(db, 'messages'));
    const totalMessages = messagesSnapshot.size;
    
    let unreadMessages = 0;
    messagesSnapshot.forEach((doc) => {
      if (doc.data().status === 'unread') {
        unreadMessages++;
      }
    });

    // 2. Ambil semua dokumen dari koleksi clients
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    const totalClients = clientsSnapshot.size;

    let activeContracts = 0;
    let maintenanceClients = 0;
    clientsSnapshot.forEach((doc) => {
      const status = doc.data().status;
      if (status === 'Active' || status === 'Active Contract') {
        activeContracts++;
      } else if (status === 'Maintenance') {
        maintenanceClients++;
      }
    });

    // 3. Susun data dummy grafik untuk tren bulanan (bisa dikembangkan nanti)
    const analyticsData = [
      { month: 'Jan', proyek: totalClients > 0 ? totalClients : 2, prospek: totalMessages > 0 ? totalMessages : 4 },
      { month: 'Feb', proyek: activeContracts + 1, prospek: unreadMessages + 3 },
      { month: 'Mar', proyek: activeContracts, prospek: totalMessages },
    ];

    return NextResponse.json({
      stats: {
        totalClients,
        activeContracts,
        maintenanceClients,
        totalMessages,
        unreadMessages,
      },
      chartData: analyticsData
    }, { status: 200 });

  } catch (error) {
    console.error("Error Dashboard API:", error);
    return NextResponse.json({ message: 'Gagal memuat analitik dashboard.' }, { status: 500 });
  }
}