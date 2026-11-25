//                                     BİSMİLLAHİRRAHMANİRRAHİM

import {SURAHS, TOTAL_PAGES, juzRange, juzPieceRange, surahOfPage, juzOfPage} from './quran';

export const MONTH_NAMES = ['Recep', 'Şaban', 'Ramazan'];
// "Recep'in 5. günü"
export const MONTH_GENITIVE = ["Recep'in", "Şaban'ın", "Ramazan'ın"];

const pagesText = ({start, end}) => (start === end ? `${start}. sayfa` : `${start}–${end}. sayfalar`);

const juzPiece = (index, piecesPerJuz) => {
  const juz = Math.ceil (index / piecesPerJuz);
  const piece = ((index - 1) % piecesPerJuz) + 1;
  return {juz, piece, range: juzPieceRange (juz, piece, piecesPerJuz)};
};

const pieceName = piecesPerJuz => (piecesPerJuz === 2 ? 'yarı' : 'çeyrek');

const readingOfPiece = (index, piecesPerJuz) => {
  const {juz, piece, range} = juzPiece (index, piecesPerJuz);
  return {title: `${juz}. cüz · ${piece}. ${pieceName (piecesPerJuz)}`, subtitle: pagesText (range), pages: `${range.start}–${range.end}`};
};

// pages: kâğıt çizelgede "okunacak sayfalar" sütununa yazılan kısa bilgi (1–10 / 12 / 36. Yâsîn)
const readingOfJuz = juz => ({title: `${juz}. cüz`, subtitle: pagesText (juzRange (juz)), pages: `${juzRange (juz).start}–${juzRange (juz).end}`});

const readingOfSurah = number => {
  const surah = SURAHS[number - 1];
  return {title: `${surah.number}. ${surah.name} Sûresi`, subtitle: `${surah.ayahs} âyet · ${surah.page}. sayfadan başlar`, pages: `${surah.number}. ${surah.name}`};
};

const readingOfPage = page => ({
  title: `${page}. sayfa`,
  subtitle: `${juzOfPage (page)}. cüz · ${surahOfPage (page).name} Sûresi`,
  pages: String (page),
});

const rotate = (start, step, total) => ((start - 1 + step) % total) + 1;

// ---------- Dönerli 10/5 sayfa planları: çeyrek cüz (5 sayfa) birimiyle ----------
// Çeyrek q (1..120): cüz = ceil(q/4), cüz içindeki çeyrek = (q-1)%4+1
const QUARTERS = 120;
const quarterOf = q => juzPiece (q, 4);

// Bir okumanın başı / sonu: cüz, yarım ya da çeyrek sınırına göre en sade ad
const startLabel = q => {
  const {juz, piece} = quarterOf (q);
  if (piece === 1) return `${juz}. cüz`;
  if (piece === 3) return `${juz}. cüz 2. yarı`;
  return `${juz}. cüz ${piece}. çeyrek`;
};
const endLabel = q => {
  const {juz, piece} = quarterOf (q);
  if (piece === 4) return `${juz}. cüz`;
  if (piece === 2) return `${juz}. cüz 1. yarı`;
  return `${juz}. cüz ${piece}. çeyrek`;
};

// q'dan başlayan "count" çeyrek (ör. 3. cüz 2. yarı – 4. cüz 1. yarı · 51–70. sayfalar)
const readingOfQuarters = (q, count) => {
  const lastQ = rotate (q, count - 1, QUARTERS);
  const first = quarterOf (q);
  const last = quarterOf (lastQ);
  let title;
  if (count === 4 && first.piece === 1) title = `${first.juz}. cüz`;
  else if (count === 2 && (first.piece === 1 || first.piece === 3)) title = `${first.juz}. cüz · ${(first.piece + 1) / 2}. yarı`;
  else if (count === 1) title = `${first.juz}. cüz · ${first.piece}. çeyrek`;
  else if (first.juz === last.juz && count < 4) title = `${first.juz}. cüz · ${first.piece}.–${last.piece}. çeyrek`;
  else title = `${startLabel (q)} – ${endLabel (lastQ)}`;
  // 30. cüzden 1. cüze geçiş
  const wraps = last.range.end < first.range.start;
  const subtitle = wraps
    ? `${first.range.start}–${TOTAL_PAGES} ve 1–${last.range.end}. sayfalar`
    : pagesText ({start: first.range.start, end: last.range.end});
  const pages = wraps
    ? `${first.range.start}–${TOTAL_PAGES}, 1–${last.range.end}`
    : `${first.range.start}–${last.range.end}`;
  return {title, subtitle, pages};
};

