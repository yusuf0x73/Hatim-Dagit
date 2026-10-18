//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

// 1..N anahtarlı parçalar REST'te başında null olan dizi olarak gelir
const count = parts => Object.values (parts).filter (Boolean).length;

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

const cevap = (hatim, subKey, no) => {
  const sira = no < 11 ? 1 : no < 21 ? 2 : 3;
  return hatim[subKey][sira].cevaplar[no - (sira - 1) * 10 - 1];
};

module.exports = ({test}) => {
  test ('3 aylar: yeni plan "sabit" kaydedilir; parça alınır, ismi değişir, bırakılır', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#tenPagesThenJuz');
    await a.type (TITLE_INPUT, 'E2E 3 aylar 10 sayfa');
    await a.click ('Devam Et', {exact: true});
    const {route, key} = await a.createdKey ();
    assert.equal (route, 'ucaylar');

    const hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.plan, 'tenPagesThenJuz');
    assert.equal (hatim.rotating, false, 'varsayılan sabit olmalı');
    const subKey = Object.keys (hatim).find (k => hatim[k] && hatim[k].parts);
    assert.equal (count (hatim[subKey].parts), 60);

    await a.goto (`/ucaylar/${key}`);
    await a.click ('[data-part="7"]');
    await a.type ('#partName', 'Meryem');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/7/name`)) === 'Meryem', {message: 'parça alınmadı'});

    await a.click ('[data-part="7"]');
    await a.type ('#partName', 'Meryem Ana');
    await a.click ('#renameButton');
    await a.waitSheetClosed ();
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/7/name`)) === 'Meryem Ana', {message: 'isim değişmedi'});

    await a.click ('[data-part="7"]');
    await a.click ('#releaseButton');
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/7/isTaken`)) === false, {message: 'bırakılmadı'});
  });

  test ('3 aylar: ikinci oluşturmada da "sabit" seçili kalır', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#samePage');
    await a.click ('#rotating');
    await a.type (TITLE_INPUT, 'E2E dönerli');
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    assert.equal (await dbGet (`hatim/${key}/rotating`), true, 'kullanıcı dönerli seçti');

    await a.page.keyboard.press ('Escape');
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#samePage');
    assert.equal (await a.page.$eval ('#fixed', el => el.getAttribute ('aria-checked')), 'true');
  });

  test ('3 aylar her gün 1 cüz ve Ramazan hatminde cüz alınır, sahibi ismini değiştirir', async ({user}) => {
    for (const [button, route, extra] of [['#months3', 'ucaylarhergun1cuz', '#eachday1part'], ['#newDonerliRamazanKhatm', 'ramazan', null]]) {
      const a = await user ();
      await a.goto ('/');
      await a.click (button);
      if (extra) await a.click (extra);
      await a.type (TITLE_INPUT, `E2E ${route}`);
      await a.click ('Devam Et', {exact: true});
      const created = await a.createdKey ();
      assert.equal (created.route, route);
      const {key} = created;
      const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];

      await a.goto (`/${route}/${key}`);
      await a.click ('[data-part="15"]');
      await a.type ('#partName', 'Yusuf');
      await a.click ('#takeButton');
      await a.waitSheetClosed ();
      await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 15).isim === 'Yusuf', {message: `${route}: cüz alınmadı`});
      await a.waitPart (15, 'Yusuf');

      await a.click ('[data-part="15"]');
      await a.type ('#partName', 'Yusuf Ziya');
      await a.click ('İsmi güncelle');
      await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 15).isim === 'Yusuf Ziya', {message: `${route}: isim değişmedi`});
    }
  }, {timeout: 120000});
};
