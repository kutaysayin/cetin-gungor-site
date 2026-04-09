/* Hakkimizda ana sayfasi — tarihce, misyon/vizyon ve degerlerimiz bolumlerini icerir */

import type { Metadata } from "next";
import { Target, Eye, Shield, Users, Lightbulb, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkimizda",
  description:
    "Manisa Insaat Malzemecileri Dernegi hakkinda bilgi edinin. Tarihcemiz, misyonumuz, vizyonumuz ve degerlerimiz.",
  openGraph: {
    title: "Hakkimizda",
    description:
      "Manisa Insaat Malzemecileri Dernegi hakkinda bilgi edinin. Tarihcemiz, misyonumuz, vizyonumuz ve degerlerimiz.",
  },
};
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";

const timelineItems = [
  {
    year: "2024",
    title: "Derneğin Kuruluşu",
    description:
      "Manisa İnşaat Malzemecileri Derneği, sektördeki köklü firmaların öncülüğünde Manisa'da resmi olarak kuruldu. Kuruluş genel kuruluna 47 firma temsilcisi katıldı ve yönetim kurulu oluşturuldu. Dernek, inşaat malzemeleri sektöründeki paydaşları tek çatı altında toplamayı hedefleyerek faaliyetlerine başladı.",
  },
  {
    year: "2024",
    title: "TIMFED Üyeliği",
    description:
      "Derneğimiz, Türkiye İnşaat Malzemecileri Federasyonu'na (TIMFED) üye olarak kabul edildi. Bu üyelik sayesinde ulusal düzeyde temsil imkânı ve diğer il dernekleriyle işbirliği kapısı açıldı. TIMFED çatısı altında gerçekleştirilen toplantılar ve çalışma gruplarına aktif katılım sağlandı.",
  },
  {
    year: "2025",
    title: "İlk Olağan Genel Kurul",
    description:
      "Kuruluşun ardından gerçekleştirilen ilk olağan genel kurulda derneğin tüzüğü güncellendi ve yeni dönem yönetim kurulu seçildi. Üye sayısı 85'e ulaşan dernek, faaliyet raporunu genel kurula sundu. Önümüzdeki dönem için stratejik hedefler belirlenerek eylem planı onaylandı.",
  },
];

const missionVisionItems = [
  {
    icon: Target,
    title: "Misyonumuz",
    color: "bg-primary/10",
    iconColor: "text-primary",
    text: "Manisa ilinde faaliyet gösteren inşaat malzemeleri sektörü temsilcilerini bir araya getirerek mesleki dayanışmayı güçlendirmek, üyelerimizin hak ve çıkarlarını korumak, sektörün sürdürülebilir büyümesine katkı sağlamak ve bölge ekonomisinin gelişimine öncülük etmek.",
  },
  {
    icon: Eye,
    title: "Vizyonumuz",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
    text: "Türkiye'nin önde gelen il inşaat malzemeleri derneklerinden biri olmak; üyelerimize değer katan, sektörde standartları yükselten ve Manisa'yı inşaat malzemeleri ticaretinde bölgesel bir merkez hâline getiren, yenilikçi ve güvenilir bir kurum olmak.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Güven",
    text: "Üyelerimiz ve paydaşlarımızla şeffaf, dürüst ve tutarlı ilişkiler sürdürürüz.",
  },
  {
    icon: Users,
    title: "Birlik",
    text: "Sektördeki tüm paydaşları kapsayan kucaklayıcı bir dayanışma kültürü inşa ederiz.",
  },
  {
    icon: Lightbulb,
    title: "Yenilik",
    text: "Dijital dönüşümü destekler, sektörde en güncel uygulamaların yaygınlaşmasına öncülük ederiz.",
  },
  {
    icon: Award,
    title: "Kalite",
    text: "Sunduğumuz hizmetlerde ve temsil ettiğimiz sektörde yüksek kalite standartlarını benimseriz.",
  },
];

export default function HakkimizdaPage() {
  return (
    <main>
      <PageHeader
        title="Hakkımızda"
        subtitle="Manisa inşaat malzemeleri sektörünün köklü ve güvenilir temsilcisi"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      {/* Tarihçe */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Tarihçemiz"
            subtitle="Kısa bir geçmişte büyük adımlar; derneğimizin kuruluşundan bugüne kilometre taşları"
            className="mb-14"
          />

          <div className="relative max-w-3xl mx-auto">
            {/* Dikey çizgi — thicker */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-secondary/25" />

            <div className="space-y-12">
              {timelineItems.map((item, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.1}>
                  <div className="relative flex gap-8">
                    {/* Nokta — larger */}
                    <div className="relative flex-shrink-0 w-12 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-secondary border-4 border-white ring-2 ring-secondary/40 mt-1 z-10 shadow-sm" />
                    </div>

                    {/* İçerik — card with shadow */}
                    <div className="flex-1 pb-2 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.07)] border border-neutral-100 p-6 -mt-1">
                      <span className="inline-block bg-secondary/10 text-secondary font-bold text-sm px-3 py-1 rounded-full mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-primary mb-3">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Misyon & Vizyon"
            subtitle="Nereye gittiğimizi bilmek, oraya nasıl ulaşacağımızı belirlemenin ilk adımıdır"
            className="mb-12"
          />

          <div className="grid lg:grid-cols-2 gap-8">
            {missionVisionItems.map(({ icon: Icon, title, text, color, iconColor }, idx) => (
              <AnimatedSection key={title} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-shadow duration-300 border border-neutral-100 h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${color} mb-6`}>
                    <Icon size={28} className={iconColor} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-[0.9375rem]">
                    {text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Değerlerimiz"
            subtitle="Tüm faaliyetlerimizin temelini oluşturan ilkeler"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, text }, idx) => (
              <AnimatedSection key={title} delay={idx * 0.08}>
                <div className="group rounded-2xl p-6 border border-neutral-200 hover:border-secondary/40 hover:bg-secondary/5 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-5 group-hover:bg-secondary transition-colors duration-300">
                    <Icon size={26} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-3">{title}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
