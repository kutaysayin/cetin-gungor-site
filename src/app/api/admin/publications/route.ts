/* Admin — Yayin CRUD API route — GET + POST /api/admin/publications */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const publicationSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmalidir"),
  type: z.enum(["DERGI", "RAPOR", "BULTEN", "DIGER"]),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  issueNumber: z.number().int().optional().nullable(),
  publishedAt: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const publications = await prisma.publication.findMany({
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ publications });
  } catch (error) {
    console.error("Yayin listesi hatasi:", error);
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
    const parsed = publicationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, type, description, coverImage, fileUrl, issueNumber, publishedAt } =
      parsed.data;

    const publication = await prisma.publication.create({
      data: {
        title,
        type,
        description: description ?? null,
        coverImage: coverImage ?? null,
        fileUrl: fileUrl ?? null,
        issueNumber: issueNumber ?? null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ publication }, { status: 201 });
  } catch (error) {
    console.error("Yayin ekleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
