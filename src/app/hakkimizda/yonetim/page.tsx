/* Yonetim Kurulu sayfasi — aktif uyeleri veritabanindan cekerek gosterir */

import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Yonetim Kurulu",
  description:
    "Manisa Insaat Malzemecileri Dernegi yonetim kurulu uyeleri ve gorevleri.",
  openGraph: {
    title: "Yonetim Kurulu",
    description:
      "Manisa Insaat Malzemecileri Dernegi yonetim kurulu uyeleri ve gorevleri.",
  },
};
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Renk paleti — sıraya göre döner
const avatarColors = [
  "bg-primary text-white",
  "bg-secondary text-white",
  "bg-accent text-white",
  "bg-primary-700 text-white",
  "bg-secondary-700 text-white",
];

export default async function YonetimPage() {
  const members = await prisma.boardMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const [baskan, ...diger] = members;

  return (
    <main>
      <PageHeader
        title="Yönetim Kurulu"
        subtitle="Derneğimizi temsil eden deneyimli ve vizyoner liderlerimiz"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hakkımızda", href: "/hakkimizda" },
          { label: "Yönetim Kurulu" },
        ]}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Başkan — büyük öne çıkan kart */}
          {baskan && (
            <AnimatedSection className="mb-16">
              <SectionTitle title="Başkanımız" className="mb-10" />
              {/* President card: gradient from primary-50 to accent-50, rounded-3xl, shadow-elevated */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-primary-100/50">
                <div className="flex flex-col md:flex-row items-center md:items-stretch gap-0">
                  {/* Avatar alanı */}
                  <div className="flex-shrink-0 flex items-center justify-center bg-primary/5 md:w-64 py-12 px-8">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-primary/20">
                      {getInitials(baskan.name)}
                    </div>
                  </div>

                  {/* Bilgiler */}
                  <div className="flex-1 p-8 md:p-12">
                    <span className="inline-block bg-secondary/15 text-secondary-700 text-sm font-semibold px-3 py-1 rounded-full mb-4 border border-secondary/20">
                      {baskan.title}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {baskan.name}
                    </h2>
                    {baskan.company && (
                      <p className="text-neutral-500 text-lg mb-4">
                        {baskan.company}
                      </p>
                    )}
                    {baskan.period && (
                      <p className="text-neutral-400 text-sm mb-6">
                        Dönem: {baskan.period}
                      </p>
                    )}
                    {baskan.bio && (
                      <p className="text-neutral-600 leading-relaxed max-w-2xl">
                        {baskan.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Diğer üyeler */}
          {diger.length > 0 && (
            <div>
              <SectionTitle
                title="Kurul Üyeleri"
                subtitle="Yönetim kurulumuzun değerli üyeleri"
                className="mb-10"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diger.map((member, idx) => (
                  <AnimatedSection key={member.id} delay={idx * 0.07}>
                    <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 flex gap-5 items-start h-full">
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${avatarColors[(idx + 1) % avatarColors.length]}`}
                      >
                        {getInitials(member.name)}
                      </div>

                      {/* Bilgiler */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-primary leading-snug">
                          {member.name}
                        </h3>
                        <p className="text-secondary font-semibold text-sm mt-0.5">
                          {member.title}
                        </p>
                        {member.company && (
                          <p className="text-neutral-500 text-sm mt-1 truncate">
                            {member.company}
                          </p>
                        )}
                        {member.period && (
                          <p className="text-neutral-400 text-xs mt-1">
                            Dönem: {member.period}
                          </p>
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* Veri yoksa */}
          {members.length === 0 && (
            <div className="text-center py-20 text-neutral-400">
              <p className="text-lg">Yönetim kurulu bilgileri yakında eklenecektir.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
