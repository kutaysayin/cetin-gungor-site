"use client";

/* Etkinlik kayit butonu — oturum durumuna ve kayit durumuna gore dinamik */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, X, Loader2, LogIn, UserX } from "lucide-react";

interface EventRegisterButtonProps {
  eventId: string;
  slug: string;
  isLoggedIn: boolean;
  isRegistered: boolean;
  isFull: boolean;
}

export default function EventRegisterButton({
  eventId,
  slug,
  isLoggedIn,
  isRegistered,
  isFull,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmUnregister, setConfirmUnregister] = useState(false);

  async function handleRegister() {
    setRegistering(true);
    setError(null);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Bir hata olustu. Lutfen tekrar deneyin.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Baglanti hatasi. Lutfen tekrar deneyin.");
    } finally {
      setRegistering(false);
    }
  }

  async function handleUnregister() {
    setUnregistering(true);
    setError(null);
    setConfirmUnregister(false);
    try {
      const res = await fetch("/api/events/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Bir hata olustu. Lutfen tekrar deneyin.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Baglanti hatasi. Lutfen tekrar deneyin.");
    } finally {
      setUnregistering(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Hata mesaji */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
          <X size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Giris yapilmamis */}
      {!isLoggedIn && (
        <Link
          href={`/giris?callbackUrl=/etkinlikler/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold text-sm hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
        >
          <LogIn size={16} />
          Kayit olmak icin giris yapin
        </Link>
      )}

      {/* Kayitli degil + yer var */}
      {isLoggedIn && !isRegistered && !isFull && (
        <button
          onClick={handleRegister}
          disabled={registering}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-secondary to-secondary-600 text-white font-semibold text-sm hover:from-secondary-600 hover:to-secondary-700 hover:shadow-[0_4px_14px_rgba(200,149,46,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {registering ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Kayit Ol
            </>
          )}
        </button>
      )}

      {/* Kayitli */}
      {isLoggedIn && isRegistered && (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 text-green-700 font-semibold text-sm border border-green-200">
            <CheckCircle size={16} className="text-green-600" />
            Kayitlisiniz
          </div>

          {!confirmUnregister ? (
            <div>
              <button
                onClick={() => setConfirmUnregister(true)}
                className="text-sm text-neutral-400 hover:text-red-500 underline underline-offset-4 transition-colors"
              >
                Kaydi iptal et
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">Emin misiniz?</span>
              <button
                onClick={handleUnregister}
                disabled={unregistering}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 disabled:opacity-50 transition-all duration-200"
              >
                {unregistering ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Iptal ediliyor...
                  </>
                ) : (
                  <>
                    <UserX size={13} />
                    Evet, iptal et
                  </>
                )}
              </button>
              <button
                onClick={() => setConfirmUnregister(false)}
                className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Vazgec
              </button>
            </div>
          )}
        </div>
      )}

      {/* Kontenjan doldu */}
      {isLoggedIn && !isRegistered && isFull && (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-500 font-semibold text-sm border border-neutral-200 cursor-not-allowed">
          <X size={15} />
          Kontenjan Doldu
        </div>
      )}
    </div>
  );
}
