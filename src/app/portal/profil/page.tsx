/**
 * Portal Profil sayfasi
 * Kullanici bilgilerini ceker ve ProfilForm istemci bileseni ile gosterir.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ProfilForm from "@/components/portal/ProfilForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profilim | Uye Portali",
};

export default async function PortalProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      sector: true,
      address: true,
      bio: true,
    },
  });

  if (!user) redirect("/giris");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Profilim</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Kisisel ve firma bilgilerinizi guncelleyin.
        </p>
      </div>

      <ProfilForm user={user} />
    </div>
  );
}
