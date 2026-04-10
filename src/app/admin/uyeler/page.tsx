/* Admin — Uyeler listesi */
import { prisma } from "@/lib/db";
import UsersListClient from "./UsersListClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Uye Yonetimi" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Uye Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {users.length} uye
          </p>
        </div>
      </div>

      <UsersListClient users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
