import dataMonths3 from './strings/dataMonths3';
import {db} from './backend';

const SUPPORTED_LANGUAGES = ['tr', 'en', 'ar'];

// "en-GB", "ar_AE", "TR-tr" gibi değerleri desteklenen dil koduna çevirir
const normalizeLanguage = value => {
  const code = String (value || '').toLowerCase ().split (/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes (code) ? code : null;
};

/**
 * Seçilmiş dil > cihazın dil listesi > İngilizce.
 * Eskiden sadece "en", "en-US", "tr" gibi tam eşleşmeler tanınıyordu; "en-GB", "ar-AE" vb. Türkçe açılıyordu.
 */
const detectLanguage = () => {
  if (navigator.userAgent.toLowerCase ().indexOf ('googlebot') != -1) {
    return 'tr';
  }
  let saved = null;
  try {
    saved = normalizeLanguage (localStorage.getItem ('language'));
  } catch (error) {}
  if (saved) return saved;

  const deviceLanguages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || navigator.userLanguage];
  for (const language of deviceLanguages) {
    const code = normalizeLanguage (language);
    if (code) return code;
  }
  return 'en';
};

const setLanguage = lang => localStorage.setItem ('language', lang);

const removeAll = (obj, item, subKey) => {
  let arr = obj[subKey];
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === item) {
      arr.splice (i, 1);
    } else {
      ++i;
    }
  }
  obj[subKey] = arr;
  return obj;
};

