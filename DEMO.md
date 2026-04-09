# Demo Sunum Rehberi — Cetin Gungor Dernegi Web Sitesi

> Bu belge, Manisa Belediyesi'ne yapilacak demo sunum icin adim adim rehber niteligindedir.
> Demo URL: http://localhost:3000

---

## Hizli Baslangic

```bash
# Bagimliliklari yukle
npm install

# Veritabanini olustur ve tohum verisini yukle
npx prisma db push
npx prisma db seed

# Gelistirme sunucusunu baslat
npm run dev
```

Tarayicida http://localhost:3000 adresine gidin.

---

## Demo Senaryosu (Tahmini Sure: 20 dakika)

### 1. Anasayfa Turu (3 dk)
- **URL:** `/`
- Gosterilecekler:
  - Hero bolumunu gosterin — animasyonlu giris, gradient blob'lar, CTA butonlari
  - Asagi kaydin → Istatistik sayaclari (count-up animasyonu)
  - Hakkimizda on izleme, son haberler, yaklasan etkinlikler
  - Yonetim kurulu bolumu
  - CTA bolumu + Footer (cok katmanli dalga tasarimi)
  - Newsletter formu: Bir email girin, "Abone Ol" butonuna basin
- **Vurgulanacak:** Premium tasarim, akici animasyonlar, mobil uyumluluk

### 2. Hakkimizda Sayfalari (2 dk)
- **URL:** `/hakkimizda`
- Timeline tarihce gorunumu
- `/hakkimizda/yonetim` → Yonetim kurulu uyeleri
- `/hakkimizda/tuzuk` → Accordion ile tuzuk maddeleri
- `/hakkimizda/calisma-gruplari` → Komisyon detaylari

### 3. Haber Sistemi (2 dk)
- **URL:** `/haberler`
- Kategori filtreleme (SEKTOR, DERNEK, TIMFED, DERNEKLERDEN)
- Bir habere tiklayin → Detay sayfasi
  - Tam icerik, yazar, tarih, goruntuleme sayisi
  - Sosyal medya paylasim butonlari
  - Ilgili haberler bolumu

