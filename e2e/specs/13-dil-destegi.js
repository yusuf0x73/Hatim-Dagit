//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const path = require ('path');
const {dbGet, waitUntil} = require ('../lib/user');
const {config} = require ('../lib/config');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';
const TURKISH = /[çğıöşüÇĞİÖŞÜ]|\b(ve|bir|bu|ile|veya|Hatim|hatim|hatmi|Hatmi|sayfa|Sayfa|sayfalar|Tamam|Kapat|Sil|Geri|Devam|Yeni|Okudum|Okundu|Okunuyor|Bos|Ekle|Kopyala|Paylas|Hepsi|Tumu|Cuz)\b/;
// Ekranda Türkçe harf olabilecek ama çeviri olmayan yazılar: marka, isimler, dil seçici, kullanıcı başlıkları
const ALLOWED = [/Hatim Dağıt/g, /Yusuf Yeni[cç]eri/gi, /YENİÇERİ/g, /Türkçe/g, /Türkiye/g, /E2E[^\n]*/g, /Ayşe/g];

const turkishLines = text => text.split ('\n')
  .map (line => ALLOWED.reduce ((rest, re) => rest.replace (re, ''), line))
  .filter (line => TURKISH.test (line));

module.exports = ({test}) => {
  test ('İngilizce ve Arapça arayüzde sayfalarda Türkçe metin kalmaz', async ({user}) => {
    // Hatimler Türkçe arayüzle açılır (başlık "E2E", koşu sonunda silinir)
    const tr = await user ();
    await tr.goto ('/');
    await tr.click ('#newKhatm');
    await tr.type (TITLE_INPUT, 'E2E dil hızlı');
    await tr.click ('Devam Et', {exact: true});
    const quick = (await tr.createdKey ()).key;

    await tr.goto ('/');
    await tr.click ('#months3');
    await tr.click ('#tenPagesThenJuz');
    await tr.type (TITLE_INPUT, 'E2E dil 3 aylar');
    await tr.click ('Devam Et', {exact: true});
    const months3 = (await tr.createdKey ()).key;
    const hatim = await dbGet (`hatim/${months3}`);
    const subKey = Object.keys (hatim).find (k => hatim[k] && hatim[k].parts);

    await tr.goto ('/');
    await tr.click ('#customKhatm');
    await tr.click ('#ozel-half');
    await tr.type ('#ozelHeader', 'E2E dil özel');
    await tr.click ('#ozelCreate');
    const ozel = (await tr.createdKey ()).key;

    const problems = [];
    for (const lang of ['en', 'ar']) {
      const u = await user ({lang});
      const check = async label => {
        await new Promise (resolve => setTimeout (resolve, 600));
        const lines = turkishLines (await u.text ());
        if (lines.length) problems.push (`[${lang}] ${label}:\n    ${lines.slice (0, 8).join ('\n    ')}`);
      };

      await u.goto ('/');
      await u.page.waitForSelector ('#newKhatm');
      await check ('ana sayfa');
      await u.click ('#months3');
      await u.page.waitForSelector ('#tenPagesThenJuz', {visible: true});
      await check ('3 aylar plan penceresi');
      await u.click ('#tenPagesThenJuz');
      await check ('3 aylar plan ayrıntısı');
      await u.goto ('/');
      await u.click ('#customKhatm');
      await u.page.waitForSelector ('#ozel-half', {visible: true});
      await check ('özel hatim penceresi');
      await u.click ('#ozel-pages');
      await check ('özel hatim: sayfa grubu');
      await u.goto ('/');
      await u.click ('#surahKhatm');
      await u.page.waitForSelector ('#ozel-yasin', {visible: true});
      await check ('sûre hatmi penceresi');

      await u.goto (`/cuz/${quick}`);
      await u.page.waitForSelector ('[data-part="1"]');
      await check ('hızlı hatim');
      await u.click (`[data-part="${lang === 'en' ? 1 : 2}"]`);
      await u.page.waitForSelector ('#partName', {visible: true});
      await check ('cüz alma penceresi');
      await u.type ('#partName', 'Ali');
      await u.click ('#takeButton');
      await u.waitSheetClosed ().catch (() => {});
      await check ('cüz alındıktan sonra');

      await u.goto (`/ucaylar/${months3}`);
      await u.page.waitForSelector ('[data-part="1"]');
      await check ('3 aylar sayfası');
      await u.click (`[data-part="${lang === 'en' ? 1 : 2}"]`);
      await u.type ('#partName', 'Ali');
      await u.click ('#takeButton');
      await u.waitSheetClosed ();
      await waitUntil (async () => (await dbGet (`hatim/${months3}/${subKey}/parts/${lang === 'en' ? 1 : 2}/name`)) === 'Ali');
      await u.page.waitForSelector ('#mineLine');
      await check ('3 aylar: parça alındı');
      await u.click (`[data-mine="${lang === 'en' ? 1 : 2}"]`);
      await u.page.waitForSelector ('[role=dialog] button[aria-pressed]');
      await check ('3 aylar çizelgesi');
      await u.page.screenshot ({path: path.join (config.outDir, `dil-${lang}-cizelge.png`)});
      await u.page.keyboard.press ('Escape');
      await u.page.evaluate (() => { window.print = () => {}; });
      await u.click ('#printButton');
      await check ('yazdırma seçenekleri');
      await u.click ('#printAll');
      await u.page.waitForSelector ('.hd-print section');
      const printText = await u.page.$eval ('.hd-print', el => el.innerText);
      const printLines = turkishLines (printText);
      if (printLines.length) problems.push (`[${lang}] çıktı:\n    ${printLines.slice (0, 8).join ('\n    ')}`);

      await u.goto (`/ozel/${ozel}`);
      await u.page.waitForSelector ('[data-part="1"]');
      await check ('özel hatim sayfası');

      await u.goto ('/');
      await u.click ('Hatimlerim').catch (() => {});
      for (const route of ['/oku', '/cookies', '/privacypolicy', '/termsconditions', '/cizelgelerim']) {
        await u.goto (route);
        await new Promise (resolve => setTimeout (resolve, 1500));
        await check (route);
      }
      await u.goto ('/privacypolicy');
      await new Promise (resolve => setTimeout (resolve, 800));
      assert.ok ((await u.text ()).includes (lang === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'), `${lang}: gizlilik metni boş`);
      await u.goto ('/oku');
      await new Promise (resolve => setTimeout (resolve, 1500));
      await u.page.screenshot ({path: path.join (config.outDir, `dil-${lang}-oku.png`)});
    }
    assert.equal (problems.length, 0, `Türkçe kalan yerler:\n${problems.join ('\n')}`);
  }, {timeout: 300000});
};
