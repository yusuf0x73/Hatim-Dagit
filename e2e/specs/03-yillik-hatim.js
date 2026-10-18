//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const subKeysOf = hatim => Object.keys (hatim).filter (k => hatim[k] && typeof hatim[k] === 'object' && hatim[k].parts);

const createYearly = async a => {
  await a.goto ('/');
  await a.click ('#yearBased');
  await a.type ('input[placeholder="Lütfen Hatim başlığı yazın .."]', 'E2E yıllık hatim');
  await a.click ('Devam Et', {exact: true});
  const {key} = await a.createdKey ();
  const hatim = await dbGet (`hatim/${key}`);
  return {key, subKey: subKeysOf (hatim)[0]};
};

module.exports = ({test}) => {
  test ('yıllık hatimde cüz alınır, ismi değiştirilir, başlık düzenlenir', async ({user}) => {
    const a = await user ();
    const {key, subKey} = await createYearly (a);
    await a.goto (`/yillik/${key}`);

    await a.click ('[data-part="12"]');
    await a.type ('#partName', 'Hasan');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();
    await a.waitPart (12, 'Hasan');
    assert.deepEqual (await dbGet (`hatim/${key}/${subKey}/parts/12`), {name: 'Hasan', isTaken: true});

    await a.click ('[data-part="12"]');
    await a.type ('#partName', 'Hasan Hüseyin');
    await a.click ('İsmi güncelle');
    await a.waitSheetClosed ();
    await a.waitPart (12, 'Hasan Hüseyin');

    // Tek hatim varken "1. Hatim" çubuğu görünmez
    assert.equal ((await a.text ()).includes ('1. Hatim'), false);

    await a.click ('#editHatim');
    await a.type ('#editHeader', 'E2E yıllık (düzenlendi)');
    await a.click ('#editSave');
    await waitUntil (async () => (await dbGet (`hatim/${key}/header`)) === 'E2E yıllık (düzenlendi)', {message: 'başlık kaydedilmedi'});
  });

  test ('yarış: yıllık hatimde aynı cüze üç kişi aynı anda basar, biri alır', async ({user}) => {
    const owner = await user ();
    const {key, subKey} = await createYearly (owner);
    const users = await Promise.all ([user (), user (), user ()]);
    await Promise.all (users.map (u => u.goto (`/yillik/${key}`)));
    for (const [i, u] of users.entries ()) {
      await u.click ('[data-part="20"]');
      await u.type ('#partName', `Kişi ${i}`);
    }
    await Promise.all (users.map (u => u.click ('#takeButton')));

    const part = await waitUntil (async () => {
      const p = await dbGet (`hatim/${key}/${subKey}/parts/20`);
      return p.isTaken && p;
    }, {message: 'cüzü kimse alamadı'});
    const winner = Number (part.name.slice (-1));
    for (const [i, u] of users.entries ()) {
      if (i !== winner) await u.waitText ('az önce başkası aldı');
    }
    await users[winner].waitPart (20, 'Sizin');
  });

  test ('yıllık hatim silinir', async ({user}) => {
    const a = await user ();
    const {key} = await createYearly (a);
    await a.goto (`/yillik/${key}`);
    await a.click ('#deleteHatim');
    await a.click ('Evet, sil');
    await waitUntil (async () => new URL (a.page.url ()).pathname === '/', {message: 'silindikten sonra ana sayfaya dönmedi'});
  });
};