### 4. Etkinlikler (2 dk)
- **URL:** `/etkinlikler`
- Yaklasan etkinlikler listesi
- Bir etkinlige tiklayin → Detay (tarih, konum, kapasite)
- "Kayit Ol" butonu (giris gerektir — Adim 6'da gosterilecek)

### 5. Diger Sayfalar (2 dk)
- `/uyeler` → Uye dizini, sektor filtreleme, arama
- `/yayinlar` → Yayin listesi (dergi, rapor, bulten)
- `/galeri` → Foto albumleri, lightbox gorunumu
- `/avantaj-rehberi` → Kategorilere gore uye avantajlari
- `/iletisim` → Iletisim formu + harita + bilgiler

### 6. Uyelik Sistemi (3 dk)
- **Kayit:** `/kayit` → 3 adimli wizard gosterin (doldurmak zorunda degilsiniz)
- **Giris:** `/giris` → `uye1@test.com` / `Test1234!` ile giris yapin
- **Portal Dashboard:** `/portal` → Ozet kartlari, hizli erisim
- `/portal/profil` → Profil duzenleme formu
- `/portal/etkinliklerim` → Kayitli etkinlikler
- `/portal/aidat` → Aidat durumu + odeme gecmisi
- **Odeme Demo:** `/portal/odeme` → Demo kart bilgileri ile odeme simulasyonu
  - Sari uyari banneri: "Bu bir demo odeme sayfasidir"
  - Demo kart bilgileri otomatik doldurulur
  - 2 saniyelik islem simulasyonu → Basari mesaji + islem numarasi
- **Etkinlige Kayit:** `/etkinlikler` → Bir etkinlige gidin, "Kayit Ol" butonuna basin

### 7. Admin Paneli (5 dk)
- **Cikis yapin**, ardindan `admin@cetingungor.org.tr` / `Admin123!` ile giris yapin
- **Dashboard:** `/admin`
  - 6 ozet karti (uye, haber, etkinlik, yayin, mesaj sayilari)
  - Son haberler, mesajlar, yaklasan etkinlikler
- **Haber Yonetimi:** `/admin/haberler`
  - "Yeni Haber Ekle" → Zengin metin editoru (Tiptap), otomatik slug
  - Baslik girin, otomatik slug'i gosterin
  - RichTextEditor'u gosterin (bold, italic, baslik, liste, gorsel)
- **Etkinlik Yonetimi:** `/admin/etkinlikler` → Katilimci sayilari, CRUD
- **Uye Yonetimi:** `/admin/uyeler` → Filtreler, aktif/pasif toggle, rol degistirme
- **Mesajlar:** `/admin/mesajlar` → Okunmamis/okunmus ayirimi
- **Site Ayarlari:** `/admin/ayarlar` → Dernek bilgileri + sosyal medya
- **Diger:** Yayinlar, Galeri, Yonetim Kurulu, Avantajlar, Newsletter

### 8. Mobil Gorunum (1 dk)
- Tarayici DevTools ile mobil gorunume gecin (375px genislik)
- Anasayfa → Hamburger menu, staggered animasyonlar
- Portal → Alt navigasyon cubugu
- Admin → Hamburger sidebar

### 9. Teknik Ozellikler (1 dk)
- **SEO:** `/sitemap.xml` → Dinamik sitemap
- **KVKK:** `/kvkk` → Tam Turkce aydinlatma metni
- **Cerez:** Sayfa altindaki cerez onay banneri
- **PWA:** Manifest dosyasi, offline destek
- **Performans:** Sayfa yukleme hizi, skeleton loader'lar

---

## Teknik Ozellikler Ozeti

| Ozellik | Detay |
|---------|-------|
| Framework | Next.js 16 (App Router) |
| Stil | Tailwind CSS v4 |
| Veritabani | Prisma 7 + SQLite (prod'da PostgreSQL) |
| Kimlik Dogrulama | NextAuth.js v4 (JWT) |
| Animasyonlar | Framer Motion |
| Ikonlar | Lucide React |
| Editoru | Tiptap (zengin metin) |
| SEO | Dinamik sitemap, robots.txt, JSON-LD, meta taglar |
| KVKK | Aydinlatma metni + cerez politikasi + onay banneri |
| PWA | manifest.json + service worker + offline sayfa |
| Toplam Route | 80+ (sayfa + API) |
| TypeScript | 0 hata |
| Responsive | Mobile-first (375px → 1440px) |
| Tasarim | "Clean luxury" — premium, kurumsal |

---

## Gelecek Gelistirmeler (Sprint 5+)

Bu demo sitenin uretim ortamina hazirlanmasi icin planlanmis gelistirmeler:

1. **Gercek Odeme Entegrasyonu** — iyzico veya PayTR ile canli odeme
2. **Dosya Yukleme** — Gorsel ve belge yukleme (Vercel Blob veya S3)
3. **Email Bildirimleri** — Kayit onay, aidat hatirlatma, etkinlik bildirimleri
4. **Arama** — Full-text arama (haberler, etkinlikler, uyeler)
5. **Coklu Dil** — Ingilizce destek
6. **Analytics** — Google Analytics / Plausible entegrasyonu
7. **Uretim Veritabani** — PostgreSQL'e gecis
8. **CDN & Gorsel Optimizasyonu** — next/image + Vercel Image Optimization
9. **CI/CD** — Otomatik deploy (Vercel)
10. **Guvenlik Denetimi** — OWASP taramasi, rate limiting guclendirilmesi

---

## Bilinen Sinirlamalar (Demo)

- Gorseller placeholder URL'lerdir, gercek fotograflar eklenmemistir
- Odeme sistemi tamamen demo modundadir, gercek islem yapilmaz
- Email gonderimi aktif degildir (kayit onay, bildirimler)
- Dosya yukleme yoktur (gorsel URL'leri manuel girilir)
- SQLite kullanilmaktadir (uretimde PostgreSQL onerilir)
- Bildirimler statik demo verisidir

---

## Iletisim

**Gelistirici:** [Adiniz]
**Email:** [Email adresiniz]
**Tarih:** Nisan 2026
