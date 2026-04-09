# Cetin Gungor — Manisa Insaat Malzemecileri Dernegi Demo Sitesi

## Proje Bilgisi
- **Amac:** Manisa Belediyesi'ne satis icin profesyonel demo site
- **Referans:** DIMSIAD (Denizli) ve TIMDER (Istanbul) — cok daha ust seviye
- **Stack:** Next.js 16 (App Router) + Tailwind CSS v4 + Prisma 7 + SQLite (dev) + Framer Motion + Lucide React
- **Dil:** Turkce (UTF-8)
- **Tasarim:** Mobile-first, premium, kurumsal — "Clean luxury"

## Renk Sistemi (derinlestirilmis, 50-950 arasi)
- Primary: #1a2744 (koyu lacivert — guven, kurumsal)
- Secondary: #c8952e (altin/amber — prestij, basari)
- Accent: #2a9d8f (turkuaz — modernlik, yenilik)
- Neutral: #f8f9fa → #0d1117

## Tipografi Sistemi
- **Display/Baslik:** DM Serif Display (serif, karakter sahibi, h1-h4 otomatik)
- **Body:** DM Sans (modern, okunaklı sans-serif)
- **Mono:** Geist Mono
- Letter-spacing: Basliklar -0.025em (tight), paragraflar line-height 1.7

## Agentlar
- product-manager: Urun yonetimi, sprint planlama
- frontend-dev: Next.js + Tailwind gelistirme
- backend-dev: Prisma + API + Auth
- uiux-designer: Tasarim sistemi, UX akislari
- qa-tester: Test, kalite kontrol

## Sprint Durumu
- [x] Sprint 1: Proje kurulumu + Anasayfa + Hakkimizda + Haberler
- [x] Sprint 2: Uye Dizini + Etkinlikler + Yayinlar + Galeri + Avantaj Rehberi
- [x] Sprint 2.5: Tam Tasarim Yenileme (Design Polish)
- [x] Sprint 3: Auth + Uye Portali + Iletisim
- [x] Sprint 4: Admin Paneli (CMS) + SEO + KVKK
- [x] Sprint 5: Odeme + PWA + Final Polish

## Sprint 1 Tamamlanan Isler
- Next.js 16 + Tailwind v4 + Prisma 7 + Framer Motion + Lucide React kurulumu
- Tailwind design tokens (globals.css @theme inline ile primary/secondary/accent/neutral)
- Prisma schema: SiteSettings, News, BoardMember, Event, WorkGroup, MemberCompany, Publication
- Seed data: 5 yonetim kurulu uyesi, 12 haber, 3 etkinlik, 4 calisma grubu (tum Turkce)
- Layout: Header + Footer
- Anasayfa: HeroSection, StatsSection, AboutPreview, LatestNews, UpcomingEvents, BoardPreview, CTASection
- Hakkimizda: Tarihce (timeline), Yonetim Kurulu, Tuzuk (accordion), Calisma Gruplari
- Haberler: Liste (kategori filtre + sayfalama) + Detay (SEO, sosyal paylasim, ilgili haberler)
- UI: Button, Badge, PageHeader, SectionTitle, NewsCard componentleri

## Sprint 2 Tamamlanan Isler
- Prisma schema: GalleryAlbum, GalleryPhoto, Advantage modelleri eklendi
- Seed data: 18 uye firma, 8 etkinlik, 9 yayin, 4 galeri albumu (28 fotograf), 8 avantaj
- Uye Dizini, Etkinlikler, Yayinlar, Galeri, Avantaj Rehberi sayfalari
- MemberCard, MemberSearch, EventsView, PublicationCard, GalleryGrid, AvantajTabs componentleri
- Header/Footer navigasyon guncellendi

