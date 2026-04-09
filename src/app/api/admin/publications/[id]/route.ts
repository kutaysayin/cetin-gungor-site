/* Admin — Yayin guncelleme/silme API route — PUT + DELETE /api/admin/publications/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const updatePublicationSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmalidir"),
  type: z.enum(["DERGI", "RAPOR", "BULTEN", "DIGER"]),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  issueNumber: z.number().int().optional().nullable(),
  publishedAt: z.string().optional(),
});

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
    const parsed = updatePublicationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, type, description, coverImage, fileUrl, issueNumber, publishedAt } =
      parsed.data;

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        title,
        type,
        description: description ?? null,
        coverImage: coverImage ?? null,
        fileUrl: fileUrl ?? null,
        issueNumber: issueNumber ?? null,
        ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });

    return NextResponse.json({ publication });
  } catch (error) {
    console.error("Yayin guncelleme hatasi:", error);
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

    await prisma.publication.delete({ where: { id } });

    return NextResponse.json({ message: "Yayin silindi" });
  } catch (error) {
    console.error("Yayin silme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
