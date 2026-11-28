//                                     BİSMİLLAHİRRAHMANİRRAHİM

import {SURAHS, TOTAL_PAGES, juzRange, juzPieceRange, surahOfPage, juzOfPage,
        juzLabel, pageLabel, pagesLabel, surahLabel, halfLabel, quarterLabel, quartersLabel, ayahsLabel} from './quran';
import {tx, LOCALE} from '../strings/tx';

export const MONTH_NAMES = tx (['Recep', 'Şaban', 'Ramazan'], ['Rajab', "Sha'ban", 'Ramadan'], ['رجب', 'شعبان', 'رمضان']);
// "Recep'in 5. günü" / "Day 5 of Rajab" / "اليوم 5 من رجب"
const MONTH_GENITIVE_TR = ["Recep'in", "Şaban'ın", "Ramazan'ın"];
export const monthDayLabel = (monthIndex, day) =>
  tx (`${MONTH_GENITIVE_TR[monthIndex]} ${day}. günü`, `day ${day} of ${MONTH_NAMES[monthIndex]}`, `اليوم ${day} من ${MONTH_NAMES[monthIndex]}`);

const pagesText = pagesLabel;

const juzPiece = (index, piecesPerJuz) => {
  const juz = Math.ceil (index / piecesPerJuz);
  const piece = ((index - 1) % piecesPerJuz) + 1;
  return {juz, piece, range: juzPieceRange (juz, piece, piecesPerJuz)};
};


const readingOfPiece = (index, piecesPerJuz) => {
  const {juz, piece, range} = juzPiece (index, piecesPerJuz);
  return {title: `${juzLabel (juz)} · ${piecesPerJuz === 2 ? halfLabel (piece) : quarterLabel (piece)}`, subtitle: pagesText (range), pages: `${range.start}–${range.end}`};
};

// pages: kâğıt çizelgede "okunacak sayfalar" sütununa yazılan kısa bilgi (1–10 / 12 / 36. Yâsîn)
const readingOfJuz = juz => ({title: juzLabel (juz), subtitle: pagesText (juzRange (juz)), pages: `${juzRange (juz).start}–${juzRange (juz).end}`});

// 29 günlük ayın son günü: iki cüz (ay içinde tam hatim). 30 → 1 geçişinde sayfalar ikiye ayrılır.
const readingOfTwoJuz = (a, b) => {
  const first = juzRange (a);
  const second = juzRange (b);
  const joined = second.start === first.end + 1;
  return {
    title: tx (`${a}. ve ${b}. cüz`, `Juz ${a} and ${b}`, `الجزءان ${a} و${b}`),
    subtitle: joined ? pagesText ({start: first.start, end: second.end})
      : tx (`${first.start}–${first.end} ve ${second.start}–${second.end}. sayfalar`, `Pages ${first.start}–${first.end} and ${second.start}–${second.end}`,
            `الصفحات ${first.start}–${first.end} و${second.start}–${second.end}`),
    pages: joined ? `${first.start}–${second.end}` : `${first.start}–${first.end}, ${second.start}–${second.end}`,
  };
};

// Günde 1 cüz, her ay aldığı cüzden başlar; ay 29 günse son gün iki cüz okunur ve ay yine tam hatimle biter
export const juzPerDay = (slot, length) => Array.from ({length}, (_, day) => {
  const juz = rotate (slot, day, 30);
  return length < 30 && day === length - 1 ? readingOfTwoJuz (juz, rotate (slot, day + 1, 30)) : readingOfJuz (juz);
});

const readingOfSurah = number => {
  const surah = SURAHS[number - 1];
  return {title: `${surah.number}. ${surahLabel (surah.name)}`,
          subtitle: `${ayahsLabel (surah.ayahs)} · ${tx (`${surah.page}. sayfadan başlar`, `starts on page ${surah.page}`, `تبدأ من الصفحة ${surah.page}`)}`, pages: `${surah.number}. ${surah.name}`};
};

