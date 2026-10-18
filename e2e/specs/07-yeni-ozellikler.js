//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

const cevap = (hatim, subKey, no) => {
  const sira = no < 11 ? 1 : no < 21 ? 2 : 3;
  return hatim[subKey][sira].cevaplar[no - (sira - 1) * 10 - 1];
};

const create = async (a, button, {plan} = {}) => {
  await a.goto ('/');
  await a.click (button);
  if (plan) await a.click (`#${plan}`);
  await a.type (TITLE_INPUT, 'E2E yeni özellik');
  await a.click ('Devam Et', {exact: true});
  return a.createdKey ();
};

const take = async (u, no, name) => {
  await u.click (`[data-part="${no}"]`);
  await u.type ('#partName', name);
  await u.click ('#takeButton');
  await u.waitSheetClosed ();
  await u.waitPart (no, name);
};

module.exports = ({test}) => {
  test ('admin: hızlı hatimde başkasının cüzünün ismini değiştirir ve bırakır', async ({user}) => {
    const admin = await user ();
    const {key} = await create (admin, '#newKhatm');
    const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];

    const b = await user ();
    await b.goto (`/cuz/${key}`);
    await take (b, 11, 'Ömer');

    await admin.goto (`/cuz/${key}`);
    await admin.click ('[data-part="11"]');
    await admin.type ('#partName', 'Ömer Faruk');
    await admin.click ('İsmi güncelle');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 11).isim === 'Ömer Faruk', {message: 'admin ismi değiştiremedi'});

    await admin.waitPart (11, 'Ömer Faruk');
    await admin.click ('[data-part="11"]');
    await admin.click ('#releaseButton');
    await admin.click ('#releaseButton');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 11).alindi === false, {message: 'admin bırakamadı'});
  });

  test ('admin: yıllık hatimde başkasının cüzünün ismini değiştirir; "aldıklarım" rozeti çizelgeyi açar', async ({user}) => {
    const admin = await user ();
    const {key} = await create (admin, '#yearBased');
    const hatim = await dbGet (`hatim/${key}`);
    const subKey = Object.keys (hatim).find (k => hatim[k] && hatim[k].parts);

    const b = await user ();
    await b.goto (`/yillik/${key}`);
    await take (b, 6, 'Bilal');

    // B kendi rozetine dokununca doğrudan çizelgesi açılır
    await b.click ('6. cüz', {exact: true});
    await b.waitText ('Okuma çizelgesi');
    await b.waitText ('Tebrik bırakın');

    await admin.goto (`/yillik/${key}`);
    await admin.click ('[data-part="6"]');
    await admin.type ('#partName', 'Bilal-i Habeşî');
    await admin.click ('İsmi güncelle');
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/6/name`)) === 'Bilal-i Habeşî', {message: 'admin ismi değiştiremedi'});
  });

  test ('3 aylar: başkasının çizelgesine bakılır, kendi kartına dokununca çizelge açılır', async ({user}) => {
    const a = await user ();
    const {key} = await create (a, '#months3', {plan: 'tenPagesThenJuz'});
    await a.goto (`/ucaylar/${key}`);
    await take (a, 3, 'Hatice');

    await a.click ('[data-mine="3"]');
    await a.waitText ('Okuma çizelgesi', {timeout: 5000}).catch (() => {});
    await waitUntil (async () => (await a.text ()).includes ('gün okundu'), {message: 'kendi çizelgesi açılmadı'});

    const b = await user ();
    await b.goto (`/ucaylar/${key}`);
    await b.click ('[data-part="3"]');
    await b.click ('#otherChart');
    await b.waitText ('Hatice ·');
    await b.waitText ('Bu çizelgeyi sadece cüzü alan kişi işaretleyebilir');
  });

  test ('emoji: 5 kişi aynı anda tebrik bırakır, hiçbiri kaybolmaz; geri alınabilir', async ({user}) => {
    const owner = await user ();
    const {key} = await create (owner, '#newKhatm');
    const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];
    await owner.goto (`/cuz/${key}`);
    await take (owner, 2, 'Zehra');

    const fans = await Promise.all (Array.from ({length: 5}, () => user ()));
    await Promise.all (fans.map (f => f.goto (`/cuz/${key}`)));
    for (const f of fans) {
      await f.waitPart (2, 'Zehra');
      await f.click ('[data-part="2"]');
      await f.waitText ('Tebrik bırakın');
    }
    await Promise.all (fans.map (f => f.click ('[data-reaction="dua"]')));

    const count = async () => Object.keys ((await dbGet (`hatim/${key}/${subKey}/charts/reactions/2/dua`)) || {}).length;
    await waitUntil (async () => (await count ()) === 5, {message: 'tebriklerin hepsi kaydedilmedi'});

    // Geri alma
    await fans[0].click ('[data-reaction="dua"]');
    await waitUntil (async () => (await count ()) === 4, {message: 'tebrik geri alınmadı'});

    // Kartta emoji görünür
    await owner.goto (`/cuz/${key}`);
    await waitUntil (() => owner.page.evaluate (() => (document.querySelector ('[data-reactions="2"]') || {}).innerText === '🤲4'),
                     {message: 'kartta emoji özeti görünmedi'});
    assert.ok (true);
  });
};
