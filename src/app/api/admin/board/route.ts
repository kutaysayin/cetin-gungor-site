/* Admin — Yonetim Kurulu CRUD API route — GET + POST /api/admin/board */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const boardMemberSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir"),
  title: z.string().min(2, "Unvan en az 2 karakter olmalidir"),
  company: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  order: z.number().int().optional(),
  period: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const members = await prisma.boardMember.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Yonetim kurulu listesi hatasi:", error);
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
    const parsed = boardMemberSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, title, company, image, bio, order, period, active } = parsed.data;

    const member = await prisma.boardMember.create({
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

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Yonetim kurulu ekleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
