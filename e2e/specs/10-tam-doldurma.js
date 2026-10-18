//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Her hatim türü baştan sona doldurulur: son parça hariç hepsi başka cihazlardan (doğrudan sunucuya),
  sonuncusu ekrandan alınır. Sayfa "tamamlandı" durumuna geçmeli; otomatik yeni hatim yalnızca seçildiyse
  ve tam bir kez açılmalı.
*/

const assert = require ('assert/strict');
const {dbGet, waitUntil, sleep} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';
const AUTO = 'Hatim bittiğinde otomatik olarak yeni hatim oluştur';

const takeDirect = (ctx, fn, params) => {
  const query = new URLSearchParams ({
    dev: ctx.config.target === 'test' ? 'true' : 'false', writeTotalReadParts: 'false', ...params,
  });
  return fetch (`${ctx.config.functionsUrl}/.netlify/functions/${fn}?${query}`).then (r => r.status);
};

const inBatches = async (items, run, size = 6) => {
  for (let i = 0; i < items.length; i += size) await Promise.all (items.slice (i, i + size).map (run));
};

const range = (from, to) => Array.from ({length: to - from + 1}, (_, i) => from + i);
const subKeysV3 = hatim => Object.keys (hatim).filter (k => hatim[k] && typeof hatim[k] === 'object' && hatim[k].parts);

// Eski türler (hızlı / Ramazan / her gün 1 cüz): 29 cüz başkalarından, 30. ekrandan
const fillLegacy = async (ctx, {button, route, plan, auto}) => {
  const a = await ctx.user ();
  await a.goto ('/');
  await a.click (button);
  if (plan) await a.click (`#${plan}`);
  await a.type (TITLE_INPUT, `E2E dolu ${route}`);
  if (auto) await a.click (AUTO);
  await a.click ('Devam Et', {exact: true});
  const created = await a.createdKey ();
  assert.equal (created.route, route);
  const {key} = created;
  const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];

  await inBatches (range (1, 29), async no => {
    const status = await takeDirect (ctx, 'takeCuz', {key, subKey, cuzNo: String (no), name: `Kişi ${no}`, alindi: 'true',
                                                       ownerId: `o${no}`, makeNewHatimArg: String (!!auto)});
    assert.equal (status, 200, `${route}: ${no}. cüz alınamadı`);
  });

  await a.goto (`/${route}/${key}`);
  await a.click ('[data-part="30"]');
  await a.type ('#partName', 'Son okuyan');
  await a.click ('#takeButton');
  await a.waitSheetClosed ();
  await waitUntil (async () => {
    const hatim = await dbGet (`hatim/${key}`);
    const c = hatim[subKey][3].cevaplar[9];
    return c.alindi && c.isim === 'Son okuyan';
  }, {message: `${route}: 30. cüz alınamadı`});

  await sleep (2500);
  const subKeys = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys);
  assert.equal (subKeys.length, auto ? 2 : 1, `${route}: yeni hatim sayısı yanlış (${subKeys.length})`);
  if (auto) {
    const fresh = (await dbGet (`hatim/${key}`))[subKeys.find (k => k !== subKey)];
    assert.equal (fresh.baslik, `E2E dolu ${route}`, `${route}: yeni hatim başlığı taşınmadı`);
    if (route === 'ramazan') assert.equal (fresh.isRamazan, true, 'yeni hatim Ramazan hatmi olmalı');
  }
  return a;
};

module.exports = ({test}) => {
  test ('Ramazan (otomatik yeni hatim açık): 30 cüz dolar, Ramazan türünde tek yeni hatim açılır', async ctx => {
    const a = await fillLegacy (ctx, {button: '#newDonerliRamazanKhatm', route: 'ramazan', auto: true});
    await a.waitText ('2. Hatim');
  }, {timeout: 240000});

  test ('3 aylar her gün 1 cüz (otomatik kapalı): 30 cüz dolar, yeni hatim açılmaz, sayfa tamamlandı der', async ctx => {
    const a = await fillLegacy (ctx, {button: '#months3', route: 'ucaylarhergun1cuz', plan: 'eachday1part', auto: false});
    await a.waitText ('Bütün cüzler alındı');
  }, {timeout: 240000});

  test ('3 aylar 10 sayfa: 60 parça dolar, sayfa %100 olur, yeni hatim açılmaz', async ctx => {
    const a = await ctx.user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#tenPagesThenJuz');
    await a.type (TITLE_INPUT, 'E2E dolu 3 aylar');
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    const [subKey] = subKeysV3 (await dbGet (`hatim/${key}`));

    await inBatches (range (1, 59), async no => {
      const status = await takeDirect (ctx, 'takeCuzV3', {key, subKey, cuzNo: String (no), name: `Kişi ${no}`, alindi: 'true', ownerId: `o${no}`});
      assert.equal (status, 200, `${no}. parça alınamadı`);
    });

    await a.goto (`/ucaylar/${key}`);
    await a.click ('#nextFree');
    await a.type ('#partName', 'Son okuyan');
    await a.click ('#takeButton');
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/60/name`)) === 'Son okuyan', {message: '60. parça alınamadı'});
    await a.waitText ('%100');
    await sleep (2000);
    assert.equal (subKeysV3 (await dbGet (`hatim/${key}`)).length, 1);
  }, {timeout: 240000});

  test ('Yâsîn hatmi: 41 okuma dolar, sayfa tamamlandı der', async ctx => {
    const a = await ctx.user ();
    await a.goto ('/');
    await a.click ('#surahKhatm');
    await a.click ('#ozel-yasin');
    await a.type ('#ozelHeader', 'E2E dolu Yâsîn');
    await a.click ('#ozelCreate');
    const {key} = await a.createdKey ();
    const [subKey] = subKeysV3 (await dbGet (`hatim/${key}`));

    await inBatches (range (1, 40), async no => {
      const status = await takeDirect (ctx, 'takeCuzV3', {key, subKey, cuzNo: String (no), name: `Kişi ${no}`, alindi: 'true', ownerId: `o${no}`});
      assert.equal (status, 200, `${no}. okuma alınamadı`);
    });

    await a.goto (`/ozel/${key}`);
    await a.click ('#nextFree');
    await a.type ('#partName', 'Son okuyan');
    await a.click ('#takeButton');
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/41/name`)) === 'Son okuyan', {message: '41. okuma alınamadı'});
    await a.waitText ('Bütün cüzler alındı');
    assert.equal (subKeysV3 (await dbGet (`hatim/${key}`)).length, 1);
  }, {timeout: 240000});
};
