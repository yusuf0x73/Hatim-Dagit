//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Güncelleme kullanıcının cihazındaki kayıtları silmemeli: eski sürümlerden kalan localStorage
  (eski biçim 'cuz' dizisi, hatim listesi, admin token'ları, dil) yeni sayfalarda cüz alınca korunur.
*/

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

module.exports = ({test}) => {
  test ('eski sürümden kalan cihaz kayıtları cüz alınca silinmez', async ({user}) => {
    const owner = await user ();
    await owner.goto ('/');
    await owner.click ('#newDonerliRamazanKhatm');
    await owner.type (TITLE_INPUT, 'E2E yerel kayıt');
    await owner.click ('Devam Et', {exact: true});
    const {key} = await owner.createdKey ();
    const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];

    const u = await user ();
    await u.goto ('/');
    // Eski bir cihaz: çok eski biçim 'cuz' dizisi, hatim listesi, başka bir hatmin admin token'ı
    const old = {
      cuz: JSON.stringify (['3', '7']),
      CuzKeyler: JSON.stringify (['-eskiHatim1']),
      CuzKeylerBaslik: JSON.stringify (['Eski hatmim']),
      language: 'tr',
    };
    await u.page.evaluate (old => {
      Object.entries (old).forEach (([k, v]) => localStorage.setItem (k, v));
      const db = JSON.parse (localStorage.getItem ('LocalDb') || '{}');
      db.Hatim = {adminToken: [{'-eskiHatim1': 'eskiToken'}]};
      localStorage.setItem ('LocalDb', JSON.stringify (db));
    }, old);

    await u.goto (`/ramazan/${key}`);
    await u.click ('[data-part="12"]');
    await u.type ('#partName', 'Eski cihaz');
    await u.click ('#takeButton');
    await u.waitSheetClosed ();
    await waitUntil (async () => (await dbGet (`hatim/${key}`))[subKey][2].cevaplar[1].alindi, {message: 'cüz alınmadı'});
    await u.waitPart (12, 'Eski cihaz');

    const now = await u.page.evaluate (() => ({...localStorage}));
    assert.deepEqual (JSON.parse (now.cuz_v1), ['3', '7'], 'eski "cuz" dizisi cuz_v1\'e taşınmalı');
    assert.deepEqual (JSON.parse (now.cuz)[subKey], ['12']);
    assert.equal (now.CuzKeyler, old.CuzKeyler);
    assert.equal (now.CuzKeylerBaslik, old.CuzKeylerBaslik);
    assert.equal (now.language, 'tr');
    assert.deepEqual (JSON.parse (now.LocalDb).Hatim.adminToken, [{'-eskiHatim1': 'eskiToken'}]);
  });
};
