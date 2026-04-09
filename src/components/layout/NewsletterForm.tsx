/* E-Bulten formu — client component */
"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Bir hata olustu.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        aria-label="E-posta adresiniz"
        required
        className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/35 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-4 py-2.5 rounded-full bg-secondary hover:bg-secondary-400 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(200,149,46,0.3)] disabled:opacity-50"
      >
        {status === "loading" ? "Gonderiliyor..." : "Abone Ol"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