// Günlük çeyrek sayıları bir hatme (120 çeyrek) yetmezse eksik son iki güne eklenir:
// ör. Ramazan 29 gün × 20 sayfa = 580 → son iki gün 30'ar sayfa.
const fillToKhatm = counts => {
  const out = [...counts];
  const missing = QUARTERS - out.reduce ((a, b) => a + b, 0);
  if (missing > 0 && out.length) {
    out[out.length - 1] += Math.ceil (missing / 2);
    if (out.length > 1) out[out.length - 2] += Math.floor (missing / 2);
  }
  return out;
};

// Ardışık okumalar: her gün bir öncekinin bittiği yerden devam eder
const runsFrom = (startQ, counts) => {
  let q = startQ;
  return counts.map (count => {
    const reading = readingOfQuarters (q, count);
    q = rotate (q, count, QUARTERS);
    return reading;
  });
};

const repeat = (value, times) => Array.from ({length: times}, () => value);

// Sabit planda "step" hep 0'dır: kişi her gün aynı yeri okur
const advance = (rotating, step) => (rotating ? step : 0);

/**
 * Üç aylar okuma planları.
 * slots: dağıtılan parça sayısı
 * reading(slot, monthIndex, dayInMonth, dayInPeriod): o gün okunacak kısım
 */
export const PLANS = {
  // Eski "3 aylar boyunca günde 1 cüz" (ucaylarhergun1cuz sayfası). Her ay aldığı cüzden başlar.
  eachday1part: {
    id: 'eachday1part',
    title: '3 aylar boyunca günde 1 cüz',
    slots: 30,
    slotLabel: slot => readingOfJuz (slot),
    defaultRotating: true,
    reading: (slot, monthIndex, dayInMonth) => readingOfJuz (rotate (slot, dayInMonth, 30)),
  },

  tenPagesThenJuz: {
    id: 'tenPagesThenJuz',
    title: "Recep ve Şaban'da günde 10 sayfa, Ramazan'da günde 1 cüz",
    description: 'Kur\'ân 60 parçaya (yarım cüz, 10 sayfa) bölünür. Recep ve Şaban\'da günde 10 sayfa, Ramazan\'da günde 1 cüz okunur.',
    slots: 60,
    unit: 'parça',
    unitAcc: 'parçayı',
    takeText: 'Parçayı al',
    slotLabel: slot => readingOfPiece (slot, 2),
    defaultRotating: true,
    rotatingText: 'Her gün sıradaki 10 sayfaya geçilir; Recep–Şaban\'da bir hatim biter. Ramazan\'da kalınan yerden devam edilip her gün 20 sayfa (1 cüz) ile ikinci hatim biter. Gün sayısı yetmezse eksik sayfalar son iki güne eklenir.',
    fixedText: 'Recep ve Şaban\'da her gün aynı 10 sayfa, Ramazan\'da her gün o sayfaların cüzü okunur.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) => {
      if (monthIndex < 2) return readingOfPiece (rotate (slot, advance (rotating, dayInPeriod), 60), 2);
      return readingOfJuz (Math.ceil (slot / 2));
    },
    // Dönerli: Recep+Şaban tam bir hatim (günde 10 sayfa), Ramazan kalınan yerden tam bir hatim (günde 20 sayfa)
    readings: (slot, {monthDays}) => {
      const start = 2 * slot - 1;
      const first = fillToKhatm (repeat (2, monthDays[0] + monthDays[1]));
      const second = fillToKhatm (repeat (4, monthDays[2]));
      return runsFrom (start, [...first, ...second]);
    },
  },

  fivePagesThenTenPages: {
    id: 'fivePagesThenTenPages',
    title: "Recep ve Şaban'da günde 5 sayfa, Ramazan'da günde 10 sayfa",
    description: 'Kur\'ân 120 parçaya (hizb, 5 sayfa) bölünür. Recep ve Şaban\'da günde 5 sayfa, Ramazan\'da günde 10 sayfa okunur.',
    slots: 120,
    unit: 'parça',
    unitAcc: 'parçayı',
    takeText: 'Parçayı al',
    slotLabel: slot => readingOfPiece (slot, 4),
    defaultRotating: true,
    rotatingText: 'Her gün sıradaki 5 sayfaya geçilir; Ramazan\'da kalınan yerden devam edilip her gün 10 sayfa okunur ve üç ayda tam bir hatim biter. Gün sayısı yetmezse eksik sayfalar son iki güne eklenir.',
    fixedText: 'Recep ve Şaban\'da her gün aynı 5 sayfa, Ramazan\'da her gün o sayfaları içeren 10 sayfa okunur.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) => {
      if (monthIndex < 2) return readingOfPiece (rotate (slot, advance (rotating, dayInPeriod), 120), 4);
      return readingOfPiece (Math.ceil (slot / 2), 2);
    },
    // Dönerli: üç ay boyunca tek hatim (Recep–Şaban günde 5, Ramazan günde 10 sayfa)
    readings: (slot, {monthDays}) =>
      runsFrom (slot, fillToKhatm ([...repeat (1, monthDays[0] + monthDays[1]), ...repeat (2, monthDays[2])])),
  },

  samePage: {
    id: 'samePage',
    title: '3 aylar boyunca her gün 1 sayfa',
    description: 'Kur\'ân\'ın 604 sayfası dağıtılır; herkes her gün 1 sayfa okur. Bütün sayfalar alındığında her gün bir hatim tamamlanır.',
    slots: 604,
    unit: 'sayfa',
    unitAcc: 'sayfayı',
    takeText: 'Sayfayı al',
    slotLabel: slot => readingOfPage (slot),
    defaultRotating: false,
    rotatingText: 'Aldığınız sayfadan başlayıp her gün bir sonraki sayfayı okursunuz.',
    fixedText: 'Aldığınız sayfayı üç ay boyunca her gün okursunuz.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) =>
      readingOfPage (rotate (slot, advance (rotating, dayInPeriod), 604)),
  },

  sameSurah: {
    id: 'sameSurah',
    title: '3 aylar boyunca her gün 1 sûre',
    description: '114 sûre dağıtılır; herkes her gün 1 sûre okur. Bütün sûreler alındığında her gün bir hatim tamamlanır.',
    slots: 114,
    unit: 'sûre',
    unitAcc: 'sûreyi',
    takeText: 'Sûreyi al',
    slotLabel: slot => readingOfSurah (slot),
    defaultRotating: false,
    rotatingText: 'Aldığınız sûreden başlayıp her gün bir sonraki sûreyi okursunuz.',
    fixedText: 'Aldığınız sûreyi üç ay boyunca her gün okursunuz.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) =>
      readingOfSurah (rotate (slot, advance (rotating, dayInPeriod), 114)),
  },
};

