//                                     BİSMİLLAHİRRAHMANİRRAHİM

const assert = require ('assert/strict');
const {dbGet, waitUntil} = require ('../lib/user');

const TITLE_INPUT = 'input[placeholder="Lütfen Hatim başlığı yazın .."]';

module.exports = ({test}) => {
  test ('3 aylar sahiplik: hatmi açmayan kişi kendi parçalarını bırakır, başkasınınkini bırakamaz', async ({user}) => {
    const admin = await user ();
    await admin.goto ('/');
    await admin.click ('#months3');
    await admin.click ('#fivePagesThenTenPages');
    await admin.type (TITLE_INPUT, 'E2E sahiplik');
    await admin.click ('Devam Et', {exact: true});
    const {key} = await admin.createdKey ();
    const hatim = await dbGet (`hatim/${key}`);
    const subKey = Object.keys (hatim).find (k => hatim[k] && hatim[k].parts);
    const part = no => dbGet (`hatim/${key}/${subKey}/parts/${no}`);

    const take = async (u, no, name) => {
      await u.click (`[data-part="${no}"]`);
      await u.type ('#partName', name);
      await u.click ('#takeButton');
      await u.waitSheetClosed ();
      await waitUntil (async () => (await part (no)).isTaken === true && (await part (no)).name === name, {message: `${no} alınmadı`});
    };
    const release = async (u, no) => {
      await u.click (`[data-part="${no}"]`);
      await u.click ('#releaseButton');
      await new Promise (resolve => setTimeout (resolve, 2500));
      return part (no);
    };

    const ali = await user ();
    await ali.goto (`/ucaylar/${key}`);
    const veli = await user ();
    await veli.goto (`/ucaylar/${key}`);

    await take (ali, 2, 'Ali');
    assert.equal ((await release (ali, 2)).isTaken, false, 'Ali kendi parçasını bırakamadı');
    await take (ali, 3, 'Ali');
    await take (veli, 4, 'Veli');
    assert.equal ((await release (ali, 3)).isTaken, false, 'Ali ikinci aldığı parçayı bırakamadı');

    // Ali (hatmi açmadı) Veli'nin parçasına dokununca düğmeleri görür ama sunucu izin vermemeli
    await take (ali, 5, 'Ali');
    await ali.click ('[data-part="4"]');
    const buttons = await ali.page.$$eval ('#releaseButton', els => els.length);
    console.log ('      Ali, Veli\'nin parçasında bırak düğmesi görüyor mu:', buttons > 0);
    if (buttons) {
      await ali.click ('#releaseButton');
      await new Promise (resolve => setTimeout (resolve, 2500));
      const text = await ali.text ();
      console.log ('      ekrandaki hata:', (text.match (/[^\n]*(kardeş|başka|ait|izin|alamaz|değil)[^\n]*/i) || ['(yok)'])[0]);
    }
    const veliPart = await part (4);
    assert.deepEqual ({name: veliPart.name, isTaken: veliPart.isTaken}, {name: 'Veli', isTaken: true}, 'Ali, Veli\'nin parçasını bıraktı!');

    // Hatmi açan herkesinkini bırakabilir
    await admin.goto (`/ucaylar/${key}`);
    assert.equal ((await release (admin, 4)).isTaken, false, 'hatmi açan bırakamadı');
  }, {timeout: 180000});
};
