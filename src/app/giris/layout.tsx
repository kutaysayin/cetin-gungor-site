import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uye Girisi | MIMAD",
  description: "Uye portalina erisim icin giris yapin.",
};

export default function GirisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
