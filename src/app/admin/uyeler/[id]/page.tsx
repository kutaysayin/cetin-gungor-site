/* Admin — Uye detay/duzenleme sayfasi */
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import UserEditForm from "./UserEditForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Uye Duzenleme" };

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      phone: true,
      sector: true,
      address: true,
      bio: true,
      duesStatus: true,
      active: true,
      role: true,
      memberSince: true,
      lastDuesDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-primary-900">
          Uye Duzenleme
        </h1>
        <p className="text-neutral-500 mt-1">{user.name} — {user.email}</p>
      </div>

      {/* Uye bilgi karti */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Uyelik Tarihi</span>
            <p className="font-medium text-neutral-800">
              {new Date(user.memberSince).toLocaleDateString("tr-TR")}
            </p>
          </div>
          <div>
            <span className="text-neutral-400">Kayit Tarihi</span>
            <p className="font-medium text-neutral-800">
              {new Date(user.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
          <div>
            <span className="text-neutral-400">Son Guncelleme</span>
            <p className="font-medium text-neutral-800">
              {new Date(user.updatedAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
      </div>

      <UserEditForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
