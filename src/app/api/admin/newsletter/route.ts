/* Admin — Newsletter aboneleri API — GET + DELETE /api/admin/newsletter */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Abone ID gereklidir" },
        { status: 400 }
      );
    }

    await prisma.newsletter.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true, message: "Abone devre disi birakildi." });
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
