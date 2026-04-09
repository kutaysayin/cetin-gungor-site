"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import FormField from "@/components/admin/FormField";
import { Save } from "lucide-react";

interface SiteSettings {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  socialMedia: string | null;
}

interface SocialMedia {
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

function parseSocialMedia(json: string | null): SocialMedia {
  const defaults: SocialMedia = {
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  };
  if (!json) return defaults;
  try {
    const parsed = JSON.parse(json);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export default function SettingsClient({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: settings?.name ?? "Manisa Insaat Malzemecileri Dernegi",
    description: settings?.description ?? "",
    address: settings?.address ?? "",
    phone: settings?.phone ?? "",
    email: settings?.email ?? "",
  });
  const [social, setSocial] = useState<SocialMedia>(
    parseSocialMedia(settings?.socialMedia ?? null)
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSocialChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setSocial((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          address: form.address || null,
          phone: form.phone || null,
          email: form.email || null,
          socialMedia: JSON.stringify(social),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Kaydetme basarisiz");
        return;
      }

      toast.success("Ayarlar kaydedildi");
    } catch {
      toast.error("Sunucu hatasi olustu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Genel Bilgiler */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Genel Bilgiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Dernek Adi"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+90 236 XXX XX XX"
          />
          <FormField
            label="Aciklama"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleChange}
            rows={2}
          />
          <div className="md:col-span-2">
            <FormField
              label="Adres"
              name="address"
              type="textarea"
              value={form.address}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Sosyal Medya */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Sosyal Medya Linkleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Instagram"
            name="instagram"
            type="url"
            value={social.instagram}
            onChange={handleSocialChange}
            placeholder="https://instagram.com/..."
          />
          <FormField
            label="Facebook"
            name="facebook"
            type="url"
            value={social.facebook}
            onChange={handleSocialChange}
            placeholder="https://facebook.com/..."
          />
          <FormField
            label="Twitter / X"
            name="twitter"
            type="url"
            value={social.twitter}
            onChange={handleSocialChange}
            placeholder="https://twitter.com/..."
          />
          <FormField
            label="LinkedIn"
            name="linkedin"
            type="url"
            value={social.linkedin}
            onChange={handleSocialChange}
            placeholder="https://linkedin.com/..."
          />
          <FormField
            label="YouTube"
            name="youtube"
            type="url"
            value={social.youtube}
            onChange={handleSocialChange}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Kaydediliyor..." : "Ayarlari Kaydet"}
        </button>
      </div>
    </form>
  );
}
