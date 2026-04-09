/* Admin — Avantaj CRUD API route — GET + POST /api/admin/advantages */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const advantageSchema = z.object({
  companyName: z.string().min(2, "Firma adi en az 2 karakter olmalidir"),
  description: z.string().min(5, "Aciklama en az 5 karakter olmalidir"),
  category: z.string().min(1, "Kategori gereklidir"),
  discount: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const advantages = await prisma.advantage.findMany({
      orderBy: { companyName: "asc" },
    });

    return NextResponse.json({ advantages });
  } catch (error) {
    console.error("Avantaj listesi hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = advantageSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { companyName, description, category, discount, contact, active } = parsed.data;

    const advantage = await prisma.advantage.create({
      data: {
        companyName,
        description,
        category,
        discount: discount ?? null,
        contact: contact ?? null,
        active: active ?? true,
      },
    });

    return NextResponse.json({ advantage }, { status: 201 });
  } catch (error) {
    console.error("Avantaj ekleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
