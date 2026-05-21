// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 🛠️ Tambahkan servicePrice yang dikirim oleh frontend form
    const { serviceId, serviceName, servicePrice, clientName, clientEmail, clientPhone, surveyDate } = body;

    const orderId = `JNET-BKG-${Date.now()}`;
    
    // 🛠️ SINKRONISASI HARGA: Gunakan harga dari etalase. Jika kosong/nol, beri fallback 500.000
    const finalPrice = Number(servicePrice) || 500000; 

    // Ambil dari env, jika masih terkena bug cache Turbopack, otomatis pakai server key kamu yang aktif di bawah
    const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY?.trim() || "SB-Mid-server-sILvrFgCnq7d4KGTjsak0WeH"; 

    // Lakukan enkripsi manual ke format Base64 (Standard Basic Auth Midtrans)
    const encodedKey = Buffer.from(`${SERVER_KEY}:`).toString("base64");

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: finalPrice, // 🛠️ Nominal total tagihan mengikuti harga etalase
      },
      item_details: [
        {
          id: `SVC-${serviceId || 'unknown'}`,
          price: finalPrice, // 🛠️ Harga per item mengikuti harga etalase
          quantity: 1,
          name: `${String(serviceName || 'Layanan').substring(0, 25)}`,
        },
      ],
      customer_details: {
        first_name: clientName || "Klien JasaNet",
        email: clientEmail || "email@jasanet.com",
        phone: clientPhone || "08123456789",
      },
      custom_field1: `Tanggal Rencana Survei: ${surveyDate || "-"}`,
    };

    // Tembak langsung ke API Endpoint Midtrans Sandbox
    const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodedKey}`
      },
      body: JSON.stringify(transactionDetails)
    });

    const transactionData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      throw new Error(transactionData.error_messages ? transactionData.error_messages.join(", ") : "Ditolak oleh Midtrans");
    }

    return NextResponse.json({ 
      token: transactionData.token,
      orderId: orderId 
    });

  } catch (error: any) {
    console.error("❌ MIDTRANS RAW API ERROR LOG:", error.message || error);
    
    return NextResponse.json(
      { error: error.message || "Gagal memproses booking" },
      { status: 500 }
    );
  }
}