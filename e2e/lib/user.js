//                                     BİSMİLLAHİRRAHMANİRRAHİM

const {config} = require ('./config');

// Bu koşuda açılan hatimler (prod'da koşu sonunda silinir)
const createdKeys = new Set ();

const sleep = ms => new Promise (resolve => setTimeout (resolve, ms));

// Koşul sağlanana kadar bekler (sayfa ya da veritabanı için)
const waitUntil = async (check, {timeout = 15000, interval = 150, message = 'koşul sağlanmadı'} = {}) => {
  const end = Date.now () + timeout;
  let last;
  while (Date.now () < end) {
    try {
      last = await check ();
      if (last) return last;
    } catch (error) {
      last = error;
    }
    await sleep (interval);
  }
  throw new Error (`${message}${last instanceof Error ? `: ${last.message}` : ''}`);
};

// Test veritabanından okuma (hatim/<key> herkese açık okunur)
const dbGet = async path => {
  const response = await fetch (`${config.databaseUrl}/${path}.json`);
  if (!response.ok) throw new Error (`${path} okunamadı: ${response.status}`);
  return response.json ();
};

/**
 * Bir "cihaz": kendi gizli penceresi ve localStorage'ı olan telefon boyutlu tarayıcı.
 * lang: arayüz dili, countVisit: ziyaret sayacını artırsın mı (varsayılan hayır)
 */