const readingOfPage = page => ({
  title: pageLabel (page),
  subtitle: `${juzLabel (juzOfPage (page))} · ${surahLabel (surahOfPage (page).name)}`,
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
  if (piece === 1) return juzLabel (juz);
  if (piece === 3) return `${juzLabel (juz)} ${halfLabel (2)}`;
  return `${juzLabel (juz)} ${quarterLabel (piece)}`;
};
const endLabel = q => {
  const {juz, piece} = quarterOf (q);
  if (piece === 4) return juzLabel (juz);
  if (piece === 2) return `${juzLabel (juz)} ${halfLabel (1)}`;
  return `${juzLabel (juz)} ${quarterLabel (piece)}`;
};

// q'dan başlayan "count" çeyrek (ör. 3. cüz 2. yarı – 4. cüz 1. yarı · 51–70. sayfalar)
const readingOfQuarters = (q, count) => {
  const lastQ = rotate (q, count - 1, QUARTERS);
  const first = quarterOf (q);
  const last = quarterOf (lastQ);
  let title;
  if (count === 4 && first.piece === 1) title = juzLabel (first.juz);
  else if (count === 2 && (first.piece === 1 || first.piece === 3)) title = `${juzLabel (first.juz)} · ${halfLabel ((first.piece + 1) / 2)}`;
  else if (count === 1) title = `${juzLabel (first.juz)} · ${quarterLabel (first.piece)}`;
  else if (first.juz === last.juz && count < 4) title = `${juzLabel (first.juz)} · ${quartersLabel (first.piece, last.piece)}`;
  else title = `${startLabel (q)} – ${endLabel (lastQ)}`;
  // 30. cüzden 1. cüze geçiş
  const wraps = last.range.end < first.range.start;
  const subtitle = wraps
    ? tx (`${first.range.start}–${TOTAL_PAGES} ve 1–${last.range.end}. sayfalar`, `Pages ${first.range.start}–${TOTAL_PAGES} and 1–${last.range.end}`,
          `الصفحات ${first.range.start}–${TOTAL_PAGES} و1–${last.range.end}`)
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

/*
  Dağıtılan birimin adları. unitKind mantık için (dilden bağımsız), diğerleri arayüz metni:
  unit: "Alınan parça", unitAcc: "Şu parçayı aldınız", units: başlık / çoğul, takeText: düğme.
*/
const PIECE_WORDS = {
  unitKind: 'piece',
  unit: tx ('parça', 'part', 'قسم'),
  unitAcc: tx ('parçayı', 'part', 'القسم'),
  unitsAcc: tx ('parçaları', 'parts', 'الأقسام'),
  units: tx ('Parçalar', 'Parts', 'الأقسام'),
  takeText: tx ('Parçayı al', 'Take this part', 'خذ هذا القسم'),
};
const PAGE_WORDS = {
  unitKind: 'page',
  unit: tx ('sayfa', 'page', 'صفحة'),
  unitAcc: tx ('sayfayı', 'page', 'الصفحة'),
  unitsAcc: tx ('sayfaları', 'pages', 'الصفحات'),
  units: tx ('Sayfalar', 'Pages', 'الصفحات'),
  takeText: tx ('Sayfayı al', 'Take this page', 'خذ هذه الصفحة'),
};
const JUZ_WORDS = {
  unitKind: 'juz',
  unit: tx ('cüz', 'juz', 'جزء'),
  unitAcc: tx ('cüzü', 'juz', 'الجزء'),
  unitsAcc: tx ('cüzleri', 'juz', 'الأجزاء'),
  units: tx ('Cüzler', 'Juz', 'الأجزاء'),
  takeText: tx ('Cüzü al', 'Take this juz', 'خذ هذا الجزء'),
};
const SURAH_WORDS = {
  unitKind: 'surah',
  unit: tx ('sûre', 'surah', 'سورة'),
  unitAcc: tx ('sûreyi', 'surah', 'السورة'),
  unitsAcc: tx ('sûreleri', 'surahs', 'السور'),
  units: tx ('Sûreler', 'Surahs', 'السور'),
  takeText: tx ('Sûreyi al', 'Take this surah', 'خذ هذه السورة'),
};

/**
 * Üç aylar okuma planları.
 * slots: dağıtılan parça sayısı
 * reading(slot, monthIndex, dayInMonth, dayInPeriod): o gün okunacak kısım
 */
export const PLANS = {
  // Eski "3 aylar boyunca günde 1 cüz" (ucaylarhergun1cuz sayfası). Her ay aldığı cüzden başlar.
  eachday1part: {
    id: 'eachday1part',
    title: tx ('3 aylar boyunca günde 1 cüz', '1 juz a day for the three months', 'جزء يوميًا طوال الأشهر الثلاثة'),
    slots: 30,
    ...JUZ_WORDS,
    slotLabel: slot => readingOfJuz (slot),
    defaultRotating: true,
    rotatingText: tx ('Her ay aldığınız cüzden başlayıp her gün bir sonraki cüzü okursunuz; her ay bir hatim biter. Ay 29 gün çekerse son gün iki cüz okunur.',
                      'Each month you start from the juz you take and read the next juz every day; a khatm is completed each month. If the month has 29 days, two juz are read on the last day.',
                      'في كل شهر تبدأ من الجزء الذي أخذته وتقرأ الجزء التالي كل يوم؛ فتُختم ختمة كل شهر. وإن كان الشهر ٢٩ يومًا يُقرأ جزءان في اليوم الأخير.'),
    fixedText: tx ('Aldığınız cüzü üç ay boyunca her gün okursunuz. Bütün cüzler alındığında her gün bir hatim tamamlanır.',
                   'You read the juz you take every day for three months. Once all juz are taken, a khatm is completed every day.',
                   'تقرأ الجزء الذي أخذته كل يوم طوال ثلاثة أشهر. وعند أخذ كل الأجزاء تُختم ختمة كاملة كل يوم.'),
    // Sabit: her gün aldığı cüz; dönerli: her ay aldığı cüzden başlayıp sıradaki
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) =>
      readingOfJuz (rotating === false ? slot : rotate (slot, dayInMonth, 30)),
    readings: (slot, {monthDays}) => monthDays.flatMap (length => juzPerDay (slot, length)),
  },

  tenPagesThenJuz: {
    id: 'tenPagesThenJuz',
    title: tx ("Recep ve Şaban'da günde 10 sayfa, Ramazan'da günde 1 cüz",
               "10 pages a day in Rajab and Sha'ban, 1 juz a day in Ramadan",
               '١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان'),
    description: tx ('Kur\'ân 60 parçaya (yarım cüz, 10 sayfa) bölünür. Recep ve Şaban\'da günde 10 sayfa, Ramazan\'da günde 1 cüz okunur.',
                     "The Qur'an is divided into 60 parts (half a juz, 10 pages). 10 pages a day are read in Rajab and Sha'ban, 1 juz a day in Ramadan.",
                     'يُقسَّم القرآن إلى ٦٠ قسمًا (نصف جزء، ١٠ صفحات). تُقرأ ١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان.'),
    slots: 60,
    ...PIECE_WORDS,
    slotLabel: slot => readingOfPiece (slot, 2),
    defaultRotating: true,
    rotatingText: tx ('Her gün sıradaki 10 sayfaya geçilir; Recep–Şaban\'da bir hatim biter. Ramazan\'da kalınan yerden devam edilip her gün 20 sayfa (1 cüz) ile ikinci hatim biter. Gün sayısı yetmezse eksik sayfalar son iki güne eklenir.',
                      "Each day you move on to the next 10 pages; one khatm is completed in Rajab–Sha'ban. In Ramadan you continue from where you left off with 20 pages (1 juz) a day and complete a second khatm. If there are not enough days, the missing pages are added to the last two days.",
                      'كل يوم تنتقل إلى الصفحات العشر التالية، فتُختم ختمة في رجب وشعبان. وفي رمضان تُكمل من حيث توقفت بـ٢٠ صفحة (جزء) يوميًا فتُختم ختمة ثانية. وإن لم تكفِ الأيام تُضاف الصفحات الناقصة إلى آخر يومين.'),
    fixedText: tx ('Recep ve Şaban\'da her gün aynı 10 sayfa, Ramazan\'da her gün o sayfaların cüzü okunur.',
                   "The same 10 pages every day in Rajab and Sha'ban, and the juz of those pages every day in Ramadan.",
                   'الصفحات العشر نفسها كل يوم في رجب وشعبان، وجزء تلك الصفحات كل يوم في رمضان.'),
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
    title: tx ("Recep ve Şaban'da günde 5 sayfa, Ramazan'da günde 10 sayfa",
               "5 pages a day in Rajab and Sha'ban, 10 pages a day in Ramadan",
               '٥ صفحات يوميًا في رجب وشعبان، و١٠ صفحات يوميًا في رمضان'),
    description: tx ('Kur\'ân 120 parçaya (hizb, 5 sayfa) bölünür. Recep ve Şaban\'da günde 5 sayfa, Ramazan\'da günde 10 sayfa okunur.',
                     "The Qur'an is divided into 120 parts (a quarter juz, 5 pages). 5 pages a day are read in Rajab and Sha'ban, 10 pages a day in Ramadan.",
                     'يُقسَّم القرآن إلى ١٢٠ قسمًا (ربع جزء، ٥ صفحات). تُقرأ ٥ صفحات يوميًا في رجب وشعبان، و١٠ صفحات يوميًا في رمضان.'),
    slots: 120,
    ...PIECE_WORDS,
    slotLabel: slot => readingOfPiece (slot, 4),
    defaultRotating: true,
    rotatingText: tx ('Her gün sıradaki 5 sayfaya geçilir; Ramazan\'da kalınan yerden devam edilip her gün 10 sayfa okunur ve üç ayda tam bir hatim biter. Gün sayısı yetmezse eksik sayfalar son iki güne eklenir.',
                      'Each day you move on to the next 5 pages; in Ramadan you continue from where you left off with 10 pages a day, completing a full khatm over the three months. If there are not enough days, the missing pages are added to the last two days.',
                      'كل يوم تنتقل إلى الصفحات الخمس التالية، وفي رمضان تُكمل من حيث توقفت بـ١٠ صفحات يوميًا فتُختم ختمة كاملة في الأشهر الثلاثة. وإن لم تكفِ الأيام تُضاف الصفحات الناقصة إلى آخر يومين.'),
    fixedText: tx ('Recep ve Şaban\'da her gün aynı 5 sayfa, Ramazan\'da her gün o sayfaları içeren 10 sayfa okunur.',
                   "The same 5 pages every day in Rajab and Sha'ban, and the 10 pages containing them every day in Ramadan.",
                   'الصفحات الخمس نفسها كل يوم في رجب وشعبان، و١٠ صفحات تشملها كل يوم في رمضان.'),
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
    title: tx ('3 aylar boyunca her gün 1 sayfa', '1 page a day for the three months', 'صفحة يوميًا طوال الأشهر الثلاثة'),
    description: tx ('Kur\'ân\'ın 604 sayfası dağıtılır; herkes her gün 1 sayfa okur. Bütün sayfalar alındığında her gün bir hatim tamamlanır.',
                     "The 604 pages of the Qur'an are shared out; everyone reads 1 page a day. Once all pages are taken, a khatm is completed every day.",
                     'تُوزَّع صفحات القرآن الـ٦٠٤؛ ويقرأ كل شخص صفحة يوميًا. وعند أخذ كل الصفحات تُختم ختمة كاملة كل يوم.'),
    slots: 604,
    ...PAGE_WORDS,
    slotLabel: slot => readingOfPage (slot),
    defaultRotating: false,
    rotatingText: tx ('Aldığınız sayfadan başlayıp her gün bir sonraki sayfayı okursunuz.',
                      'Starting from the page you take, you read the next page each day.',
                      'تبدأ من الصفحة التي أخذتها وتقرأ الصفحة التالية كل يوم.'),
    fixedText: tx ('Aldığınız sayfayı üç ay boyunca her gün okursunuz.', 'You read the page you take every day for three months.',
                   'تقرأ الصفحة التي أخذتها كل يوم طوال ثلاثة أشهر.'),
    reading: (slot, monthIndex, dayInMonth, dayInPeriod, ramadanStart, rotating) =>
      readingOfPage (rotate (slot, advance (rotating, dayInPeriod), 604)),
  },

  sameSurah: {
    id: 'sameSurah',
    title: tx ('3 aylar boyunca her gün 1 sûre', '1 surah a day for the three months', 'سورة يوميًا طوال الأشهر الثلاثة'),
    description: tx ('114 sûre dağıtılır; herkes her gün 1 sûre okur. Bütün sûreler alındığında her gün bir hatim tamamlanır.',
                     'The 114 surahs are shared out; everyone reads 1 surah a day. Once all surahs are taken, a khatm is completed every day.',
                     'تُوزَّع السور الـ١١٤؛ ويقرأ كل شخص سورة يوميًا. وعند أخذ كل السور تُختم ختمة كاملة كل يوم.'),
    slots: 114,
    ...SURAH_WORDS,
    slotLabel: slot => readingOfSurah (slot),
    defaultRotating: false,
    rotatingText: tx ('Aldığınız sûreden başlayıp her gün bir sonraki sûreyi okursunuz.',
                      'Starting from the surah you take, you read the next surah each day.',
                      'تبدأ من السورة التي أخذتها وتقرأ السورة التالية كل يوم.'),
    fixedText: tx ('Aldığınız sûreyi üç ay boyunca her gün okursunuz.', 'You read the surah you take every day for three months.',
                   'تقرأ السورة التي أخذتها كل يوم طوال ثلاثة أشهر.'),
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
  date.toLocaleDateString (LOCALE, {day: 'numeric', month: 'long', weekday: 'short'});
