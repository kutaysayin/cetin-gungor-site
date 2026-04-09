/**
 * Cerez Politikasi sayfasi
 * Web sitesinde kullanilan cerezler hakkinda bilgilendirme.
 */

import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Cerez Politikasi",
  description:
    "Manisa Insaat Malzemecileri Dernegi Cerez Politikasi — web sitemizde kullanilan cerezler ve yonetimi hakkinda bilgilendirme.",
};

export default function CerezPolitikasiPage() {
  return (
    <>
      <PageHeader
        title="Cerez Politikasi"
        subtitle="Web sitemizde kullanilan cerezler hakkinda bilgilendirme"
        breadcrumbs={[{ label: "Cerez Politikasi" }]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-10">
            {/* 1. Cerez Nedir? */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                1. Cerez Nedir?
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Bu web sitesi, kullanici deneyimini iyilestirmek ve site
                islevselligini saglamak amaciyla cerezler (cookies)
                kullanmaktadir. Cerezler, web sitesini ziyaret ettiginizde
                cihaziniza kaydedilen kucuk metin dosyalaridir.
              </p>
            </div>

            {/* 2. Kullanilan Cerez Turleri */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                2. Kullanilan Cerez Turleri
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="px-4 py-3 font-semibold text-primary-800">
                        Cerez Adi
                      </th>
                      <th className="px-4 py-3 font-semibold text-primary-800">
                        Turu
                      </th>
                      <th className="px-4 py-3 font-semibold text-primary-800">
                        Amaci
                      </th>
                      <th className="px-4 py-3 font-semibold text-primary-800">
                        Suresi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-700">
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-3 font-mono text-xs">
                        next-auth.session-token
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Zorunlu
                        </span>
                      </td>
                      <td className="px-4 py-3">Oturum yonetimi</td>
                      <td className="px-4 py-3">Oturum suresi</td>
                    </tr>
                    <tr className="border-t border-neutral-100 bg-neutral-50/50">
                      <td className="px-4 py-3 font-mono text-xs">
                        next-auth.csrf-token
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Zorunlu
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Guvenlik (CSRF korumasi)
                      </td>
                      <td className="px-4 py-3">Oturum suresi</td>
                    </tr>
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-3 font-mono text-xs">
                        next-auth.callback-url
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Zorunlu
                        </span>
                      </td>
                      <td className="px-4 py-3">Yonlendirme bilgisi</td>
                      <td className="px-4 py-3">Oturum suresi</td>
                    </tr>
                    <tr className="border-t border-neutral-100 bg-neutral-50/50">
                      <td className="px-4 py-3 font-mono text-xs">
                        cookie-consent
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Zorunlu
                        </span>
                      </td>
                      <td className="px-4 py-3">Cerez tercihi kaydi</td>
                      <td className="px-4 py-3">1 yil</td>
                    </tr>
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-3 font-mono text-xs">_ga</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-accent-100 text-accent-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Analitik
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Google Analytics ziyaretci takibi
                      </td>
                      <td className="px-4 py-3">2 yil</td>
                    </tr>
                    <tr className="border-t border-neutral-100 bg-neutral-50/50">
                      <td className="px-4 py-3 font-mono text-xs">_gid</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-accent-100 text-accent-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Analitik
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Google Analytics oturum takibi
                      </td>
                      <td className="px-4 py-3">24 saat</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Cerez Kategorileri */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                3. Cerez Kategorileri
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 leading-relaxed">
                <li>
                  <strong>Zorunlu Cerezler:</strong> Site islevselligini saglar,
                  devre disi birakilamaz.
                </li>
                <li>
                  <strong>Analitik Cerezler:</strong> Ziyaretci istatistikleri
                  toplar, anonim veriler icerir.
                </li>
                <li>
                  <strong>Pazarlama Cerezleri:</strong> Su an
                  kullanilmamaktadir.
                </li>
              </ul>
            </div>

            {/* 4. Cerez Yonetimi */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                4. Cerez Yonetimi
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Tarayici ayarlarinizdan cerezleri yonetebilir veya
                silebilirsiniz. Ancak zorunlu cerezleri devre disi birakmak
                sitenin duzgun calismammasina neden olabilir.
              </p>
            </div>

            {/* 5. Iletisim */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                5. Iletisim
              </h2>
              <div className="bg-neutral-50 rounded-2xl p-6 space-y-2 text-neutral-700">
                <p className="font-semibold text-primary-800">
                  Manisa Insaat Malzemecileri Dernegi
                </p>
                <p>
                  <strong>Web:</strong>{" "}
                  <span className="text-accent-600">cetingungor.org.tr</span>
                </p>
                <p>
                  <strong>E-posta:</strong>{" "}
                  <a
                    href="mailto:kvkk@cetingungor.org.tr"
                    className="text-accent-600 hover:underline"
                  >
                    kvkk@cetingungor.org.tr
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
