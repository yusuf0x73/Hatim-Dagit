//                                     BİSMİLLAHİRRAHMANİRRAHİM

// Diyanet mushafı esas alınmıştır: 604 sayfa, 30 cüz. Fâtiha ile Bakara'nın açılışı birlikte 1. sayfadır,
// bu yüzden her cüz 20 sayfadır: n. cüz 20n−19 ile 20n arası (3. cüz 41–60); 30. cüz 581–604.
// (Medine mushafında aynı yerler bir sayfa ileridedir; burada Diyanet numaraları kullanılır.)
import {tx} from '../strings/tx';

export const TOTAL_PAGES = 604;

export const juzRange = juz => ({
  start: 20 * (juz - 1) + 1,
  end: juz === 30 ? TOTAL_PAGES : 20 * juz,
});

// Cüzü eşit parçalara böler (yarım: 2, çeyrek: 4). Fazla sayfalar son parçaya eklenir,
// böylece 604 sayfa boşluksuz ve çakışmasız dağılır.
export const juzPieceRange = (juz, piece, piecesPerJuz) => {
  const {start, end} = juzRange (juz);
  const size = Math.floor (20 / piecesPerJuz);
  const pieceStart = start + (piece - 1) * size;
  const pieceEnd = piece === piecesPerJuz ? end : pieceStart + size - 1;
  return {start: pieceStart, end: pieceEnd};
};