export const NEW_PLAN_IDS = ['tenPagesThenJuz', 'fivePagesThenTenPages', 'samePage', 'sameSurah'];

export const toDate = isoDate => {
  const [y, m, d] = isoDate.split ('-').map (Number);
  return new Date (y, m - 1, d);
};

const sameDay = (a, b) =>
  a.getFullYear () === b.getFullYear () && a.getMonth () === b.getMonth () && a.getDate () === b.getDate ();

/**
 * Bir parçanın üç aylık gün gün okuma çizelgesi.
 * period: {startingDate: 'YYYY-MM-DD' (1 Recep), monthDays: [Recep, Şaban, Ramazan]}
 */
// Hatimde "rotating" alanı yoksa planın eski (varsayılan) davranışı geçerlidir
export const isRotating = (planId, rotating) =>
  rotating === undefined || rotating === null ? !!(PLANS[planId] && PLANS[planId].defaultRotating) : !!rotating;

export const buildSchedule = (planId, slot, period, rotating) => {
  const plan = PLANS[planId];
  const turns = isRotating (planId, rotating);
  const ramadanStart = period.monthDays[0] + period.monthDays[1];
  // Dönerli 10/5 sayfa planlarında günler birbirine bağlıdır (kalınan yerden devam, eksik son günlere)
  const series = turns && plan.readings ? plan.readings (Number (slot), period) : null;
  const days = [];
  let dayInPeriod = 0;
  const today = new Date ();

  period.monthDays.forEach ((length, monthIndex) => {
    for (let dayInMonth = 0; dayInMonth < length; dayInMonth++, dayInPeriod++) {
      const date = toDate (period.startingDate);
      date.setDate (date.getDate () + dayInPeriod);
      days.push ({
        index: dayInPeriod,
        monthIndex,
        month: MONTH_NAMES[monthIndex],
        dayInMonth: dayInMonth + 1,
        date,
        isToday: sameDay (date, today),
        ...(series ? series[dayInPeriod] : plan.reading (Number (slot), monthIndex, dayInMonth, dayInPeriod, ramadanStart, turns)),
      });
    }
  });

  return days;
};

// Bugün dönemin kaçıncı günü (dönem dışındaysa null)
export const todayIndex = period => {
  const start = toDate (period.startingDate);
  const total = period.monthDays.reduce ((a, b) => a + b, 0);
  const diff = Math.floor ((new Date ().setHours (0, 0, 0, 0) - start.getTime ()) / 86400000);
  return diff >= 0 && diff < total ? diff : null;
};

export const periodEndDate = period => {
  const end = toDate (period.startingDate);
  end.setDate (end.getDate () + period.monthDays.reduce ((a, b) => a + b, 0) - 1);
  return end;
};

export const formatDate = date =>
  date.toLocaleDateString ('tr-TR', {day: 'numeric', month: 'long', weekday: 'short'});
