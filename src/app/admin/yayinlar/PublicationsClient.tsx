"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/Modal";
import FormField from "@/components/admin/FormField";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  type: string;
  description: string | null;
  coverImage: string | null;
  fileUrl: string | null;
  issueNumber: number | null;
  publishedAt: string;
}

const typeLabels: Record<string, string> = {
  DERGI: "Dergi",
  RAPOR: "Rapor",
  BULTEN: "Bulten",
  DIGER: "Diger",
};

const emptyForm = {
  title: "",
  type: "DERGI",
  description: "",
  coverImage: "",
  fileUrl: "",
  issueNumber: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function PublicationsClient({
  publications: initial,
}: {
  publications: Publication[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [publications, setPublications] = useState(initial);
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

  function startEdit(pub: Publication) {
    setEditingId(pub.id);
    setForm({
      title: pub.title,
      type: pub.type,
      description: pub.description ?? "",
      coverImage: pub.coverImage ?? "",
      fileUrl: pub.fileUrl ?? "",
      issueNumber: pub.issueNumber?.toString() ?? "",
      publishedAt: pub.publishedAt.slice(0, 10),
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
      title: form.title,
      type: form.type,
      description: form.description || null,
      coverImage: form.coverImage || null,
      fileUrl: form.fileUrl || null,
      issueNumber: form.issueNumber ? parseInt(form.issueNumber) : null,
      publishedAt: form.publishedAt,
    };

    try {
      const url = editingId
        ? `/api/admin/publications/${editingId}`
        : "/api/admin/publications";
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

      toast.success(editingId ? "Yayin guncellendi" : "Yayin eklendi");
      resetForm();
      router.refresh();
      // Refresh list
      if (editingId) {
        setPublications((prev) =>
          prev.map((p) => (p.id === editingId ? data.publication : p))
        );
      } else {
        setPublications((prev) => [data.publication, ...prev]);
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
      const res = await fetch(`/api/admin/publications/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPublications((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Yayin silindi");
    } catch {
      toast.error("Silme basarisiz");
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Yayin Ekle
        </button>
      )}

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-neutral-800">
              {editingId ? "Yayin Duzenle" : "Yeni Yayin"}
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
              label="Baslik"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <FormField
              label="Tur"
              name="type"
              type="select"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: "DERGI", label: "Dergi" },
                { value: "RAPOR", label: "Rapor" },
                { value: "BULTEN", label: "Bulten" },
                { value: "DIGER", label: "Diger" },
              ]}
              required
            />
            <FormField
              label="Aciklama"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              rows={2}
            />
            <FormField
              label="Kapak Gorseli URL"
              name="coverImage"
              type="url"
              value={form.coverImage}
              onChange={handleChange}
            />
            <FormField
              label="Dosya URL"
              name="fileUrl"
              type="url"
              value={form.fileUrl}
              onChange={handleChange}
            />
            <FormField
              label="Sayi No"
              name="issueNumber"
              type="number"
              value={form.issueNumber}
              onChange={handleChange}
            />
            <FormField
              label="Yayin Tarihi"
              name="publishedAt"
              type="date"
              value={form.publishedAt}
              onChange={handleChange}
            />
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
                  Baslik
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Tur
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Sayi
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Tarih
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody>
              {publications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-neutral-400">
                    Henuz yayin eklenmemis.
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr
                    key={pub.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {pub.title}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {typeLabels[pub.type] ?? pub.type}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {pub.issueNumber ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(pub.publishedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(pub)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition"
                          title="Duzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(pub.id)}
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
        title="Yayin Sil"
        message="Bu yayini silmek istediginizden emin misiniz? Bu islem geri alinamaz."
        confirmText="Sil"
        danger
      />
    </div>
  );
}