## Sprint 2.5 Tamamlanan Isler (Design Polish)
- **Tipografi:** DM Serif Display (display) + DM Sans (body) font pairing, next/font/google
- **Renk Sistemi:** 50-950 arasi tam skala, gradient tanimlari, glow shadow'lar
- **Header:** Custom SVG logo ikon, nav link underline animasyonu, glassmorphism dropdown (backdrop-blur-xl, rounded-2xl, shadow-2xl), gradient "Uye Girisi" butonu, mobile drawer staggered animasyonlar
- **Footer:** Cok katmanli dalga SVG (3 layer depth), dot pattern overlay, gradient arka plan, refined kolon basliklari (uppercase, tracking-wide), rounded-full newsletter input/button
- **HeroSection:** Animated gradient mesh blob'lari, grid pattern overlay, gradient CTA butonlari, text-shadow, "Kesfet" scroll prompt
- **StatsSection:** Ikon kutulari, decorative separator cizgileri, hover lift efekti, cubic ease count-up
- **AboutPreview:** Dekoratif quote mark, geometric accent shapes, staggered AnimatedSection
- **LatestNews/Events/Board:** AnimatedSection stagger, refined kartlar, empty state ikonlari
- **CTASection:** Floating blur blob'lari, dot pattern overlay, gradient text, premium buton
- **PageHeader:** Daha yuksek (py-20 md:py-28), dot pattern overlay, merkezi hizalama, dekoratif gold cizgi
- **Kart Componentleri:** border-yok sadece shadow, rounded-2xl, hover:-translate-y-1 + shadow-card-hover, MemberCard sektor bazli renk gradient avatar, NewsCard gradient overlay + kategori badge on image, PublicationCard tilt efekti
- **Button:** Gradient primary variant, glow shadow hover, scale-[1.02] mikro-interaksiyon
- **Detay Sayfalari:** Haber detay (hero, dekoratif cizgi, rounded share butonlari), Etkinlik detay (elevated date card, gradient kayit butonu), Uye detay (banner header, info grid)
- **Genel:** AnimatedSection (scroll-triggered fade-in), ScrollToTop butonu, SkeletonCard loader, scrollbar-hide utility, ::selection rengi, bg-dot-pattern/bg-grid-pattern CSS siniflari
- TypeScript: 0 hata, Build: basarili (16 route)

## Sprint 3 Tamamlanan Isler (Auth + Portal + Iletisim)
- **Auth Sistemi:** NextAuth.js v4 + CredentialsProvider, JWT strategy, bcryptjs (salt 12)
- **Prisma Schema:** User (role, duesStatus, sector, active), EventRegistration (unique [userId, eventId]), ContactMessage modelleri
- **Middleware:** `/portal/*` ve `/admin/*` route korumasi (withAuth)
- **Giris Sayfasi:** `/giris` — Email/sifre login formu, hata mesajlari, "Hesap Olustur" yonlendirme
- **Kayit Sayfasi:** `/kayit` — 3 adimli wizard (Kisisel → Firma → Sifre), Zod v4 validasyon
- **Iletisim Sayfasi:** `/iletisim` — Harita, iletisim bilgileri, form (rate limiting)
- **Uye Portali (6 sayfa):**
  - `/portal` — Dashboard (ozet kartlari, hizli erisim)
  - `/portal/profil` — Profil duzenleme formu
  - `/portal/etkinliklerim` — Kayitli etkinlikler listesi
  - `/portal/aidat` — Aidat durumu + odeme gecmisi
  - `/portal/belgelerim` — Indirilebilir belgeler
  - `/portal/avantajlar` — Uye avantajlari
- **Portal Layout:** Sidebar (desktop) + bottom nav (mobile), auth-aware
- **Etkinlik Kayit:** EventRegisterButton (kayit/iptal), kapasite kontrolu, auth-gated
- **API Route'lari (7 adet):**
  - `POST /api/auth/register` — Kullanici kayit (Zod validasyon, bcrypt hash)
  - `GET/POST /api/auth/[...nextauth]` — NextAuth handler
  - `POST /api/contact` — Iletisim formu (rate limiting)
  - `POST /api/events/register` — Etkinlik kayit (kapasite kontrolu)
  - `POST /api/events/unregister` — Etkinlik kayit iptali
  - `PUT /api/portal/profile` — Profil guncelleme
  - `PUT /api/portal/change-password` — Sifre degistirme
