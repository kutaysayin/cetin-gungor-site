/* Admin Etkinlik guncelleme/silme — PUT/DELETE /api/admin/events/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true, companyName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Etkinlik bulunamadi" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Etkinlik getirme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

const eventUpdateSchema = z.object({
  title: z.string().min(1, "Baslik gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  description: z.string().min(1, "Aciklama gereklidir"),
  date: z.string().min(1, "Tarih gereklidir"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = eventUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, description, date, endDate, location, image, capacity } = parsed.data;

    // Slug benzersizlik kontrolu (kendi id'si haric)
    const existingSlug = await prisma.event.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      return NextResponse.json({ error: "Bu slug zaten kullaniliyor" }, { status: 409 });
    }

    const event = await prisma.event.update({
      where: { id },
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

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Etkinlik guncelleme hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;

    // Once kayitlari sil, sonra etkinligi
    await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Etkinlik basariyla silindi" });
  } catch (error) {
    console.error("Etkinlik silme hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}
