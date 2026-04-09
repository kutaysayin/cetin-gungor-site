/* Admin — Avantaj guncelleme/silme API route — PUT + DELETE /api/admin/advantages/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const updateAdvantageSchema = z.object({
  companyName: z.string().min(2, "Firma adi en az 2 karakter olmalidir"),
  description: z.string().min(5, "Aciklama en az 5 karakter olmalidir"),
  category: z.string().min(1, "Kategori gereklidir"),
  discount: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateAdvantageSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { companyName, description, category, discount, contact, active } = parsed.data;

    const advantage = await prisma.advantage.update({
      where: { id },
      data: {
        companyName,
        description,
        category,
        discount: discount ?? null,
        contact: contact ?? null,
        active: active ?? true,
      },
    });

    return NextResponse.json({ advantage });
  } catch (error) {
    console.error("Avantaj guncelleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.advantage.delete({ where: { id } });

    return NextResponse.json({ message: "Avantaj silindi" });
  } catch (error) {
    console.error("Avantaj silme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
