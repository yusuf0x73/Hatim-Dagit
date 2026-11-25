//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Programlanabilir hatim: Kur'ân'ı hangi parçalara bölerek dağıtacağınız.
  Hatimde {kind, size?, name?, count?} olarak saklanır; parça numaraları 1'den başlar.
*/

import {SURAHS, TOTAL_PAGES, juzRange, juzPieceRange, juzOfPage, surahOfPage,
        juzLabel, pageLabel, pagesLabel, surahLabel, halfLabel, quarterLabel, ayahsLabel} from './quran';
import {tx} from '../strings/tx';

// Yâsîn ve Fetih hatminde bir hatim kaç okumadır
export const SURAH_KHATM_SIZE = 41;

export const RECITATIONS = {
  // name hatimde saklanır (Türkçe); label arayüzde gösterilir
  yasin: {id: 'yasin', name: 'Yâsîn', label: SURAHS[35].name, surah: 36, count: SURAH_KHATM_SIZE},
  fetih: {id: 'fetih', name: 'Fetih', label: SURAHS[47].name, surah: 48, count: SURAH_KHATM_SIZE},
};

const pagesText = pagesLabel;

const piece = (n, perJuz) => {
  const juz = Math.ceil (n / perJuz);
  const no = ((n - 1) % perJuz) + 1;
  return {juz, no, range: juzPieceRange (juz, no, perJuz)};
};

const pageGroupRange = (n, size) => ({start: (n - 1) * size + 1, end: Math.min (n * size, TOTAL_PAGES)});

// Sûrenin sayfaları: bir sonraki sûrenin başladığı sayfaya kadar (o sayfa dahil, sûre sayfa ortasında bitebilir)
const surahRange = no => {
  const start = SURAHS[no - 1].page;
  return {start, end: no < SURAHS.length ? Math.max (start, SURAHS[no].page) : TOTAL_PAGES};
};

/**
 * Her birim: slots (parça sayısı), label (uzun ad), sub (alt bilgi), tile (kutuda yazan kısa ad),
 * group (sayfa tabanlılarda cüz numarası; büyük listelerde gruplamak için)
 */
