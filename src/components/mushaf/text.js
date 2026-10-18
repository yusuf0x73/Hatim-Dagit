//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Mushaf metni: Diyanet'in Word mushafından çıkarılan 604 sayfa (public/mushaf/pages.json).
  Her sayfa blok listesidir: ["S", sûreNo, arapçaAd] başlık, ["B"] besmele,
  ["T", [metin, âyetNo, metin, âyetNo, ...]] âyetler. Sayfa sınırları Medine düzenidir.
*/

import {juzOfPage} from 'plans/quran';

const PUBLIC = process.env.PUBLIC_URL || '';
export const PDF_PAGE = n => `${PUBLIC}/mushaf/pdf/${n}.webp`;
const BESMELE = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ';
export const AR = n => String (n).replace (/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

let loading = null;
export const loadMushaf = () => {
  if (!loading) {
    const fonts = ['KHamdullah', 'KHamBase', 'KHamMarks'].map (name => {
      const face = new FontFace (name, `url(${PUBLIC}/mushaf/fonts/${name}.ttf)`, {display: 'block'});
      document.fonts.add (face);
      return face.load ();
    });
    const pages = fetch (`${PUBLIC}/mushaf/pages.json`).then (r => {
      if (!r.ok) throw new Error ('mushaf');
      return r.json ();
    });
    loading = Promise.all ([pages, ...fonts]).then (([data]) => index (data));
    loading.catch (() => { loading = null; });
  }
  return loading;
};

// Her sayfanın başında hangi sûre/âyette olunduğu
const index = pages => {
  const info = [], sureAr = {};
  let s = 0, a = 0;
  pages.forEach ((blocks, i) => {
    info[i] = {s0: s, a0: a};
    for (const b of blocks) {
      if (b[0] === 'S') { s = b[1]; a = 0; sureAr[s] = b[2]; }
      else if (b[0] === 'T') for (const x of b[1]) if (typeof x === 'number') a = x;
    }
    info[i].s1 = s;
  });
  return {pages, info, sureAr, total: pages.length};
};

/* Lafza-i Celal ve "Rab" kelimeleri. Durak/medd işaretleri CSS ile boyanamıyor
   (tarayıcı işareti harfin rengiyle çizer); onları .marks font katmanı kırmızı çizer. */
const strip = w => w.replace (/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '').replace (/ٱ/g, 'ا');
const isAllah = w => /^(?:[وفبتأا]{0,2})?ل?لله(?:م)?$/.test (strip (w)) && /ل[^\s]*ل[^\s]*ّ/.test (w);
const isRabb = w => /ر[ً-ْ]*ب[ً-ْ]*ّ/.test (w) &&
  /^(?:و|ف|ب|ل|وب|ول|فب|فل)?(?:ال)?رب(?:ك|كم|كما|كن|ه|هم|هما|ها|نا|ي|ى|)$/.test (strip (w));
const esc = s => s.replace (/[&<>]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[c]));
const words = seg => seg.split (' ').map (w => (isAllah (w) || isRabb (w) ? `<span class="lz">${esc (w)}</span>` : esc (w))).join (' ');
const medal = n => `<span class="ay"><i>${AR (n)}</i></span>`;

export const pageHTML = (m, n) => {
  const blocks = m.pages[n - 1];
  let {s0: s, a0: a} = m.info[n - 1];
  let out = '';
  blocks.forEach ((b, bi) => {
    if (b[0] === 'S') {
      s = b[1]; a = 0;
      out += `<div class="sure"><span>${b[2]}</span></div>`;
    } else if (b[0] === 'B') {
      // Fâtiha'da besmele 1. âyettir
      out += s === 1
        ? `<p class="besm"><span class="aya" data-s="1" data-a="1">${words (BESMELE)} ${medal (1)}</span></p>`
        : `<p class="besm">${words (BESMELE)}</p>`;
      if (s === 1) a = 1;
    } else {
      const segs = b[1];
      let html = '';
      segs.forEach ((x, i) => {
        if (typeof x === 'number') return;
        const num = typeof segs[i + 1] === 'number' ? segs[i + 1] : null;
        html += `<span class="aya" data-s="${s}" data-a="${num || a + 1}">${words (x)}${num ? ` ${medal (num)}` : ''}</span> `;
        if (num) a = num;
      });
      const next = blocks[bi + 1];
      out += `<p class="txt${(next && next[0] === 'S') || n === m.total ? ' last' : ''}">${html}</p>`;
    }
  });
  return out;
};

export const headerHTML = (m, n) =>
  `<span>اَلْجُزْءُ ${AR (juzOfPage (n))}</span><span>${m.sureAr[m.info[n - 1].s1] || ''}</span><span>${AR (n)}</span>`;

// Yazıyı sabit çerçeveye sığdır: font boyutunda ikili arama
export const fit = (el, W) => {
  const body = el && el.querySelector ('.body');
  if (!body) return;
  let lo = W * 0.022, hi = W * 0.062;
  for (let i = 0; i < 11; i++) {
    const mid = (lo + hi) / 2;
    body.style.fontSize = mid + 'px';
    if (body.scrollHeight <= body.clientHeight + 1) lo = mid;
    else hi = mid;
  }
  body.style.fontSize = lo + 'px';
  const jc = body.querySelectorAll ('.ink>*').length > 1 ? 'space-between' : 'flex-start';
  for (const layer of body.children) layer.style.justifyContent = jc;
};
