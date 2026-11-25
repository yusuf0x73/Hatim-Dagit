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

  test ('üç aylar tanıtımı her sayfada çıkar, toplam 2 kez (oturumda 1); "oluştur" ana sayfada planları açar', async ({user}) => {
    const shown = async a => {
      try { await a.page.waitForSelector ('#months3IntroTitle', {visible: true, timeout: 4000}); return true; }
      catch (error) { return false; }
    };
    const newSession = a => a.page.evaluate (() => sessionStorage.clear ());

    const a = await user ({months3Intro: true});
    await a.goto ('/oku');
    assert.ok (await shown (a), 'Kur\'an okuyucu sayfasında çıkmadı');
    await a.click ('#months3IntroClose');
    await a.goto ('/');
    assert.ok (!(await shown (a)), 'aynı oturumda ikinci kez çıktı');
    await newSession (a);
    await a.goto ('/cizelgelerim');
    assert.ok (await shown (a), 'yeni oturumda ikinci kez çıkmadı');
    await a.click ('#months3IntroClose');
    await newSession (a);
    await a.goto ('/');
    assert.ok (!(await shown (a)), 'üçüncü kez çıktı');

    // Başka sayfadan "oluştur": ana sayfaya geçer, plan penceresi açılır
    const b = await user ({months3Intro: true});
    await b.goto ('/oku');
    assert.ok (await shown (b));
    await b.click ('#months3IntroCreate');
    await b.page.waitForSelector ('#tenPagesThenJuz', {visible: true});
    assert.equal (new URL (b.page.url ()).pathname, '/');
    await newSession (b);
    await b.goto ('/');
    assert.ok (!(await shown (b)), 'oluşturmaya geçene yine çıktı');
  });

  test ('üç aylar plan penceresi İngilizce ve Arapça', async ({user}) => {
    const cases = [
      {lang: 'en', title: "10 pages a day in Rajab and Sha'ban, 1 juz a day in Ramadan", mode: 'Rotating'},
      {lang: 'ar', title: '١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان', mode: 'دوّارة'},
    ];
    for (const c of cases) {
      const a = await user ({lang: c.lang});
      await a.goto ('/');
      await a.click ('#months3');
      await a.page.waitForSelector ('#tenPagesThenJuz', {visible: true});
      assert.equal (await a.page.$eval ('#tenPagesThenJuz', el => el.innerText.split ('\n')[0]), c.title);
      await a.click ('#tenPagesThenJuz');
      assert.ok ((await a.page.$eval ('#rotating', el => el.innerText)).startsWith (c.mode));
      assert.equal (await a.page.$eval ('#rotating', el => el.getAttribute ('aria-checked')), 'true');
      await a.page.screenshot ({path: require ('path').join (require ('../lib/config').config.outDir, `ucaylar-plan-${c.lang}.png`)});
    }
  });

  test ('üç aylar tanıtımı İngilizce ve Arapça arayüzde de çıkar', async ({user}) => {
    const cases = [
      {lang: 'en', title: 'The three holy months khatm is ready', feature: 'Rotating reading, a full khatm', dir: 'ltr'},
      {lang: 'ar', title: 'ختمة الأشهر الثلاثة جاهزة', feature: 'قراءة دوّارة، ختمة كاملة', dir: 'rtl'},
    ];
    for (const c of cases) {
      const a = await user ({lang: c.lang, months3Intro: true});
      await a.goto ('/');
      await a.page.waitForSelector ('#months3IntroTitle', {visible: true, timeout: 15000});
      assert.equal (await a.page.$eval ('#months3IntroTitle', el => el.innerText), c.title);
      await a.waitText (c.feature);
      assert.equal (await a.page.$eval ('#months3IntroTitle', el => el.closest ('[dir]') && el.closest ('[dir]').getAttribute ('dir')), c.dir);
      await a.page.screenshot ({path: require ('path').join (require ('../lib/config').config.outDir, `ucaylar-tanitim-${c.lang}.png`)});
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
