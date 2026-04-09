"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";

const categories = [
  { value: "SEKTOR", label: "Sektor" },
  { value: "DERNEK", label: "Dernek" },
  { value: "TIMFED", label: "TIMFED" },
  { value: "DERNEKLERDEN", label: "Derneklerden" },
];

interface NewsData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featured: boolean;
  image: string | null;
  authorName: string | null;
  publishedAt: string;
  viewCount: number;
}

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("SEKTOR");
  const [excerpt, setExcerpt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/admin/news/${id}`);
        if (!res.ok) {
          setError("Haber bulunamadi");
          setFetching(false);
          return;
        }
        const data: { news: NewsData } = await res.json();
        const n = data.news;
        setTitle(n.title);
        setSlug(n.slug);
        setCategory(n.category);
        setExcerpt(n.excerpt);
        setFeatured(n.featured);
        setImage(n.image || "");
        setContent(n.content);
        setAuthorName(n.authorName || "");
        setPublishedAt(new Date(n.publishedAt).toISOString().split("T")[0]);
      } catch {
        setError("Veri yuklenirken bir hata olustu");
      } finally {
        setFetching(false);
      }
    }
    fetchNews();
  }, [id]);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          category,
          featured,
          image: image || undefined,
          authorName: authorName || undefined,
          publishedAt: publishedAt || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bir hata olustu");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/haberler"), 1000);
    } catch {
      setError("Sunucu hatasi olustu");
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-64 bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/admin/haberler"
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          &larr; Haberlere Don
        </Link>
        <h1 className="font-display text-2xl md:text-3xl text-primary-900 mt-3">
          Haber Duzenle
        </h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
          Haber basariyla guncellendi! Yonlendiriliyorsunuz...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baslik */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Baslik *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
            placeholder="Haber basligi"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none font-mono text-sm"
            placeholder="haber-slug"
          />
        </div>

        {/* Kategori + One Cikan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Kategori *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none bg-white"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-400"
            />
            <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
              One Cikan Haber
            </label>
          </div>
        </div>

        {/* Ozet */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Ozet * <span className="text-neutral-400">({excerpt.length}/200)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
            required
            rows={3}
            maxLength={200}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none resize-none"
            placeholder="Haberin kisa ozeti (max 200 karakter)"
          />
        </div>

        {/* Gorsel URL */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Gorsel URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
            placeholder="https://ornek.com/gorsel.jpg"
          />
        </div>

        {/* Icerik */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Icerik *
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Haber icerigini yazin..."
          />
        </div>

        {/* Yazar + Tarih */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Yazar Adi
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
              placeholder="Yazar adi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Yayin Tarihi
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
            />
          </div>
        </div>

        {/* Gonder */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || success}
            className="px-8 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guncelleniyor..." : "Guncelle"}
          </button>
          <Link
            href="/admin/haberler"
            className="px-6 py-3 text-neutral-600 hover:text-neutral-800 font-medium"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
