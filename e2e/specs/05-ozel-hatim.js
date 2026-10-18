//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

// 1..N anahtarlı parçalar REST'te başında null olan dizi olarak gelir
const count = parts => Object.values (parts).filter (Boolean).length;

const subKeysOf = hatim => Object.keys (hatim).filter (k => hatim[k] && typeof hatim[k] === 'object' && hatim[k].parts);

const createYasin = async a => {
  await a.goto ('/');
  await a.click ('#surahKhatm');
  await a.click ('#ozel-yasin');
  // Başlık "E2E" ile başlar: prod'da temizlik betiği yalnızca bunları siler
  await a.type ('#ozelHeader', 'E2E Yâsîn hatmi');
  await a.click ('#ozelCreate');
  const {route, key} = await a.createdKey ();
  assert.equal (route, 'ozel');
  return key;
};

module.exports = ({test}) => {
  test ('Yâsîn hatmi: 41 okuma; sıradaki alınır, okundu işaretlenir, dua günü düzenlenir', async ({user}) => {
    const a = await user ();
    const key = await createYasin (a);
    const hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.type, 'ozel');
    assert.equal (hatim.unit.kind, 'recite');
    const [subKey] = subKeysOf (hatim);
    assert.equal (count (hatim[subKey].parts), 41);

    await a.goto (`/ozel/${key}`);
    await a.click ('#nextFree');
    await a.type ('#partName', 'Halil');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/1/name`)) === 'Halil', {message: 'okuma alınmadı'});
    await a.waitPart (1, 'Halil');

    await a.click ('[data-part="1"]');
    await a.click ('#toggleRead');
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/charts/1/0`)) === true, {message: 'okundu kaydedilmedi'});

    // Kurallar kökte yalnızca header / description / startingDate'e izin verir
    await a.click ('#editHatim');
    await a.type ('#editHeader', 'E2E Yâsîn (düzenlendi)');
    await a.setValue ('#editDate', '2026-12-25');
    await a.click ('#editSave');
    await waitUntil (async () => (await dbGet (`hatim/${key}/startingDate`)) === '2026-12-25', {message: 'dua günü kaydedilmedi'});
    assert.equal (await dbGet (`hatim/${key}/header`), 'E2E Yâsîn (düzenlendi)');
  });

  test ('yarış: 4 kişi aynı anda "sıradakini bana verin" der, okuma tek kişiye gider', async ({user}) => {
    const owner = await user ();
    const key = await createYasin (owner);
    const [subKey] = subKeysOf (await dbGet (`hatim/${key}`));
    const users = await Promise.all ([user (), user (), user (), user ()]);
    await Promise.all (users.map (u => u.goto (`/ozel/${key}`)));
    for (const [i, u] of users.entries ()) {
      await u.click ('#nextFree');
      await u.type ('#partName', `Okuyucu ${i}`);
    }
    await Promise.all (users.map (u => u.click ('#takeButton')));

    const first = await waitUntil (async () => {
      const p = await dbGet (`hatim/${key}/${subKey}/parts/1`);
      return p.isTaken && p;
    }, {message: 'okumayı kimse alamadı'});
    const winner = Number (first.name.slice (-1));
    for (const [i, u] of users.entries ()) if (i !== winner) await u.waitText ('az önce başkası aldı');
    const parts = await dbGet (`hatim/${key}/${subKey}/parts`);
    assert.equal (Object.values (parts).filter (p => p && p.isTaken).length, 1);
  });

  test ('programlanabilir hatim: 2 hatim × 120 hizb açılır, yeni hatim eklenir', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#customKhatm');
    await a.click ('#ozel-hizb');
    await a.type ('#ozelHeader', 'E2E hizb');
    await a.click ('[data-counter="plus"]');
    await a.click ('#ozelCreate');
    const {key} = await a.createdKey ();
    let hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.unit.kind, 'hizb');
    assert.equal (subKeysOf (hatim).length, 2);
    subKeysOf (hatim).forEach (k => assert.equal (count (hatim[k].parts), 120));

    await a.goto (`/ozel/${key}`);
    await a.click ('#NewSubKhatm');
    await a.click ('Evet');
    await waitUntil (async () => subKeysOf (await dbGet (`hatim/${key}`)).length === 3, {message: 'yeni hatim eklenmedi'});
  });
};
