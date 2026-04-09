/* Uye arama ve sektor filtresi — URL parametreleri ile calisir */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";

const sektorler = [
  { value: "", label: "Tümü" },
  { value: "Seramik & Fayans", label: "Seramik & Fayans" },
  { value: "Boya & Yalıtım", label: "Boya & Yalıtım" },
  { value: "Tesisat & Isıtma", label: "Tesisat & Isıtma" },
  { value: "Elektrik & Aydınlatma", label: "Elektrik & Aydınlatma" },
  { value: "Hırdavat & Nalburiye", label: "Hırdavat & Nalburiye" },
];

export default function MemberSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearch = searchParams.get("arama") ?? "";
  const currentSektor = searchParams.get("sektor") ?? "";

  function buildUrl(arama: string, sektor: string) {
    const q = new URLSearchParams();
    if (arama) q.set("arama", arama);
    if (sektor) q.set("sektor", sektor);
    const qs = q.toString();
    return `/uyeler${qs ? `?${qs}` : ""}`;
  }

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(buildUrl(value, currentSektor));
    }, 350);
  }

  function handleSektor(value: string) {
    router.push(buildUrl(currentSearch, value));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {/* Arama kutusu */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Firma adı veya yetkili ara..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
        />
      </div>

      {/* Sektör filtresi */}
      <select
        value={currentSektor}
        onChange={(e) => handleSektor(e.target.value)}
        className="px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition sm:w-64"
      >
        {sektorler.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
