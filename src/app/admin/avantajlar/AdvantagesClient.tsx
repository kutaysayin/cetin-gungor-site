"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/Modal";
import FormField from "@/components/admin/FormField";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

interface Advantage {
  id: string;
  companyName: string;
  description: string;
  category: string;
  discount: string | null;
  contact: string | null;
  active: boolean;
}

const categoryOptions = [
  { value: "insaat", label: "Insaat Malzemeleri" },
  { value: "elektrik", label: "Elektrik" },
  { value: "tesisat", label: "Tesisat" },
  { value: "boya", label: "Boya & Yalitim" },
  { value: "hirdavat", label: "Hirdavat" },
  { value: "diger", label: "Diger" },
];

const emptyForm = {
  companyName: "",
  description: "",
  category: "",
  discount: "",
  contact: "",
  active: true,
};

export default function AdvantagesClient({
  advantages: initial,
}: {
  advantages: Advantage[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [advantages, setAdvantages] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(adv: Advantage) {
    setEditingId(adv.id);
    setForm({
      companyName: adv.companyName,
      description: adv.description,
      category: adv.category,
      discount: adv.discount ?? "",
      contact: adv.contact ?? "",
      active: adv.active,
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      companyName: form.companyName,
      description: form.description,
      category: form.category,
      discount: form.discount || null,
      contact: form.contact || null,
      active: form.active,
    };

    try {
      const url = editingId
        ? `/api/admin/advantages/${editingId}`
        : "/api/admin/advantages";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Islem basarisiz");
        return;
      }

      toast.success(editingId ? "Avantaj guncellendi" : "Avantaj eklendi");
      resetForm();

      if (editingId) {
        setAdvantages((prev) =>
          prev.map((a) => (a.id === editingId ? data.advantage : a))
        );
      } else {
        setAdvantages((prev) => [...prev, data.advantage]);
      }
    } catch {
      toast.error("Sunucu hatasi olustu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/advantages/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setAdvantages((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success("Avantaj silindi");
    } catch {
      toast.error("Silme basarisiz");
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Avantaj Ekle
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-neutral-800">
              {editingId ? "Avantaj Duzenle" : "Yeni Avantaj"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Firma Adi"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Kategori"
              name="category"
              type="select"
              value={form.category}
              onChange={handleChange}
              options={categoryOptions}
              required
            />
            <FormField
              label="Aciklama"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              required
              rows={2}
            />
            <div className="space-y-4">
              <FormField
                label="Indirim"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="%10 indirim"
              />
              <FormField
                label="Iletisim"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Tel veya email"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-400"
              />
              Aktif
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium border border-neutral-200 rounded-xl hover:bg-neutral-50 transition"
            >
              Vazgec
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Firma
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Indirim
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Durum
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody>
              {advantages.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Henuz avantaj eklenmemis.
                  </td>
                </tr>
              ) : (
                advantages.map((adv) => (
                  <tr
                    key={adv.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900">
                        {adv.companyName}
                      </p>
                      <p className="text-xs text-neutral-400 line-clamp-1">
                        {adv.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {categoryOptions.find((c) => c.value === adv.category)
                        ?.label ?? adv.category}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {adv.discount ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          adv.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {adv.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(adv)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition"
                          title="Duzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(adv.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Avantaj Sil"
        message="Bu avantaji silmek istediginizden emin misiniz?"
        confirmText="Sil"
        danger
      />
    </div>
  );
}
