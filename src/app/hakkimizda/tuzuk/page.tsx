/* Dernek Tuzugu sayfasi — akordeon seklinde 10 madde gosterir */

import type { Metadata } from "next";
import { FileDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Dernek Tuzugu",
  description:
    "Manisa Insaat Malzemecileri Dernegi tuzugu. Dernegin amaci, uyelik kosullari, organlar ve calisma esaslari.",
  openGraph: {
    title: "Dernek Tuzugu",
    description:
      "Manisa Insaat Malzemecileri Dernegi tuzugu. Dernegin amaci, uyelik kosullari, organlar ve calisma esaslari.",
  },
};
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import TuzukAccordion from "@/components/hakkimizda/TuzukAccordion";

const maddeler = [
  {
    no: 1,
    baslik: "Derneğin Adı ve Merkezi",
    icerik: [
      "Derneğin adı 'Manisa İnşaat Malzemecileri Derneği'dir. Kısa adı 'MANİMAD' olarak kullanılır.",
      "Derneğin merkezi Manisa'dır. Adres değişikliği yönetim kurulu kararı ile yapılır ve ilgili makamlara bildirilir; tüzük değişikliği gerekmez.",
      "Dernek, yurt içinde şube açabilir. Şube açma kararı genel kurulda alınır ve şubelerin kuruluşu yasal prosedürlere uygun olarak gerçekleştirilir.",
    ],
  },
  {
    no: 2,
    baslik: "Derneğin Amacı",
    icerik: [
      "Derneğin amacı; Manisa ilinde inşaat malzemeleri alanında faaliyet gösteren tüm gerçek ve tüzel kişileri bir araya getirerek sektörün sorunlarını tespit etmek, çözüm üretmek ve mesleki dayanışmayı güçlendirmektir.",
      "Bu doğrultuda dernek; üyelerinin ekonomik, mesleki ve sosyal haklarını korur; sektörde etik standartların yerleşmesine katkı sağlar ve kamuoyu nezdinde güçlü bir temsil oluşturur.",
      "Dernek, kâr amacı gütmeksizin faaliyetlerini sürdürür; tüm gelir ve kaynaklar dernek amaçlarının gerçekleştirilmesi için kullanılır.",
    ],
  },
  {
    no: 3,
    baslik: "Derneğin Faaliyet Alanı",
    icerik: [
      "Dernek; eğitim, seminer, çalıştay ve konferanslar düzenler; sektörel yayınlar hazırlar; ticaret fuarları ile geziler organize eder ve üyelerine danışmanlık hizmetleri sunar.",
      "Kamu kurum ve kuruluşları, meslek odaları, belediyeler ve diğer sivil toplum kuruluşlarıyla işbirliği yaparak sektörü etkileyen mevzuat çalışmalarına katkı sağlar.",
      "Ulusal ve uluslararası alanda faaliyet gösteren üst birlikler, federasyonlar ve konfederasyonlara üye olabilir; ortak projeler geliştirebilir.",
    ],
  },
  {
    no: 4,
    baslik: "Üyelik Koşulları",
    icerik: [
      "Medeni haklarını kullanma ehliyetine sahip, on sekiz yaşını doldurmuş ve inşaat malzemeleri sektöründe faaliyet gösteren gerçek kişiler ile bu alanda kurulmuş tüzel kişiler derneğe üye olabilir.",
      "Üyelik başvurusu, başvuru formu ve gerekli belgeler ile yönetim kuruluna yapılır. Yönetim kurulu, başvuruyu otuz gün içinde değerlendirerek sonucu yazılı olarak başvuru sahibine bildirir.",
      "Üyeliğe kabul edilen kişi, yıllık aidatını düzenli ödemek ve dernek tüzüğüne uymakla yükümlüdür. Aidat miktarı ve ödeme koşulları genel kurul tarafından belirlenir.",
    ],
  },
  {
    no: 5,
    baslik: "Üyelikten Çıkma",
    icerik: [
      "Her üye, yazılı olarak bildirmek kaydıyla dernek üyeliğinden serbestçe çıkabilir. Çıkma bildirimi, yönetim kurulu başkanlığına yazılı olarak iletilir.",
      "Üyelikten çıkma, bildiriminin yönetim kuruluna ulaşmasından itibaren sonuç doğurur. Çıkan üyenin birikimlerdeki katkı payı iade edilmez.",
      "Üyelikten ayrılan kişinin ayrılış tarihine kadar doğmuş aidat ve diğer yükümlülükleri sona ermez; bu borçlar dernek tarafından takip edilebilir.",
    ],
  },
  {
    no: 6,
    baslik: "Üyelikten Çıkarılma",
    icerik: [
      "Dernek tüzüğüne veya genel kurul kararlarına aykırı hareket etmek, üyelik koşullarını kaybetmek, dernek onurunu zedeleyici tutum ve davranışlarda bulunmak ile aidat borcunu mazeretsiz biçimde altı ay süre ile ödememek üyelikten çıkarılma nedenleridir.",
      "Çıkarma kararı, disiplin kurulunun incelemesi ve önerisi üzerine yönetim kurulu tarafından üçte iki çoğunlukla alınır. Karar yazılı olarak ilgili üyeye tebliğ edilir.",
      "Çıkarılan üye, on beş gün içinde itiraz hakkını genel kurulda kullanabilir. Genel kurul kararı kesin olup dernek içinde başka bir yola başvurulamaz.",
    ],
  },
  {
    no: 7,
    baslik: "Dernek Organları",
    icerik: [
      "Derneğin zorunlu organları şunlardır: Genel Kurul, Yönetim Kurulu ve Denetim Kurulu.",
      "Genel Kurul en üst karar organıdır. Yönetim Kurulu yürütme organı olarak görev yapar. Denetim Kurulu ise derneğin hesap ve işlemlerini denetler.",
      "Dernek, ihtiyaç duyulması hâlinde tüzük hükümlerine ve mevzuata uygun olarak ihtisas komisyonları, çalışma grupları veya danışma kurulları oluşturabilir.",
    ],
  },
  {
    no: 8,
    baslik: "Genel Kurul",
    icerik: [
      "Genel Kurul, derneğe kayıtlı ve aidat borcu bulunmayan tüm üyelerden oluşur. Olağan Genel Kurul iki yılda bir Nisan ayında toplanır; olağanüstü toplantı ise yönetim kurulu ya da denetim kurulunun gerekli görmesi veya üyelerin beşte birinin yazılı talebi üzerine yapılır.",
      "Genel Kurul toplantısına çağrı, en az on beş gün önceden yazılı olarak veya elektronik ortamda üyelere bildirilir; toplantı gündemi ilan edilir. Çoğunluk sağlanamazsa ikinci toplantı çoğunluk şartı aranmaksızın yapılır.",
      "Genel Kurul; derneğin ana tüzüğünü değiştirir, yönetim ve denetim kurullarını seçer, bütçeyi onaylar, taşınmaz mal alım satımına izin verir ve derneğin feshine karar verebilir.",
    ],
  },
  {
    no: 9,
    baslik: "Yönetim Kurulu",
    icerik: [
      "Yönetim Kurulu, Genel Kurul tarafından iki yıl için seçilen beş asıl ve beş yedek üyeden oluşur. Kurul, kendi içinden bir başkan, bir başkan yardımcısı, bir genel sekreter ve bir sayman seçer.",
      "Yönetim Kurulu, ayda en az bir kez olağan toplanır; gerektiğinde başkanın daveti ile olağanüstü toplantı yapılabilir. Toplantı yeter sayısı üç olup kararlar oy çokluğuyla alınır.",
      "Yönetim Kurulu; derneği temsil eder, bütçeyi uygular, personel istihdam eder, çalışma programı hazırlar ve Genel Kurula hesap verir.",
    ],
  },
  {
    no: 10,
    baslik: "Denetim Kurulu",
    icerik: [
      "Denetim Kurulu, Genel Kurul tarafından iki yıl için seçilen üç asıl ve üç yedek üyeden oluşur. Kurul, kendi içinden bir başkan seçer.",
      "Denetim Kurulu; derneğin hesapları, defter ve belgelerini en az altı ayda bir inceler; sonuçları bir raporla Yönetim Kuruluna ve Genel Kurula sunar.",
      "Denetim Kurulu, derneğin tüzüğe aykırı hareket ettiğini tespit etmesi hâlinde olağanüstü Genel Kurul toplantısını talep etme yetkisine sahiptir.",
    ],
  },
];

export default function TuzukPage() {
  return (
    <main>
      <PageHeader
        title="Dernek Tüzüğü"
        subtitle="Manisa İnşaat Malzemecileri Derneği kuruluş ve işleyiş esasları"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hakkımızda", href: "/hakkimizda" },
          { label: "Dernek Tüzüğü" },
        ]}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* PDF İndir butonu */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10 p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div>
              <h2 className="font-bold text-primary text-lg">
                Tüzük Belgesi
              </h2>
              <p className="text-neutral-500 text-sm mt-0.5">
                Dernek tüzüğünün tam metnini PDF olarak indirebilirsiniz.
              </p>
            </div>
            <Button href="#" variant="primary" size="md">
              <FileDown size={18} />
              PDF İndir
            </Button>
          </div>

          {/* Akordeon — rounded-2xl items, open item has left border-secondary */}
          <TuzukAccordion maddeler={maddeler} />
        </div>
      </section>
    </main>
  );
}
