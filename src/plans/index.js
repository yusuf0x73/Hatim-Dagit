//                                     BİSMİLLAHİRRAHMANİRRAHİM

import {SURAHS, juzRange, juzPieceRange, surahOfPage, juzOfPage} from './quran';

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
  return {title: `${juz}. cüz · ${piece}. ${pieceName (piecesPerJuz)}`, subtitle: pagesText (range)};
};

const readingOfJuz = juz => ({title: `${juz}. cüz`, subtitle: pagesText (juzRange (juz))});

const readingOfSurah = number => {
  const surah = SURAHS[number - 1];
  return {title: `${surah.number}. ${surah.name} Sûresi`, subtitle: `${surah.ayahs} âyet · ${surah.page}. sayfadan başlar`};
};

const readingOfPage = page => ({
  title: `${page}. sayfa`,
  subtitle: `${juzOfPage (page)}. cüz · ${surahOfPage (page).name} Sûresi`,
});

const rotate = (start, step, total) => ((start - 1 + step) % total) + 1;

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
    rotatingText: 'Her gün sıradaki 10 sayfaya geçilir; Ramazan\'da her gün sıradaki cüz.',
    fixedText: 'Recep ve Şaban\'da her gün aynı 10 sayfa, Ramazan\'da her gün o sayfaların cüzü okunur.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) => {
      if (monthIndex < 2) return readingOfPiece (rotate (slot, advance (rotating, dayInPeriod), 60), 2);
      return readingOfJuz (rotate (Math.ceil (slot / 2), advance (rotating, dayInPeriod - ramadanStart), 30));
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
    rotatingText: 'Her gün sıradaki 5 sayfaya geçilir; Ramazan\'da her gün sıradaki 10 sayfa.',
    fixedText: 'Recep ve Şaban\'da her gün aynı 5 sayfa, Ramazan\'da her gün o sayfaları içeren 10 sayfa okunur.',
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) => {
      if (monthIndex < 2) return readingOfPiece (rotate (slot, advance (rotating, dayInPeriod), 120), 4);
      return readingOfPiece (rotate (Math.ceil (slot / 2), advance (rotating, dayInPeriod - ramadanStart), 60), 2);
    },
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
        ...plan.reading (Number (slot), monthIndex, dayInMonth, dayInPeriod, ramadanStart, turns),
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
