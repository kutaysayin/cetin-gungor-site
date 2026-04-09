/* Admin — Yonetim Kurulu guncelleme/silme API route — PUT + DELETE /api/admin/board/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const updateBoardMemberSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir"),
  title: z.string().min(2, "Unvan en az 2 karakter olmalidir"),
  company: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  order: z.number().int().optional(),
  period: z.string().optional().nullable(),
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
    const parsed = updateBoardMemberSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, title, company, image, bio, order, period, active } = parsed.data;

    const member = await prisma.boardMember.update({
      where: { id },
      data: {
        name,
        title,
        company: company ?? null,
        image: image ?? null,
        bio: bio ?? null,
        order: order ?? 0,
        period: period ?? null,
        active: active ?? true,
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Yonetim kurulu guncelleme hatasi:", error);
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

    await prisma.boardMember.delete({ where: { id } });

    return NextResponse.json({ message: "Yonetim kurulu uyesi silindi" });
  } catch (error) {
    console.error("Yonetim kurulu silme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
