//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Bileşen içindeki kısa metinler için: tx ('Türkçe', 'English', 'العربية').
  Dil sayfa yüklenince belirlenir; dil değişince sayfa yenilenir (LanguagePicker).
*/

import detectLanguage from '../common';

export const LANG = detectLanguage ();

export const tx = (tr, en, ar) => (LANG === 'en' ? en : LANG === 'ar' ? ar : tr);

export const LOCALE = {tr: 'tr-TR', en: 'en-GB', ar: 'ar-EG'}[LANG] || 'tr-TR';

// Sayıları dilin rakamlarıyla yazar (Arapçada ١٢٣)
export const num = n => (LANG === 'ar' ? Number (n).toLocaleString ('ar-EG', {useGrouping: false}) : String (n));
