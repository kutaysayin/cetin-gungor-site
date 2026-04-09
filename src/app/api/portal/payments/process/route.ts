import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await request.json();
  const { paymentId, cardHolder } = body as { paymentId: string; cardHolder: string };

  if (!paymentId || !cardHolder) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  // Find payment and verify ownership
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    return NextResponse.json({ error: "Odeme bulunamadi" }, { status: 404 });
  }

  if (payment.userId !== session.user.id) {
    return NextResponse.json({ error: "Yetkisiz islem" }, { status: 403 });
  }

  if (payment.status !== "BEKLEMEDE") {
    return NextResponse.json({ error: "Bu odeme zaten islenmis" }, { status: 400 });
  }

  // Generate transaction ID
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Update payment
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "ODENDI",
      paymentMethod: "KREDI_KARTI",
      transactionId,
      paidAt: new Date(),
    },
  });

  // If payment type is AIDAT, also update user dues status
  if (payment.type === "AIDAT") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        duesStatus: "ODENDI",
        lastDuesDate: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true, transactionId });
}
