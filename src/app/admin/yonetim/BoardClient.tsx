"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/Modal";
import FormField from "@/components/admin/FormField";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

interface BoardMember {
  id: string;
  name: string;
  title: string;
  company: string | null;
  image: string | null;
  bio: string | null;
  order: number;
  period: string | null;
  active: boolean;
}

const emptyForm = {
  name: "",
  title: "",
  company: "",
  image: "",
  bio: "",
  order: "0",
  period: "",
  active: true,
};

export default function BoardClient({
  members: initial,
}: {
  members: BoardMember[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [members, setMembers] = useState(initial);
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

  function startEdit(member: BoardMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      title: member.title,
      company: member.company ?? "",
      image: member.image ?? "",
      bio: member.bio ?? "",
      order: member.order.toString(),
      period: member.period ?? "",
      active: member.active,
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
      name: form.name,
      title: form.title,
      company: form.company || null,
      image: form.image || null,
      bio: form.bio || null,
      order: parseInt(form.order) || 0,
      period: form.period || null,
      active: form.active,
    };

    try {
      const url = editingId
        ? `/api/admin/board/${editingId}`
        : "/api/admin/board";
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

      toast.success(editingId ? "Uye guncellendi" : "Uye eklendi");
      resetForm();

      if (editingId) {
        setMembers((prev) =>
          prev
            .map((m) => (m.id === editingId ? data.member : m))
            .sort((a: BoardMember, b: BoardMember) => a.order - b.order)
        );
      } else {
        setMembers((prev) =>
          [...prev, data.member].sort(
            (a: BoardMember, b: BoardMember) => a.order - b.order
          )
        );
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
      const res = await fetch(`/api/admin/board/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMembers((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Uye silindi");
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
          Yeni Uye Ekle
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-neutral-800">
              {editingId ? "Uye Duzenle" : "Yeni Yonetim Kurulu Uyesi"}
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
              label="Ad Soyad"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <FormField
              label="Unvan"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Baskan, Baskan Yardimcisi, vb."
            />
            <FormField
              label="Firma"
              name="company"
              value={form.company}
              onChange={handleChange}
            />
            <FormField
              label="Fotograf URL"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
            />
            <FormField
              label="Biyografi"
              name="bio"
              type="textarea"
              value={form.bio}
              onChange={handleChange}
              rows={2}
            />
            <div className="space-y-4">
              <FormField
                label="Sira No"
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
              />
              <FormField
                label="Donem"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="2024-2028"
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

      {/* Members table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-semibold text-neutral-600 w-12">
                  Sira
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Ad Soyad
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Unvan
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Firma
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">
                  Donem
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
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Henuz yonetim kurulu uyesi eklenmemis.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral-500">
                      {member.order}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {member.title}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {member.company ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {member.period ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {member.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(member)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition"
                          title="Duzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(member.id)}
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
        title="Uye Sil"
        message="Bu yonetim kurulu uyesini silmek istediginizden emin misiniz?"
        confirmText="Sil"
        danger
      />
    </div>
  );
}
