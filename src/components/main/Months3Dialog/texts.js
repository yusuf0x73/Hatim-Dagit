//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Üç aylar plan penceresine özel metinler. Plan adları ve açıklamaları plans/index.js içindedir (PLANS, tx ile).
*/

import {tx, LOCALE} from 'strings/tx';
import {PLANS} from 'plans';

const META = {
  eachday1part: tx ('30 cüz · günde 1 cüz', '30 juz · 1 juz a day', '٣٠ جزءًا · جزء يوميًا'),
  tenPagesThenJuz: tx ('60 parça (yarım cüz)', '60 parts (half a juz)', '٦٠ قسمًا (نصف جزء)'),
  fivePagesThenTenPages: tx ('120 parça (hizb, 5 sayfa)', '120 parts (quarter juz, 5 pages)', '١٢٠ قسمًا (ربع جزء، ٥ صفحات)'),
  samePage: tx ('604 sayfa', '604 pages', '٦٠٤ صفحات'),
  sameSurah: tx ('114 sûre', '114 surahs', '١١٤ سورة'),
};

const DESCRIPTION = {
  eachday1part: tx ('Kur\'ân\'ın 30 cüzü dağıtılır; herkes her gün 1 cüz okur.',
                    "The 30 juz of the Qur'an are shared out; everyone reads 1 juz a day.",
                    'تُوزَّع أجزاء القرآن الثلاثون؛ ويقرأ كل شخص جزءًا يوميًا.'),
};

export const months3Texts = () => ({
  locale: LOCALE,
  back: tx ('‹ Diğer seçenekler', '‹ Other options', '› خيارات أخرى'),
  rotating: tx ('Dönerli', 'Rotating', 'دوّارة'),
  fixed: tx ('Sabit', 'Fixed', 'ثابتة'),
  plan: planId => ({...PLANS[planId], meta: META[planId], description: PLANS[planId].description || DESCRIPTION[planId]}),
});
