//                                     BİSMİLLAHİRRAHMANİRRAHİM

/**
 * "Hatimlerim": bu cihazda alınan parçalar ve oluşturulan hatimler.
 * Yeni kayıtlar 'hd.myKhatms' altında tutulur; eski sürümlerin kayıtları
 * (CuzKeyler, LocalDb) sadece okunur ve listeye eklenir, hiçbir zaman değiştirilmez.
 */

const STORE = 'hd.myKhatms';
const TICKS = 'hd.planTicks';
const HIDDEN = 'hd.hiddenKhatms';

const readJson = (name, fallback) => {
  try {
    const value = JSON.parse (localStorage.getItem (name));
    return value == null ? fallback : value;
  } catch (error) {
    return fallback;
  }
};

const writeJson = (name, value) => {
  try {
    localStorage.setItem (name, JSON.stringify (value));
  } catch (error) {
    console.log (`myKhatms: ${error}`);
  }
};

export const KHATM_TYPES = {
  cuz: 'Hızlı Hatim',
  ramazan: 'Ramazan Dönerli',
  yillik: 'Yıllık Hatim',
  ucaylarhergun1cuz: '3 Aylar · Günde 1 cüz',
  ucaylar: '3 Aylar',
  ozel: 'Özel Hatim',
};

const upsert = (key, update) => {
  const store = readJson (STORE, {});
  const current = store[key] || {key, parts: [], created: false};
  store[key] = {...current, ...update (current), updatedAt: Date.now ()};
  writeJson (STORE, store);

  // Kullanıcı daha önce listeden kaldırdıysa yeniden göster
  const hidden = readJson (HIDDEN, []);
  if (hidden.includes (key)) writeJson (HIDDEN, hidden.filter (k => k !== key));
};

export const rememberPart = ({key, type, route, title, subKey, no, label, plan, period, rotating}) =>
  upsert (key, current => ({
    type: type || current.type,
    route: route || current.route,
    title: title || current.title,
    plan: plan || current.plan,
    period: period || current.period,
    rotating: rotating !== undefined ? rotating : current.rotating,
    parts: [
      ...current.parts.filter (p => !(p.subKey === subKey && String (p.no) === String (no))),
      {subKey, no: String (no), label, takenAt: Date.now ()},
    ],
  }));

export const forgetPart = ({key, subKey, no}) =>
  upsert (key, current => ({
    parts: current.parts.filter (p => !(p.subKey === subKey && String (p.no) === String (no))),
  }));

export const rememberCreated = ({key, type, route, title, plan, period, rotating}) =>
  upsert (key, current => ({
    type: type || current.type,
    route: route || current.route,
    title: title || current.title,
    plan: plan || current.plan,
    period: period || current.period,
    rotating: rotating !== undefined ? rotating : current.rotating,
    created: true,
  }));

// Sadece listede zaten olan (yeni ya da eski kayıtlı) hatimlerin başlığını günceller
export const rememberTitle = (key, title) => {
  if (!title) return;
  const store = readJson (STORE, {});
  const known = store[key] || legacyEntries ()[key];
  if (known && known.title !== title) {
    const updated = {...(store[key] || {key, parts: [], created: false}), title};
    writeJson (STORE, {...store, [key]: updated});
  }
};

// Listeden kaldırma sadece bu cihazdaki görünümü etkiler; hatme dokunmaz
export const hideKhatm = key => {
  const hidden = readJson (HIDDEN, []);
  if (!hidden.includes (key)) writeJson (HIDDEN, [...hidden, key]);
};

/* ---------- Eski sürüm kayıtları (salt okunur) ---------- */

