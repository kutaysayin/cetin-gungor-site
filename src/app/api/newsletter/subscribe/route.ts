/* Newsletter abone API — POST /api/newsletter/subscribe */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.email("Gecerli bir email adresi giriniz"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Gecersiz email",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { success: false, message: "Bu email adresi zaten kayitli." },
          { status: 409 }
        );
      }
      // Re-activate
      await prisma.newsletter.update({
        where: { id: existing.id },
        data: { active: true },
      });
    } else {
      await prisma.newsletter.create({
        data: { email: parsed.data.email, name: parsed.data.name },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Basariyla abone oldunuz!",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Bir hata olustu, lutfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
