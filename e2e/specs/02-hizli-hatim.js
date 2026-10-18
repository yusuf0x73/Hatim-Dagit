//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

// Eski yapıda cüz: <subKey>/<1|2|3>/cevaplar/<0..9>
const cevap = (hatim, subKey, no) => {
  const sira = no < 11 ? 1 : no < 21 ? 2 : 3;
  return hatim[subKey][sira].cevaplar[no - (sira - 1) * 10 - 1];
};

const createQuick = async a => {
  await a.goto ('/');
  await a.click ('#newKhatm');
  await a.type (TITLE_INPUT, 'E2E hızlı hatim');
  await a.click ('Devam Et', {exact: true});
  const {key} = await a.createdKey ();
  const hatim = await dbGet (`hatim/${key}`);
  const subKey = Object.values (hatim.khatmSubKeys)[0];
  return {key, subKey};
};

const takePart = async (u, no, name) => {
  await u.click (`[data-part="${no}"]`);
  await u.type ('#partName', name);
  await u.click ('#takeButton');
  await u.waitSheetClosed ();
};

module.exports = ({test}) => {
  test ('hatim oluşturulur, cüz alınır, ismi değiştirilir ve bırakılır', async ({user}) => {
    const a = await user ();
    const {key, subKey} = await createQuick (a);
    await a.goto (`/cuz/${key}`);

    await takePart (a, 5, 'Ayşe');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 5).isim === 'Ayşe', {message: 'cüz alınmadı'});
    await a.waitPart (5, 'Ayşe');

    // Sahibi ismini değiştirir (sunucuda eskiden iptal ediliyordu)
    await a.click ('[data-part="5"]');
    await a.type ('#partName', 'Ayşe Hanım');
    await a.click ('İsmi güncelle');
    await a.waitSheetClosed ();
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 5).isim === 'Ayşe Hanım', {message: 'isim değişmedi'});
    await a.waitPart (5, 'Ayşe Hanım');

    await a.click ('[data-part="5"]');
    await a.click ('#releaseButton');
    await a.click ('#releaseButton');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 5).alindi === false, {message: 'cüz bırakılmadı'});
  });

  test ('yarış: iki kişi aynı cüze aynı anda basarsa yalnızca biri alır', async ({user}) => {
    const owner = await user ();
    const {key, subKey} = await createQuick (owner);
    const [a, b] = await Promise.all ([user (), user ()]);
    await Promise.all ([a.goto (`/cuz/${key}`), b.goto (`/cuz/${key}`)]);

    for (const u of [a, b]) {
      await u.click ('[data-part="9"]');
      await u.type ('#partName', u === a ? 'Ali' : 'Veli');
    }
    await Promise.all ([a.click ('#takeButton'), b.click ('#takeButton')]);

    const winner = await waitUntil (async () => {
      const c = cevap (await dbGet (`hatim/${key}`), subKey, 9);
      return c.alindi && c.isim;
    }, {message: 'cüzü kimse alamadı'});
    const loser = winner === 'Ali' ? b : a;
    await loser.waitText ('az önce başkası aldı');
    assert.equal (await loser.local ('cuz').then (v => JSON.stringify (JSON.parse (v || '{}')[subKey] || []).includes ('9')), false,
                  'kaybeden cihaz cüzü kendisinin sanmamalı');
  });

  test ('cihazdaki kayıt silinse de secret ile kendi cüzünün ismini değiştirebilir, başkası değiştiremez', async ({user}) => {
    // Hatmi oluşturan admin olduğu için cüzü başka biri alır
    const owner = await user ();
    const {key, subKey} = await createQuick (owner);
    const a = await user ();
    await a.goto (`/cuz/${key}`);
    await takePart (a, 3, 'Fatma');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 3).alindi, {message: 'cüz alınmadı'});
    await a.waitPart (3, 'Fatma');

    // "Bu cüz benim" kaydı kaybolmuş (eski sürüm / temizlik), secret duruyor
    await a.page.evaluate (() => localStorage.setItem ('cuz', '{}'));
    await a.goto (`/cuz/${key}`);
    await a.click ('[data-part="3"]');
    await a.waitText ('Bu cüzü bu cihazdan siz aldıysanız');
    await a.type ('#partName', 'Fatma Nur');
    await a.click ('İsmi güncelle');
    await a.waitSheetClosed ();
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 3).isim === 'Fatma Nur', {message: 'isim değişmedi'});
    await a.waitText ('Sizin');

    // Aynı hatimde başka cüz almış ikinci kişi bu cüzü değiştiremez
    const b = await user ();
    await b.goto (`/cuz/${key}`);
    await takePart (b, 4, 'Zeynep');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 4).alindi, {message: 'ikinci cüz alınmadı'});
    await b.waitPart (4, 'Zeynep');
    await b.click ('[data-part="3"]');
    await b.type ('#partName', 'Kötü niyet');
    await b.click ('İsmi güncelle');
    await b.waitText ('başka bir cihazdan alınmış');
    assert.equal (cevap (await dbGet (`hatim/${key}`), subKey, 3).isim, 'Fatma Nur');
  });

  test ('hatim silinince veri silinmez, yalnızca "silindi" işaretlenir', async ({user}) => {
    const a = await user ();
    const {key, subKey} = await createQuick (a);
    await a.goto (`/cuz/${key}`);
    await takePart (a, 8, 'Emine');
    await waitUntil (async () => cevap (await dbGet (`hatim/${key}`), subKey, 8).alindi, {message: 'cüz alınmadı'});
    await a.waitPart (8, 'Emine');
    // Cüz alınınca açılan bilgi penceresi (varsa) kapatılır
    await a.click ('Kapat', {exact: true, timeout: 6000}).catch (() => {});

    await a.click ('#deleteHatim');
    await a.click ('Evet', {exact: true});
    await waitUntil (async () => new URL (a.page.url ()).pathname === '/', {message: 'silindikten sonra ana sayfaya dönmedi'});

    // Cüzler ve isimler yerinde: "hatimlerimiz nerede" denirse geri getirilebilir
    const hatim = await dbGet (`hatim/${key}`);
    assert.ok (hatim && hatim.khatmSubKeys, 'hatmin verisi silinmiş');
    assert.equal (cevap (hatim, subKey, 8).isim, 'Emine');

    // Linke tıklayan "silinmiş" mesajını görür
    const b = await user ();
    await b.goto (`/cuz/${key}`);
    await b.waitText ('silinmiş');
  });
};
