/* Etkinlik kaydı iptal API route — POST /api/events/unregister */
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

    // Kaydı bul
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Bu etkinlige kayitli degil siniz" },
        { status: 404 }
      );
    }

    // Kaydi sil
    await prisma.eventRegistration.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Etkinlik kaydiniz iptal edildi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Etkinlik iptal hatasi:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatasi olustu, lutfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
