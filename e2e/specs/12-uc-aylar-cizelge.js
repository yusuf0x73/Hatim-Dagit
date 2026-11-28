//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const path = require ('path');
const {dbGet, waitUntil} = require ('../lib/user');
const {config} = require ('../lib/config');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

module.exports = ({test}) => {
  test ('3 aylar: Ramazan Şaban\'dan devam eder; tam hatim; "Sizin"; A4 çıktı', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#tenPagesThenJuz');
    await a.type (TITLE_INPUT, 'E2E 3 aylar çizelge');
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    const hatim = await dbGet (`hatim/${key}`);
    assert.equal (hatim.rotating, true, 'varsayılan dönerli olmalı');
    const subKey = Object.keys (hatim).find (k => hatim[k] && hatim[k].parts);

    await a.page.keyboard.press ('Escape');
    await a.goto (`/ucaylar/${key}`);
    for (const no of [1, 2]) {
      await a.click (`[data-part="${no}"]`);
      await a.type ('#partName', 'Ahmet');
      await a.click ('#takeButton');
      await a.waitSheetClosed ();
      await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/${no}/name`)) === 'Ahmet', {message: `${no} alınmadı`});
    }
    // Başka bir cihazdan başka bir kişi
    const b = await user ();
    await b.goto (`/ucaylar/${key}`);
    await b.click ('[data-part="3"]');
    await b.type ('#partName', 'Fatma');
    await b.click ('#takeButton');
    await b.waitSheetClosed ();
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/parts/3/name`)) === 'Fatma', {message: '3 alınmadı'});

    // "Şu parçaları aldınız" ve kutularda "Sizin"
    await a.waitText ('Şu parçaları aldınız');
    const mine = await a.page.$eval ('#mineLine', el => el.innerText);
    assert.ok (mine.includes ('1. cüz · 1. yarı') && mine.includes ('1. cüz · 2. yarı'), mine);
    await a.waitPart (1, 'Sizin');
    assert.ok (!(await a.page.$eval ('[data-part="3"]', el => el.innerText)).includes ('Sizin'));

    // Parça kartının altında uzun çizelge yok; çizelge karta dokununca açılır
    assert.equal ((await a.page.$$ ('[data-inline-chart]')).length, 0);
    await a.click ('[data-mine="1"]');
    await a.waitText ('Recep');
    const dayText = label => a.page.evaluate (label => {
      const button = [...document.querySelectorAll ('[role=dialog] button[aria-pressed]')].find (b => b.innerText.startsWith (label));
      return button ? button.innerText : null;
    }, label);

    // Recep–Şaban tam bir hatim; Ramazan kalınan yerden (1. sayfadan) ikinci hatim, gün yetmezse son iki gün fazla
    const recepSaban = hatim.monthDays[0] + hatim.monthDays[1];
    const ramadanFirst = await waitUntil (() => dayText ('Ramazan 1 ·'));
    assert.ok (ramadanFirst.includes ('1–20. sayfalar'), ramadanFirst);
    if (hatim.monthDays[2] === 29) {
      const last = await dayText ('Ramazan 29 ·');
      assert.ok (last.includes ('571–604. sayfalar'), `son gün 30 sayfa olmalı: ${last}`);
    }

    // Çizelgeden "okudum" işaretlenir (çevrimiçi); önce işaretler yüklensin
    await a.waitText ('gün okundu');
    await a.page.evaluate (() => [...document.querySelectorAll ('[role=dialog] button[aria-pressed]')].find (b => b.innerText.startsWith ('Ramazan 1 ·')).click ());
    await waitUntil (async () => (await dbGet (`hatim/${key}/${subKey}/charts/1/${recepSaban}`)) === true, {message: 'işaret kaydedilmedi'});

    // Ay başlığı kaydırınca en üste yapışır (arada boşluk yok)
    const gap = await waitUntil (() => a.page.evaluate (() => {
      const body = [...document.querySelectorAll ('[role=dialog] h3')][0].parentElement;
      body.scrollTop = 400;
      return new Promise (resolve => setTimeout (() => {
        const stuck = [...body.querySelectorAll ('h3')].map (h => h.getBoundingClientRect ().top - body.getBoundingClientRect ().top);
        resolve (stuck.length ? String (Math.min (...stuck.filter (t => t >= -2))) : null);
      }, 100));
    }));
    assert.ok (Math.abs (Number (gap)) <= 2, `ay başlığı üstte boşluk bırakıyor: ${gap}px`);
    await a.page.screenshot ({path: path.join (config.outDir, 'ucaylar-cizelge-penceresi.png')});
    await a.page.keyboard.press ('Escape');

    // Yazdırma: kişi seçerek (Ahmet'in 2, Fatma'nın 1 parçası var; yalnızca Fatma seçilir)
    await a.page.evaluate (() => { window.print = () => {}; });
    await a.click ('#printButton');
    await a.waitText ('Herkesinkini yazdır (3 kart');
    await a.click ('#printPick');
    await a.page.waitForSelector ('[data-person]');
    const people = await a.page.$$eval ('[data-person]', els => els.map (el => el.getAttribute ('data-person')));
    assert.deepEqual (people.sort (), ['Ahmet', 'Fatma']);
    await a.click ('[data-person="Fatma"]');
    await a.waitText ('Seçilenleri yazdır (1 kişi, 1 kart');
    await a.page.screenshot ({path: path.join (config.outDir, 'ucaylar-yazdir-kisi-sec.png')});
    await a.click ('#printPicked');
    await a.page.waitForSelector ('.hd-print [data-print-slot]');
    assert.deepEqual (await a.page.$$eval ('.hd-print [data-print-slot]', els => els.map (el => el.getAttribute ('data-print-slot'))), ['3']);
    await a.goto (`/ucaylar/${key}`);
    await a.page.waitForSelector ('#printButton');

    // A4 çıktı: hepsi (60 parça), her sayfada PER_PAGE kişi, taşma yok
    // isMobile / ölçek değişirse Puppeteer sayfayı yeniden yükler; yalnızca boyut değişir (A4 = 794×1123 px)
    await a.page.setViewport ({width: 794, height: 1123, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    await a.page.evaluate (() => { window.print = () => {}; });
    await a.click ('#printButton');
    await a.click ('#printAll');
    await a.page.waitForSelector ('.hd-print section');
    await a.page.emulateMediaType ('print');
    const info = await a.page.evaluate (() => {
      const pages = [...document.querySelectorAll ('.hd-print section')];
      const firstPage = pages[0];
      const blocks = [...firstPage.querySelectorAll ('[data-print-slot]')];
      const top = firstPage.getBoundingClientRect ().top;
      const pageHeight = firstPage.getBoundingClientRect ().height;
      const last = blocks[blocks.length - 1].getBoundingClientRect ();
      const footer = firstPage.querySelector ('footer').getBoundingClientRect ();
      return {pages: pages.length, perPage: blocks.length, blockHeight: blocks[0].getBoundingClientRect ().height,
              lastBottom: last.bottom - top, footerTop: footer.top - top, pageHeight};
    });
    console.log ('      A4 ölçümü:', JSON.stringify (info));
    assert.equal (info.perPage, 6);
    assert.equal (info.pages, 10);
    assert.ok (info.lastBottom <= info.footerTop, 'son çizelge sayfa altına taşıyor');
    assert.ok (info.footerTop < info.pageHeight, 'alt bilgi sayfaya sığmıyor');
    const pdf = path.join (config.outDir, 'ucaylar-cizelgeler.pdf');
    await a.page.pdf ({path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true});
    await a.page.screenshot ({path: path.join (config.outDir, 'ucaylar-a4-sayfa1.png'), clip: {x: 0, y: 0, width: 794, height: 1123}});
  }, {timeout: 150000});

  test ('3 aylar günde 1 cüz: çıktı alınır (herkes / kişi seçerek), 29 günlük ayın son günü iki cüz, A4\'e 6 kart', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#eachday1part');
    await a.type (TITLE_INPUT, 'E2E günde 1 cüz çıktı');
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    const subKey = Object.values ((await dbGet (`hatim/${key}`)).khatmSubKeys)[0];

    await a.goto (`/ucaylarhergun1cuz/${key}`);
    for (const [no, name] of [[1, 'Ahmet'], [2, 'Ahmet'], [7, 'Zeynep']]) {
      await a.click (`[data-part="${no}"]`);
      await a.type ('#partName', name);
      await a.click ('#takeButton');
      await a.waitSheetClosed ();
      await waitUntil (async () => {
        const hatim = await dbGet (`hatim/${key}/${subKey}`);
        return [1, 2, 3].flatMap (i => hatim[i].cevaplar).some (c => c.cevap === String (no) && c.alindi && c.isim === name);
      }, {message: `${no}. cüz alınmadı`});
    }
    await a.page.keyboard.press ('Escape');

    await a.page.evaluate (() => { window.print = () => {}; });
    await a.click ('#printButton');
    await a.waitText ('Herkesinkini yazdır (3 kart');
    await a.click ('#printPick');
    await a.page.waitForSelector ('[data-person]');
    assert.deepEqual ((await a.page.$$eval ('[data-person]', els => els.map (el => el.getAttribute ('data-person')))).sort (), ['Ahmet', 'Zeynep']);
    await a.click ('[data-person="Ahmet"]');
    await a.waitText ('Seçilenleri yazdır (1 kişi, 2 kart');
    await a.click ('#printPicked');
    await a.page.waitForSelector ('.hd-print [data-print-slot]');
    assert.deepEqual (await a.page.$$eval ('.hd-print [data-print-slot]', els => els.map (el => el.getAttribute ('data-print-slot'))), ['1', '2']);

    // 1. cüzün kartı: her ay 1. cüzden başlar; ay 29 günse son gün iki cüz
    const card = await a.page.$eval ('.hd-print [data-print-slot="1"]', el => el.innerText);
    assert.ok (card.includes ('Ahmet'), card);
    const monthDays = await (async () => {
      // Kartta her ayın sütunu: 30 satır; 29 günlük ayda son satırda "561–604"
      const rows = await a.page.$$eval ('.hd-print [data-print-slot="1"] tbody tr', trs => trs.map (tr => [...tr.querySelectorAll ('td.pages')].map (td => td.innerText)));
      return rows;
    }) ();
    assert.equal (monthDays[0][0], '1–20', 'Recep 1: 1. cüz');
    const lastRamazan = monthDays.map (r => r[2]).filter (Boolean).pop ();
    assert.ok (lastRamazan === '561–604' || lastRamazan === '581–604', `Ramazan son gün: ${lastRamazan}`);

    // Hepsi: 30 kart, A4'te 6'şar → 5 sayfa
    await a.goto (`/ucaylarhergun1cuz/${key}`);
    await a.page.waitForSelector ('#printButton');
    await a.page.setViewport ({width: 794, height: 1123, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    await a.page.evaluate (() => { window.print = () => {}; });
    await a.click ('#printButton');
    await a.click ('#printAll');
    await a.page.waitForSelector ('.hd-print section');
    await a.page.emulateMediaType ('print');
    const info = await a.page.evaluate (() => {
      const pages = [...document.querySelectorAll ('.hd-print section')];
      const top = pages[0].getBoundingClientRect ().top;
      const blocks = [...pages[0].querySelectorAll ('[data-print-slot]')];
      return {pages: pages.length, perPage: blocks.length, lastBottom: blocks[blocks.length - 1].getBoundingClientRect ().bottom - top,
              footerTop: pages[0].querySelector ('footer').getBoundingClientRect ().top - top};
    });
    assert.equal (info.perPage, 6);
    assert.equal (info.pages, 5);
    assert.ok (info.lastBottom <= info.footerTop, 'son kart sayfa altına taşıyor');
    await a.page.pdf ({path: path.join (config.outDir, 'gunde-1-cuz-cizelgeler.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true});
    await a.page.screenshot ({path: path.join (config.outDir, 'gunde-1-cuz-a4-sayfa1.png'), clip: {x: 0, y: 0, width: 794, height: 1123}});
  }, {timeout: 150000});

  test ('3 aylar günde 1 cüz: "sabit" seçilir; aldığım cüz kartı ve "aldınız" üstte; masaüstünde yazdırma penceresi', async ({user}) => {
    const a = await user ();
    await a.goto ('/');
    await a.click ('#months3');
    await a.click ('#eachday1part');
    await a.page.waitForSelector ('#fixed');
    assert.equal (await a.page.$eval ('#rotating', el => el.getAttribute ('aria-checked')), 'true', 'varsayılan dönerli olmalı');
    await a.click ('#fixed');
    await a.type (TITLE_INPUT, 'E2E günde 1 cüz sabit');
    await a.click ('Devam Et', {exact: true});
    const {key} = await a.createdKey ();
    const hatim = await dbGet (`hatim/${key}`);
    const subKey = Object.values (hatim.khatmSubKeys)[0];
    assert.deepEqual (hatim[subKey].isMonths3, {eachday1part: true, rotating: false});

    await a.goto (`/ucaylarhergun1cuz/${key}`);
    await a.click ('[data-part="5"]');
    await a.type ('#partName', 'Hatice');
    await a.click ('#takeButton');
    await a.waitSheetClosed ();
    await a.page.keyboard.press ('Escape');
    await a.waitText ('Şu cüzleri aldınız');
    const card = (await a.page.$eval ('[data-mine="5"]', el => el.innerText)).toLocaleLowerCase ('tr-TR');
    assert.ok (card.includes ('her gün') && card.includes ('5. cüz') && card.includes ('81–100'), card);

    // Sabit: çizelgede her gün aynı cüz
    await a.click ('[data-mine="5"]');
    await a.page.waitForSelector ('[role=dialog] button[aria-pressed]');
    const titles = (await a.page.$$eval ('[role=dialog] button[aria-pressed]', els => els.map (el => el.innerText))).filter (t => t.includes (' · '));
    const odd = titles.filter (t => !t.includes ('5. cüz') || t.includes ('6. cüz'));
    assert.ok (titles.length === 89 && odd.length === 0, `gün sayısı ${titles.length}; farklı: ${JSON.stringify (odd.slice (0, 3))}`);
    await a.page.keyboard.press ('Escape');
    await a.page.screenshot ({path: path.join (config.outDir, 'gunde-1-cuz-mobil.png'), fullPage: false});

    // Masaüstü
    await a.page.setViewport ({width: 1366, height: 900, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    await sleepMs (500);
    await a.page.screenshot ({path: path.join (config.outDir, 'gunde-1-cuz-masaustu.png')});
    await a.page.evaluate (() => { window.print = () => {}; });
    await a.click ('#printButton');
    await a.waitText ('Herkesinkini yazdır (1 kart');
    await sleepMs (400);
    await a.page.screenshot ({path: path.join (config.outDir, 'gunde-1-cuz-yazdir-masaustu.png')});
  }, {timeout: 150000});
};

const sleepMs = ms => new Promise (resolve => setTimeout (resolve, ms));
