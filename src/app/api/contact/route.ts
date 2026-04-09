/* Iletisim formu API route — POST /api/contact */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir"),
  email: z.email("Gecerli bir email adresi giriniz"),
  subject: z.string().min(1, "Konu gereklidir"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalidir"),
});

// Basit in-memory rate limiter: ip -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 5 * 60 * 1000; // 5 dakika

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (ts) => now - ts < WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS) {
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // IP tespiti
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cok fazla istek gonderdiniz. Lutfen 5 dakika bekleyip tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json(
      { success: true, message: "Mesajiniz basariyla iletildi. En kisa surede donecegiz." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Iletisim formu hatasi:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatasi olustu, lutfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
