//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Üç aylar plan penceresinin dil metinleri. Türkçe plan metinleri plans/index.js içindedir (PLANS).
*/

import detectLanguage from 'common';
import {PLANS} from 'plans';

const TR = {
  locale: 'tr-TR',
  back: '‹ Diğer seçenekler',
  rotating: 'Dönerli',
  fixed: 'Sabit',
  plans: {
    eachday1part: {meta: '30 cüz · her gün sıradaki cüz',
                   description: 'Aldığınız cüzden başlayarak her gün bir sonraki cüzü okursunuz.'},
    tenPagesThenJuz: {meta: '60 parça (yarım cüz)'},
    fivePagesThenTenPages: {meta: '120 parça (hizb, 5 sayfa)'},
    samePage: {meta: '604 sayfa'},
    sameSurah: {meta: '114 sûre'},
  },
};

const EN = {
  locale: 'en-GB',
  back: '‹ Other options',
  rotating: 'Rotating',
  fixed: 'Fixed',
  plans: {
    eachday1part: {
      title: '1 juz a day for the three months',
      meta: '30 juz · the next juz each day',
      description: 'Starting from the juz you take, you read the next juz each day.',
    },
    tenPagesThenJuz: {
      title: "10 pages a day in Rajab and Sha'ban, 1 juz a day in Ramadan",
      meta: '60 parts (half a juz)',
      description: "The Qur'an is divided into 60 parts (half a juz, 10 pages). 10 pages a day are read in Rajab and Sha'ban, 1 juz a day in Ramadan.",
      rotatingText: "Each day you move on to the next 10 pages; one khatm is completed in Rajab–Sha'ban. In Ramadan you continue from where you left off with 20 pages (1 juz) a day and complete a second khatm. If there are not enough days, the missing pages are added to the last two days.",
      fixedText: "The same 10 pages every day in Rajab and Sha'ban, and the juz of those pages every day in Ramadan.",
    },
    fivePagesThenTenPages: {
      title: "5 pages a day in Rajab and Sha'ban, 10 pages a day in Ramadan",
      meta: '120 parts (quarter juz, 5 pages)',
      description: "The Qur'an is divided into 120 parts (a quarter juz, 5 pages). 5 pages a day are read in Rajab and Sha'ban, 10 pages a day in Ramadan.",
      rotatingText: 'Each day you move on to the next 5 pages; in Ramadan you continue from where you left off with 10 pages a day, completing a full khatm over the three months. If there are not enough days, the missing pages are added to the last two days.',
      fixedText: "The same 5 pages every day in Rajab and Sha'ban, and the 10 pages containing them every day in Ramadan.",
    },
    samePage: {
      title: '1 page a day for the three months',
      meta: '604 pages',
      description: "The 604 pages of the Qur'an are shared out; everyone reads 1 page a day. Once all pages are taken, a khatm is completed every day.",
      rotatingText: 'Starting from the page you take, you read the next page each day.',
      fixedText: 'You read the page you take every day for three months.',
    },
    sameSurah: {
      title: '1 surah a day for the three months',
      meta: '114 surahs',
      description: 'The 114 surahs are shared out; everyone reads 1 surah a day. Once all surahs are taken, a khatm is completed every day.',
      rotatingText: 'Starting from the surah you take, you read the next surah each day.',
      fixedText: 'You read the surah you take every day for three months.',
    },
  },
};

const AR = {
  locale: 'ar-EG',
  back: '› خيارات أخرى',
  rotating: 'دوّارة',
  fixed: 'ثابتة',
  plans: {
    eachday1part: {
      title: 'جزء يوميًا طوال الأشهر الثلاثة',
      meta: '٣٠ جزءًا · الجزء التالي كل يوم',
      description: 'تبدأ من الجزء الذي أخذته وتقرأ الجزء التالي كل يوم.',
    },
    tenPagesThenJuz: {
      title: '١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان',
      meta: '٦٠ قسمًا (نصف جزء)',
      description: 'يُقسَّم القرآن إلى ٦٠ قسمًا (نصف جزء، ١٠ صفحات). تُقرأ ١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان.',
      rotatingText: 'كل يوم تنتقل إلى الصفحات العشر التالية، فتُختم ختمة في رجب وشعبان. وفي رمضان تُكمل من حيث توقفت بـ٢٠ صفحة (جزء) يوميًا فتُختم ختمة ثانية. وإن لم تكفِ الأيام تُضاف الصفحات الناقصة إلى آخر يومين.',
      fixedText: 'الصفحات العشر نفسها كل يوم في رجب وشعبان، وجزء تلك الصفحات كل يوم في رمضان.',
    },
    fivePagesThenTenPages: {
      title: '٥ صفحات يوميًا في رجب وشعبان، و١٠ صفحات يوميًا في رمضان',
      meta: '١٢٠ قسمًا (ربع جزء، ٥ صفحات)',
      description: 'يُقسَّم القرآن إلى ١٢٠ قسمًا (ربع جزء، ٥ صفحات). تُقرأ ٥ صفحات يوميًا في رجب وشعبان، و١٠ صفحات يوميًا في رمضان.',
      rotatingText: 'كل يوم تنتقل إلى الصفحات الخمس التالية، وفي رمضان تُكمل من حيث توقفت بـ١٠ صفحات يوميًا فتُختم ختمة كاملة في الأشهر الثلاثة. وإن لم تكفِ الأيام تُضاف الصفحات الناقصة إلى آخر يومين.',
      fixedText: 'الصفحات الخمس نفسها كل يوم في رجب وشعبان، و١٠ صفحات تشملها كل يوم في رمضان.',
    },
    samePage: {
      title: 'صفحة يوميًا طوال الأشهر الثلاثة',
      meta: '٦٠٤ صفحات',
      description: 'تُوزَّع صفحات القرآن الـ٦٠٤؛ ويقرأ كل شخص صفحة يوميًا. وعند أخذ كل الصفحات تُختم ختمة كاملة كل يوم.',
      rotatingText: 'تبدأ من الصفحة التي أخذتها وتقرأ الصفحة التالية كل يوم.',
      fixedText: 'تقرأ الصفحة التي أخذتها كل يوم طوال ثلاثة أشهر.',
    },
    sameSurah: {
      title: 'سورة يوميًا طوال الأشهر الثلاثة',
      meta: '١١٤ سورة',
      description: 'تُوزَّع السور الـ١١٤؛ ويقرأ كل شخص سورة يوميًا. وعند أخذ كل السور تُختم ختمة كاملة كل يوم.',
      rotatingText: 'تبدأ من السورة التي أخذتها وتقرأ السورة التالية كل يوم.',
      fixedText: 'تقرأ السورة التي أخذتها كل يوم طوال ثلاثة أشهر.',
    },
  },
};

const TEXTS = {tr: TR, en: EN, ar: AR};

export const months3Texts = () => {
  const language = TEXTS[detectLanguage ()] ? detectLanguage () : 'tr';
  const texts = TEXTS[language];
  // Türkçe metin eksikse plans/index.js'deki Türkçe alanlar kullanılır
  const plan = planId => ({...PLANS[planId], ...TR.plans[planId], ...texts.plans[planId]});
  return {...texts, language, plan};
};
