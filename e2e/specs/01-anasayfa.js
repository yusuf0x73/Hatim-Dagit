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

  test ('3 aylar: 10/5 sayfa planları "dönerli", sayfa/sûre planları "sabit" işaretli gelir', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    for (const [plan, selected] of [['tenPagesThenJuz', '#rotating'], ['fivePagesThenTenPages', '#rotating'], ['samePage', '#fixed'], ['sameSurah', '#fixed']]) {
      await a.click (`#${plan}`);
      await a.page.waitForSelector (selected);
      const other = selected === '#rotating' ? '#fixed' : '#rotating';
      assert.equal (await a.page.$eval (selected, el => el.getAttribute ('aria-checked')), 'true', `${plan}: ${selected} seçili değil`);
      assert.equal (await a.page.$eval (other, el => el.getAttribute ('aria-checked')), 'false');
      await a.click ('Diğer seçenekler');
    }
  });

  test ('ilk girişte üç aylar tanıtımı bir kez çıkar, "oluştur" planları açar', async ({user}) => {
    const a = await user ({months3Intro: true});
    await a.goto ('/');
    await a.page.waitForSelector ('#months3IntroTitle', {visible: true, timeout: 15000});
    await a.waitText ('Dönerli okuma, tam hatim');
    await a.click ('#months3IntroCreate');
    await a.page.waitForSelector ('#tenPagesThenJuz', {visible: true});
    await a.goto ('/');
    await a.page.waitForSelector ('#newKhatm');
    await new Promise (resolve => setTimeout (resolve, 1500));
    assert.equal (await a.page.$ ('#months3IntroTitle'), null, 'ikinci girişte yine çıktı');
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