const removeAll_v1 = (arr, item) => {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === item) {
      arr.splice (i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

const objectToArray = obj => {
  return Object.keys (obj)
    .filter (
      x =>
        [
          'adminToken',
          'delete',
          'subKey',
          'makeNewHatim',
          'khatmSubKeys',
          'activeSubKhatmKey',
          'totalReadParts',
        ].includes (x) == false
    )
    .map (key => {
      obj[key].subKey = key;
      return obj[key];
    });
};

function getObjectSize (obj) {
  const seen = new Set ();
  function sizeOfObject (object) {
    if (object !== null && typeof object === 'object' && !seen.has (object)) {
      seen.add (object);
      let bytes = 0;
      for (const key in object) {
        if (object.hasOwnProperty (key)) {
          bytes += sizeOfObject (object[key]);
        }
      }
      return bytes;
    }
    if (object !== null && typeof object === 'string') {
      return object.length * 2; // 2 bytes per character
    }
    return typeof object === 'number' ? 8 : 0; // Assuming 8 bytes for numbers
  }

  const bytes = sizeOfObject (obj);
  return bytes;
}

const objectToArrayV3 = obj => {
  const keys = [
    'header',
    'description',
    'adminToken',
    'donerli',
    'howManyDays',
    'makeNewHatim',
    'startingDate',
    'totalKhatmsBeDistributed',
    'type',
    'version',
  ];

  return Object.keys (obj)
    .filter (x => keys.includes (x) == false)
    .map (key => {
      obj[key].subKey = key;
      return obj[key];
    });
};

const isSafari = () => {
  let userAgentString = navigator.userAgent;
  let chromeAgent = userAgentString.indexOf ('Chrome') > -1;
  let safariAgent = userAgentString.indexOf ('Safari') > -1;
  if (chromeAgent && safariAgent) safariAgent = false;
  return safariAgent;
};

const isStandalone = () => {
  return 'standalone' in window.navigator && window.navigator.standalone;
};

const extractKey = db.api.extractKey;

const initializeLocalStorage = type => {
  switch (type) {
    case 'cuz':
      localStorage.setItem ('cuz', JSON.stringify ({}));
      break;
    case 'cuz_v1':
      localStorage.setItem (
        'cuz_v1',
        JSON.stringify (JSON.parse (localStorage.getItem ('cuz')) || [])
      );
      initializeLocalStorage ('cuz');
      break;
  }
};

/** current index for Hatimler visibilities */
const getCurrentIndex = allLanguage => {
  let currentIndex = 0;
  for (let i = 0; i < allLanguage.length; i++) {
    let totalCevap =
      allLanguage[i][1].cevaplar.filter (cevap => cevap.alindi).length +
      allLanguage[i][2].cevaplar.filter (cevap => cevap.alindi).length +
      allLanguage[i][3].cevaplar.filter (cevap => cevap.alindi).length;

    if (totalCevap != 30) {
      currentIndex = i;
      break;
    }
  }

  return currentIndex;
};

/** current index for Hatimler visibilities */
const getCurrentIndexV3 = hatims => {
  let currentIndex = 0;
  for (let i = 0; i < hatims.length; i++) {
    let totalCevap = hatims[i].parts.filter (part => part.isTaken).length;

    if (totalCevap != 30) {
      currentIndex = i;
      break;
    }
  }

  return currentIndex;
};

// Ağ isteği belirtilen sürede dönmezse hata fırlatır (internet yokken sonsuza kadar beklememek için)
const withTimeout = (promise, ms) =>
  new Promise ((resolve, reject) => {
    const timer = setTimeout (() => reject (new Error ('timeout')), ms);
    promise.then (
      value => {
        clearTimeout (timer);
        resolve (value);
      },
      error => {
        clearTimeout (timer);
        reject (error);
      }
    );
  });

const DAY_MS = 24 * 60 * 60 * 1000;

const toIsoDate = date => date.toISOString ().slice (0, 10);

// dataMonths3 tablosundaki (Diyanet'e göre girilmiş) dönemler
const tableMonths3Periods = () =>
  Object.values (dataMonths3).flatMap (entry => {
    if (entry.double) {
      return [1, 2].map (i => ({
        startingDate: entry[`startingDate${i}`],
        monthDays: entry[`monthDays${i}`],
      }));
    }
    return [{startingDate: entry.startingDate, monthDays: entry.monthDays}];
  });

// Tabloda olmayan yıllar için Recep, Şaban ve Ramazan'ı Hicri takvimden hesaplar
const computedMonths3Periods = from => {
  const formatter = new Intl.DateTimeFormat ('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    timeZone: 'UTC',
  });
  const hijri = time => {
    const parts = {};
    formatter
      .formatToParts (new Date (time))
      .forEach (part => (parts[part.type] = part.value));
    return {month: parseInt (parts.month), day: parseInt (parts.day)};
  };

  const periods = [];
  let time =
    Date.UTC (from.getFullYear (), from.getMonth (), from.getDate ()) -
    120 * DAY_MS;
  for (let i = 0; i < 800 && periods.length < 2; i++, time += DAY_MS) {
    const {month, day} = hijri (time);
    if (month !== 7 || day !== 1) continue;

    const monthDays = [];
    let monthStart = time;
    [7, 8, 9].forEach (hijriMonth => {
      let length = 0;
      while (hijri (monthStart + length * DAY_MS).month === hijriMonth) length++;
      monthDays.push (length);
      monthStart += length * DAY_MS;
    });
    periods.push ({startingDate: toIsoDate (new Date (time)), monthDays});
  }
  return periods;
};

/**
 * Bitmemiş ilk üç aylar dönemini döndürür: {startingDate: Recep'in 1. günü, monthDays: [Recep, Şaban, Ramazan]}
 * Tabloda o döneme ait (Diyanet) kayıt varsa o kullanılır, yoksa Hicri takvimden hesaplanır.
 */
const getMonths3Date = () => {
  const today = new Date ();
  const periodEnd = period => {
    const end = new Date (period.startingDate);
    end.setDate (end.getDate () + period.monthDays.reduce ((a, b) => a + b));
    return end;
  };

  const tablePeriods = tableMonths3Periods ();
  let periods = tablePeriods;
  try {
    periods = computedMonths3Periods (today).map (
      computed =>
        tablePeriods.find (
          period =>
            Math.abs (new Date (period.startingDate) - new Date (computed.startingDate)) <=
            5 * DAY_MS
        ) || computed
    );
  } catch (error) {
    console.log (`getMonths3Date: ${error}`);
  }

  return (
    periods.find (period => periodEnd (period) >= today) ||
    tablePeriods[tablePeriods.length - 1]
  );
};

const isEmptyObjectLocDb = value => {
  if (typeof value == 'object' && Object.keys (value).length == 0) {
    return true;
  }

  return false;
};

const isKhatmFull = khatm => {
  let totalCevap =
    khatm[1].cevaplar.filter (cevap => cevap.alindi).length +
    khatm[2].cevaplar.filter (cevap => cevap.alindi).length +
    khatm[3].cevaplar.filter (cevap => cevap.alindi).length;

  return totalCevap > 29;
};

const getTotalPartsInKhatm = khatm => {
  let totalCevap =
    khatm[1].cevaplar.filter (cevap => cevap.alindi).length +
    khatm[2].cevaplar.filter (cevap => cevap.alindi).length +
    khatm[3].cevaplar.filter (cevap => cevap.alindi).length;
  return totalCevap;
};

const typeCheck = (data, type) => {
  if (typeof data == type) {
    return true;
  }

  return false;
};

const hatimSiraBelirle = no => {
  let hatimSira = 1;
  switch (true) {
    case no < 11:
      break;
    case no < 21:
      hatimSira = 2;
      break;
    case no <= 30:
      hatimSira = 3;
      break;
  }

  return {
    sira: hatimSira,
    subSira: no - ((hatimSira - 1) * 10 + 1),
  };
};

const isAdmin = () => {
  return (JSON.parse (localStorage.getItem ('CuzKeyler'))
    ? JSON.parse (localStorage.getItem ('CuzKeyler'))
    : []).includes (extractKey ());
};

const version = '2.0.0';

export default detectLanguage;

export {
  setLanguage,
  removeAll,
  removeAll_v1,
  objectToArray,
  objectToArrayV3,
  isSafari,
  isStandalone,
  extractKey,
  initializeLocalStorage,
  getMonths3Date,
  withTimeout,
  version,
  isEmptyObjectLocDb,
  typeCheck,
  getCurrentIndex,
  getCurrentIndexV3,
  isKhatmFull,
  hatimSiraBelirle,
  getTotalPartsInKhatm,
  isAdmin,
};
