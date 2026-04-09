/* Etkinlik kaydı API route — POST /api/events/register */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Bu islem icin giris yapmaniz gereklidir" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId } = body as { eventId?: string };

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Etkinlik ID gereklidir" },
        { status: 400 }
      );
    }

    // Etkinlik varligini kontrol et
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadi" },
        { status: 404 }
      );
    }

    // Kapasite kontrolu
    if (event.capacity !== null && event._count.registrations >= event.capacity) {
      return NextResponse.json(
        { success: false, message: "Etkinlik kontenjanı dolmustur" },
        { status: 409 }
      );
    }

    // Daha once kayit olmus mu kontrolu
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Bu etkinlige zaten kayit olundunuz" },
        { status: 409 }
      );
    }

    // Kayit olustur
    await prisma.eventRegistration.create({
      data: {
        userId: session.user.id,
        eventId,
        status: "ONAYLANDI",
      },
    });

    return NextResponse.json(
      { success: true, message: "Etkinlige basariyla kayit olundu" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Etkinlik kayit hatasi:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatasi olustu, lutfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
