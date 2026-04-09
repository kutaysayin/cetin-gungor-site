/* Admin Haber guncelleme/silme — PUT/DELETE /api/admin/news/[id] */
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
    const news = await prisma.news.findUnique({ where: { id } });

    if (!news) {
      return NextResponse.json({ error: "Haber bulunamadi" }, { status: 404 });
    }

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Haber getirme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}

const newsUpdateSchema = z.object({
  title: z.string().min(1, "Baslik gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  content: z.string().min(1, "Icerik gereklidir"),
  excerpt: z.string().min(1, "Ozet gereklidir").max(200, "Ozet en fazla 200 karakter olmalidir"),
  category: z.enum(["SEKTOR", "DERNEK", "TIMFED", "DERNEKLERDEN"]),
  featured: z.boolean().default(false),
  image: z.string().optional(),
  authorName: z.string().optional(),
  publishedAt: z.string().optional(),
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
    const parsed = newsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, content, excerpt, category, featured, image, authorName, publishedAt } =
      parsed.data;

    // Slug benzersizlik kontrolu (kendi id'si haric)
    const existingSlug = await prisma.news.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      return NextResponse.json({ error: "Bu slug zaten kullaniliyor" }, { status: 409 });
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        featured,
        image: image || null,
        authorName: authorName || null,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("Haber guncelleme hatasi:", error);
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

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Haber basariyla silindi" });
  } catch (error) {
    console.error("Haber silme hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}
