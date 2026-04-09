"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/admin/FormField";
import { useToast } from "@/components/admin/Toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  phone: string | null;
  sector: string | null;
  address: string | null;
  bio: string | null;
  duesStatus: string;
  active: boolean;
  role: string;
}

export default function UserEditForm({ user }: { user: User }) {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    companyName: user.companyName ?? "",
    sector: user.sector ?? "",
    address: user.address ?? "",
    role: user.role,
    active: user.active,
    duesStatus: user.duesStatus,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone || null,
          companyName: form.companyName || null,
          sector: form.sector || null,
          address: form.address || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Guncelleme basarisiz");
        return;
      }

      toast.success("Uye bilgileri guncellendi");
      router.refresh();
    } catch {
      toast.error("Sunucu hatasi olustu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Kisisel Bilgiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Ad Soyad"
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
            required
          />
          <FormField
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0532 XXX XX XX"
          />
          <FormField
            label="Firma"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
          />
          <FormField
            label="Sektor"
            name="sector"
            value={form.sector}
            onChange={handleChange}
          />
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

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Uyelik Durumu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Rol"
            name="role"
            type="select"
            value={form.role}
            onChange={handleChange}
            options={[
              { value: "MEMBER", label: "Uye" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
          <FormField
            label="Aidat Durumu"
            name="duesStatus"
            type="select"
            value={form.duesStatus}
            onChange={handleChange}
            options={[
              { value: "ODENDI", label: "Odendi" },
              { value: "BEKLEMEDE", label: "Beklemede" },
              { value: "GECIKTI", label: "Gecikti" },
            ]}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-700">
              Hesap Durumu
            </label>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, active: !prev.active }))
              }
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                form.active ? "bg-green-500" : "bg-red-400"
              }`}
            >
              <span
                className={`inline-block h-7 w-7 rounded-full bg-white shadow transition-transform ${
                  form.active ? "translate-x-11" : "translate-x-1.5"
                }`}
              />
              <span className="sr-only">
                {form.active ? "Aktif" : "Pasif"}
              </span>
            </button>
            <p className="text-xs text-neutral-500">
              {form.active ? "Aktif" : "Pasif"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/uyeler"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Don
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
