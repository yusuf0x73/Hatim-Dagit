//                                     BİSMİLLAHİRRAHMANİRRAHİM

import LocDb from '@yusuf-yeniceri/easy-storage';
import Language from 'strings';

/*
  Cüz alan her cihaz, o hatim için bir secret (ownerId) saklar; sunucu isim değiştirme ve bırakmada bunu kontrol eder.
  Cihazda "bu cüz benim" kaydı silinmiş olsa da secret duruyorsa kişi kendi cüzünü değiştirebilmeli.
  legacy: hızlı / Ramazan / 3 aylar her gün 1 cüz (takeCuz), diğerleri takeCuzV3
*/
export const hasSecret = ({hatimKey, subKey, legacy}) => {
  try {
    const path = legacy ? `Hatim/hatimKeys/${hatimKey}/${subKey}/ownerId` : `Hatim/${hatimKey}/${subKey}/ownerId`;
    const ownerId = LocDb.ref (path).get ();
    return typeof ownerId === 'string' && ownerId.length > 0;
  } catch (error) {
    return false;
  }
};

// Bu cihaz hatmi oluşturdu mu (yıllık / özel: Hatim/<key>/adminToken, diğerleri: Hatim/adminToken listesi)
export const isLocalAdmin = hatimKey => {
  try {
    const direct = LocDb.ref (`Hatim/${hatimKey}/adminToken`).get ();
    if (typeof direct === 'string' && direct.length > 0) return true;
    const list = LocDb.ref ('Hatim/adminToken').get ();
    return Array.isArray (list) && list.some (item => item && Object.keys (item)[0] === hatimKey);
  } catch (error) {
    return false;
  }
};

// Boş görünen parçayı almaya çalışırken: başkası az önce aldıysa 409 ya da (onun kaydı yazıldıysa) 401 gelir
export const takeFailMessage = status =>
  status == 401 || status == 409 ? Language.Kit.JustTaken : Language.Kit.TakeFailed;

// Sunucunun cevabına göre kullanıcıya gösterilecek hata
export const failMessage = (status, fallback) => {
  if (status == 401) return Language.Kit.NotYours;
  if (status == 409) return Language.Kit.JustTaken;
  return fallback;
};
