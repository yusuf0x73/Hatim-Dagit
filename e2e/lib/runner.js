//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Küçük ve hızlı e2e çatısı: tek Chrome, her kullanıcı ayrı gizli pencere (ayrı localStorage = ayrı cihaz),
  testler paralel koşar. Cypress'e göre birkaç kat hızlı; puppeteer-core sistemdeki Chrome'u kullanır.

    node e2e/run.js                 bütün testler
    node e2e/run.js yarış           adında "yarış" geçenler
    HEADFUL=1 node e2e/run.js       pencereleri görerek
*/

const fs = require ('fs');
const path = require ('path');
const puppeteer = require ('puppeteer-core');
const {spawnSync} = require ('child_process');
const {config, guardTarget} = require ('./config');
const {createUser, createdKeys} = require ('./user');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const color = (code, text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);

const loadTests = filter => {
  const dir = path.join (__dirname, '..', 'specs');
  const tests = [];
  fs.readdirSync (dir).filter (f => f.endsWith ('.js')).sort ().forEach (file => {
    const register = require (path.join (dir, file));
    register ({test: (name, fn, options = {}) => tests.push ({name: `${file.replace ('.js', '')} › ${name}`, fn, ...options})});
  });
  return filter ? tests.filter (t => t.name.toLocaleLowerCase ('tr').includes (filter.toLocaleLowerCase ('tr'))) : tests;
};

const withTimeout = (promise, ms, name) => Promise.race ([
  promise,
  new Promise ((_, reject) => setTimeout (() => reject (new Error (`${ms / 1000} sn içinde bitmedi: ${name}`)), ms)),
]);

const run = async () => {
  guardTarget ();
  console.log (`hedef: ${config.target === 'prod' ? 'PROD veritabanı (yalnızca E2E hatimleri yazılır, sonunda silinir)' : 'test veritabanı'}`);

  const probe = await fetch (config.appUrl).catch (() => null);
  if (!probe) throw new Error (`${config.appUrl} açık değil. Önce: yarn start (test DB'ye bağlı)`);
  const fn = await fetch (`${config.functionsUrl}/.netlify/functions/takeCuzV3`).catch (() => null);
  if (!fn) throw new Error (`${config.functionsUrl} açık değil. Hatim-Dagit-sFunctions klasöründe: yarn dev`);

  // Bazı testler yalnızca test veritabanında koşar (ör. ziyaret sayacını artıran)
  const tests = loadTests (process.argv[2]).filter (t => !(config.target === 'prod' && t.testDbOnly));
  const browser = await puppeteer.launch ({
    executablePath: CHROME,
    headless: process.env.HEADFUL ? false : 'new',
    args: ['--no-first-run', '--disable-features=Translate'],
  });

  const concurrency = Number (process.env.E2E_CONCURRENCY) || 4;
  const results = [];
  const started = Date.now ();
  let next = 0;

  const worker = async () => {
    while (next < tests.length) {
      const t = tests[next++];
      const contexts = [];
      const ctx = {
        config,
        // Her çağrı yeni bir "cihaz" açar
        user: async (options = {}) => {
          const user = await createUser (browser, options);
          contexts.push (user);
          return user;
        },
      };
      const begin = Date.now ();
      try {
        await withTimeout (t.fn (ctx), t.timeout || 90000, t.name);
        // Sayfada yakalanmamış bir JS hatası olduysa test geçmiş sayılmaz
        const pageErrors = contexts.flatMap (user => user.logs.filter (l => l.startsWith ('PAGEERROR')));
        if (pageErrors.length) throw new Error (`sayfa hatası: ${pageErrors[0]}`);
        results.push ({name: t.name, ok: true, ms: Date.now () - begin});
        console.log (`${color (32, '✓')} ${t.name} ${color (90, `(${Date.now () - begin} ms)`)}`);
      } catch (error) {
        const shots = [];
        for (const [i, user] of contexts.entries ()) {
          const file = path.join (config.outDir, `${t.name.replace (/[^\wğüşöçıİĞÜŞÖÇ-]+/g, '_')}-${i + 1}.png`);
          if (await user.screenshot (file)) shots.push (file);
        }
        results.push ({name: t.name, ok: false, error});
        console.log (`${color (31, '✗')} ${t.name}\n    ${color (31, error.message)}${shots.length ? `\n    ${color (90, shots.join ('\n    '))}` : ''}`);
        contexts.forEach (user => user.logs.length && console.log (color (90, user.logs.slice (-8).map (l => `    ${l}`).join ('\n'))));
      } finally {
        await Promise.all (contexts.map (user => user.close ()));
      }
    }
  };

  fs.mkdirSync (config.outDir, {recursive: true});
  await Promise.all (Array.from ({length: Math.min (concurrency, tests.length)}, worker));
  await browser.close ();

  // Açılan hatimler kaydedilir; prod'da sunucu reposundaki temizlik betiği yalnızca "E2E" başlıklı olanları siler
  fs.writeFileSync (config.createdFile, JSON.stringify ([...createdKeys], null, 1) + '\n');
  const cleanup = path.join (__dirname, '..', '..', '..', 'Hatim-Dagit-sFunctions', 'tests', 'cleanup-e2e.js');
  if (config.target === 'prod' && createdKeys.size > 0) {
    if (fs.existsSync (cleanup)) {
      const result = spawnSync ('node', [cleanup, config.createdFile, '--prod'], {cwd: path.dirname (path.dirname (cleanup)), encoding: 'utf8'});
      console.log ((result.stdout || '') + (result.stderr || ''));
    } else {
      console.log (color (31, `temizlik betiği yok: ${config.createdFile} içindeki hatimleri elle silin`));
    }
  }

  const failed = results.filter (r => !r.ok).length;
  console.log (`\n${failed ? color (31, `${failed} başarısız`) : color (32, 'hepsi geçti')} · ${results.length} test · ${((Date.now () - started) / 1000).toFixed (1)} sn`);
  process.exit (failed ? 1 : 0);
};

module.exports = {run};
