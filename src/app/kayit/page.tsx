/* Uyelik Basvurusu sayfasi — server component */
import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import KayitForm from "@/components/auth/KayitForm";

export const metadata: Metadata = {
  title: "Uyelik Basvurusu | MIMAD",
  description: "Manisa Insaat Malzemecileri Dernegi'ne uye olmak icin basvuru formu.",
};

export default function KayitPage() {
  return (
    <>
      <PageHeader
        title="Uyelik Basvurusu"
        subtitle="Dernegimize uye olmak icin asagidaki formu eksiksiz doldurun"
        breadcrumbs={[{ label: "Uyelik Basvurusu" }]}
      />
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <KayitForm />
        </div>
      </section>
    </>
  );
}
