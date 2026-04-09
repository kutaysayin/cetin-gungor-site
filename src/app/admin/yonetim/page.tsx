/* Admin — Yonetim Kurulu yonetimi */
import { prisma } from "@/lib/db";
import BoardClient from "./BoardClient";

export const metadata = { title: "Yonetim Kurulu Yonetimi" };

export default async function AdminBoardPage() {
  const members = await prisma.boardMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Yonetim Kurulu Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {members.length} uye
          </p>
        </div>
      </div>

      <BoardClient members={JSON.parse(JSON.stringify(members))} />
    </div>
  );
}
