//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

module.exports = ({test}) => {
  test ('diğer hatim türleri tek kartta, ortak ve belirgin bir zeminde görünür', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.page.waitForSelector ('#yearBased');
    const info = await a.page.evaluate (() => {
      const ids = ['yearBased', 'months3', 'newDonerliRamazanKhatm', 'surahKhatm', 'customKhatm', 'evradEzkar'];
      const parents = new Set (ids.map (id => document.getElementById (id).parentElement));
      const card = document.getElementById ('yearBased').parentElement;
      const style = getComputedStyle (card);
      return {parents: parents.size, background: style.backgroundColor, image: style.backgroundImage};
    });
    assert.equal (info.parents, 1, 'hepsi tek kartın içinde olmalı');
    assert.notEqual (info.background, 'rgba(0, 0, 0, 0)');
    assert.notEqual (info.background, 'rgb(255, 255, 255)');
    assert.ok (info.image.includes ('gradient'), 'kartın ortak zemini olmalı');
  });

  test ('3 aylar planlarında "sabit" işaretli gelir', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    for (const plan of ['tenPagesThenJuz', 'samePage']) {
      await a.click (`#${plan}`);
      await a.page.waitForSelector ('#fixed');
      assert.equal (await a.page.$eval ('#fixed', el => el.getAttribute ('aria-checked')), 'true', `${plan}: sabit seçili değil`);
      assert.equal (await a.page.$eval ('#rotating', el => el.getAttribute ('aria-checked')), 'false');
      await a.click ('Diğer seçenekler');
    }
  });

  test ('ziyaret sayacı aynı anda açılan sayfaları kaybetmez', async ({user}) => {
    const before = Number (await dbGet ('ziyaretSayisi')) || 0;
    const visitors = await Promise.all (Array.from ({length: 6}, () => user ({countVisit: true})));
    await Promise.all (visitors.map (v => v.goto ('/')));
    // Sayaç başkaları tarafından da artabilir; en az 6 artmış olmalı
    await waitUntil (async () => (Number (await dbGet ('ziyaretSayisi')) || 0) >= before + 6,
                     {timeout: 20000, message: 'ziyaret sayacı 6 artmadı'});
  }, {testDbOnly: true});
};
