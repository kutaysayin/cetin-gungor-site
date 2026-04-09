/* Uye Giris sayfasi — server component */
import { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import GirisForm from "@/components/auth/GirisForm";

export const metadata: Metadata = {
  title: "Uye Girisi | MIMAD",
  description: "Uye portalina erisim icin giris yapin.",
};

export default function GirisPage() {
  return (
    <>
      <PageHeader
        title="Uye Girisi"
        subtitle="Uye portalina erisim icin lutfen giris yapin"
        breadcrumbs={[{ label: "Uye Girisi" }]}
      />
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GirisForm />
        </div>
      </section>
    </>
  );
}