const SURAH_NAMES_EN = ["Al-Fatihah", "Al-Baqarah", "Al Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];

const SURAH_NAMES_AR = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

// [ad, âyet sayısı, başladığı sayfa (Diyanet mushafı; public/mushaf/pages.json'dan)]
export const SURAHS = [
  ['Fâtiha', 7, 1], ['Bakara', 286, 1], ['Âl-i İmrân', 200, 49], ['Nisâ', 176, 76],
  ['Mâide', 120, 105], ["En'âm", 165, 127], ["A'râf", 206, 150], ['Enfâl', 75, 176],
  ['Tevbe', 129, 186], ['Yûnus', 109, 207], ['Hûd', 123, 220], ['Yûsuf', 111, 234],
  ["Ra'd", 43, 248], ['İbrâhîm', 52, 254], ['Hicr', 99, 261], ['Nahl', 128, 266],
  ['İsrâ', 111, 281], ['Kehf', 110, 292], ['Meryem', 98, 304], ['Tâhâ', 135, 311],
  ['Enbiyâ', 112, 321], ['Hac', 78, 331], ["Mü'minûn", 118, 341], ['Nûr', 64, 349],
  ['Furkân', 77, 358], ['Şuarâ', 227, 366], ['Neml', 93, 376], ['Kasas', 88, 384],
  ['Ankebût', 69, 395], ['Rûm', 60, 403], ['Lokmân', 34, 410], ['Secde', 30, 414],
  ['Ahzâb', 73, 417], ["Sebe'", 54, 427], ['Fâtır', 45, 433], ['Yâsîn', 83, 439],
  ['Sâffât', 182, 445], ['Sâd', 88, 452], ['Zümer', 75, 457], ["Mü'min", 85, 466],
  ['Fussılet', 54, 476], ['Şûrâ', 53, 482], ['Zuhruf', 89, 488], ['Duhân', 59, 495],
  ['Câsiye', 37, 498], ['Ahkâf', 35, 501], ['Muhammed', 38, 506], ['Fetih', 29, 510],
  ['Hucurât', 18, 514], ['Kâf', 45, 517], ['Zâriyât', 60, 519], ['Tûr', 49, 522],
  ['Necm', 62, 525], ['Kamer', 55, 527], ['Rahmân', 78, 530], ['Vâkıa', 96, 533],
  ['Hadîd', 29, 536], ['Mücâdele', 22, 541], ['Haşr', 24, 544], ['Mümtehine', 13, 548],
  ['Saf', 14, 550], ['Cuma', 11, 552], ['Münâfikûn', 11, 553], ['Teğâbün', 18, 555],
  ['Talâk', 12, 557], ['Tahrîm', 12, 559], ['Mülk', 30, 561], ['Kalem', 52, 563],
  ['Hâkka', 52, 565], ['Meâric', 44, 567], ['Nûh', 28, 569], ['Cin', 28, 571],
  ['Müzzemmil', 20, 573], ['Müddessir', 56, 574], ['Kıyâmet', 40, 576], ['İnsân', 31, 577],
  ['Mürselât', 50, 579], ["Nebe'", 40, 581], ['Nâziât', 46, 582], ['Abese', 42, 584],
  ['Tekvîr', 29, 585], ['İnfitâr', 19, 586], ['Mutaffifîn', 36, 587], ['İnşikâk', 25, 588],
  ['Bürûc', 22, 589], ['Târık', 17, 590], ["A'lâ", 19, 590], ['Gâşiye', 26, 591],
  ['Fecr', 30, 592], ['Beled', 20, 593], ['Şems', 15, 594], ['Leyl', 21, 595],
  ['Duhâ', 11, 595], ['İnşirâh', 8, 596], ['Tîn', 8, 596], ['Alak', 19, 597],
  ['Kadr', 5, 598], ['Beyyine', 8, 598], ['Zilzâl', 8, 599], ['Âdiyât', 11, 599],
  ['Kâria', 11, 600], ['Tekâsür', 8, 600], ['Asr', 3, 601], ['Hümeze', 9, 601],
  ['Fîl', 5, 601], ['Kureyş', 4, 602], ['Mâûn', 7, 602], ['Kevser', 3, 602],
  ['Kâfirûn', 6, 603], ['Nasr', 3, 603], ['Tebbet', 5, 603], ['İhlâs', 4, 604],
  ['Felak', 5, 604], ['Nâs', 6, 604],
].map (([name, ayahs, page], index) => ({
  number: index + 1,
  // name: arayüz dilinde; trName: Türkçe (kayıtlı verilerle karşılaştırma için)
  name: tx (name, SURAH_NAMES_EN[index], SURAH_NAMES_AR[index]),
  trName: name,
  ayahs,
  page,
}));

// Bir sayfanın hangi cüzde olduğu
export const juzOfPage = page => {
  for (let juz = 30; juz >= 1; juz--) {
    if (page >= juzRange (juz).start) return juz;
  }
  return 1;
};

// Bir sayfada başlayan (yoksa devam eden) sure
export const surahOfPage = page => {
  let found = SURAHS[0];
  for (const surah of SURAHS) {
    if (surah.page <= page) found = surah;
    else break;
  }
  return found;
};

// ---------- Arayüz dilinde kısa etiketler ----------
export const juzLabel = n => tx (`${n}. cüz`, `Juz ${n}`, `الجزء ${n}`);
export const pageLabel = n => tx (`${n}. sayfa`, `Page ${n}`, `الصفحة ${n}`);
export const pagesLabel = ({start, end}) =>
  start === end ? pageLabel (start) : tx (`${start}–${end}. sayfalar`, `Pages ${start}–${end}`, `الصفحات ${start}–${end}`);
export const surahLabel = name => tx (`${name} Sûresi`, `Surah ${name}`, `سورة ${name}`);
export const halfLabel = n => tx (`${n}. yarı`, n === 1 ? '1st half' : '2nd half', n === 1 ? 'النصف الأول' : 'النصف الثاني');
export const quarterLabel = n => tx (`${n}. çeyrek`, `Quarter ${n}`, `الربع ${n}`);
export const quartersLabel = (a, b) => tx (`${a}.–${b}. çeyrek`, `Quarters ${a}–${b}`, `الأرباع ${a}–${b}`);
export const ayahsLabel = n => tx (`${n} âyet`, `${n} verses`, `${n} آية`);
