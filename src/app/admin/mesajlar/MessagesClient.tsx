"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";
import { ConfirmModal } from "@/components/admin/Modal";
import { Mail, MailOpen, Trash2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesClient({
  messages: initial,
}: {
  messages: Message[];
}) {
  const toast = useToast();
  const [messages, setMessages] = useState(initial);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function openMessage(msg: Message) {
    setSelectedMessage(msg);

    if (!msg.read) {
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: "PATCH",
        });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
          );
        }
      } catch {
        // Silent fail for marking as read
      }
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      if (selectedMessage?.id === deleteId) setSelectedMessage(null);
      toast.success("Mesaj silindi");
    } catch {
      toast.error("Silme basarisiz");
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-neutral-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3" />
          <p>Henuz mesaj yok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-neutral-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                !msg.read ? "bg-primary-50/30" : ""
              }`}
              onClick={() => openMessage(msg)}
            >
              <div className="flex-shrink-0 mt-1">
                {msg.read ? (
                  <MailOpen className="w-5 h-5 text-neutral-300" />
                ) : (
                  <Mail className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !msg.read
                        ? "font-bold text-neutral-900"
                        : "font-medium text-neutral-700"
                    }`}
                  >
                    {msg.name}
                  </p>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    !msg.read ? "font-semibold text-neutral-800" : "text-neutral-600"
                  }`}
                >
                  {msg.subject}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {msg.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(msg.id);
                }}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      <Modal
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject ?? "Mesaj"}
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-neutral-400">Gonderen</span>
                <p className="font-medium text-neutral-800">
                  {selectedMessage.name}
                </p>
              </div>
              <div>
                <span className="text-neutral-400">Email</span>
                <p className="font-medium text-neutral-800">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
              </div>
              <div>
                <span className="text-neutral-400">Tarih</span>
                <p className="font-medium text-neutral-800">
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    "tr-TR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium transition"
              >
                <Mail className="w-4 h-4" />
                Yanitla
              </a>
              <button
                onClick={() => {
                  setDeleteId(selectedMessage.id);
                  setSelectedMessage(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Mesaj Sil"
        message="Bu mesaji silmek istediginizden emin misiniz?"
        confirmText="Sil"
        danger
      />
    </div>
  );
}
