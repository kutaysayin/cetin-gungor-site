import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cetingungor.org.tr";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/hakkimizda/yonetim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/hakkimizda/tuzuk`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/hakkimizda/calisma-gruplari`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/haberler`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/etkinlikler`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/uyeler`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/yayinlar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/galeri`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/avantaj-rehberi`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.7 },
    { url: `${baseUrl}/kvkk`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cerez-politikasi`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Dynamic news pages
  const news = await prisma.news.findMany({ select: { slug: true, updatedAt: true } });
  const newsPages = news.map((n) => ({
    url: `${baseUrl}/haberler/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic event pages
  const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
  const eventPages = events.map((e) => ({
    url: `${baseUrl}/etkinlikler/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic member pages
  const members = await prisma.memberCompany.findMany({ where: { active: true }, select: { id: true, createdAt: true } });
  const memberPages = members.map((m) => ({
    url: `${baseUrl}/uyeler/${m.id}`,
    lastModified: m.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...newsPages, ...eventPages, ...memberPages];
}
