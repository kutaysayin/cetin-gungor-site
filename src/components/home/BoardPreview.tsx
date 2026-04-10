import { prisma } from "@/lib/db";
import type { BoardMember as PrismaBoardMember } from "../../generated/prisma/client";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";

async function getBoardMembers(): Promise<PrismaBoardMember[]> {
  try {
    return await prisma.boardMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SmallMemberCard({ member }: { member: PrismaBoardMember }) {
  return (
    <div className="bg-white rounded-2xl p-5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary font-bold text-sm mx-auto mb-3">
        {getInitials(member.name)}
      </div>
      <p className="font-semibold text-primary text-sm leading-snug">
        {member.name}
      </p>
      <p className="text-xs text-secondary-500 mt-0.5 font-medium">{member.title}</p>
      {member.company && (
        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
          {member.company}
        </p>
      )}
    </div>
  );
}

export default async function BoardPreview() {
  const members = await getBoardMembers();
  const [president, ...rest] = members;

  return (
    <section className="py-24 md:py-32 bg-primary-50/30">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            title="Yonetim Kurulu"
            linkText="Tum Yonetim →"
            linkHref="/hakkimizda/yonetim"
            className="mb-12"
          />
        </AnimatedSection>

        {members.length === 0 ? (
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-neutral-100 h-40 animate-pulse"
                />
              ))}
            </div>
          </AnimatedSection>
        ) : (
          <div className="flex flex-col gap-6">
            {/* President — large featured card */}
            {president && (
              <AnimatedSection delay={0}>
                <div className="bg-white rounded-3xl shadow-[var(--shadow-elevated)] p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {getInitials(president.name)}
                  </div>
                  {/* Info */}
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold text-secondary-500 uppercase tracking-widest mb-1">
                      {president.title}
                    </p>
                    <h3 className="text-xl font-bold text-primary">{president.name}</h3>
                    {president.company && (
                      <p className="text-sm text-neutral-500 mt-1">{president.company}</p>
                    )}
                    {president.bio && (
                      <p className="text-sm text-neutral-400 mt-2 line-clamp-2 max-w-lg">
                        {president.bio}
                      </p>
                    )}
                  </div>
                  {/* Decorative accent */}
                  <div className="hidden sm:block ml-auto shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-xl bg-primary-100" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Other members grid */}
            {rest.length > 0 && (
              <AnimatedSection delay={0.15}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rest.map((member) => (
                    <SmallMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
