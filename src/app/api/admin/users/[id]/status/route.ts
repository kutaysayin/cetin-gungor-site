/* Admin — Uye durum degistir API route — PATCH /api/admin/users/[id]/status */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Kullanici bulunamadi" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });

    return NextResponse.json({
      user: { id: updated.id, active: updated.active },
      message: updated.active ? "Uye aktif edildi" : "Uye pasif yapildi",
    });
  } catch (error) {
    console.error("Uye durum degistirme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
