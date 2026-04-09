import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uyelik Basvurusu | MIMAD",
  description: "MIMAD uyelik basvurusu icin formu doldurun.",
};

export default function KayitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
