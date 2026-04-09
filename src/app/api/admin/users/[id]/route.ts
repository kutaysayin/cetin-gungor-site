/* Admin — Uye guncelleme API route — GET + PUT /api/admin/users/[id] */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod/v4";

const updateUserSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir"),
  email: z.email("Gecerli bir email adresi giriniz"),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  role: z.enum(["MEMBER", "ADMIN"]),
  active: z.boolean(),
  duesStatus: z.enum(["ODENDI", "BEKLEMEDE", "GECIKTI"]),
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        phone: true,
        sector: true,
        address: true,
        bio: true,
        duesStatus: true,
        active: true,
        role: true,
        memberSince: true,
        lastDuesDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanici bulunamadi" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Uye detay hatasi:", error);
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
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, companyName, sector, address, role, active, duesStatus } =
      parsed.data;

    // Email benzersizlik kontrolu
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: "Bu email adresi baska bir kullanici tarafindan kullaniliyor" },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone: phone ?? null,
        companyName: companyName ?? null,
        sector: sector ?? null,
        address: address ?? null,
        role,
        active,
        duesStatus,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Uye guncelleme hatasi:", error);
    return NextResponse.json({ error: "Sunucu hatasi olustu" }, { status: 500 });
  }
}
