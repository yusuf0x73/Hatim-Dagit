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
};
