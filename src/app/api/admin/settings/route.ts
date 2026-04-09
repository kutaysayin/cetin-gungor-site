/* Admin — Site Ayarlari API route — GET + PUT /api/admin/settings */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const settingsSchema = z.object({
  name: z.string().min(2, "Dernek adi en az 2 karakter olmalidir"),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  socialMedia: z.string().optional().nullable(), // JSON string
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Ayarlar okuma hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, description, address, phone, email, socialMedia } = parsed.data;

    // Mevcut ayarlari bul veya olustur
    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          name,
          description: description ?? null,
          address: address ?? null,
          phone: phone ?? null,
          email: email ?? null,
          socialMedia: socialMedia ?? null,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          name,
          description: description ?? null,
          address: address ?? null,
          phone: phone ?? null,
          email: email ?? null,
          socialMedia: socialMedia ?? null,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Ayarlar guncelleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
