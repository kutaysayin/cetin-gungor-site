/* Admin — Iletisim mesajlari yonetimi */
import { prisma } from "@/lib/db";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mesaj Yonetimi" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Iletisim Mesajlari
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {messages.length} mesaj
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {unreadCount} okunmamis
              </span>
            )}
          </p>
        </div>
      </div>

      <MessagesClient messages={JSON.parse(JSON.stringify(messages))} />
    </div>
  );
}
