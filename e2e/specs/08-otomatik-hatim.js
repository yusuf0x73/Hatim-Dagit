//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  "Hatim bittiğinde otomatik olarak yeni hatim oluştur": 29 cüz başkaları tarafından alınır (doğrudan sunucuya),
  30. cüz ekrandan alınır; tam olarak bir yeni hatim açılmalı ve sayfada görünmeli.
*/

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';
const AUTO = 'Hatim bittiğinde otomatik olarak yeni hatim oluştur';

// Başka cihazlardan cüz alma (her biri ayrı sahip)
const takeDirect = (ctx, fn, params) => {
  const query = new URLSearchParams ({
    dev: ctx.config.target === 'test' ? 'true' : 'false', writeTotalReadParts: 'false', makeNewHatimArg: 'true', ...params,
  });
  return fetch (`${ctx.config.functionsUrl}/.netlify/functions/${fn}?${query}`).then (r => r.status);
};

// Aynı anda en fazla 6 istek
const inBatches = async (items, run) => {
  for (let i = 0; i < items.length; i += 6) await Promise.all (items.slice (i, i + 6).map (run));
};

const subKeysV3 = hatim => Object.keys (hatim).filter (k => hatim[k] && typeof hatim[k] === 'object' && hatim[k].parts);

module.exports = ({test}) => {
  test ('hızlı hatim: 30. cüz alınınca tek bir yeni hatim açılır ve sayfada görünür', async ctx => {
    const a = await ctx.user ();
    await a.goto ('/');
    await a.click ('#newKhatm');
    await a.type (TITLE_INPUT, 'E2E otomatik hatim');
    await a.click (AUTO);
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    let hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.makeNewHatim, true, 'otomatik hatim seçeneği kaydedilmedi');
    const subKey = Object.values (hatim.khatmSubKeys)[0];

    const others = Array.from ({length: 29}, (_, i) => i + 1);
    await inBatches (others, async no => {
      const status = await takeDirect (ctx, 'takeCuz', {key, subKey, cuzNo: String (no), name: `Kişi ${no}`, alindi: 'true', ownerId: `o${no}`});
      assert.equal (status, 200, `${no}. cüz alınamadı`);
    });
    hatim = await dbGet (`hatim/${key}`);
    assert.equal (Object.values (hatim.khatmSubKeys).length, 1, '29 cüzde yeni hatim açılmamalı');

    await a.goto (`/cuz/${key}`);
    await a.click ('[data-part="30"]');
    await a.type ('#partName', 'Son okuyan');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();

    const subKeys = await waitUntil (async () => {
      const keys = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys);
      return keys.length === 2 && keys;
    }, {timeout: 20000, message: '30. cüzden sonra yeni hatim açılmadı'});
    const fresh = subKeys.find (k => k !== subKey);

    // Yeni hatim boş 30 cüzle sayfada görünür
    await a.goto (`/cuz/${key}`);
    await waitUntil (() => a.page.evaluate (sub => document.querySelectorAll (`[data-sub="${sub}"][data-part]`).length === 30, fresh),
                     {message: 'yeni hatim sayfada görünmedi'});

    // Bir süre sonra da tek yeni hatim kalmalı
    await new Promise (r => setTimeout (r, 2000));
    assert.equal (Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys).length, 2);
  }, {timeout: 180000});

  test ('yıllık hatim: son cüz alınınca tek bir yeni hatim açılır ve sayfada görünür', async ctx => {
    const a = await ctx.user ();
    await a.goto ('/');
    await a.click ('#yearBased');
    await a.type (TITLE_INPUT, 'E2E otomatik yıllık');
    await a.click (AUTO);
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    let hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.makeNewHatim, true, 'otomatik hatim seçeneği kaydedilmedi');
    const [subKey] = subKeysV3 (hatim);

    await inBatches (Array.from ({length: 29}, (_, i) => i + 1), async no => {
      const status = await takeDirect (ctx, 'takeCuzV3', {key, subKey, cuzNo: String (no), name: `Kişi ${no}`, alindi: 'true', ownerId: `o${no}`});
      assert.equal (status, 200, `${no}. cüz alınamadı`);
    });
    assert.equal (subKeysV3 (await dbGet (`hatim/${key}`)).length, 1, '29 cüzde yeni hatim açılmamalı');

    await a.goto (`/yillik/${key}`);
    await a.click ('[data-part="30"]');
    await a.type ('#partName', 'Son okuyan');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();

    await waitUntil (async () => subKeysV3 (await dbGet (`hatim/${key}`)).length === 2,
                     {timeout: 20000, message: 'son cüzden sonra yeni hatim açılmadı'});
    // Canlı sayfa: ikinci hatim kendiliğinden görünür (yenilemeden)
    await a.waitText ('2. Hatim');
    await new Promise (r => setTimeout (r, 2000));
    assert.equal (subKeysV3 (await dbGet (`hatim/${key}`)).length, 2);
  }, {timeout: 180000});
};