const createUser = async (browser, {lang = 'tr', countVisit = false, viewport, userAgent} = {}) => {
  const context = await browser.createIncognitoBrowserContext ();
  const page = await context.newPage ();
  const logs = [];
  let prodHit = null;

  if (userAgent) await page.setUserAgent (userAgent);
  await page.setViewport (viewport || {width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
  await page.evaluateOnNewDocument ((lang, countVisit) => {
    if (localStorage.getItem ('__e2eInit')) return;
    localStorage.setItem ('__e2eInit', '1');
    if (!countVisit) localStorage.setItem ('user', 'test');
    localStorage.setItem ('language', lang);
    localStorage.setItem ('hd.playBannerClosed', '1');
    localStorage.setItem ('LocalDb', JSON.stringify ({cookieStuff: {cookieBannerAccepted: true}}));
  }, lang, countVisit);

  page.on ('pageerror', error => logs.push (`PAGEERROR ${error.message.slice (0, 200)}`));
  page.on ('console', message => {
    const text = message.text ();
    if (message.type () === 'error' && !text.startsWith ('Warning:') && !text.includes ('MIME type')) logs.push (`console: ${text.slice (0, 200)}`);
  });
  page.on ('dialog', dialog => dialog.dismiss ());

  // Prod'a giden her bağlantı testi durdurur
  const watchProd = url => {
    if (config.forbiddenHosts.some (host => url.includes (host))) prodHit = url;
  };
  page.on ('request', request => watchProd (request.url ()));
  const cdp = await page.target ().createCDPSession ();
  await cdp.send ('Network.enable');
  cdp.on ('Network.webSocketCreated', ({url}) => watchProd (url));

  const assertNoProd = () => {
    if (prodHit) throw new Error (`izin verilmeyen bağlantı: ${prodHit}`);
  };

  // Görünür ve metni eşleşen ilk tıklanabilir öğe
  const findByText = (text, exact) => page.evaluateHandle ((text, exact) => {
    const candidates = [...document.querySelectorAll ('button, a, [role=button], [role=radio], label')];
    const visible = el => el.offsetParent !== null && getComputedStyle (el).visibility !== 'hidden';
    const norm = s => (s || '').replace (/\s+/g, ' ').trim ();
    return candidates.find (el => visible (el) && (exact ? norm (el.innerText) === text : norm (el.innerText).includes (text))) || null;
  }, text, exact);

  const user = {
    page,
    logs,

    goto: async path => {
      await page.goto (`${config.appUrl}${path}`, {waitUntil: 'domcontentloaded'});
      assertNoProd ();
    },

    // "#id" ya da css seçici ise seçiciyle, değilse görünen metinle tıklar
    click: async (target, {exact = false, timeout = 15000} = {}) => {
      const isSelector = /^[#.[]/.test (target);
      const handle = await waitUntil (async () => {
        // Seçiciye uyan gizli öğeler olabilir (kapalı pencereler): görünen ilki
        if (isSelector) {
          for (const h of await page.$$ (target)) if (await h.boundingBox ()) return h;
          return null;
        }
        const h = await findByText (target, exact);
        if (!h || !h.asElement ()) return null;
        return (await h.asElement ().boundingBox ()) ? h : null;
      }, {timeout, message: `tıklanacak öğe yok: ${target}`});
      // Fare koordinatı yerine öğenin kendisine tıklanır: yüklenirken kayan sayfada yanlış kutuya basılmaz
      await handle.asElement ().evaluate (el => { el.scrollIntoView ({block: 'center'}); el.click (); });
      assertNoProd ();
    },

    // Aynı seçiciye uyan gizli öğeler olabilir (kapalı pencereler): görünen ilkine yazar
    type: async (selector, text) => {
      const handle = await waitUntil (async () => {
        const handles = await page.$$ (selector);
        for (const h of handles) if (await h.boundingBox ()) return h;
        return null;
      }, {message: `yazılacak alan yok: ${selector}`});
      await handle.evaluate (el => { el.scrollIntoView ({block: 'center'}); el.focus (); el.select && el.select (); });
      await page.keyboard.press ('Backspace');
      await handle.type (text);
    },

    // Tarih alanları için (input type=date)
    setValue: async (selector, value) => {
      await page.waitForSelector (selector, {timeout: 15000});
      await page.$eval (selector, (el, value) => {
        const setter = Object.getOwnPropertyDescriptor (Object.getPrototypeOf (el), 'value').set;
        setter.call (el, value);
        el.dispatchEvent (new Event ('input', {bubbles: true}));
        el.dispatchEvent (new Event ('change', {bubbles: true}));
      }, value);
    },

    text: () => page.evaluate (() => document.body.innerText),

    waitText: async (text, {timeout = 15000} = {}) => {
      await waitUntil (async () => (await page.evaluate (() => document.body.innerText)).includes (text),
                       {timeout, message: `metin görünmedi: "${text}"`});
      assertNoProd ();
    },

    waitGone: text => waitUntil (async () => !(await page.evaluate (() => document.body.innerText)).includes (text),
                                 {message: `metin kaybolmadı: "${text}"`}),

    // Parça kutusunda bir metnin görünmesini bekler (ör. alan kişinin ismi)
    waitPart: (no, text) => waitUntil (
      () => page.evaluate ((no, text) => [...document.querySelectorAll (`[data-part="${no}"]`)].some (el => el.innerText.includes (text)), no, text),
      {message: `${no}. parçada "${text}" görünmedi`}),

    // Alma / isim penceresi işini bitirip kapanana kadar bekler
    // Kapanınca bir bilgi penceresi açılırsa (ör. "cüzü aldınız") o da "Kapat" ile kapatılır
    waitSheetClosed: async () => {
      await waitUntil (
        () => page.evaluate (() => ![...document.querySelectorAll ('#partName, #takeButton')].some (el => el.offsetParent !== null)),
        {message: 'pencere kapanmadı'});
      await sleep (300);
      await page.evaluate (() => {
        const close = [...document.querySelectorAll ('button')].find (b => b.offsetParent !== null && b.innerText.trim () === 'Kapat');
        if (close) close.click ();
      });
    },

    local: key => page.evaluate (key => localStorage.getItem (key), key),

    // Hatim oluşturulunca açılan "link hazır" penceresinden hatim anahtarını alır
    createdKey: async () => {
      await waitUntil (async () => (await page.evaluate (() => document.body.innerText)).includes ('Yeni Hatim Oluşturuldu!'),
                       {timeout: 20000, message: 'hatim oluşturulamadı'});
      const text = await page.evaluate (() => document.body.innerText);
      const match = text.match (/https?:\/\/\S+?\/([a-zA-Z0-9]+)\/(-[\w-]+)/);
      if (!match) throw new Error ('linkte hatim anahtarı yok');
      assertNoProd ();
      // Koşu sonunda silinmek üzere kaydedilir
      createdKeys.add (match[2]);
      return {route: match[1], key: match[2]};
    },

    screenshot: async file => {
      try {
        await page.screenshot ({path: file, fullPage: false});
        return true;
      } catch (error) {
        return false;
      }
    },

    close: () => context.close ().catch (() => {}),
  };

  return user;
};

module.exports = {createUser, waitUntil, dbGet, sleep, createdKeys};
