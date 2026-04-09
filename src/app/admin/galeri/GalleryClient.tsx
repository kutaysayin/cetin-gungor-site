"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/Modal";
import FormField from "@/components/admin/FormField";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Photo {
  id: string;
  albumId: string;
  url: string;
  caption: string | null;
  order: number;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  date: string;
  photos: Photo[];
}

const emptyAlbumForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
};

const emptyPhotoForm = {
  url: "",
  caption: "",
};

export default function GalleryClient({ albums: initial }: { albums: Album[] }) {
  const router = useRouter();
  const toast = useToast();
  const [albums, setAlbums] = useState(initial);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm);
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState(emptyPhotoForm);
  const [saving, setSaving] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);
  const [deletePhotoId, setDeletePhotoId] = useState<{
    albumId: string;
    photoId: string;
  } | null>(null);

  function handleAlbumChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setAlbumForm((prev) => ({ ...prev, [name]: value }));
    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setAlbumForm((prev) => ({ ...prev, slug }));
    }
  }

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setPhotoForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEditAlbum(album: Album) {
    setEditingAlbumId(album.id);
    setAlbumForm({
      title: album.title,
      slug: album.slug,
      description: album.description ?? "",
      coverImage: album.coverImage ?? "",
    });
    setShowAlbumForm(true);
  }

  function resetAlbumForm() {
    setAlbumForm(emptyAlbumForm);
    setEditingAlbumId(null);
    setShowAlbumForm(false);
  }

  async function handleAlbumSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: albumForm.title,
      slug: albumForm.slug,
      description: albumForm.description || null,
      coverImage: albumForm.coverImage || null,
    };

    try {
      const url = editingAlbumId
        ? `/api/admin/gallery/${editingAlbumId}`
        : "/api/admin/gallery";
      const method = editingAlbumId ? "PUT" : "POST";

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

      toast.success(editingAlbumId ? "Album guncellendi" : "Album eklendi");
      resetAlbumForm();

      if (editingAlbumId) {
        setAlbums((prev) =>
          prev.map((a) =>
            a.id === editingAlbumId ? { ...a, ...data.album } : a
          )
        );
      } else {
        setAlbums((prev) => [{ ...data.album, photos: [] }, ...prev]);
      }
    } catch {
      toast.error("Sunucu hatasi olustu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAlbum() {
    if (!deleteAlbumId) return;
    try {
      const res = await fetch(`/api/admin/gallery/${deleteAlbumId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setAlbums((prev) => prev.filter((a) => a.id !== deleteAlbumId));
      toast.success("Album silindi");
    } catch {
      toast.error("Silme basarisiz");
    }
    setDeleteAlbumId(null);
  }

  async function handleAddPhoto(e: React.FormEvent, albumId: string) {
    e.preventDefault();
    if (!photoForm.url) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/gallery/${albumId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: photoForm.url,
          caption: photoForm.caption || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Fotograf eklenemedi");
        return;
      }

      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId
            ? { ...a, photos: [...a.photos, data.photo] }
            : a
        )
      );
      setPhotoForm(emptyPhotoForm);
      toast.success("Fotograf eklendi");
    } catch {
      toast.error("Sunucu hatasi olustu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePhoto() {
    if (!deletePhotoId) return;
    try {
      const res = await fetch(
        `/api/admin/gallery/${deletePhotoId.albumId}/photos?photoId=${deletePhotoId.photoId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === deletePhotoId.albumId
            ? {
                ...a,
                photos: a.photos.filter(
                  (p) => p.id !== deletePhotoId.photoId
                ),
              }
            : a
        )
      );
      toast.success("Fotograf silindi");
    } catch {
      toast.error("Silme basarisiz");
    }
    setDeletePhotoId(null);
  }

  return (
    <div className="space-y-6">
      {/* Add album button */}
      {!showAlbumForm && (
        <button
          onClick={() => {
            resetAlbumForm();
            setShowAlbumForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Album
        </button>
      )}

      {/* Album form */}
      {showAlbumForm && (
        <form
          onSubmit={handleAlbumSubmit}
          className="bg-white rounded-2xl shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-neutral-800">
              {editingAlbumId ? "Album Duzenle" : "Yeni Album"}
            </h2>
            <button
              type="button"
              onClick={resetAlbumForm}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Album Adi"
              name="title"
              value={albumForm.title}
              onChange={handleAlbumChange}
              required
            />
            <FormField
              label="Slug"
              name="slug"
              value={albumForm.slug}
              onChange={handleAlbumChange}
              required
              placeholder="album-url-yolu"
            />
            <FormField
              label="Aciklama"
              name="description"
              type="textarea"
              value={albumForm.description}
              onChange={handleAlbumChange}
              rows={2}
            />
            <FormField
              label="Kapak Gorseli URL"
              name="coverImage"
              type="url"
              value={albumForm.coverImage}
              onChange={handleAlbumChange}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetAlbumForm}
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

      {/* Albums list */}
      <div className="space-y-4">
        {albums.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center text-neutral-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3" />
            <p>Henuz album eklenmemis.</p>
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
            >
              {/* Album header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <button
                  onClick={() =>
                    setExpandedAlbum(
                      expandedAlbum === album.id ? null : album.id
                    )
                  }
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {expandedAlbum === album.id ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {album.title}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {album.photos.length} fotograf &middot;{" "}
                      {new Date(album.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditAlbum(album)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition"
                    title="Duzenle"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteAlbumId(album.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded: photos */}
              {expandedAlbum === album.id && (
                <div className="p-6 space-y-4">
                  {/* Add photo form */}
                  <form
                    onSubmit={(e) => handleAddPhoto(e, album.id)}
                    className="flex flex-wrap items-end gap-3 p-4 bg-neutral-50 rounded-xl"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <FormField
                        label="Fotograf URL"
                        name="url"
                        type="url"
                        value={photoForm.url}
                        onChange={handlePhotoChange}
                        required
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <FormField
                        label="Aciklama"
                        name="caption"
                        value={photoForm.caption}
                        onChange={handlePhotoChange}
                        placeholder="Fotograf aciklamasi"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </button>
                  </form>

                  {/* Photos grid */}
                  {album.photos.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-4">
                      Bu albumde henuz fotograf yok.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {album.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group rounded-xl overflow-hidden bg-neutral-100 aspect-square"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption ?? ""}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() =>
                                setDeletePhotoId({
                                  albumId: album.id,
                                  photoId: photo.id,
                                })
                              }
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                              <p className="text-xs text-white truncate">
                                {photo.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirm modals */}
      <ConfirmModal
        open={!!deleteAlbumId}
        onClose={() => setDeleteAlbumId(null)}
        onConfirm={handleDeleteAlbum}
        title="Album Sil"
        message="Bu albumu ve tum fotograflarini silmek istediginizden emin misiniz? Bu islem geri alinamaz."
        confirmText="Sil"
        danger
      />
      <ConfirmModal
        open={!!deletePhotoId}
        onClose={() => setDeletePhotoId(null)}
        onConfirm={handleDeletePhoto}
        title="Fotograf Sil"
        message="Bu fotografi silmek istediginizden emin misiniz?"
        confirmText="Sil"
        danger
      />
    </div>
  );
}
