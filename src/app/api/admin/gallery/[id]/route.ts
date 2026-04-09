/* Admin — Galeri album guncelleme/silme API route — GET + PUT + DELETE /api/admin/gallery/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const updateAlbumSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmalidir"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalidir"),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { id } = await params;

    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { order: "asc" } },
      },
    });

    if (!album) {
      return NextResponse.json({ error: "Album bulunamadi" }, { status: 404 });
    }

    return NextResponse.json({ album });
  } catch (error) {
    console.error("Album detay hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

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
    const parsed = updateAlbumSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, description, coverImage } = parsed.data;

    // Slug benzersizlik kontrolu
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: "Bu slug zaten kullaniliyor" },
        { status: 409 }
      );
    }

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        title,
        slug,
        description: description ?? null,
        coverImage: coverImage ?? null,
      },
    });

    return NextResponse.json({ album });
  } catch (error) {
    console.error("Album guncelleme hatasi:", error);
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

    // Cascading delete — once fotograflari sil
    await prisma.galleryPhoto.deleteMany({ where: { albumId: id } });
    await prisma.galleryAlbum.delete({ where: { id } });

    return NextResponse.json({ message: "Album ve fotograflar silindi" });
  } catch (error) {
    console.error("Album silme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
