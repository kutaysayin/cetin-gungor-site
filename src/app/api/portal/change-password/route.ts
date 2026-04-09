/**
 * Portal sifre degistirme API'si
 * PUT /api/portal/change-password — mevcut sifreyi dogrulayip yeni sifreyi kaydeder
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut sifre gereklidir"),
  newPassword: z
    .string()
    .min(8, "Yeni sifre en az 8 karakter olmalidir")
    .max(128),
  confirmPassword: z.string().min(1, "Sifre tekrari gereklidir"),
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

  const result = passwordSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dogrulama hatasi", details: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { currentPassword, newPassword, confirmPassword } = result.data;

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "Yeni sifre ve sifre tekrari eslesmyor" },
      { status: 422 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isCurrentValid = await compare(currentPassword, user.password);
  if (!isCurrentValid) {
    return NextResponse.json(
      { error: "Mevcut sifre yanlis" },
      { status: 422 }
    );
  }

  const hashedPassword = await hash(newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ success: true, message: "Sifreniz basariyla guncellendi" });
}
