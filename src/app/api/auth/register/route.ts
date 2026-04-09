/* Uyelik basvurusu API route — POST /api/auth/register */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalidir"),
  email: z.email("Gecerli bir email adresi giriniz"),
  password: z.string().min(8, "Sifre en az 8 karakter olmalidir"),
  phone: z.string().min(1, "Telefon numarasi gereklidir"),
  companyName: z.string().min(1, "Firma adi gereklidir"),
  sector: z.string().min(1, "Sektor gereklidir"),
  address: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz form verisi";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { name, email, password, phone, companyName, sector, address, website } =
      parsed.data;

    // Email benzersizligi kontrolu
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email adresi zaten kayitlidir" },
        { status: 409 }
      );
    }

    // Sifreyi hashle
    const hashedPassword = await hash(password, 12);

    // Kullanici olustur (admin onayi bekliyor)
    // Not: website alani Prisma client'ta henuz mevcut degil, bio alanina kaydedilir
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        companyName,
        sector,
        address: address ?? null,
        bio: website ? `Web: ${website}` : null,
        role: "MEMBER",
        active: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Basvurunuz alindi. Incelendikten sonra email ile bilgilendirileceksiniz.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayit hatasi:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatasi olustu, lutfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
