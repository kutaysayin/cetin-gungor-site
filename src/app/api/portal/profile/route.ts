/**
 * Portal profil guncelleme API'si
 * PUT  /api/portal/profile — profil bilgisi guncelleme
 * POST /api/portal/profile — profil guncelleme veya sifre degistirme
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir").max(100),
  phone: z.string().max(20).optional().nullable(),
  companyName: z.string().max(200).optional().nullable(),
  sector: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Oturum acmaniz gerekiyor" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek govdesi" }, { status: 400 });
  }

  const result = profileSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dogrulama hatasi", details: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, phone, companyName, sector, address, bio } = result.data;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone ?? null,
      companyName: companyName ?? null,
      sector: sector ?? null,
      address: address ?? null,
      bio: bio ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      sector: true,
      address: true,
      bio: true,
    },
  });

  return NextResponse.json({ user: updated });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek govdesi" }, { status: 400 });
  }

  const userId = session.user.id;

  // Sifre degistirme islemi
  if (body.changePassword === true) {
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Mevcut ve yeni sifre gereklidir" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni sifre en az 6 karakter olmalidir" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Kullanici bulunamadi" }, { status: 404 });
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Mevcut sifre yanlis" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Sifre guncellendi" });
  }

  // Profil bilgisi guncelleme
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2) {
    return NextResponse.json(
      { error: "Ad soyad en az 2 karakter olmalidir" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null,
      companyName: typeof body.companyName === "string" && body.companyName.trim() ? body.companyName.trim() : null,
      sector: typeof body.sector === "string" && body.sector.trim() ? body.sector.trim() : null,
      address: typeof body.address === "string" && body.address.trim() ? body.address.trim() : null,
      bio: typeof body.bio === "string" && body.bio.trim() ? body.bio.trim() : null,
    },
  });

  return NextResponse.json({ success: true, message: "Profil guncellendi" });
}
