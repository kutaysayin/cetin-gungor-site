/* Admin Etkinlik olusturma — POST /api/admin/events */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const eventCreateSchema = z.object({
  title: z.string().min(1, "Baslik gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  description: z.string().min(1, "Aciklama gereklidir"),
  date: z.string().min(1, "Tarih gereklidir"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = eventCreateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, description, date, endDate, location, image, capacity } = parsed.data;

    // Slug benzersizlik kontrolu
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullaniliyor" }, { status: 409 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location: location || null,
        image: image || null,
        capacity: capacity ?? null,
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Etkinlik olusturma hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}
