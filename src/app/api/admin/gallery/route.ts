/* Admin — Galeri album CRUD API route — GET + POST /api/admin/gallery */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const albumSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmalidir"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalidir"),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const albums = await prisma.galleryAlbum.findMany({
      orderBy: { date: "desc" },
      include: { photos: { select: { id: true } } },
    });

    const result = albums.map((a) => ({
      ...a,
      photoCount: a.photos.length,
      photos: undefined,
    }));

    return NextResponse.json({ albums: result });
  } catch (error) {
    console.error("Album listesi hatasi:", error);
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
    const parsed = albumSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, description, coverImage } = parsed.data;

    // Slug benzersizlik kontrolu
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullaniliyor" },
        { status: 409 }
      );
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        slug,
        description: description ?? null,
        coverImage: coverImage ?? null,
      },
    });

    return NextResponse.json({ album }, { status: 201 });
  } catch (error) {
    console.error("Album ekleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
