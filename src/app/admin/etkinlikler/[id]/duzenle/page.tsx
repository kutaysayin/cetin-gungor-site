"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";

interface Registration {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    companyName: string | null;
  };
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string | null;
  image: string | null;
  capacity: number | null;
  registrations: Registration[];
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) {
          setError("Etkinlik bulunamadi");
          setFetching(false);
          return;
        }
        const data: { event: EventData } = await res.json();
        const ev = data.event;
        setTitle(ev.title);
        setSlug(ev.slug);
        setDescription(ev.description);
        // datetime-local icin format
        setDate(new Date(ev.date).toISOString().slice(0, 16));
        setEndDate(ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : "");
        setLocation(ev.location || "");
        setImage(ev.image || "");
        setCapacity(ev.capacity ? String(ev.capacity) : "");
        setRegistrations(ev.registrations || []);
      } catch {
        setError("Veri yuklenirken bir hata olustu");
      } finally {
        setFetching(false);
      }
    }
    fetchEvent();
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
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          date,
          endDate: endDate || undefined,
          location: location || undefined,
          image: image || undefined,
          capacity: capacity ? parseInt(capacity, 10) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bir hata olustu");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/etkinlikler"), 1000);
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
          href="/admin/etkinlikler"
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          &larr; Etkinliklere Don
        </Link>
        <h1 className="font-display text-2xl md:text-3xl text-primary-900 mt-3">
          Etkinlik Duzenle
        </h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
          Etkinlik basariyla guncellendi! Yonlendiriliyorsunuz...
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
            placeholder="Etkinlik basligi"
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
            placeholder="etkinlik-slug"
          />
        </div>

        {/* Tarih + Bitis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Tarih *
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Bitis Tarihi
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
            />
          </div>
        </div>

        {/* Konum + Kapasite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Konum
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
              placeholder="Etkinlik konumu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Kapasite
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min={1}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
              placeholder="Sinirsiz"
            />
          </div>
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

        {/* Aciklama */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Aciklama *
          </label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Etkinlik aciklamasini yazin..."
          />
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
            href="/admin/etkinlikler"
            className="px-6 py-3 text-neutral-600 hover:text-neutral-800 font-medium"
          >
            Iptal
          </Link>
        </div>
      </form>

      {/* Kayitli Kullanicilar */}
      {registrations.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl text-primary-900 mb-4">
            Kayitli Katilimcilar ({registrations.length})
          </h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-neutral-100">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Ad Soyad
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Firma
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Durum
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Kayit Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 text-sm text-neutral-800 font-medium">
                      {reg.user.name}
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-500">
                      {reg.user.email}
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-500">
                      {reg.user.companyName || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-500">
                      {new Date(reg.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