const BUILDERS = {
  juz: () => ({
    slots: 30,
    noun: tx ('cüz', 'juz', 'جزء'),
    label: n => juzLabel (n),
    sub: n => pagesText (juzRange (n)),
    tile: n => String (n),
    range: n => juzRange (n),
  }),

  half: () => ({
    slots: 60,
    noun: tx ('yarım cüz', 'half juz', 'نصف جزء'),
    label: n => { const p = piece (n, 2); return `${juzLabel (p.juz)} · ${halfLabel (p.no)}`; },
    sub: n => pagesText (piece (n, 2).range),
    tile: n => halfLabel (piece (n, 2).no),
    range: n => piece (n, 2).range,
    group: n => piece (n, 2).juz,
  }),

  // Hizb: çeyrek cüz, 5 sayfa (sayfa başından başlar)
  hizb: () => ({
    slots: 120,
    noun: tx ('hizb', 'quarter juz', 'ربع جزء'),
    label: n => { const p = piece (n, 4); return `${juzLabel (p.juz)} · ${tx (`${p.no}. hizb`, quarterLabel (p.no), quarterLabel (p.no))}`; },
    sub: n => pagesText (piece (n, 4).range),
    tile: n => tx (`${piece (n, 4).no}. hizb`, quarterLabel (piece (n, 4).no), quarterLabel (piece (n, 4).no)),
    range: n => piece (n, 4).range,
    group: n => piece (n, 4).juz,
  }),

  page: () => ({
    slots: TOTAL_PAGES,
    noun: tx ('sayfa', 'pages', 'صفحة'),
    label: n => pageLabel (n),
    range: n => ({start: n, end: n}),
    sub: n => `${juzLabel (juzOfPage (n))} · ${surahLabel (surahOfPage (n).name)}`,
    tile: n => String (n),
    group: n => juzOfPage (n),
  }),

  surah: () => ({
    slots: SURAHS.length,
    noun: tx ('sûre', 'surahs', 'سورة'),
    label: n => surahLabel (SURAHS[n - 1].name),
    sub: n => `${tx (`${n}. sûre`, `Surah ${n}`, `السورة ${n}`)} · ${ayahsLabel (SURAHS[n - 1].ayahs)} · ${pageLabel (SURAHS[n - 1].page)}`,
    tile: n => SURAHS[n - 1].name,
    range: surahRange,
    list: true,
  }),

  pages: ({size}) => {
    const per = Math.min (Math.max (Number (size) || 1, 1), TOTAL_PAGES);
    return {
      slots: Math.ceil (TOTAL_PAGES / per),
      noun: per === 1 ? tx ('sayfa', 'pages', 'صفحة') : tx (`${per} sayfa`, `${per}-page parts`, `أقسام من ${per} صفحات`),
      countNoun: tx ('parça', 'parts', 'قسم'),
      label: n => pagesText (pageGroupRange (n, per)),
      sub: n => `${juzLabel (juzOfPage (pageGroupRange (n, per).start))} · ${surahLabel (surahOfPage (pageGroupRange (n, per).start).name)}`,
      tile: n => { const r = pageGroupRange (n, per); return r.start === r.end ? String (r.start) : `${r.start}–${r.end}`; },
      range: n => pageGroupRange (n, per),
      group: n => juzOfPage (pageGroupRange (n, per).start),
    };
  },

  // Sûre okumaları: Yâsîn / Fetih hatmi ya da isim verilen özel okuma
  recite: ({name, count}) => {
    // Yâsîn / Fetih hatminde her okuma o sûredir; isim verilen özel okumanın sayfası yok
    const known = Object.values (RECITATIONS).find (r => r.name === name);
    const shown = known ? known.label : name;
    return {
    slots: Math.max (Number (count) || 1, 1),
    noun: shown,
    label: n => `${n}. ${shown}`,
    sub: () => '',
    tile: n => String (n),
    range: known ? () => surahRange (known.surah) : undefined,
    };
  },
};

export const unitOf = spec => {
  const kind = spec && BUILDERS[spec.kind] ? spec.kind : 'juz';
  return {kind, ...BUILDERS[kind] (spec || {})};
};

// Programlama penceresindeki seçenekler
export const UNIT_OPTIONS = [
  {kind: 'juz', title: tx ('Cüz', 'Juz', 'جزء'), meta: tx ('30 parça · her biri 20 sayfa', '30 parts · 20 pages each', '٣٠ قسمًا · كل قسم ٢٠ صفحة')},
  {kind: 'half', title: tx ('Yarım cüz', 'Half juz', 'نصف جزء'), meta: tx ('60 parça · her biri 10 sayfa', '60 parts · 10 pages each', '٦٠ قسمًا · كل قسم ١٠ صفحات')},
  {kind: 'hizb', title: tx ('Hizb', 'Quarter juz', 'ربع جزء'), meta: tx ('120 parça · her biri 5 sayfa', '120 parts · 5 pages each', '١٢٠ قسمًا · كل قسم ٥ صفحات')},
  {kind: 'page', title: tx ('Sayfa', 'Page', 'صفحة'), meta: tx ('604 sayfa · herkes istediği sayfayı alır', '604 pages · everyone takes the page they want', '٦٠٤ صفحات · كل شخص يأخذ الصفحة التي يريدها')},
  {kind: 'surah', title: tx ('Sûre', 'Surah', 'سورة'), meta: tx ('114 sûre · herkes bir sûre alır', '114 surahs · everyone takes a surah', '١١٤ سورة · كل شخص يأخذ سورة')},
  {kind: 'pages', title: tx ('Sayfa grubu', 'Page groups', 'مجموعة صفحات'), meta: tx ('Kaç sayfalık parçalar olacağını siz seçin', 'You choose how many pages each part has', 'اختر عدد صفحات كل قسم')},
];
