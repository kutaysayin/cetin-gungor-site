import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AboutPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <AnimatedSection delay={0}>
            <div className="relative">
              {/* Decorative big quote mark */}
              <span
                className="absolute -top-4 -left-2 text-9xl leading-none text-secondary/10 font-serif pointer-events-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="relative">
                <SectionTitle title="Hakkimizda" className="mb-8" />

                <p className="text-neutral-600 leading-relaxed mb-4">
                  Manisa Insaat Malzemecileri Dernegi olarak, bolgemizin insaat ve
                  yapi sektoru profesyonellerini bir cerceve altinda bulusturarak
                  ortak gelisimi on planda tutuyoruz. Uyelerimize mesleki destek,
                  hukuki danismanlik ve sektor icindeki guncel bilgilere erisim
                  olanaklari sunuyoruz.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Kurulus amacimiz; Manisa&apos;daki insaat malzemecileri arasindaki
                  dayanismayi guclendirilmek, sektore yonelik projeler gelistirmek
                  ve yerel ekonomiye katkida bulunmaktir. Dernegimiz, uyelerinin
                  ticari cikarlari dogrultusunda kurumsal bir ses olarak gorev
                  yapmaktadir.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-10">
                  Yonetim kurulumuz, is dunyasindan deneyimli isimlerden olusmakta
                  olup Manisa Belediyesi, Ticaret Odasi ve diger meslek kuruluslari
                  ile aktif is birligi icerisinde calismayi surdurmektedir.
                </p>

                <Link
                  href="/hakkimizda"
                  className="inline-flex items-center gap-2 text-secondary-600 font-semibold hover:text-secondary-500 transition-colors group"
                >
                  Devamini Oku
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Visual placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 flex items-center justify-center shadow-[var(--shadow-elevated)] relative">
              {/* Inner geometric accent */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-6 right-6 w-24 h-24 rounded-2xl border-2 border-primary-200 rotate-12" />
                <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full border-2 border-accent-200" />
                <div className="absolute top-1/2 left-6 w-8 h-8 rounded-lg bg-secondary-100 rotate-45" />
              </div>
              <div className="relative flex flex-col items-center gap-4 text-primary-300">
                <Building2 size={64} strokeWidth={1} />
                <span className="text-sm font-medium text-primary-400 text-center px-8">
                  Manisa Insaat Malzemecileri Dernegi
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
