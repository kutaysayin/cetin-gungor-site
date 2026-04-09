/* Admin Haber olusturma — POST /api/admin/news */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const newsCreateSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = newsCreateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, slug, content, excerpt, category, featured, image, authorName, publishedAt } =
      parsed.data;

    // Slug benzersizlik kontrolu
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullaniliyor" }, { status: 409 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        featured,
        image: image || null,
        authorName: authorName || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, news }, { status: 201 });
  } catch (error) {
    console.error("Haber olusturma hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}
