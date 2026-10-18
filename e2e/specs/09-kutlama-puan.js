//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';
const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

const createQuick = async a => {
  await a.goto ('/');
  await a.click ('#newKhatm');
  await a.type (TITLE_INPUT, 'E2E kutlama');
  await a.click ('Devam Et', {exact: true});
  return (await a.createdKey ()).key;
};

const take = async (u, no, name) => {
  await u.click (`[data-part="${no}"]`);
  await u.type ('#partName', name);
  await u.click ('#takeButton');
};

// Ekranda kutlama canvas'ı var mı
const celebrating = u => u.page.evaluate (() => [...document.querySelectorAll ('canvas')].some (c => c.offsetParent !== null || getComputedStyle (c).position === 'fixed'));

module.exports = ({test}) => {
  test ('Android: cüz alınınca kutlama + önce puan penceresi, ardından "aldınız"; puan verince bir daha sorulmaz', async ({user}) => {
    const owner = await user ();
    const key = await createQuick (owner);

    const a = await user ({userAgent: ANDROID});
    await a.goto (`/cuz/${key}`);
    await a.page.evaluate (() => { window.__opened = []; window.open = url => { window.__opened.push (url); return null; }; });

    await take (a, 5, 'Yasemin');
    await a.waitText ('Hatim Dağıt\'ı beğendiniz mi?');
    assert.ok (await celebrating (a), 'kutlama patlaması görünmedi');
    assert.equal ((await a.text ()).includes ('5. cüzü aldınız'), false, '"aldınız" puan penceresinden önce çıkmamalı');

    await a.click ('[data-star="5"]');
    await a.click ('#rateStore');
    const opened = await a.page.evaluate (() => window.__opened);
    assert.ok (opened.some (u => u.includes ('play.google.com/store/apps/details?id=com.hatimdagit.twa')), `Play Store açılmadı: ${opened}`);

    await a.waitText ('5. cüzü aldınız');
    await a.click ('Kapat', {exact: true});

    // Puan verdi: sonraki cüzde doğrudan "aldınız"
    await take (a, 6, 'Yasemin');
    await a.waitText ('6. cüzü aldınız');
    assert.equal ((await a.text ()).includes ('beğendiniz mi'), false);
  });

  test ('Android: düşük puan Play Store\'a değil bize yönlendirir; Android olmayan cihazda puan sorulmaz', async ({user}) => {
    const owner = await user ();
    const key = await createQuick (owner);

    const a = await user ({userAgent: ANDROID});
    await a.goto (`/cuz/${key}`);
    await take (a, 7, 'Kerem');
    await a.waitText ('beğendiniz mi?');
    await a.click ('[data-star="2"]');
    await a.page.waitForSelector ('#rateFeedback', {visible: true});
    assert.equal (await a.page.$ ('#rateStore'), null, 'düşük puanda Play Store butonu çıkmamalı');
    await a.click ('Kapat', {exact: true});
    await a.waitText ('7. cüzü aldınız');

    const iphone = await user ();
    await iphone.goto (`/cuz/${key}`);
    await take (iphone, 8, 'Elif');
    await iphone.waitText ('8. cüzü aldınız');
    assert.equal ((await iphone.text ()).includes ('beğendiniz mi'), false, 'Android olmayan cihazda puan sorulmamalı');
    await waitUntil (async () => true);
    assert.ok (await dbGet (`hatim/${key}`));
  });
};
