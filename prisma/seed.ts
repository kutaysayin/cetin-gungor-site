import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as path from "path";
import { hash } from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL ?? "file:./dev.db";

// Convert relative file path to absolute for @libsql/client compatibility
function resolveLibsqlUrl(url: string): string {
  if (url.startsWith("file:")) {
    const filePart = url.slice("file:".length);
    const absolutePath = path.resolve(filePart);
    return `file:${absolutePath}`;
  }
  return url;
}

const adapter = new PrismaLibSql({ url: resolveLibsqlUrl(DATABASE_URL) });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Tohum verisi yukleniyor...");

  // Mevcut verileri temizle
  await prisma.payment.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.user.deleteMany();
  await prisma.galleryPhoto.deleteMany();
  await prisma.galleryAlbum.deleteMany();
  await prisma.advantage.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.memberCompany.deleteMany();
  await prisma.workGroup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.news.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.siteSettings.deleteMany();

  console.log("Mevcut veriler temizlendi.");

  // 1. Site Ayarlari
  await prisma.siteSettings.create({
    data: {
      name: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
      description:
        "Manisa ve cevresindeki insaat malzemeleri sektoru esnaf ve ticaret erbabinin ortak cikarlari dogrultusunda faaliyet gosteren profesyonel meslek kurulusu.",
      address: "Manisa Organize Sanayi Bolgesi, Manisa",
      phone: "0236 555 12 34",
      email: "info@cetingungor.org.tr",
      socialMedia: JSON.stringify({
        instagram: "https://instagram.com/cetingungormanisa",
        facebook: "https://facebook.com/cetingungormanisa",
        twitter: "https://twitter.com/cetingungormanisa",
        linkedin: "https://linkedin.com/company/cetingungormanisa",
        youtube: "https://youtube.com/@cetingungormanisa",
      }),
    },
  });

  console.log("Site ayarlari olusturuldu.");

  // 2. Yonetim Kurulu Uyeleri
  const boardMembers = [
    {
      name: "Cetin Gungor",
      title: "Baskan",
      company: "Gungor Yapi Malzemeleri",
      bio: "Manisa insaat malzemeleri sektorunde 25 yili askin deneyimiyle faaliyet gosteren Cetin Gungor, 2020 yilindan bu yana dernek baskanligini yuruten bir lider olarak sektore onemli katkilar sunmaktadir. Gungor Yapi Malzemeleri'nin kurucusu ve yonetim kurulu baskani olarak sektorun gelisimi, esnaf haklarinin korunmasi ve dernegimizin kurumsallasma surecinde belirleyici roller ustlenmistir. Sanayi Odasi ve TIMFED nezdinde aktif temsilcilik gorevlerini surduren Gungor, Manisa'nin yapi sektoru ekosisteminin guclenmesi icin kesintisiz caba gostermektedir.",
      order: 0,
      period: "2024-2028",
      active: true,
    },
    {
      name: "Ali Yilmaz",
      title: "Baskan Yardimcisi",
      company: "Yilmaz Insaat",
      bio: "Yilmaz Insaat'in sahibi Ali Yilmaz, 18 yildir insaat malzemeleri ve satis sektorunde aktif olarak calismaktadir. Dernekte baskan yardimcisi gorevini ustlenen Yilmaz, ozellikle uye iliskileri, fuarlar ve sektore yeni giren isletmelerin yonlendirilmesi konularinda onemli gorevler ifa etmektedir. Ayrica Ege Bolge Insaat Malzemecileri platformunda Manisa temsilcisi olarak dernegi temsil etmektedir.",
      order: 1,
      period: "2024-2028",
      active: true,
    },
    {
      name: "Mehmet Demir",
      title: "Genel Sekreter",
      company: "Demir Yapi Market",
      bio: "Demir Yapi Market'in uc nesil surdurulen aile isletmesinin basinda bulunan Mehmet Demir, dernegimizin idari ve kurumsal hafizasinin onemli bir parcasidir. Genel sekreter sifatiyla yonetim kurulu kararlarinin kayit altina alinmasi, resmi yazismalar ve uye kayit islemlerinin duzenlenmesinde kritik bir rol ustlenmektedir. Manisa Ticaret ve Sanayi Odasi ile koordinasyonu saglayan Demir, sektorel diyalogun guclendirilmesine buyuk katki sunmaktadir.",
      order: 2,
      period: "2024-2028",
      active: true,
    },
    {
      name: "Ayse Kaya",
      title: "Sayman",
      company: "Kaya Ticaret",
      bio: "Mali musavirlik altyapisina sahip Ayse Kaya, Kaya Ticaret'in genel mudurlugunu ustlenmekte olup dernegimizin mali islerini titizlikle yonetmektedir. Sayman olarak butce planlama, gelir-gider takibi ve mali raporlama konularinda profesyonel bir yaklasim sergilemektedir. Kaya, kadin girisimcilerin sektordeki gorunurlugunun arttirilmasina yonelik calismalar yuruterek gencler icin mentorluk programlari duzenlenmesine de on ayak olmaktadir.",
      order: 3,
      period: "2024-2028",
      active: true,
    },
    {
      name: "Hasan Celik",
      title: "Uye",
      company: "Celik Malzeme",
      bio: "Celik Malzeme'nin kurucusu Hasan Celik, bolgede demir-celik ve yapi malzemeleri ticaretinde 20 yili askin bir kariyere sahiptir. Yonetim kurulu uyesi sifatiyla ozellikle teknik komiteler, mevzuat takibi ve sektorde standardizasyon calismalarinda aktif rol oynamaktadir. Uye dernekle iliskiler komitesinde de gorev yapan Celik, sektorun ulusal ve uluslararasi platformlarda temsili konusunda degerli katkilar saglamaktadir.",
      order: 4,
      period: "2024-2028",
      active: true,
    },
  ];

  for (const member of boardMembers) {
    await prisma.boardMember.create({ data: member });
  }

  console.log("Yonetim kurulu uyeleri olusturuldu.");

  // Tarihler icin yardimci
  const now = new Date("2026-04-09");
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  // 3. Haberler
  const newsItems = [
    // SEKTOR haberleri (4 adet)
    {
      title: "2026 Yili Insaat Malzemeleri Fiyat Endeksi Aciklandi",
      slug: "2026-insaat-malzemeleri-fiyat-endeksi-aciklandi",
      category: "SEKTOR",
      featured: true,
      publishedAt: daysAgo(5),
      authorName: "Sektör Masası",
      excerpt:
        "Turkiye Insaat Malzemeleri Sanayicileri Dernegi, 2026 yili ilk ceyrek fiyat endeksini acikladi. Demir-celik ve cimento fiyatlarinda belirgin artislar goze carpiyor.",
      content: `Turkiye Insaat Malzemeleri Sanayicileri Dernegi (TIMSAD) tarafindan yayimlanan 2026 yili ilk ceyrek fiyat endeksine gore, temel yapi malzemelerinde bir onceki yilin ayni donemine kiyasla yuzde on uc ile yuzde yirmi uc arasinda degisen oranlarda fiyat artisi yasanmistir. En yuksek artis, insaat demiri ve lamine cati malzemelerinde gozlemlenirken cimento ve tugla fiyatlarindaki yukselis gorece sinirli kalmistir.

Raporda belirtilen temel nedenlerin basinda enerji maliyetlerindeki artis, doviz kurundaki dalgalanmalar ve ham madde teminindeki aksakliklar gelmektedir. Uzmanlar, ikinci ceyrekte de benzer bir seyrin devam edebilecegini ifade ederken sektorel talep canlanmasinin fiyatlar uzerindeki baskiyi daha da arttirabilecegi uyarisinda bulunmaktadir.

Manisa Insaat Malzemecileri Dernegi olarak, uyelerimizi bu gelismeler hakkinda bilgilendirmek ve ortaya cikan zorluklarla birlikte bas etme stratejileri gelistirmek icin yakin zamanda ozel bir panel duzenleyecegiz. Uye isletmelerimizin fiyat politikalari ve stok yonetimi konusunda destek talep etmeleri halinde teknik ekibimiz hazir bulunmaktadir.`,
    },
    {
      title: "Cephe Sistemlerinde Yeni Yangin Guvenligi Yonetmeligi Yururluge Girdi",
      slug: "cephe-sistemleri-yangin-guvenligi-yonetmeligi",
      category: "SEKTOR",
      featured: false,
      publishedAt: daysAgo(18),
      authorName: "Mevzuat Birimi",
      excerpt:
        "Bayindirlik ve Iskân Bakanligi tarafindan hazirlanan yeni yangin guvenligi yonetmeligi, dis cephe ve yalitim malzemeleri uretici ve saticilarini dogrudan etkiliyor.",
      content: `Bayindirlik ve Iskân Bakanligi'nin yayimladigi yeni yangin guvenligi yonetmeligi, 1 Nisan 2026 tarihi itibarilyle yururluge girerek cephe kaplama ve isi yalitim malzemeleri sektorunde onemli degisikliklere yol acmaktadir. Yonetmelik kapsaminda; bina dis cephelerinde kullanilacak malzemelerin en az A1 ya da A2 yangina dayaniklilik sinifina sahip olmasi zorunlu kilinmis, C sinifi veya altindaki malzemelerin kullanimi yurt genelinde yasaklanmistir.

Uygulamayi denetlemekle yukumlu olan belediye fen isleri mudurluklerinin ve yapi denetim kuruluslarinin net bir program cercevesinde harekete gecmesi beklenmekte olup, sertifikasyon surecleri de hizlandirilmaktadir. Uyumsuz malzemelerin piyasadan cekilmesi asamasinda isletmeler, mevcut stoklarini nakde donusturmek ya da urun yelpazelerini hizla guncellemek durumunda kalacaklar.

Manisa Insaat Malzemecileri Dernegi, bu yonetmeligi derin bir dikkatle incelemekte; uye isletmelerin compliance (uyum) sureclerinde aksaksiz destek alabilmesi icin bir danismanlik protokolu gelistirmektedir. Detayli bilgilendirme ve sorulariniz icin dernek sekreterligimizle iletisime gecmenizi oneririz.`,
    },
    {
      title: "Ege Bolgesi Insaat Sektoru 2025 Yilini Buyume ile Kapatti",
      slug: "ege-bolgesi-insaat-sektoru-2025-yili-degerlendirme",
      category: "SEKTOR",
      featured: false,
      publishedAt: daysAgo(35),
      authorName: "Arastirma Birimi",
      excerpt:
        "TurkStat verilerine gore Ege Bolgesi insaat sektoru 2025 yilinda yuzde sekiz buyume kaydetti. Manisa ili bu performansin onde gelen katkilayicilari arasinda yer aldi.",
      content: `Turkiye Istatistik Kurumu'nun (TurkStat) 2025 yili sonu verilerine gore, Ege Bolgesi insaat sektoru bir onceki yila kiyasla yuzde sekiz buyume kaydetmistir. Bu oran, ulke ortalamasinin belirgin bicimde uzerinde olup bolgenin sanayi ve konut yatirimlarindaki guclenmesini yansitiyor. Manisa ilindeki organize sanayi bolgeleri genislemesi ve kentsel donusum projeleri, bu buyumeye onemli katki saglamistir.

Raporun dikkat ceken bulgulari arasinda insaat ruhsatlarindaki artis, yabanci sermayeli projelerin bolgeye cekimi ve kamu alt yapi yatirimlarinin ivmelenmesi yer almaktadir. Manisa Buyuksehir Belediyesi'nin son bic yilda hayata gecirdigi projeler, insaat malzemeleri piyasasina onemli bir canlilik kazandirmistir.

Dernegimiz bu gelismelerin uye isletmelerimize surekli kaynak olarak yansimasi icin Manisa Buyuksehir Belediyesi Imar ve Sehircilik Dairesi ile aktif diyalog icindedir. Bolgesel buyume trendi, yakın vadede yapi malzemeleri talebinin artmasini destekleyecek gozukmektedir.`,
    },
    {
      title: "Deprem Yonetmeligi Kapsaminda Yapi Malzemelerinde Zorunlu Sertifikasyon Genisledi",
      slug: "deprem-yonetmeligi-zorunlu-sertifikasyon",
      category: "SEKTOR",
      featured: true,
      publishedAt: daysAgo(52),
      authorName: "Teknik Komite",
      excerpt:
        "Guncellenen deprem yonetmeligi uyarinca kolon, kiriş ve temel sistemleri icin kullanilan malzemelerin zorunlu TSE sertifikasyonu kapsamina alinmasi sektorde yeni duzenlemeler gerektiriyor.",
      content: `Afet ve Acil Durum Yonetimi Baskanligi (AFAD) ve Cevre, Sehircilik ve Iklim Degisikligi Bakanligi'nin ortaklasa hazirlanan guncel deprem yonetmeliginin yapi malzemeleri sertifikasyonuna iliskin eki 15 Subat 2026 tarihinde Resmi Gazete'de yayimlanarak yururluge girdi. Buna gore kolon, kiriş ve temel yapilarinda kullanilan beton, celik ve ankraj malzemeleri TSE zorunlu belgelendirme kapsamina alinmistir.

Yonetmelikteki degisiklikler, bayii ve distributorlerin envanter yonetimine de dogrudan etki etmektedir. Belgesiz malzeme satisi yapan isletmelere uygulanacak idari para cezalari ile satis durdurma yaptirimlari ciddi boyutlara ulasmaktadir. Sektor aktörleri, bu surecin gecis doneminin asil zorlugu olacagini vurgulamaktadir.

Dernek olarak Mevzuat Komisyonumuz bu duzenlemelere iliskin kapsamli bir kiyaslama rehberi hazirlamis olup uye isletmelerimize dagitilmak uzere baski surecindedir. Belgelendirme konusundaki destek ve sorulariniz icin komisyon baskaniniz Hasan Celik ile dogrudan iletisime gecebilirsiniz.`,
    },

    // DERNEK haberleri (4 adet)
    {
      title: "Olagan Genel Kurul Toplantisi Basariyla Tamamlandi",
      slug: "olagan-genel-kurul-toplantisi-tamamlandi",
      category: "DERNEK",
      featured: true,
      publishedAt: daysAgo(10),
      authorName: "Dernek Sekreterya",
      excerpt:
        "Manisa Insaat Malzemecileri Dernegi'nin 2026 yili olagan genel kurulu gerceklestirildi. Toplantida mali tablo onaylandi, yeni donem hedefleri belirlendi.",
      content: `Manisa Insaat Malzemecileri Dernegi'nin 2026 yili Olagan Genel Kurul Toplantisi, 5 Nisan 2026 Pazar gunu Manisa Buyuksehir Belediyesi Konferans Salonu'nda 87 uye isletme temsilcisinin katilimiyla gerceklestirildi. Toplantida 2025 yili faaliyet raporu ve mali tablolar oybirligiyle kabul edildi.

Yonetim Kurulu Baskani Cetin Gungor, acilis konusmasinda dernegimizin 2025 yilinda kazandigi yeni uyeleri, gerceklestirilen egitim ve fuarcilik faaliyetlerini ve TIMFED nezdinde sagladigimiz temsil basarisini vurguladi. 2026-2028 donemi icin hazirlanan stratejik plan da uyelerin onayina sunuldu ve kabul gordu.

Toplantinin gundem disinda kalan serbest konusma bolumunde uyeler, fiyat artislari, mevzuat uyum sureleri ve genc girisimci destegi konularinda oneri ve goruslerini paylasarak aktif bir katilim sergiled. Bir sonraki olaganustu genel kurul gerektigi takdirde uc ay icinde yapilacagi da duyuruldu.`,
    },
    {
      name: "Yonetim Kurulu Yillik Butce ve Faaliyet Planini Onayladi",
      title: "Yonetim Kurulu Yillik Butce ve Faaliyet Planini Onayladi",
      slug: "yonetim-kurulu-butce-faaliyet-plan-2026",
      category: "DERNEK",
      featured: false,
      publishedAt: daysAgo(22),
      authorName: "Dernek Sekreterya",
      excerpt:
        "Mart 2026 yonetim kurulu toplantisinda 2026 yili butcesi ve faaliyet plani onaylandi. Egitim, fuarcilik ve dijital donusum odakli yatirimlar on plana cikti.",
      content: `Manisa Insaat Malzemecileri Dernegi Yonetim Kurulu'nun Mart 2026 olaganustü toplantisinda 2026 yili butcesi ve faaliyet plani oybirligiyle kabul edildi. Toplam butcenin yuzde kirkbes'i egitim faaliyetleri ve kapasite gelistirme programlarina, yuzde yirmisi fuar organizasyonlari ve katilimlarina, yuzde on besi dijital altyapi yatirimina ve kalan bolumu operasyonel giderlere ayrildi.

Baskan Cetin Gungor, onaylanan planin Manisa sektorunun ulusal gundeme tasinmasinda etkili bir arac olacagini belirterek yeni doneme iliskin iyimserligi yansitan bir konusma yapti. Sayman Ayse Kaya ise butce kalemi detaylarini ve tasarrufu on gorulen harcamalari kurula aktarirken mali disiplinin her asamada korunmasi gerektigini vurguladi.

Faaliyet planinin onemli maddelerinden birini olusturan dijital uye portali projesinin Haziran 2026'ya kadar tamamlanmasi planlanmaktadir. Ayrica genclik komisyonu kurulmasina yonelik on calismalarin baslatilmasi da kabul edilen maddeler arasinda yer aldi.`,
    },
    {
      title: "Dernek Uyelerine Yonetim Becerisi ve Muhasebe Egitimi Verildi",
      slug: "uyelere-yonetim-muhasebe-egitimi",
      category: "DERNEK",
      featured: false,
      publishedAt: daysAgo(48),
      authorName: "Egitim Komisyonu",
      excerpt:
        "Egitim Komisyonu tarafindan duzenlenen isletme yonetimi ve on muhasebe egitimi programina 34 uye isletme temsilcisi katildi.",
      content: `Manisa Insaat Malzemecileri Dernegi Egitim Komisyonu'nun organizasyonuyla duzenlenen iki gunluk isletme yonetimi ve on muhasebe egitimi, 10-11 Subat 2026 tarihlerinde Manisa Ticaret ve Sanayi Odasi toplanti salonunda gerceklestirildi. Programa 34 uye isletme sahibi ve yoneticisi katildi.

Egitimin ilk gunu, temel finans okur-yazarligina iliskin calistiray ile stok yonetimi ilkeleri uzerine yogunlasirken ikinci gun dijital muhasebe yazilimlari ve e-belge sistemleri konulari islendi. Egitmen olarak gorev yapan Serbest Mali Musavir Ozlem Sahin, buyuk bir ilgiyle karsilanan sunumlarinda sektore ozel pratik uygulamalara genis yer verdi.

Egitim sonucunda hazirlanan geri bildirim formlarinda katilimcilar yuzde doksanbeslik bir memnuniyet orani kaydetmis ve bunun gibi etkinliklerin yil boyunca daha sik duzenlenmesi talep edilmistir. Egitim Komisyonu, bir sonraki programi Mayis 2026 icin daha genis bir kapsam ve katilimciyla planlamaktadir.`,
    },
    {
      title: "Uye Isletme Ziyaret Programi Tamamlandi: Saha Gozlemleri Raporlandi",
      slug: "uye-isletme-ziyaret-programi-tamamlandi",
      category: "DERNEK",
      featured: false,
      publishedAt: daysAgo(70),
      authorName: "Ali Yilmaz",
      excerpt:
        "Baskan Yardimcisi Ali Yilmaz liderligindeki heyet, Ocak ayinda 20 uye isletmeyi ziyaret ederek saha gozlemlerini tamamladi. Raporun temel bulgulari paylasiliyor.",
      content: `Dernek Baskan Yardimcisi Ali Yilmaz ve iki yonetim kurulu uye esligindeki heyet, Ocak 2026 boyunca 20 uye isletmeyi yerinde ziyaret etti. Programin amaci, uyelerin guncel sorunlarini dogrudan sahada tespit etmek ve stratejik plan icin somut veri toplamaktir.

Ziyaret raporuna gore isletmelerin basli sorunlari; artan kira maliyetleri, nitelikli eleman teminindeki gucluklер ve tedarik sureclerindeki belirsizlikler olarak siralanmaktadir. Ozellikle KOBi desteklerine erisimde bürokratik engellerden yakinan isletme sahipleri, dernekten lobi ve aracilık destegi talep etmistir.

Ziyaret bulgulari yonetim kuruluna sunulmus olup bu bulgular isiginда egitim programi icerikleri revize edilmis ve yeni bir uye destek hatti olusturulmustur. Ziyaret programinin yillik periyodik bir uygulama olarak surdurulebilmesi icin gereken kaynaklar butcede ayrilmistir.`,
    },

    // TIMFED haberleri (2 adet)
    {
      title: "TIMFED 2026 Olaganüstü Genel Kurulu Ankara'da Yapildi",
      slug: "timfed-2026-olaganustu-genel-kurulu",
      category: "TIMFED",
      featured: true,
      publishedAt: daysAgo(14),
      authorName: "TIMFED Haber Merkezi",
      excerpt:
        "Turkiye Insaat Malzemecileri Federasyonu'nun olaganustu genel kurulunda sektore iliskin kritik kararlar alindi. Manisa Dernegi de bu toplantida temsil edildi.",
      content: `Turkiye Insaat Malzemecileri Federasyonu (TIMFED), 28 Mart 2026 tarihinde Ankara Kongre Merkezi'nde olaganustu genel kurul toplantisi duzenleddi. Yurt genelinden 38 uye dernegin temsilcilerinin katildigi toplantida federasyonun 2026-2028 stratejik plani ve butcesi oylandi. Manisa Insaat Malzemecileri Dernegi'ni Baskan Cetin Gungor temsil etti.

Toplantinin en kritik gundemi, son iki yilda yasanan fiyat artislarina ve KOBi'lerin hammadde teminindeki zorlуklara karsi federasyon duzeyi ortak savunuculuk stratejisinin sekillenmesiydi. Alinan kararlar arasinda Hazine ve Maliye Bakanligi ile gorusme talebinde bulunulmasi, KOSGEB destek paketlerinin guncellenmesi icin ortak bildiri hazirlanmasi ve bolgesel federasyon temsilciliklerinin guclendirilmesi yer aldi.

Manisa Dernegi bu sure icinde sunulan tekliflerin bircoguna destek vermis ve Ege Bolgesi'nin ozel kosullarini vurgulayan ek bir mutabakat notu toplantiya sunmustur. Federasyon kararlari yakin zamanda uye derneklere resmi yazismayla iletilecektir.`,
    },
    {
      title: "TIMFED Sektor Raporu: Turkiye Insaat Malzemeleri Ihracati Yuzde On Bes Artti",
      slug: "timfed-sektor-raporu-insaat-ihracat-artisi",
      category: "TIMFED",
      featured: false,
      publishedAt: daysAgo(42),
      authorName: "TIMFED Arastirma Birimi",
      excerpt:
        "TIMFED'in 2025 yili ihracat raporuna gore Turkiye insaat malzemeleri ihracati 8,4 milyar dolara ulasarak yuzde on bes artis kaydetti.",
      content: `Turkiye Insaat Malzemecileri Federasyonu (TIMFED) tarafindan yayimlanan 2025 yili ihracat raporuna gore, Turkiye'nin insaat malzemeleri sektorü ihracati bir onceki yila kiyasla yuzde on bes artisla 8,4 milyar dolara ulasмistir. En yuksek ihracat payi seramik kaplamalar, cam sistemleri ve saniter urunlerde gerceklesmistir.

Raporda Orta Asya, Orta Dogu ve Afrika pazarlarinin Turkiye kokenli yapi malzemeleri icin en dinamik talebi olusturan bolgeler oldugu vurgulanmaktadir. AB ulkeleri de ozellikle surdurulebilir bina malzemeleri ve yalitim sistemleri alaninda dikkat ceken alimlar yapmistir.

TIMFED Genel Baskani, ihracat alanindaki bu basarinin sureклiligini saglamak icin uretici-ihracatci-bayi zincirindeki is birliginin kritik oneme sahip oldugunu vurgulamiştir. Dernegimiz, uye isletmelere ihracata yonelik destek programlari ve Ticaret Bakanligi ihracat tesvikleri hakkinda bilgi sunmeye hazirdir.`,
    },

    // DERNEKLERDEN haberleri (2 adet)
    {
      title: "Izmir Yapi Malzemecileri Dernegi ile Kardes Dernek Protokolu Imzalandi",
      slug: "izmir-yapi-malzemecileri-kardes-dernek-protokolu",
      category: "DERNEKLERDEN",
      featured: false,
      publishedAt: daysAgo(28),
      authorName: "Dernek Sekreterya",
      excerpt:
        "Manisa ve Izmir insaat malzemecileri dernekleri arasinda is birligi ve kardes dernek protokolu imzalandi. Ortak egitim ve fuar projeleri hayata gecirilecek.",
      content: `Manisa Insaat Malzemecileri Dernegi ile Izmir Yapi Malzemecileri ve Esnafi Dernegi arasinda 20 Mart 2026 tarihinde bir is birligi ve kardes dernek protokolu imzalandi. Izmir'deki Buyuk Efes Oteli'nde gerceklestirilen imza toreninе her iki dernekten yonetim kurulu uyeleri katildi.

Protokol cercevesinde iki dernek; ortak fuarcilik projeleri, egitim programlari, hukuki ve mevzuat bilgi paylasimdı ile genc girisimci destegi konularında yillik en az iki ortak etkinlik duzenlemeyi taahhut etmistir. Ayrica her iki dernegin uye isletmelerine karsilikli ziyaret ve is birligi firsatlari saglanacaktir.

Manisa Dernegi Baskani Cetin Gungor, kardes dernek protokolunun iki kentin ekonomik dinamiklerini birbiriyle butunlestirme yolunda onemli bir adim oldugunu belirtti. Ilk ortak fuar projesinin Eylul 2026'da hayata gecirilmesi planlanmaktadir.`,
    },
    {
      title: "Ankara Insaat Malzemecileri Dernegi'nin Dijital Donusum Deneyimi Paylasimi",
      slug: "ankara-insaat-dijital-donusum-deneyimi",
      category: "DERNEKLERDEN",
      featured: false,
      publishedAt: daysAgo(60),
      authorName: "Arastirma Birimi",
      excerpt:
        "Ankara Insaat Malzemecileri Dernegi'nin uye isletmelere yonelik dijital donusum programindan elde etтigi deneyimler ve basari hikayeleri Manisa Dernegi ile paylasіldi.",
      content: `Ankara Insaat Malzemecileri Dernegi Baskani Ahmet Ozturk ve teknoloji danismanlari, 15 Subat 2026 tarihinde bir ziyaret programi kapsaminda Manisa'ya gelerek uye isletmelerin dijital donusum sureclеrine iliskin deneyimlerini paylasti. Sunus ve soru-cevap formatinda yurутulen etkinlige 28 uye isletme temsilcisi katildi.

Ankara Dernegi'nin iki yil once basladigi dijital donusum programinda isletmelerin e-ticaret platformlarina entegrasyonu, dijital stok takip sistemleri ve musteгi iliskileri yonetimi yazilimlarinin benimsenmesi gerceklestirilmis; bu uygulamalarin uye isletmelerin cirosuna yillik ortalama yuzde yirmi ilа otuz arasinda net katki sagladigi aktarilmistir.

Manisa Dernegi bu deneyimlerden yola cikarak kendi dijital donusum programini 2026 yili ikinci yarisi icin gundemine almistir. Egitim Komisyonu, Ankara Dernegi ile is birligi icinde hazırlanacak bir pilot proje modeli uzerinde calismalarini surdurmektedir.`,
    },
  ] as const;

  for (const item of newsItems) {
    await prisma.news.create({
      data: {
        title: item.title,
        slug: item.slug,
        category: item.category,
        featured: item.featured,
        publishedAt: item.publishedAt,
        authorName: item.authorName,
        excerpt: item.excerpt,
        content: item.content,
      },
    });
  }

  console.log("Haberler olusturuldu.");

  // 4. Etkinlikler
  const events = [
    {
      title: "2026-2027 Donemi Olagan Genel Kurul Toplantisi",
      slug: "2026-2027-donemi-genel-kurul-toplantisi",
      description:
        "Manisa Insaat Malzemecileri Dernegi'nin 2026-2027 donemi olagan genel kurul toplantisi. Toplantida yonetim kurulu faaliyet raporu, mali tablo denetim raporu ve 2027 yili butce taslagi oylanacaktir. Tum uye isletme temsilcilerinin katilimi beklenmektedir. Toplantida dernek icerigine iliskin onerilerin sunulabilmesi icin onerilerin en gec toplanti tarihinden on gun once sekreterlige bildirilmesi gerekmektedir.",
      date: new Date("2026-06-15T10:00:00"),
      endDate: new Date("2026-06-15T13:00:00"),
      location: "Manisa Buyuksehir Belediyesi Konferans Salonu, Manisa",
      capacity: 150,
    },
    {
      title: "Sektor Bulusma Etkinligi: Yapi Malzemeleri ve Gelecek",
      slug: "sektor-bulusma-etkinligi-yapi-malzemeleri-gelecek",
      description:
        "Ege Bolgesi insaat malzemeleri sektorunun lider temsilcilerini bir araya getiren bu etkinlikte guncel piyasa egilimleri, surdurulebilir malzeme trendleri ve dijital ticaret firsatlari ele alinacaktir. Izmir, Aydin ve Mugla derneklerinin temsilcilerinin de katilmasi beklenen etkinlikte panel oturumlari, urun tanitim alanlari ve networking bolumu yer alacaktir. Erken kayit firsatini kacirmayin.",
      date: new Date("2026-07-22T09:00:00"),
      endDate: new Date("2026-07-22T18:00:00"),
      location: "Manisa Buyuksehir Belediyesi Kulturpark Acikhava Sahnesi, Manisa",
      capacity: 300,
    },
    {
      title: "TIMFED Ege Bolgesi Temsilciler Toplantisi",
      slug: "timfed-ege-bolgesi-temsilciler-toplantisi",
      description:
        "Turkiye Insaat Malzemecileri Federasyonu'nun Ege Bolgesi temsilcilerini bulusturan bu ceyreklik toplantida federasyon stratejik plani guncellemesi, bolgesel piyasa verileri ve yasal mevzuat degisikliklerinin bolgedeki etkileri tartisılacaktir. Manisa Insaat Malzemecileri Dernegi ev sahibi dernegimiz sifatiyla toplantiya katkilarini sunacaktir. Toplantiya katilim, yonetim kurulu uyelerini ve komisyon baskanlarini kapsamaktadir.",
      date: new Date("2026-09-10T10:30:00"),
      endDate: new Date("2026-09-10T16:00:00"),
      location: "Manisa Ticaret ve Sanayi Odasi Toplanti Salonu, Manisa",
      capacity: 80,
      fee: 500,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log("Etkinlikler olusturuldu.");

  // 5. Calisma Gruplari
  const workGroups = [
    {
      name: "Egitim Komisyonu",
      description:
        "Uye isletme calisanlarinin mesleki gelisimini desteklemek amaciyla egitim programlari, seminerler ve sertifikasyon sureclerini planlayan ve yuruten komisyon. Komisyon, yilda en az dort egitim etkinligi duzenlemekte; icerik konusunda akademik kurumlar ve sertifikasyon organlariyla is birligi yapmaktadir.",
      members: JSON.stringify([
        "Ayse Kaya",
        "Fatma Arslan",
        "Ibrahim Sahin",
        "Zeynep Yildirim",
        "Murat Ozkan",
      ]),
      order: 0,
    },
    {
      name: "Fuarlar Komisyonu",
      description:
        "Yurt ici ve yurt disi fuar katilimlarini organize eden, dernek uyelerinin kolektif fuar organizasyonlarindan maksimum fayda saglamasini destekleyen komisyon. Komisyon, CNR Expo, WIN Istanbul ve bolgesel fuar takvimlerini takip ederek uye isletmelerin katilimini koordine etmektedir.",
      members: JSON.stringify([
        "Ali Yilmaz",
        "Serkan Demir",
        "Nurcan Koc",
        "Burak Yildiz",
      ]),
      order: 1,
    },
    {
      name: "Mevzuat Komisyonu",
      description:
        "Insaat malzemeleri sektorunu etkileyen yasal duzenleme, yonetmelik degisiklikleri ve standart guncellemelerini takip eden ve uye isletmelere zamaninda bilgi saglayan komisyon. Komisyon, Ticaret Bakanligi, TSE ve ilgili resmi kuruluslarla surekli iletisim icinde bulunmaktadir.",
      members: JSON.stringify([
        "Hasan Celik",
        "Leyla Aktas",
        "Mustafa Karaca",
        "Emre Bulut",
        "Senem Yilmaz",
      ]),
      order: 2,
    },
    {
      name: "Sosyal Sorumluluk Komisyonu",
      description:
        "Dernegimizin toplumsal etki alanini genisleten sosyal sorumluluk projeleri, cevre duyarliligi girisimleri ve toplumla butunlesme calismalarini koordine eden komisyon. Komisyon; okul destegi, meslek lisesi iş birlikleri ve cevre bilinci kampanyalari gibi projeleri hayata gecirmektedir.",
      members: JSON.stringify([
        "Mehmet Demir",
        "Selin Kaya",
        "Omer Polat",
        "Gamze Arslan",
      ]),
      order: 3,
    },
  ];

  for (const wg of workGroups) {
    await prisma.workGroup.create({ data: wg });
  }

  console.log("Calisma gruplari olusturuldu.");

  // 6. Uye Sirketler
  const memberCompanies = [
    // Seramik & Fayans (4)
    {
      name: "Ege Seramik Market",
      owner: "Bulent Ozturk",
      sector: "Seramik & Fayans",
      address: "Yunusemre Mahallesi, Ataturk Caddesi No:45, Yunusemre / Manisa",
      phone: "0236 231 44 10",
      email: "info@egeseramik.com.tr",
      website: "https://www.egeseramik.com.tr",
      active: true,
    },
    {
      name: "Manisa Fayans Dunyasi",
      owner: "Recep Kaplan",
      sector: "Seramik & Fayans",
      address: "Sehzadeler Mahallesi, Izmir Caddesi No:78, Sehzadeler / Manisa",
      phone: "0236 234 15 62",
      email: "info@manisafayans.com.tr",
      active: true,
    },
    {
      name: "Ozturk Seramik",
      owner: "Hikmet Ozturk",
      sector: "Seramik & Fayans",
      address: "Cumhuriyet Mahallesi, Kazim Karabekir Caddesi No:12, Turgutlu / Manisa",
      phone: "0236 312 88 20",
      email: "info@ozturkseramik.com.tr",
      website: "https://www.ozturkseramik.com.tr",
      active: true,
    },
    {
      name: "Sehzade Kaplama",
      owner: "Tayfun Arslan",
      sector: "Seramik & Fayans",
      address: "Yeni Mahalle, Ege Caddesi No:33, Akhisar / Manisa",
      phone: "0236 418 07 55",
      email: "info@sehzadekaplama.com.tr",
      active: true,
    },
    // Boya & Yalitim (3)
    {
      name: "Renk Dunyasi Boya",
      owner: "Serdar Polat",
      sector: "Boya & Yalitim",
      address: "Barbaros Mahallesi, Cumhuriyet Bulvari No:91, Yunusemre / Manisa",
      phone: "0236 233 60 41",
      email: "info@renkdunyasi.com.tr",
      website: "https://www.renkdunyasi.com.tr",
      active: true,
    },
    {
      name: "Yildirim Yalitim Sistemleri",
      owner: "Fatih Yildirim",
      sector: "Boya & Yalitim",
      address: "Emre Mahallesi, Sanayii Caddesi No:22, Salihli / Manisa",
      phone: "0236 715 33 80",
      email: "info@yildirimyalitim.com.tr",
      active: true,
    },
    {
      name: "Manisa Boya Merkezi",
      owner: "Gulsen Akdeniz",
      sector: "Boya & Yalitim",
      address: "Sehzadeler Mahallesi, Dogancilar Caddesi No:5, Sehzadeler / Manisa",
      phone: "0236 236 19 73",
      email: "info@manisaboyamerkezi.com.tr",
      active: true,
    },
    // Tesisat & Isitma (4)
    {
      name: "Aksu Tesisat",
      owner: "Orhan Aksu",
      sector: "Tesisat & Isitma",
      address: "Organize Sanayi Bolgesi, 3. Cadde No:14, Yunusemre / Manisa",
      phone: "0236 239 50 04",
      email: "info@aksutesisat.com.tr",
      website: "https://www.aksutesisat.com.tr",
      active: true,
    },
    {
      name: "Merkez Isitma Sistemleri",
      owner: "Cengiz Turan",
      sector: "Tesisat & Isitma",
      address: "Sahintepe Mahallesi, Izmir Caddesi No:100, Sehzadeler / Manisa",
      phone: "0236 235 77 18",
      email: "info@merkezisitma.com.tr",
      active: true,
    },
    {
      name: "Gungor Tesisat",
      owner: "Sinan Gungor",
      sector: "Tesisat & Isitma",
      address: "Atatürk Mahallesi, Bahar Sokak No:8, Turgutlu / Manisa",
      phone: "0236 313 24 66",
      email: "info@gungortesisat.com.tr",
      active: true,
    },
    {
      name: "Ege Kombi",
      owner: "Suleyman Cakir",
      sector: "Tesisat & Isitma",
      address: "Yeni Sanayi Sitesi, 5. Blok No:18, Akhisar / Manisa",
      phone: "0236 414 92 37",
      email: "info@egekombi.com.tr",
      website: "https://www.egekombi.com.tr",
      active: true,
    },
    // Elektrik & Aydinlatma (3)
    {
      name: "Volt Elektrik",
      owner: "Emre Kocak",
      sector: "Elektrik & Aydinlatma",
      address: "Kucuk Sanayi Sitesi, B Blok No:31, Yunusemre / Manisa",
      phone: "0236 232 41 58",
      email: "info@voltlektrik.com.tr",
      active: true,
    },
    {
      name: "Isik Aydinlatma",
      owner: "Dilek Sahin",
      sector: "Elektrik & Aydinlatma",
      address: "Merkez Mahallesi, Anafartalar Caddesi No:62, Salihli / Manisa",
      phone: "0236 713 05 29",
      email: "info@isikaydinlatma.com.tr",
      website: "https://www.isikaydinlatma.com.tr",
      active: true,
    },
    {
      name: "Manisa Kablo",
      owner: "Kemal Dogan",
      sector: "Elektrik & Aydinlatma",
      address: "OSB, Plastikcilar Caddesi No:7, Yunusemre / Manisa",
      phone: "0236 238 63 14",
      email: "info@manisakablo.com.tr",
      active: true,
    },
    // Hirdavat & Nalburiye (4)
    {
      name: "Demir Hirdavat",
      owner: "Ismail Demir",
      sector: "Hirdavat & Nalburiye",
      address: "Sehzadeler Mahallesi, Carsamba Pazari Caddesi No:17, Sehzadeler / Manisa",
      phone: "0236 237 80 03",
      email: "info@demirhirdavat.com.tr",
      website: "https://www.demirhirdavat.com.tr",
      active: true,
    },
    {
      name: "Ustalar Nalburiye",
      owner: "Mevlut Uslu",
      sector: "Hirdavat & Nalburiye",
      address: "Bahcelievler Mahallesi, Esnaf Sokak No:4, Turgutlu / Manisa",
      phone: "0236 314 55 92",
      email: "info@ustarlar.com.tr",
      active: true,
    },
    {
      name: "Sehir Hirdavat",
      owner: "Ramazan Cetin",
      sector: "Hirdavat & Nalburiye",
      address: "Cumhuriyet Mahallesi, Sanayi Caddesi No:53, Akhisar / Manisa",
      phone: "0236 415 67 44",
      email: "info@sehirhirdavat.com.tr",
      active: true,
    },
    {
      name: "Manisa Vida",
      owner: "Erkan Bulut",
      sector: "Hirdavat & Nalburiye",
      address: "Organize Sanayi Bolgesi, Metal Sanayicileri Caddesi No:29, Yunusemre / Manisa",
      phone: "0236 240 11 76",
      email: "info@manisavida.com.tr",
      website: "https://www.manisavida.com.tr",
      active: true,
    },
  ];

  for (const company of memberCompanies) {
    await prisma.memberCompany.create({ data: company });
  }

  console.log("Uye sirketler olusturuldu.");

  // 7. Ek Etkinlikler (5 yeni)
  const additionalEvents = [
    {
      title: "2024 Genel Kurul Toplantisi",
      slug: "2024-genel-kurul-toplantisi",
      description:
        "Manisa Insaat Malzemecileri Dernegi'nin 2024 yili olagan genel kurul toplantisi Manisa Ataturk Kultur Merkezi'nde gerceklestirildi. Toplantida 2023 yili faaliyet raporu ve mali tablolar oybirligiyle kabul edildi. Yeni donem yonetim kurulu gorevlendirmeleri tamamlandi ve 2024-2026 donemi stratejik hedefleri belirlendi.",
      date: new Date("2025-03-20T10:00:00"),
      endDate: new Date("2025-03-20T13:30:00"),
      location: "Ataturk Kultur Merkezi, Manisa",
      capacity: 130,
    },
    {
      title: "Sektor Bulusma Kahvaltisi",
      slug: "sektor-bulusma-kahvaltisi-2025",
      description:
        "Manisa insaat malzemeleri sektoru temsilcilerinin bir araya geldigi geleneksel sektor bulusma kahvaltisi Point Hotel Manisa'da yapildi. Etkinlikte sektorun guncel sorunlari, fuar takvimi ve uye derneklerin katkiyla olusturulan piyasa degerlendirme raporu ele alindi. Kahvalti formatinin sagladigi samimi atmosfer, uye isletmeler arasinda yeni is birliklerinin temelini atti.",
      date: new Date("2025-06-10T09:00:00"),
      endDate: new Date("2025-06-10T12:00:00"),
      location: "Point Hotel Manisa, Manisa",
      capacity: 80,
    },
    {
      title: "Is Guvenligi Egitimi",
      slug: "is-guvenligi-egitimi-2025",
      description:
        "Manisa Insaat Malzemecileri Dernegi ve Manisa Ticaret Odasi is birligi ile duzenlenen is guvenligi egitimi OSB Konferans Salonu'nda gerceklestirildi. Egitimde yapi malzemeleri deposu ve satış noktalarinda is kazasi onleme, yangin guvenligi prosedurler ve ilk yardim konulari uzman egitmenler tarafindan aktarildi. Programa katilan isletme temsilcilerine katilim sertifikasi duzenle.",
      date: new Date("2025-11-15T09:30:00"),
      endDate: new Date("2025-11-15T17:00:00"),
      location: "OSB Konferans Salonu, Manisa",
      capacity: 60,
    },
    {
      title: "Yapi Fuari Gezisi 2026",
      slug: "yapi-fuari-gezisi-2026",
      description:
        "Manisa Insaat Malzemecileri Dernegi organizasyonuyla Izmir'de duzenlenecek Yapi Fuari'na toplu katilim gezisi planlanmaktadir. Uye isletme temsilcilerinin yeni urun ve tedarikci agiyla tanisamasi, sektordeki yeni trendleri yerinde gozlemlemesi ve fuarda bulunan diger dernek temsilcileriyle ag kurabilmesi icin ozel bir program hazirlandi. Katilim icin on kayit zorunludur; kontenjan sinirlidir.",
      date: new Date("2026-10-05T07:30:00"),
      endDate: new Date("2026-10-05T20:00:00"),
      location: "Manisa Ticaret Odasi Toplanti Salonu (Bulus Noktasi), Manisa",
      capacity: 50,
    },
    {
      title: "Dijital Donusum Semineri",
      slug: "dijital-donusum-semineri-2026",
      description:
        "Insaat malzemeleri sektorunde dijital donusumun pratik boyutlarini ele alan bu seminer Manisa Ticaret Odasi konferans salonunda yapilacaktir. E-ticaret entegrasyonu, dijital envanter yonetimi, musteri iliskileri yazilimlari ve sosyal medya ile marka yonetimi konularinda uzman konusmacilar sunum yapacak. Seminer sonrasinda uygulamali demo oturumu ve soru-cevap bolumu yer alacaktir.",
      date: new Date("2026-11-20T10:00:00"),
      endDate: new Date("2026-11-20T17:30:00"),
      location: "Manisa Ticaret Odasi Konferans Salonu, Manisa",
      capacity: 100,
    },
  ];

  for (const event of additionalEvents) {
    await prisma.event.create({ data: event });
  }

  console.log("Ek etkinlikler olusturuldu.");

  // 8. Yayinlar
  const publications = [
    // DERGI (4 adet)
    {
      title: "Cetin Gungor Dergisi Sayi 1",
      type: "DERGI",
      description:
        "Manisa Insaat Malzemecileri Dernegi'nin ilk kurumsal dergisi. Bu sayida dernek tarihcesi, kurucu uye profilleri ve Manisa insaat sektoru genel degerlendirmesi yer almaktadir.",
      issueNumber: 1,
      publishedAt: new Date("2024-03-01"),
    },
    {
      title: "Cetin Gungor Dergisi Sayi 2",
      type: "DERGI",
      description:
        "Derginin ikinci sayisinda surdurulebilir yapi malzemeleri, enerji verimliligi trendleri ve Manisa'daki kentsel donusum projelerinin sektore yansimalari ele alinmaktadir.",
      issueNumber: 2,
      publishedAt: new Date("2024-06-01"),
    },
    {
      title: "Cetin Gungor Dergisi Sayi 3",
      type: "DERGI",
      description:
        "Ucuncu sayida deprem yonetmeligi guncellemeleri, uye isletme basari hikayeleri ve Ege Bolgesi insaat sektoru piyasa analizi kapsamli bicimde incelenmektedir.",
      issueNumber: 3,
      publishedAt: new Date("2024-09-01"),
    },
    {
      title: "Cetin Gungor Dergisi Sayi 4",
      type: "DERGI",
      description:
        "Dorduncu sayida yil sonu sektör degerlendirmesi, 2025 yili beklentileri ve uye sirketlerin yeni urun ve hizmetleri tanitim bolumu yer almaktadir.",
      issueNumber: 4,
      publishedAt: new Date("2024-12-01"),
    },
    // RAPOR (3 adet)
    {
      title: "2024 Manisa Insaat Sektoru Raporu",
      type: "RAPOR",
      description:
        "Manisa ilinin 2024 yili insaat malzemeleri sektoru buyume verileri, fiyat endeksleri, istihdam istatistikleri ve on goruler bu raporda derlenilmistir. Uye isletmeler ve paydas kuruluslar icin temel referans kaynagi niteligindedir.",
      issueNumber: null,
      publishedAt: new Date("2025-02-15"),
    },
    {
      title: "Sektor Analiz Raporu Q3 2025",
      type: "RAPOR",
      description:
        "2025 yili uc ceyrek donemini kapsayan bu rapor, ham madde fiyat hareketleri, ithalat-ihracat verileri ve Manisa bolgesi satis endekslerini analiz etmektedir. Piyasa beklentileri ve risk faktörleri de ayrintili bicimde degerlendirilmistir.",
      issueNumber: null,
      publishedAt: new Date("2025-10-20"),
    },
    {
      title: "Deprem Risk Degerlendirmesi Manisa",
      type: "RAPOR",
      description:
        "Manisa ve cevresindeki deprem risk haritasi ile bölgedeki yapi stokunun mevcut durumunu degerlendiren bu rapor, yapi malzemeleri sektoru icin onerileri de icerir. Teknik komite ve bagimsiz uzman akademisyenler tarafindan hazirlanan rapor, merkezi ve yerel yonetimlere sunulmak uzere derlenmistir.",
      issueNumber: null,
      publishedAt: new Date("2025-07-10"),
    },
    // REHBER (2 adet)
    {
      title: "Uye El Kitabi 2024",
      type: "REHBER",
      description:
        "Manisa Insaat Malzemecileri Dernegi'ne yeni katilan uyelerin dernek hizmetleri, tuzuk hukumleri, iletisim kanallari ve uye haklari konusunda bilgi edinebilecegi kapsamli el kitabi. Tum uye isletmelere basvuru kaynagi olarak dagitilmaktadir.",
      issueNumber: null,
      publishedAt: new Date("2024-01-15"),
    },
    {
      title: "Kaliteli Malzeme Secim Rehberi",
      type: "REHBER",
      description:
        "Insaat malzemeleri aliminda dikkat edilmesi gereken kalite standartlari, TSE sertifikalari ve sahte urun tespitine iliskin pratik bilgileri iceren rehber. Hem uye isletmeler hem de tuketic bilincini gelistirmeye yonelik kapsamli bir kaynak olarak hazirlanmistir.",
      issueNumber: null,
      publishedAt: new Date("2024-05-20"),
    },
  ];

  for (const pub of publications) {
    await prisma.publication.create({ data: pub });
  }

  console.log("Yayinlar olusturuldu.");

  // 9. Galeri Albumleri ve Fotograflari
  await prisma.galleryAlbum.create({
    data: {
      title: "Genel Kurul 2024",
      slug: "genel-kurul-2024",
      description:
        "Manisa Insaat Malzemecileri Dernegi 2024 yili Olagan Genel Kurul Toplantisi'ndan fotograflar. Toplantiya 130'dan fazla uye katildi.",
      date: new Date("2025-03-20"),
      photos: {
        create: [
          { url: "/placeholder/gallery/genel-kurul-2024-1.jpg", caption: "Genel kurul acilis konusmasi — Baskan Cetin Gungor", order: 0 },
          { url: "/placeholder/gallery/genel-kurul-2024-2.jpg", caption: "Yonetim kurulu uyeleri kürsüde", order: 1 },
          { url: "/placeholder/gallery/genel-kurul-2024-3.jpg", caption: "Oy sayim sureci", order: 2 },
          { url: "/placeholder/gallery/genel-kurul-2024-4.jpg", caption: "Uye isletme temsilcilerinden genel gorunum", order: 3 },
          { url: "/placeholder/gallery/genel-kurul-2024-5.jpg", caption: "Mali tablo sunumu — Sayman Ayse Kaya", order: 4 },
          { url: "/placeholder/gallery/genel-kurul-2024-6.jpg", caption: "Stratejik plan tanitimi", order: 5 },
          { url: "/placeholder/gallery/genel-kurul-2024-7.jpg", caption: "Kapanista yonetim kurulu ve katilimcilar toplu fotografi", order: 6 },
        ],
      },
    },
  });

  await prisma.galleryAlbum.create({
    data: {
      title: "Sektor Bulusma Etkinligi",
      slug: "sektor-bulusma-etkinligi",
      description:
        "2025 yili haziran ayinda Point Hotel'de duzenlenen sektor bulusma kahvaltisi etkinliginden kareler.",
      date: new Date("2025-06-10"),
      photos: {
        create: [
          { url: "/placeholder/gallery/sektor-bulusma-1.jpg", caption: "Etkinlik giris tabelasi ve kayit masasi", order: 0 },
          { url: "/placeholder/gallery/sektor-bulusma-2.jpg", caption: "Acilis konusmasi — Baskan Cetin Gungor", order: 1 },
          { url: "/placeholder/gallery/sektor-bulusma-3.jpg", caption: "Kahvalti sirasinda networking anlari", order: 2 },
          { url: "/placeholder/gallery/sektor-bulusma-4.jpg", caption: "Piyasa degerlendirme sunumu", order: 3 },
          { url: "/placeholder/gallery/sektor-bulusma-5.jpg", caption: "Uye isletmeler arasinda sohbet ve is gorusmesi", order: 4 },
          { url: "/placeholder/gallery/sektor-bulusma-6.jpg", caption: "Panel oturumu — sektordeki guncel sorunlar", order: 5 },
          { url: "/placeholder/gallery/sektor-bulusma-7.jpg", caption: "Etkinlik kapanisinda toplu fotograf", order: 6 },
          { url: "/placeholder/gallery/sektor-bulusma-8.jpg", caption: "Manisa'nin ileri gelen insaat malzemecileri bir arada", order: 7 },
        ],
      },
    },
  });

  await prisma.galleryAlbum.create({
    data: {
      title: "TIMFED Toplantisi",
      slug: "timfed-toplantisi",
      description:
        "Turkiye Insaat Malzemecileri Federasyonu toplantisina Manisa Dernegi temsilcilerinin katilimindan kareler.",
      date: new Date("2025-09-15"),
      photos: {
        create: [
          { url: "/placeholder/gallery/timfed-1.jpg", caption: "TIMFED toplanti salonu genel gorunum", order: 0 },
          { url: "/placeholder/gallery/timfed-2.jpg", caption: "Manisa Dernegi Baskani Cetin Gungor federasyon temsilcileriyle", order: 1 },
          { url: "/placeholder/gallery/timfed-3.jpg", caption: "Federasyon genel baskani acilis konusmasi", order: 2 },
          { url: "/placeholder/gallery/timfed-4.jpg", caption: "Bolgesel rapor sunumu sirasinda", order: 3 },
          { url: "/placeholder/gallery/timfed-5.jpg", caption: "Ege Bolgesi dernekleri temsilcileri bir arada", order: 4 },
          { url: "/placeholder/gallery/timfed-6.jpg", caption: "Toplanti arasi networking", order: 5 },
          { url: "/placeholder/gallery/timfed-7.jpg", caption: "Imzalanan mutabakat notunun teslimi", order: 6 },
        ],
      },
    },
  });

  await prisma.galleryAlbum.create({
    data: {
      title: "Fuar Ziyareti 2024",
      slug: "fuar-ziyareti-2024",
      description:
        "Manisa Insaat Malzemecileri Dernegi uyelerinin 2024 yilinda birlikte katildigi yapi malzemeleri fuarindan goruntüler.",
      date: new Date("2025-04-22"),
      photos: {
        create: [
          { url: "/placeholder/gallery/fuar-2024-1.jpg", caption: "Fuar girisinde dernek temsilcileri", order: 0 },
          { url: "/placeholder/gallery/fuar-2024-2.jpg", caption: "Seramik ve fayans fuarcilari standini gezerken", order: 1 },
          { url: "/placeholder/gallery/fuar-2024-3.jpg", caption: "Yeni yalitim urun tanitimi sirasinda", order: 2 },
          { url: "/placeholder/gallery/fuar-2024-4.jpg", caption: "Tedarikci firma temsilcileriyle gorusme", order: 3 },
          { url: "/placeholder/gallery/fuar-2024-5.jpg", caption: "Elektrik ve aydinlatma sektoru standlari", order: 4 },
          { url: "/placeholder/gallery/fuar-2024-6.jpg", caption: "Uye isletmeler ürün incelerken", order: 5 },
          { url: "/placeholder/gallery/fuar-2024-7.jpg", caption: "Fuar cikisinda grup hatira fotografı", order: 6 },
          { url: "/placeholder/gallery/fuar-2024-8.jpg", caption: "Yeni urun katalogu inceleme oturumu", order: 7 },
        ],
      },
    },
  });

  console.log("Galeri albumleri ve fotograflari olusturuldu.");

  // 10. Avantajlar (Uye Haklari)
  const advantages = [
    // UYELARARASI (4 adet)
    {
      companyName: "Celik A.S.",
      description:
        "Dernek uyelerinin Celik A.S. urunlerinden toplu alim yapmasina ozel yuzde on indirim hakki. Indirimden yararlanmak icin dernek uye kimlik belgesi ibraz edilmesi yeterlidir.",
      category: "UYELARARASI",
      discount: "%10 toplu alim indirimi",
      contact: "0236 241 33 55",
      active: true,
    },
    {
      companyName: "Manisa Nakliyat",
      description:
        "Uye isletmelerin il siniri icerisinde yapacaklari malzeme tasimaciliginda ucretsiz teslimat hizmeti. Haftalik en fazla iki teslimat hakkini kapsayan bu avantaj, uye isletme sahibinin talep etmesiyle aktive olur.",
      category: "UYELARARASI",
      discount: "Ucretsiz il ici teslimat",
      contact: "0236 225 80 17",
      active: true,
    },
    {
      companyName: "Ozdemir Depo",
      description:
        "Uye isletmelerin Ozdemir Depo'nun modern depolarinda yapacaklari stok depolama islemlerinde yuzde bes indirim uygulanmaktadir. Uzun sureli depolama anlasmalari icin ek donem indirimi de mumkundur.",
      category: "UYELARARASI",
      discount: "%5 depolama indirimi",
      contact: "0236 243 10 64",
      active: true,
    },
    {
      companyName: "Guven Sigorta Acentesi",
      description:
        "Is yeri sigortasinda uye isletmelere ozel yuzde sekiz prim indirimi saglayan anlasma. Yangin, hirsizlik ve isyeri sorumluluk sigortalarini kapsamaktadir; kapsam icin acenta ile gorusunuz.",
      category: "UYELARARASI",
      discount: "Is yeri sigortasinda %8 indirim",
      contact: "0236 231 76 90",
      active: true,
    },
    // ANLASMALI (4 adet)
    {
      companyName: "Ozel Manisa Hastanesi",
      description:
        "Uye isletme sahipleri ve birinci derece yakinlari icin Ozel Manisa Hastanesi'nde kapsamli saglik check-up paketinde yuzde yirmi indirim imkani. Randevu icin dernek kimligini ibraz ediniz.",
      category: "ANLASMALI",
      discount: "%20 saglik check-up paketi indirimi",
      contact: "0236 236 50 00",
      active: true,
    },
    {
      companyName: "ABC Sigorta",
      description:
        "Uye isletmelerin ABC Sigorta araciligiyla yaptirtacaklari isyeri sigortasinda yuzde on bes oraninda prim indirimi saglanmaktadir. Teklife basvuru sirasinda dernek uyelik belgesi sunulmasi gerekmektedir.",
      category: "ANLASMALI",
      discount: "Isyeri sigortasinda %15 indirim",
      contact: "0236 234 44 22",
      active: true,
    },
    {
      companyName: "Manisa Park Otel",
      description:
        "Is seyahatlerinizde Manisa Park Otel'in standart oda fiyatlarindan yuzde yirmi bes indirimle yararlanabilirsiniz. Rezervasyon yapilirken dernek uye numaranizi belirtmeniz yeterlidir.",
      category: "ANLASMALI",
      discount: "Konaklama %25 indirim",
      contact: "0236 239 75 00",
      active: true,
    },
    {
      companyName: "Ege Rent A Car",
      description:
        "Is amacli arac kiralama ihtiyaclari icin Ege Rent A Car'dan uye isletmelere ozel yuzde on bes indirim. Tum arac siniflarini kapsayan bu indirimden yararlanmak icin rezervasyon sirasinda dernek uyelik numaranizi kullaniniz.",
      category: "ANLASMALI",
      discount: "Arac kiralamada %15 indirim",
      contact: "0236 230 58 13",
      active: true,
    },
  ];

  for (const adv of advantages) {
    await prisma.advantage.create({ data: adv });
  }

  console.log("Avantajlar olusturuldu.");

  // 11. Kullanicilar
  const adminPassword = await hash("Admin123!", 12);
  const memberPassword = await hash("Test1234!", 12);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@cetingungor.org.tr",
      password: adminPassword,
      name: "Cetin Gungor",
      role: "ADMIN",
      active: true,
      duesStatus: "ODENDI",
      companyName: "Gungor Yapi Malzemeleri",
      sector: "Hirdavat & Nalburiye",
      memberSince: new Date("2024-01-15"),
    },
  });

  const uye1 = await prisma.user.create({
    data: {
      email: "uye1@test.com",
      password: memberPassword,
      name: "Ahmet Yilmaz",
      role: "MEMBER",
      active: true,
      duesStatus: "ODENDI",
      companyName: "Yilmaz Tesisat",
      sector: "Tesisat & Isitma",
      memberSince: new Date("2024-03-01"),
    },
  });

  const uye2 = await prisma.user.create({
    data: {
      email: "uye2@test.com",
      password: memberPassword,
      name: "Fatma Demir",
      role: "MEMBER",
      active: true,
      duesStatus: "GECIKTI",
      companyName: "Demir Seramik",
      sector: "Seramik & Fayans",
      memberSince: new Date("2024-06-15"),
    },
  });

  console.log("Kullanicilar olusturuldu.");

  // 12. Etkinlik Kayitlari
  const regEvent1 = await prisma.event.findUnique({
    where: { slug: "2026-2027-donemi-genel-kurul-toplantisi" },
  });
  const regEvent2 = await prisma.event.findUnique({
    where: { slug: "sektor-bulusma-etkinligi-yapi-malzemeleri-gelecek" },
  });
  const regEvent3 = await prisma.event.findUnique({
    where: { slug: "timfed-ege-bolgesi-temsilciler-toplantisi" },
  });

  if (regEvent1) {
    await prisma.eventRegistration.create({
      data: { userId: adminUser.id, eventId: regEvent1.id, status: "ONAYLANDI" },
    });
    await prisma.eventRegistration.create({
      data: { userId: uye1.id, eventId: regEvent1.id, status: "ONAYLANDI" },
    });
  }

  if (regEvent2) {
    await prisma.eventRegistration.create({
      data: { userId: adminUser.id, eventId: regEvent2.id, status: "ONAYLANDI" },
    });
  }

  if (regEvent3) {
    await prisma.eventRegistration.create({
      data: { userId: uye2.id, eventId: regEvent3.id, status: "ONAYLANDI" },
    });
  }

  console.log("Etkinlik kayitlari olusturuldu.");

  // 13. Iletisim Mesajlari
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Murat Ozkan",
        email: "murat.ozkan@example.com",
        subject: "Uyelik Basvurusu",
        message:
          "Merhabalar, Manisa Insaat Malzemecileri Dernegi'ne uye olmak istiyorum. Uyelik sartlari ve basvuru sureci hakkinda bilgi alabilir miyim? Insaat malzemeleri perakende sektorunde faaliyet gostermekteyim.",
        read: false,
      },
      {
        name: "Selin Arslan",
        email: "selin.arslan@example.com",
        subject: "Is Birligi Teklifi",
        message:
          "Sayin Yetkili, seramik ve yapi malzemeleri alaninda ulusal capli bir distributoruz. Derneginiz ile stratejik is birligi yaparak uye isletmelere ozel avantajli tedarik kosullari sunmak istiyoruz. Gorusme talebimizi iletmek icin bu formu kullaniyorum.",
        read: false,
      },
      {
        name: "Kemal Yildiz",
        email: "kemal.yildiz@example.com",
        subject: "Genel Bilgi",
        message:
          "Merhaba, derneginizin duzenledigi etkinlikler ve egitim programlari hakkinda bilgi almak istiyorum. Ayrica yeni acilan isletmeler icin ozel bir uyelik programi var mi? Tesekkurler.",
        read: false,
      },
    ],
  });

  console.log("Iletisim mesajlari olusturuldu.");

  // 14. Odemeler
  const allUsers = await prisma.user.findMany();
  for (const user of allUsers) {
    // Aidat odendi
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 5000,
        description: "2025 Yillik Aidat",
        type: "AIDAT",
        status: "ODENDI",
        paymentMethod: "HAVALE",
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        paidAt: new Date("2025-02-15"),
      },
    });
    // Aidat beklemede
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 6000,
        description: "2026 Yillik Aidat",
        type: "AIDAT",
        status: "BEKLEMEDE",
      },
    });
    // Etkinlik ucreti (sadece uyeler)
    if (user.role !== "ADMIN") {
      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: 500,
          description: "TIMFED Bolge Toplantisi Katilim Ucreti",
          type: "ETKINLIK",
          status: "BEKLEMEDE",
        },
      });
    }
  }

  console.log("Odeme verileri olusturuldu.");

  // 15. Newsletter
  const newsletterEmails = [
    { email: "abone1@test.com", name: "Ahmet Yilmaz" },
    { email: "abone2@test.com", name: "Fatma Demir" },
    { email: "abone3@test.com", name: "Mehmet Kaya" },
    { email: "info@egeseramik.com.tr", name: "Ege Seramik" },
    { email: "bilgi@manisayapi.com.tr", name: "Manisa Yapi" },
  ];
  for (const sub of newsletterEmails) {
    await prisma.newsletter.create({ data: sub });
  }

  console.log("Newsletter verileri olusturuldu.");
  console.log("Tohum verisi basariyla yuklendi!");
}

main()
  .catch((e) => {
    console.error("Tohum yukleme hatasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