const legacyEntries = () => {
  const entries = {};
  const add = (key, update) => {
    entries[key] = {...(entries[key] || {key, parts: [], created: false}), ...update (entries[key] || {parts: []})};
  };

  // Oluşturulan hızlı / Ramazan / 3 aylar hatimleri (/cuz/ sayfası türüne göre yönlendirir)
  const keys = readJson ('CuzKeyler', []);
  const titles = readJson ('CuzKeylerBaslik', []);
  if (Array.isArray (keys)) {
    keys.forEach ((key, index) =>
      add (key, () => ({type: 'cuz', route: `/cuz/${key}`, title: titles[index], created: true}))
    );
  }

  const localDb = readJson ('LocalDb', {});
  const hatim = (localDb && localDb.Hatim) || {};

  // 3 aylar (günde 1 cüz) sayfasında alınan cüzler
  const ucAylarCharts = (((hatim.cizelgeler || {}).ucAylar || {}).herGun1Cuz) || {};
  Object.entries (hatim.hatimKeys || {}).forEach (([key, value]) => {
    if (!value || typeof value !== 'object') return;
    const isUcAylar = ucAylarCharts[key] != null;
    const parts = [];
    Object.entries (value).forEach (([subKey, sub]) => {
      if (subKey === 'title' || !sub || !Array.isArray (sub.parts)) return;
      sub.parts.forEach (no => parts.push ({subKey, no: String (no), label: `${no}. cüz`}));
    });
    add (key, current => ({
      type: current.type && current.type !== 'cuz' ? current.type : isUcAylar ? 'ucaylarhergun1cuz' : 'cuz',
      route: isUcAylar ? `/ucaylarhergun1cuz/${key}` : `/cuz/${key}`,
      title: (value.title && value.title.value) || current.title,
      plan: isUcAylar ? 'eachday1part' : undefined,
      parts: [...current.parts, ...parts],
    }));
  });

  // Yıllık hatimler: Hatim/<key>/<subKey>/parts/<no>
  const adminKeys = (Array.isArray (hatim.adminToken) ? hatim.adminToken : []).map (t => Object.keys (t)[0]);
  Object.entries (hatim).forEach (([key, value]) => {
    if (['adminToken', 'hatimKeys', 'cizelgeler'].includes (key) || !value || typeof value !== 'object') return;
    const parts = [];
    Object.entries (value).forEach (([subKey, sub]) => {
      if (!sub || typeof sub !== 'object' || !sub.parts) return;
      Object.entries (sub.parts).forEach (([no, part]) => {
        if (part && part.isTaken) parts.push ({subKey, no: String (no), label: `${no}. cüz`});
      });
    });
    if (parts.length === 0 && !value.adminToken) return;
    add (key, current => ({
      type: 'yillik',
      route: `/yillik/${key}`,
      title: value.header || current.title,
      created: current.created || !!value.adminToken || adminKeys.includes (key),
      parts: [...current.parts, ...parts],
    }));
  });

  return entries;
};

const dedupeParts = parts => {
  const seen = new Set ();
  return parts.filter (p => {
    const id = `${p.subKey}/${p.no}`;
    if (seen.has (id)) return false;
    seen.add (id);
    return true;
  });
};

// Tüm kayıtlar: yeni kayıtlar eskilerin üzerine yazar
export const listKhatms = () => {
  const legacy = legacyEntries ();
  const store = readJson (STORE, {});
  const hidden = readJson (HIDDEN, []);
  const merged = {...legacy};

  Object.values (store).forEach (entry => {
    const old = merged[entry.key] || {parts: []};
    merged[entry.key] = {
      ...old,
      ...entry,
      title: entry.title || old.title,
      created: entry.created || old.created,
      parts: dedupeParts ([...entry.parts, ...old.parts]),
    };
  });

  return Object.values (merged)
    .filter (entry => !hidden.includes (entry.key))
    .sort ((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
};

/* ---------- Çizelge işaretleri ---------- */

export const getTicks = (key, no) => readJson (TICKS, {})[`${key}/${no}`] || [];

export const toggleTick = (key, no, dayIndex) => {
  const ticks = readJson (TICKS, {});
  const id = `${key}/${no}`;
  const current = ticks[id] || [];
  ticks[id] = current.includes (dayIndex) ? current.filter (d => d !== dayIndex) : [...current, dayIndex];
  writeJson (TICKS, ticks);
  return ticks[id];
};

// Çevrimiçi çizelgeden gelen işaretleri yerel kopyaya yazar (ana sayfadaki "Bugün" kartı için)
export const setTicks = (key, no, days) => {
  const ticks = readJson (TICKS, {});
  ticks[`${key}/${no}`] = days;
  writeJson (TICKS, ticks);
};