- **Header:** Auth-aware — giris yapmis kullanici icin dropdown menu (Portal, Cikis Yap)
- **Seed Data:** 3 kullanici (admin + 2 uye), etkinlik kayitlari, iletisim mesajlari
- **Test Kullanicilari:**
  - Admin: admin@cetingungor.org.tr / Admin123!
  - Uye 1: uye1@test.com / Test1234!
  - Uye 2: uye2@test.com / Test1234!
- TypeScript: 0 hata, Build: basarili (32 route)

## Sprint 4 Tamamlanan Isler (Admin Paneli + SEO + KVKK)
- **Middleware:** /admin/* ADMIN role kontrolu (ADMIN degilse /portal'a yonlendir)
- **Admin Layout:** Koyu sidebar (bg-[#0a101a]), genisletilebilir/daraltilabilir, 10 menu itemi, ust bar ("Siteyi Goruntule" linki), mobile hamburger
- **Admin Dashboard:** 6 ozet karti (uye, haber, etkinlik, yayin, mesaj), son haberler tablosu, son mesajlar, yaklasan etkinlikler, hizli islem butonlari
- **Admin UI Componentleri:**
  - DataTable: Generic tablo (search, pagination, zebra striping)
  - FormField: Label + input wrapper (error, required, maxLength counter)
  - Modal + ConfirmModal: Framer Motion animasyonlu dialog
  - Toast + ToastProvider + useToast: Bildirim sistemi (success/error/info)
  - RichTextEditor: Tiptap tabanli zengin metin editoru (bold, italic, baslik, liste, link, gorsel, alinti)
- **Haber Yonetimi (CRUD):** Liste + arama, yeni haber formu (otomatik slug, RichTextEditor, karakter sayaci), duzenle, sil (onay dialog)
- **Etkinlik Yonetimi (CRUD):** Liste + kayitli kisi sayisi, yeni/duzenle formu, kayitli katilimci listesi, sil
- **Uye Yonetimi:** Liste (filtre: aktif/pasif, sektor, aidat), detay/duzenle, rol degistirme, aktif/pasif toggle
- **Yayin Yonetimi:** Liste + inline form (tur, sayi no, dosya URL)
- **Galeri Yonetimi:** Album listesi, foto ekleme (URL + caption), cascading silme
- **Yonetim Kurulu:** Uye listesi (siralama), ekle/duzenle formu
- **Avantaj Yonetimi:** Liste + inline form (kategori, indirim, iletisim)
- **Iletisim Mesajlari:** Okunmamis/okunmus ayirimi, detay gorunum, okundu isaretle, sil
- **Site Ayarlari:** Dernek bilgileri + sosyal medya linkleri (JSON), upsert kayit
- **Admin API Route'lari (16 endpoint):**
  - `/api/admin/news` (POST) + `/api/admin/news/[id]` (GET/PUT/DELETE)
  - `/api/admin/events` (POST) + `/api/admin/events/[id]` (GET/PUT/DELETE)
  - `/api/admin/users` (GET) + `/api/admin/users/[id]` (GET/PUT) + `/api/admin/users/[id]/status` (PATCH)
  - `/api/admin/publications` (GET/POST) + `/api/admin/publications/[id]` (PUT/DELETE)
  - `/api/admin/gallery` (GET/POST) + `/api/admin/gallery/[id]` (GET/PUT/DELETE) + `/api/admin/gallery/[id]/photos` (POST/DELETE)
  - `/api/admin/board` (GET/POST) + `/api/admin/board/[id]` (PUT/DELETE)
  - `/api/admin/advantages` (GET/POST) + `/api/admin/advantages/[id]` (PUT/DELETE)
  - `/api/admin/messages` (GET) + `/api/admin/messages/[id]` (PATCH/DELETE)
  - `/api/admin/settings` (GET/PUT)
- **SEO:**
  - `sitemap.ts`: Dinamik XML sitemap (statik + haber/etkinlik/uye sayfalari)
  - `robots.ts`: Allow /, Disallow /portal /admin /api
  - `JsonLd.tsx`: Reusable JSON-LD component
  - Tum sayfalara generateMetadata eklendi
  - Structured data: Organization (anasayfa), Article (haberler), Event (etkinlikler), LocalBusiness (iletisim)
- **KVKK:** `/kvkk` — Tam Turkce aydinlatma metni (8 bolum, KVKK Madde 11 haklari)
- **Cerez Politikasi:** `/cerez-politikasi` — Cerez turleri tablosu, kategori aciklamalari
- **CookieConsent:** Sticky alt banner, localStorage tercih kaydi, Framer Motion animasyon, "Kabul Et" + "Sadece Zorunlu" butonlari
- **Slug Utility:** `src/lib/utils.ts` — Turkce karakter destekli slugify fonksiyonu
- **Footer:** KVKK ve Cerez Politikasi linkleri eklendi
- TypeScript: 0 hata, Build: basarili (70 route)

## Sprint 5 Tamamlanan Isler (Odeme + PWA + Final Polish)
- **Prisma Schema:** Payment (userId, amount, description, type, status, paymentMethod, transactionId, paidAt), Newsletter (email unique, name, active) modelleri, Event.fee alani
- **Demo Odeme Sistemi:**
  - `/portal/odeme` — Bekleyen odemeler listesi + odeme modal (demo kart formu, 2sn islem simulasyonu, basari animasyonu + islem no)
  - `/portal/odeme/gecmis` — Odeme gecmisi tablosu (filtre: tur, durum)
  - `/api/portal/payments` (GET) + `/api/portal/payments/process` (POST)
  - DEMO UYARISI: Sari banner "Bu bir demo odeme sayfasidir"
  - Aidat odeme → otomatik user.duesStatus guncelleme
- **PWA:**
  - `public/manifest.json` — standalone display, #1a2744 tema
  - `public/icons/icon.svg` — SVG uygulama ikonu
  - `public/sw.js` — Service worker (offline fallback)
  - `ServiceWorkerRegister.tsx` — SW kayit componenti
  - `/offline` — Cevrimdisi sayfa
  - Layout metadata: manifest, themeColor, apple-mobile-web-app-capable
- **Newsletter Sistemi:**
  - `/api/newsletter/subscribe` (POST) — Abone kayit (Zod validasyon, duplike kontrol)
  - `/api/admin/newsletter` (GET/DELETE) — Admin yonetim
  - `/admin/newsletter` — Abone listesi, arama, CSV indirme
  - `NewsletterForm.tsx` — Fonksiyonel form (loading/success/error state'ler)
  - Admin sidebar'a Newsletter menusunu eklendi
- **Bildirim Sistemi:** `NotificationBell.tsx` — Header'da zil ikonu, okunmamis badge, dropdown bildirim listesi (demo verisi)
- **Performans:**
  - `loading.tsx` dosyalari: global, haberler, portal, admin (skeleton animasyonlar)
  - CookieConsent lazy import
- **Error Sayfalari:**
  - `not-found.tsx` — Premium 404 (gradient text, dot pattern, dual CTA)
  - `error.tsx` — Error boundary (reset butonu)
  - `global-error.tsx` — Root error (inline styles, layout bagimsiz)
- **Portal Sidebar:** "Odeme" menusunu eklendi (Wallet ikonu)
- **Aidat Sayfasi:** "Online Ode" butonu aktif (disabled → Link /portal/odeme)
- **Seed Data:** Payment kayitlari (odenmis + bekleyen), Newsletter aboneleri, Event fee
- **DEMO.md:** Manisa Belediyesi sunum rehberi (9 adimli senaryo, 20 dk)
- TypeScript: 0 hata, Build: basarili (77 route)

## PROJE TAMAMLANDI
- **Toplam Route:** 77 (22 statik + 55 dinamik)
- **Toplam Sprint:** 6 (Sprint 1, 2, 2.5, 3, 4, 5)
- **TypeScript:** 0 hata
- **Build:** Basarili
- **Test Kullanicilari:** Admin (admin@cetingungor.org.tr / Admin123!), Uye1 (uye1@test.com / Test1234!), Uye2 (uye2@test.com / Test1234!)

## Animasyon Listesi
- HeroSection: Staggered fade-in-up (0.15s arayla), floating gradient mesh blob'lari
- StatsSection: Count-up (cubic ease-out), hover translateY
- Header: Scroll gecisi (transparent → glassmorphism), dropdown scale+opacity, mobile staggered links
- Footer: Sosyal medya ikon scale
- Kartlar: hover translateY(-4px) + shadow gecisi
- PageHeader: Dot pattern parallax
- CTASection: Floating dekoratif blob'lar
- ScrollToTop: Scale in/out
- AnimatedSection: Scroll-triggered opacity+translateY
- Accordion (Tuzuk): Height auto animasyonu, chevron rotate
- GalleryLightbox: Fade in/out, slide navigasyonu

## Sayfa Listesi (77 route)

### Public Sayfalar
- `/` — Anasayfa (static)
- `/hakkimizda` — Hakkimizda (static)
- `/hakkimizda/yonetim` — Yonetim Kurulu (static)
- `/hakkimizda/tuzuk` — Dernek Tuzugu (static)
- `/hakkimizda/calisma-gruplari` — Calisma Gruplari (static)
- `/haberler` — Haberler listesi (dynamic)
- `/haberler/[slug]` — Haber detay (dynamic)
- `/etkinlikler` — Etkinlikler (static)
- `/etkinlikler/[slug]` — Etkinlik detay (dynamic)
- `/uyeler` — Uye dizini (dynamic)
- `/uyeler/[id]` — Uye detay (dynamic)
- `/yayinlar` — Yayinlar listesi (dynamic)
- `/galeri` — Foto galeri (static)
- `/galeri/[slug]` — Album detay (dynamic)
- `/avantaj-rehberi` — Avantaj rehberi (static)
- `/giris` — Uye giris sayfasi
- `/kayit` — Uye kayit sayfasi (3 adimli wizard)
- `/iletisim` — Iletisim sayfasi (form + harita)
- `/kvkk` — KVKK Aydinlatma Metni (static)
- `/cerez-politikasi` — Cerez Politikasi (static)
- `/offline` — Cevrimdisi sayfa (static)
- `/sitemap.xml` — Dinamik XML sitemap
- `/robots.txt` — Robots dosyasi

### Uye Portali
- `/portal` — Dashboard
- `/portal/profil` — Profil duzenleme
- `/portal/etkinliklerim` — Kayitli etkinlikler
- `/portal/aidat` — Aidat durumu
- `/portal/odeme` — Demo odeme sayfasi
- `/portal/odeme/gecmis` — Odeme gecmisi
- `/portal/belgelerim` — Belgeler
- `/portal/avantajlar` — Uye avantajlari

### Admin Paneli
- `/admin` — Admin dashboard
- `/admin/haberler` — Haber listesi
- `/admin/haberler/yeni` — Yeni haber ekle
- `/admin/haberler/[id]/duzenle` — Haber duzenle
- `/admin/etkinlikler` — Etkinlik listesi
- `/admin/etkinlikler/yeni` — Yeni etkinlik ekle
- `/admin/etkinlikler/[id]/duzenle` — Etkinlik duzenle
- `/admin/uyeler` — Uye listesi
- `/admin/uyeler/[id]` — Uye detay/duzenle
- `/admin/yayinlar` — Yayin yonetimi
- `/admin/galeri` — Galeri yonetimi
- `/admin/yonetim` — Yonetim kurulu yonetimi
- `/admin/avantajlar` — Avantaj yonetimi
- `/admin/mesajlar` — Iletisim mesajlari
- `/admin/newsletter` — Newsletter abone yonetimi
- `/admin/ayarlar` — Site ayarlari

### API Route'lari
- `/api/auth/[...nextauth]` — NextAuth handler (GET/POST)
- `/api/auth/register` — Kullanici kayit (POST)
- `/api/contact` — Iletisim formu (POST)
- `/api/events/register` — Etkinlik kayit (POST)
- `/api/events/unregister` — Etkinlik iptal (POST)
- `/api/portal/profile` — Profil guncelleme (PUT)
- `/api/portal/change-password` — Sifre degistirme (PUT)
- `/api/portal/payments` — Odeme listesi (GET)
- `/api/portal/payments/process` — Demo odeme islemi (POST)
- `/api/newsletter/subscribe` — Newsletter abone (POST)
- `/api/admin/news` — Haber CRUD (POST)
- `/api/admin/news/[id]` — Haber CRUD (GET/PUT/DELETE)
- `/api/admin/events` — Etkinlik CRUD (POST)
- `/api/admin/events/[id]` — Etkinlik CRUD (GET/PUT/DELETE)
- `/api/admin/users` — Uye listesi (GET)
- `/api/admin/users/[id]` — Uye CRUD (GET/PUT)
- `/api/admin/users/[id]/status` — Uye durum toggle (PATCH)
- `/api/admin/publications` — Yayin CRUD (GET/POST)
- `/api/admin/publications/[id]` — Yayin CRUD (PUT/DELETE)
- `/api/admin/gallery` — Galeri CRUD (GET/POST)
- `/api/admin/gallery/[id]` — Album CRUD (GET/PUT/DELETE)
- `/api/admin/gallery/[id]/photos` — Foto CRUD (POST/DELETE)
- `/api/admin/board` — Yonetim kurulu CRUD (GET/POST)
- `/api/admin/board/[id]` — Yonetim kurulu CRUD (PUT/DELETE)
- `/api/admin/advantages` — Avantaj CRUD (GET/POST)
- `/api/admin/advantages/[id]` — Avantaj CRUD (PUT/DELETE)
- `/api/admin/messages` — Mesaj listesi (GET)
- `/api/admin/messages/[id]` — Mesaj islemleri (PATCH/DELETE)
- `/api/admin/newsletter` — Newsletter yonetimi (GET/DELETE)
- `/api/admin/settings` — Site ayarlari (GET/PUT)

## Teknik Notlar
- Prisma 7 `@prisma/adapter-libsql` ile calisir (SQLite icin driver adapter gerekli)
- Prisma client output: `src/generated/prisma`
- DB singleton: `src/lib/db.ts` (adapter ile)
- Tailwind v4: `@theme inline` ile custom properties (eski tailwind.config.js YOK)
- Next.js 16: searchParams page prop'u Promise, await edilmeli
- Font: DM Serif Display + DM Sans, next/font/google ile yuklenir
- NextAuth.js v4: JWT strategy, CredentialsProvider, custom session callbacks (id, role, companyName)
- Auth config: `src/lib/auth.ts`, type extensions: `src/types/next-auth.d.ts`
- Middleware: `src/middleware.ts` — withAuth ile /portal/* ve /admin/* korumasi
- Zod v4: `"zod/v4"` subpath import (dogrudan "zod" degil)
- bcryptjs: Sifre hashleme (salt rounds 12), seed'de hashSync kullanilir
- .env: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- Tiptap: @tiptap/react + starter-kit + extension-image/link/placeholder (RichTextEditor)
- Middleware: withAuth authorized callback ile ADMIN role kontrolu (admin routes)
- Admin API: Tum endpoint'lerde getServerSession + role === "ADMIN" kontrolu
- Slug: `src/lib/utils.ts` slugify — Turkce karakter destegi (ş→s, ç→c, ğ→g, ı→i, ö→o, ü→u)
- SEO: generateMetadata + JSON-LD structured data (Organization, Article, Event, LocalBusiness)
- CookieConsent: localStorage ile "cookie-consent" key, Framer Motion animasyon
- PWA: manifest.json + sw.js + ServiceWorkerRegister + offline sayfa
- Payment: Demo odeme sistemi (gercek islem yok, TXN-xxx islem no uretir)
- Newsletter: Footer form → /api/newsletter/subscribe, admin yonetim + CSV export
- NotificationBell: Header'da demo bildirim dropdown'u (statik veri)

## Kurallar
- Her dosya `npx tsc --noEmit` gecmeli
- Tum metinler Turkce, UTF-8
- Tailwind mobile-first: base=mobile, md:=tablet, lg:=desktop
- Component isimleri PascalCase, route dosyalari kebab-case
- `use client` sadece gerektiginde
- Sprint sonunda bu dosya guncellenir
