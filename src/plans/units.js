//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Programlanabilir hatim: Kur'ân'ı hangi parçalara bölerek dağıtacağınız.
  Hatimde {kind, size?, name?, count?} olarak saklanır; parça numaraları 1'den başlar.
*/

import {SURAHS, TOTAL_PAGES, juzRange, juzPieceRange, juzOfPage, surahOfPage} from './quran';

// Yâsîn ve Fetih hatminde bir hatim kaç okumadır
export const SURAH_KHATM_SIZE = 41;

export const RECITATIONS = {
  yasin: {id: 'yasin', name: 'Yâsîn', surah: 36, count: SURAH_KHATM_SIZE},
  fetih: {id: 'fetih', name: 'Fetih', surah: 48, count: SURAH_KHATM_SIZE},
};

const pagesText = ({start, end}) => (start === end ? `${start}. sayfa` : `${start}–${end}. sayfalar`);

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
    noun: 'cüz',
    label: n => `${n}. cüz`,
    sub: n => pagesText (juzRange (n)),
    tile: n => String (n),
    range: n => juzRange (n),
  }),

  half: () => ({
    slots: 60,
    noun: 'yarım cüz',
    label: n => { const p = piece (n, 2); return `${p.juz}. cüz · ${p.no}. yarı`; },
    sub: n => pagesText (piece (n, 2).range),
    tile: n => `${piece (n, 2).no}. yarı`,
    range: n => piece (n, 2).range,
    group: n => piece (n, 2).juz,
  }),

  // Hizb: çeyrek cüz, 5 sayfa (sayfa başından başlar)
  hizb: () => ({
    slots: 120,
    noun: 'hizb',
    label: n => { const p = piece (n, 4); return `${p.juz}. cüz · ${p.no}. hizb`; },
    sub: n => pagesText (piece (n, 4).range),
    tile: n => `${piece (n, 4).no}. hizb`,
    range: n => piece (n, 4).range,
    group: n => piece (n, 4).juz,
  }),

  page: () => ({
    slots: TOTAL_PAGES,
    noun: 'sayfa',
    label: n => `${n}. sayfa`,
    range: n => ({start: n, end: n}),
    sub: n => `${juzOfPage (n)}. cüz · ${surahOfPage (n).name} Sûresi`,
    tile: n => String (n),
    group: n => juzOfPage (n),
  }),

  surah: () => ({
    slots: SURAHS.length,
    noun: 'sûre',
    label: n => `${SURAHS[n - 1].name} Sûresi`,
    sub: n => `${n}. sûre · ${SURAHS[n - 1].ayahs} âyet · ${SURAHS[n - 1].page}. sayfa`,
    tile: n => SURAHS[n - 1].name,
    range: surahRange,
    list: true,
  }),

  pages: ({size}) => {
    const per = Math.min (Math.max (Number (size) || 1, 1), TOTAL_PAGES);
    return {
      slots: Math.ceil (TOTAL_PAGES / per),
      noun: per === 1 ? 'sayfa' : `${per} sayfa`,
      countNoun: 'parça',
      label: n => pagesText (pageGroupRange (n, per)),
      sub: n => `${juzOfPage (pageGroupRange (n, per).start)}. cüz · ${surahOfPage (pageGroupRange (n, per).start).name} Sûresi`,
      tile: n => { const r = pageGroupRange (n, per); return r.start === r.end ? String (r.start) : `${r.start}–${r.end}`; },
      range: n => pageGroupRange (n, per),
      group: n => juzOfPage (pageGroupRange (n, per).start),
    };
  },

  // Sûre okumaları: Yâsîn / Fetih hatmi ya da isim verilen özel okuma
  recite: ({name, count}) => {
    // Yâsîn / Fetih hatminde her okuma o sûredir; isim verilen özel okumanın sayfası yok
    const known = Object.values (RECITATIONS).find (r => r.name === name);
    return {
    slots: Math.max (Number (count) || 1, 1),
    noun: name,
    label: n => `${n}. ${name}`,
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
  {kind: 'juz', title: 'Cüz', meta: '30 parça · her biri 20 sayfa'},
  {kind: 'half', title: 'Yarım cüz', meta: '60 parça · her biri 10 sayfa'},
  {kind: 'hizb', title: 'Hizb', meta: '120 parça · her biri 5 sayfa'},
  {kind: 'page', title: 'Sayfa', meta: '604 sayfa · herkes istediği sayfayı alır'},
  {kind: 'surah', title: 'Sûre', meta: '114 sûre · herkes bir sûre alır'},
  {kind: 'pages', title: 'Sayfa grubu', meta: 'Kaç sayfalık parçalar olacağını siz seçin'},
];
