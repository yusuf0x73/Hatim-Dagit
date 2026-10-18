//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Test veritabanındaki GERÇEK eski hatimler (1 yıl öncesinin yıllık hatimleri, api 1 cüz sayfaları, Ramazan…)
  yeni arayüzde hatasız açılmalı. Yalnızca okunur, hiçbir şeye tıklanmaz.
  Örnekleri yenilemek: Hatim-Dagit-sFunctions klasöründe
    node tests/sample-legacy-keys.js ../Hatim-Dagit/e2e/fixtures/legacy-keys.json
*/

const fs = require ('fs');
const path = require ('path');
const {waitUntil} = require ('../lib/user');

const FILE = path.join (__dirname, '..', 'fixtures', 'legacy-keys.json');
const samples = fs.existsSync (FILE) ? JSON.parse (fs.readFileSync (FILE, 'utf8')) : [];

// Sayfa ya parçaları ya da bilinen bir durumu (silinmiş / bulunamadı) göstermeli
const STATES = ['Hatim silinmiş', 'silindi', 'bulunamadı', 'Link hatalı', 'hatalı'];

module.exports = ({test}) => {
  const groups = {};
  samples.forEach (s => {
    const name = `${s.route} (api ${s.api})`;
    (groups[name] = groups[name] || []).push (s);
  });

  Object.entries (groups).forEach (([name, list]) => {
    test (`eski veri: ${name} · ${list.length} gerçek hatim hatasız açılır`, async ({user}) => {
      const u = await user ();
      for (const sample of list) {
        await u.goto (`/${sample.route}/${sample.key}`);
        await waitUntil (async () => u.page.evaluate (states => {
          if (document.querySelector ('[data-part], #emptyKhatm')) return true;
          const text = document.body.innerText;
          return states.some (s => text.includes (s));
        }, STATES), {timeout: 20000, message: `${sample.route}/${sample.key} açılmadı`});
        const errors = u.logs.filter (l => l.startsWith ('PAGEERROR'));
        if (errors.length) throw new Error (`${sample.route}/${sample.key}: ${errors[0]}`);
      }
    }, {timeout: 180000});
  });
};
