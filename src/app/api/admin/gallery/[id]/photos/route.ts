/* Admin — Album fotograf ekleme/silme API route — POST + DELETE /api/admin/gallery/[id]/photos */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const photoSchema = z.object({
  url: z.string().min(1, "Fotograf URL'si gereklidir"),
  caption: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id: albumId } = await params;

    // Album varligini kontrol et
    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
    if (!album) {
      return NextResponse.json({ error: "Album bulunamadi" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = photoSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { url, caption, order } = parsed.data;

    // Siradaki order degeri
    const lastPhoto = await prisma.galleryPhoto.findFirst({
      where: { albumId },
      orderBy: { order: "desc" },
    });
    const nextOrder = order ?? (lastPhoto ? lastPhoto.order + 1 : 0);

    const photo = await prisma.galleryPhoto.create({
      data: {
        albumId,
        url,
        caption: caption ?? null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error("Fotograf ekleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId) {
      return NextResponse.json({ error: "Fotograf ID gereklidir" }, { status: 400 });
    }

    await prisma.galleryPhoto.delete({ where: { id: photoId } });

    return NextResponse.json({ message: "Fotograf silindi" });
  } catch (error) {
    console.error("Fotograf silme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
