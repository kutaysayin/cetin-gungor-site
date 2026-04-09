/* Admin — Uye listesi API route — GET /api/admin/users */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status"); // active | inactive
    const sector = searchParams.get("sector");
    const duesStatus = searchParams.get("duesStatus");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status === "active") where.active = true;
    if (status === "inactive") where.active = false;

    if (sector) where.sector = sector;
    if (duesStatus) where.duesStatus = duesStatus;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        phone: true,
        sector: true,
        duesStatus: true,
        active: true,
        role: true,
        memberSince: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Uye listesi hatasi:", error);
    return NextResponse.json(
      { error: "Sunucu hatasi olustu" },
      { status: 500 }
    );
  }
}
