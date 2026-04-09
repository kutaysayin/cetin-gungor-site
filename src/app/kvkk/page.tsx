/**
 * KVKK Aydinlatma Metni sayfasi
 * 6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda aydinlatma metni.
 */

import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "KVKK Aydinlatma Metni",
  description:
    "Manisa Insaat Malzemecileri Dernegi KVKK Aydinlatma Metni — 6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda kisisel verilerinizin islenmesine iliskin bilgilendirme.",
};

export default function KVKKPage() {
  return (
    <>
      <PageHeader
        title="KVKK Aydinlatma Metni"
        subtitle="6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda aydinlatma metni"
        breadcrumbs={[{ label: "KVKK Aydinlatma Metni" }]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-10">
            {/* 1. Veri Sorumlusu */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                1. Veri Sorumlusu
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Manisa Insaat Malzemecileri Dernegi (&quot;Dernek&quot;) olarak
                kisisel verilerinizin guvenligine onem veriyoruz. 6698 sayili
                Kisisel Verilerin Korunmasi Kanunu (&quot;KVKK&quot;)
                kapsaminda asagidaki aydinlatma metnini bilginize sunuyoruz.
              </p>
            </div>

            {/* 2. Islenen Kisisel Veriler */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                2. Islenen Kisisel Veriler
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 leading-relaxed">
                <li>
                  <strong>Kimlik bilgileri:</strong> Ad, soyad
                </li>
                <li>
                  <strong>Iletisim bilgileri:</strong> E-posta adresi, telefon
                  numarasi, adres
                </li>
                <li>
                  <strong>Mesleki bilgiler:</strong> Firma adi, sektor, unvan
                </li>
                <li>
                  <strong>Dijital veriler:</strong> IP adresi, cerez verileri,
                  site kullanim istatistikleri
                </li>
                <li>
                  <strong>Uyelik bilgileri:</strong> Uyelik tarihi, aidat
                  durumu, etkinlik katilim bilgileri
                </li>
              </ul>
            </div>

            {/* 3. Kisisel Verilerin Islenme Amaci */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                3. Kisisel Verilerin Islenme Amaci
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 leading-relaxed">
                <li>Dernek uyelik islemlerinin yurutulmesi</li>
                <li>Etkinlik ve toplanti organizasyonu</li>
                <li>Aidat takibi ve mali islemlerin yurutulmesi</li>
                <li>Iletisim faaliyetlerinin yurutulmesi</li>
                <li>Yasal yukumluluklerin yerine getirilmesi</li>
                <li>Dernek faaliyetleri hakkinda bilgilendirme</li>
              </ul>
            </div>

            {/* 4. Kisisel Verilerin Aktarilmasi */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                4. Kisisel Verilerin Aktarilmasi
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Kisisel verileriniz, yasal zorunluluklar cercevesinde yetkili
                kamu kurumlarina ve is ortaklarimiza aktarilabilir. Verileriniz
                yurt disina aktarilmamaktadir.
              </p>
            </div>

            {/* 5. Kisisel Veri Toplamanin Yontemi ve Hukuki Sebebi */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                5. Kisisel Veri Toplamanin Yontemi ve Hukuki Sebebi
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Kisisel verileriniz; web sitemiz, uyelik basvuru formu, iletisim
                formu ve etkinlik kayit formlari araciligiyla elektronik ortamda
                toplanmaktadir. Hukuki sebepler: acik riza, sozlesmenin
                kurulmasi/ifasi, hukuki yukumluluk, mesru menfaat.
              </p>
            </div>

            {/* 6. KVKK Madde 11 Kapsamindaki Haklariniz */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                6. KVKK Madde 11 Kapsamindaki Haklariniz
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 leading-relaxed">
                <li>
                  Kisisel verilerinizin islenip islenmedigini ogrenme
                </li>
                <li>Islenmisse buna iliskin bilgi talep etme</li>
                <li>
                  Islenme amacini ve amacina uygun kullanilip kullanilmadigini
                  ogrenme
                </li>
                <li>
                  Yurt icinde veya yurt disinda aktarildigi ucuncu kisileri
                  bilme
                </li>
                <li>
                  Eksik veya yanlis islenmisse duzeltilmesini isteme
                </li>
                <li>
                  KVKK&apos;nin 7. maddesinde ongorulen sartlar cercevesinde
                  silinmesini/yok edilmesini isteme
                </li>
                <li>
                  Duzeltme/silme islemlerinin aktarilmis ucuncu kisilere
                  bildirilmesini isteme
                </li>
                <li>
                  Islenen verilerin munhasiran otomatik sistemler vasitasiyla
                  analiz edilmesi suretiyle aleyhinize bir sonucun ortaya
                  cikmasina itiraz etme
                </li>
                <li>
                  Kanuna aykiri olarak islenmesi sebebiyle zarara ugramaniz
                  halinde zararin giderilmesini talep etme
                </li>
              </ul>
            </div>

            {/* 7. Veri Saklama Suresi */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                7. Veri Saklama Suresi
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Kisisel verileriniz, islenme amacinin gerektirdigi sure boyunca
                ve yasal yukumluluklerin ongordugu zorunlu saklama sureleri
                boyunca muhafaza edilir. Uyelik sona erdikten sonra yasal
                zorunluluklar disinda verileriniz silinir veya anonim hale
                getirilir.
              </p>
            </div>

            {/* 8. Iletisim */}
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                8. Iletisim
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Kisisel verilerinizle ilgili taleplerinizi asagidaki iletisim
                bilgileri uzerinden iletebilirsiniz:
              </p>
              <div className="bg-neutral-50 rounded-2xl p-6 space-y-2 text-neutral-700">
                <p className="font-semibold text-primary-800">
                  Manisa Insaat Malzemecileri Dernegi
                </p>
                <p>
                  <strong>Adres:</strong> Laleli Mah. Mimar Sinan Blv. No:45
                  Kat:3, Sehzadeler/Manisa
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
                <p>
                  <strong>Telefon:</strong>{" "}
                  <a
                    href="tel:+902362314567"
                    className="text-accent-600 hover:underline"
                  >
                    (236) 231 45 67
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
