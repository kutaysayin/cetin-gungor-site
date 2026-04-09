import { prisma } from "@/lib/db";
import type { News } from "@/generated/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsCard from "@/components/ui/NewsCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Newspaper } from "lucide-react";

async function getLatestNews(): Promise<News[]> {
  try {
    return await prisma.news.findMany({
      where: { featured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function LatestNews() {
  const news = await getLatestNews();

  return (
    <section className="py-24 md:py-32 bg-neutral-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            title="Son Haberler"
            linkText="Tum Haberler →"
            linkHref="/haberler"
            className="mb-12"
          />
        </AnimatedSection>

        {news.length === 0 ? (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                <Newspaper size={28} className="text-neutral-300" />
              </div>
              <p className="text-neutral-400 font-medium">Henuz haber eklenmedi</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {news.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <NewsCard
                  title={item.title}
                  slug={item.slug}
                  excerpt={item.excerpt}
                  image={item.image}
                  category={item.category}
                  publishedAt={item.publishedAt}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
