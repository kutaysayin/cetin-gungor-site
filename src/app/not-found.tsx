import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="text-center relative z-10 max-w-lg">
        {/* Big 404 */}
        <h1 className="text-[120px] md:text-[180px] font-display font-bold leading-none bg-gradient-to-br from-primary-300 via-primary-600 to-secondary-500 bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-display text-primary-800 mb-3 -mt-4">
          Sayfa Bulunamadi
        </h2>

        <p className="text-neutral-500 mb-8 leading-relaxed">
          Aradiginiz sayfa kaldirilmis, adi degistirilmis veya gecici olarak
          kullanilamaz durumda olabilir.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:shadow-lg transition-all"
          >
            Anasayfaya Don
          </Link>
          <Link
            href="/haberler"
            className="px-6 py-3 rounded-xl border border-neutral-200 text-primary-700 font-medium hover:bg-neutral-50 transition-all"
          >
            Haberler
          </Link>
        </div>
      </div>
    </div>
  );
}
