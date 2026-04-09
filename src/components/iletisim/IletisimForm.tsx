"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const KONU_SECENEKLERI = [
  { value: "", label: "Konu seciniz..." },
  { value: "Genel Bilgi", label: "Genel Bilgi" },
  { value: "Uyelik", label: "Üyelik" },
  { value: "Sikayet/Oneri", label: "Şikayet / Öneri" },
  { value: "Is Birligi", label: "İş Birliği" },
  { value: "Diger", label: "Diğer" },
];

export default function IletisimForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.message ?? "Bir hata olustu. Lutfen tekrar deneyin."
        );
        setFormState("error");
        return;
      }

      setFormState("success");
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMessage("Baglanti hatasi. Lutfen tekrar deneyin.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary-800 mb-2">
            Mesajiniz iletildi!
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            Mesajiniz basariyla iletildi. En kisa surede size donecegiz.
          </p>
        </div>
        <button
          onClick={() => setFormState("idle")}
          className="mt-2 text-sm text-secondary-600 hover:text-secondary font-medium underline underline-offset-4 transition-colors"
        >
          Yeni mesaj gonder
        </button>
      </div>
    );
  }

  const isLoading = formState === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl shadow-card p-8 space-y-5"
    >
      <h2 className="text-2xl font-bold text-primary-800 mb-1">
        Bize Yazin
      </h2>
      <p className="text-neutral-500 text-sm mb-2">
        Sorulariniz, onerileri veya is birligi teklifleriniz icin formu doldurun.
      </p>

      {/* Error alert */}
      {formState === "error" && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ad Soyad */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary-700"
        >
          Ad Soyad <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isLoading}
          value={fields.name}
          onChange={handleChange}
          placeholder="Adiniz Soyadiniz"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent disabled:opacity-50 transition-all duration-200"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary-700"
        >
          E-posta <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isLoading}
          value={fields.email}
          onChange={handleChange}
          placeholder="ornek@mail.com"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent disabled:opacity-50 transition-all duration-200"
        />
      </div>

      {/* Konu */}
      <div className="space-y-1.5">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-primary-700"
        >
          Konu <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          disabled={isLoading}
          value={fields.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-800 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent disabled:opacity-50 transition-all duration-200 appearance-none cursor-pointer"
        >
          {KONU_SECENEKLERI.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mesaj */}
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-primary-700"
        >
          Mesaj <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          disabled={isLoading}
          value={fields.message}
          onChange={handleChange}
          rows={5}
          placeholder="Mesajinizi buraya yazin..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent disabled:opacity-50 transition-all duration-200 resize-none min-h-[120px]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold text-sm hover:shadow-[0_0_24px_rgba(200,149,46,0.35)] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Gonderiliyor...
          </>
        ) : (
          <>
            <Send size={16} />
            Gonder
          </>
        )}
      </button>
    </form>
  );
}
