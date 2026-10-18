//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Kur'an okuyucu (/oku). Diyanet mushafı: Şeyh Hamdullah fontuyla metin ya da PDF sayfa görüntüsü.
  ?bas=22&bit=41 ile kullanıcının aldığı parça açılır (PartSheet'teki "Kur'an'dan oku").
  Sayfa modu: gerçek yaprak çevirme (curl.js). Akış modu: aşağı kaydırma; yatay sürükleyince
  ekrandaki son satırdan sonrası, bir yaprak gibi çevrilerek gelir.
*/

import React, {useEffect, useLayoutEffect, useMemo, useRef, useState, memo} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {SURAHS, TOTAL_PAGES, juzRange, juzOfPage} from 'plans/quran';
import Curl from './curl';
import {loadMushaf, pageHTML, headerHTML, fit, AR, PDF_PAGE} from './text';
import './mushaf.css';

const ASPECT = 0.691; // Diyanet PDF sayfa oranı
const N = TOTAL_PAGES;
const DIYANET = 'https://kuran.diyanet.gov.tr/yayinlarimiz';
const surahStart = s => SURAHS[s - 1].page;
const hizbStart = (juz, q) => { const {start} = juzRange (juz); return Math.min (start + (q - 1) * 5, juzRange (juz).end); };

const store = {
  get (k, d) { try { const v = localStorage.getItem ('hd.mushaf.' + k); return v == null ? d : JSON.parse (v); } catch (e) { return d; } },
  set (k, v) { try { localStorage.setItem ('hd.mushaf.' + k, JSON.stringify (v)); } catch (e) {} },
};
const usePersist = (key, init) => {
  const [v, setV] = useState (() => store.get (key, init));
  useEffect (() => store.set (key, v), [key, v]);
  return [v, setV];
};
const useViewport = () => {
  const [vp, set] = useState ({w: window.innerWidth, h: window.innerHeight});
  useEffect (() => {
    const f = () => set ({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener ('resize', f);
    return () => window.removeEventListener ('resize', f);
  }, []);
  return vp;
};
const nextKey = rtl => (rtl ? 'ArrowLeft' : 'ArrowRight');
const prevKey = rtl => (rtl ? 'ArrowRight' : 'ArrowLeft');
const typing = e => /INPUT|SELECT|TEXTAREA/.test (e.target.tagName);

/* ======================= sayfa ======================= */
const TextLayers = ({m, n, style}) => {
  const html = useMemo (() => pageHTML (m, n), [m, n]);
  return (
    <div className="body" style={style}>
      <div className="ink" dangerouslySetInnerHTML={{__html: html}} />
      <div className="marks" aria-hidden="true" dangerouslySetInnerHTML={{__html: html}} />
    </div>
  );
};

const MushafPage = memo (function MushafPage ({m, n, W, source, fluid, fs}) {
  const ref = useRef (null);
  useLayoutEffect (() => { if (!fluid && source === 'text') fit (ref.current, W); }, [n, W, source, fluid]);
  if (!n || n < 1 || n > N) return <div className="page" />;
  if (source === 'pdf') {
    return <div className="page pdf"><img alt={`${n}. sayfa`} draggable="false" loading={fluid ? 'lazy' : 'eager'} src={PDF_PAGE (n)} /></div>;
  }
  return (
    <div className="page" ref={ref} style={{'--W': W + 'px'}}>
      <div className="frame">
        <div className="ph" dangerouslySetInnerHTML={{__html: headerHTML (m, n)}} />
        <div className="box"><TextLayers m={m} n={n} style={fluid ? {fontSize: fs} : null} /></div>
        <div className="pf">{AR (n)}</div>
      </div>
    </div>
  );
});

/* ======================= sayfa modu =======================
   Komşu sayfalar anahtarlı slotlarda önceden çizilip sığdırılır; sürükleme başlarken yalnızca
   DOM kopyalanır, React hiç çalışmaz. Kıvrılma curl.js'te requestAnimationFrame ile döner. */
function Flipper ({m, page, go, W, H, source, rtl, onCenterTap, zoomApi, flipApi}) {
  const stage = useRef (), zoomer = useRef (), book = useRef (), curl = useRef (null), ptr = useRef (null);
  const live = useRef ({});
  live.current = {page, go, W, H, rtl};
  const slots = [page - 1, page, page + 1].filter (n => n >= 1 && n <= N);

  /* ---- yakınlaştırma: {s, x, y} (merkezden ölçek + kaydırma), React dışında tutulur ---- */
  const z = useRef ({s: 1, x: 0, y: 0});
  const pointers = useRef (new Map ()), pinch = useRef (null), pan = useRef (null);
  const center = () => {
    const r = stage.current.getBoundingClientRect (), el = zoomer.current;
    return {x: r.left + el.offsetLeft + live.current.W / 2, y: r.top + el.offsetTop + live.current.H / 2};
  };
  const applyZoom = (next, animate) => {
    const {W, H} = live.current;
    const s = Math.min (4, Math.max (1, next.s));
    const mx = Math.max (0, (W * s - window.innerWidth) / 2 + 16), my = Math.max (0, (H * s - window.innerHeight) / 2 + 90);
    z.current = s === 1 ? {s: 1, x: 0, y: 0} : {s, x: Math.min (mx, Math.max (-mx, next.x)), y: Math.min (my, Math.max (-my, next.y))};
    const el = zoomer.current;
    el.style.transition = animate ? 'transform .28s cubic-bezier(.2,.8,.2,1)' : '';
    el.style.transform = `translate(${z.current.x}px,${z.current.y}px) scale(${z.current.s})`;
  };
  // (fx, fy) ekran noktası yerinde kalacak şekilde ölçeği değiştir
  const zoomAt = (s, fx, fy, animate) => {
    const c = center (), {s: s0, x: x0, y: y0} = z.current;
    const px = (fx - c.x - x0) / s0, py = (fy - c.y - y0) / s0; // içerik noktası (merkeze göre)
    applyZoom ({s, x: fx - c.x - s * px, y: fy - c.y - s * py}, animate);
  };
  flipApi.current = dir => { const c = begin (dir, live.current.H); if (c) c.autoFlip (); };
  zoomApi.current = {
    step: k => zoomAt (z.current.s * k, window.innerWidth / 2, window.innerHeight / 2, true),
    reset: () => applyZoom ({s: 1}, true),
  };
  // Yakınken sayfa değişince yeni sayfanın başına (sağ üst; kitap yönünde sol üst) git
  useEffect (() => {
    if (z.current.s <= 1) return;
    const c = center (), {s} = z.current, {W, H, rtl} = live.current;
    const x = rtl ? window.innerWidth - 12 - c.x - s * W / 2 : 12 - c.x + s * W / 2;
    applyZoom ({s, x, y: 80 - c.y + s * H / 2}, true);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const show = n => book.current.querySelectorAll ('.slot').forEach (s => {
    s.style.visibility = Number (s.dataset.n) === n ? 'visible' : 'hidden';
  });
  useLayoutEffect (() => { if (!curl.current) show (page); });
  useEffect (() => () => curl.current && curl.current.destroy (), []);

  const nudge = dir => book.current.animate (
    [{transform: 'none'}, {transform: `translateX(${(live.current.rtl ? 1 : -1) * dir * 10}px)`}, {transform: 'none'}],
    {duration: 280});

  const begin = (dir, c0y) => {
    if (curl.current) return curl.current;
    const {page, W, H, rtl, go} = live.current;
    const leafN = dir > 0 ? page : page - 1, underN = dir > 0 ? page + 1 : page;
    if (leafN < 1 || underN > N) { nudge (dir); return null; }
    const src = book.current.querySelector (`.slot[data-n="${leafN}"] .page`);
    if (!src) return null;
    show (underN);
    curl.current = new Curl (book.current, {
      W, H, rtl, dir, c0y, leaf: src.cloneNode (true),
      onEnd: committed => {
        const np = committed ? page + dir : page;
        show (np);
        curl.current.destroy ();
        curl.current = null;
        if (np !== page) go (np);
      },
    });
    return curl.current;
  };
  // Sayfa içi (ölçeksiz) koordinat; x: serbest kenardan sırta doğru
  const local = e => {
    const r = book.current.getBoundingClientRect (), {W, rtl} = live.current, s = z.current.s;
    const x = (e.clientX - r.left) / s;
    return {x: rtl ? x : W - x, y: (e.clientY - r.top) / s};
  };
  // Yaprak yalnızca kenarlardan tutulur (yakınken metni kaydırmak sayfa çevirmesin)
  const EDGE = 0.22;
  const edgeOf = p => (p.x < live.current.W * EDGE ? 1 : p.x > live.current.W * (1 - EDGE) ? -1 : 0);

  const lastTap = useRef (null), tapTimer = useRef (0);
  const onDown = e => {
    if (e.button > 0) return;
    pointers.current.set (e.pointerId, {x: e.clientX, y: e.clientY});
    stage.current.setPointerCapture (e.pointerId);
    if (pointers.current.size === 2) { // iki parmak: yakınlaştırma, varsa çevirmeyi bırak
      const [a, b] = [...pointers.current.values ()];
      if (curl.current && ptr.current && ptr.current.drag) curl.current.release ();
      ptr.current = null; pan.current = null;
      pinch.current = {d0: Math.hypot (a.x - b.x, a.y - b.y), s0: z.current.s};
      return;
    }
    if (pointers.current.size > 2) return;
    const p = local (e);
    ptr.current = {p0: p, c0: {x: e.clientX, y: e.clientY}, t0: performance.now (), id: e.pointerId, drag: false, moved: false};
    if (curl.current) { // havadaki yaprağı yakala
      curl.current.grab (p);
      Object.assign (ptr.current, {drag: true, caught: true});
    }
  };
  const onMove = e => {
    if (pointers.current.has (e.pointerId)) pointers.current.set (e.pointerId, {x: e.clientX, y: e.clientY});
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values ()];
      zoomAt (pinch.current.s0 * Math.hypot (a.x - b.x, a.y - b.y) / pinch.current.d0, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    const {W, H} = live.current, p = local (e), q = ptr.current;
    if (!q || q.id !== e.pointerId) { // fare köşeye gelince yaprak hafifçe kalkar
      if (e.pointerType !== 'mouse' || z.current.s > 1) return;
      const near = p.x >= 0 && p.x < W * 0.14 && (p.y > H - W * 0.14 || p.y < W * 0.14) && p.y <= H;
      if (near && !curl.current) { const c = begin (1, p.y > H / 2 ? H : 0); if (c) c.hover (); }
      else if (!near && curl.current) curl.current.unhover ();
      return;
    }
    const dxs = e.clientX - q.c0.x, dys = e.clientY - q.c0.y;
    if (Math.hypot (dxs, dys) > 6) q.moved = true;
    if (pan.current) { applyZoom ({s: z.current.s, x: pan.current.x + dxs, y: pan.current.y + dys}); return; }
    if (!q.drag) {
      if (!q.moved) return;
      const dx = p.x - q.p0.x, edge = edgeOf (q.p0);
      const horizontal = Math.abs (dx) >= Math.abs (p.y - q.p0.y) * 0.8;
      const dir = dx > 0 ? 1 : -1;
      // yakınken: kenar dışı her sürükleme kaydırmadır; uzakken: kenardan, çekme yönünde
      if (z.current.s > 1 && (!horizontal || edge !== dir)) { pan.current = {x: z.current.x, y: z.current.y}; return; }
      if (!horizontal || (z.current.s === 1 && edge && edge !== dir)) { ptr.current = null; return; }
      const c = begin (dir, q.p0.y > H / 2 ? H : 0);
      if (!c) { ptr.current = null; return; }
      c.grab (q.p0);
      q.drag = true;
    }
    if (curl.current) curl.current.move (p);
  };
  const onUp = e => {
    pointers.current.delete (e.pointerId);
    if (pinch.current) {
      if (pointers.current.size < 2) { pinch.current = null; if (z.current.s < 1.06) applyZoom ({s: 1}, true); }
      return;
    }
    const q = ptr.current;
    if (!q || q.id !== e.pointerId) return;
    ptr.current = null;
    if (pan.current) { pan.current = null; return; }
    const c = curl.current, {W, H} = live.current;
    if (q.drag && c) {
      if (q.caught && !c.moved && c.dir > 0 && q.p0.x < W * 0.25) c.turn (); // kalkmış köşeye tıklama
      else c.release ();
      return;
    }
    if (q.moved || performance.now () - q.t0 > 450) return;
    // çift dokunuş: yakınlaş / uzaklaş
    const now = performance.now (), prev = lastTap.current;
    if (prev && now - prev.t < 300 && Math.hypot (e.clientX - prev.x, e.clientY - prev.y) < 30) {
      clearTimeout (tapTimer.current);
      lastTap.current = null;
      if (z.current.s > 1) applyZoom ({s: 1}, true);
      else zoomAt (2.2, e.clientX, e.clientY, true);
      return;
    }
    lastTap.current = {t: now, x: e.clientX, y: e.clientY};
    const fx = q.p0.x / W, inPage = q.p0.y >= 0 && q.p0.y <= H && q.p0.x >= 0 && q.p0.x <= W;
    const ev = {clientX: e.clientX, clientY: e.clientY};
    tapTimer.current = setTimeout (() => {
      const flip = dir => { const c2 = begin (dir, H); if (c2) c2.autoFlip (); };
      if (inPage && fx < 0.18) flip (1);
      else if (inPage && fx > 0.82) flip (-1);
      else onCenterTap (ev);
    }, 260);
  };

  useEffect (() => {
    const k = e => {
      if (typing (e) || curl.current) return;
      const dir = e.key === nextKey (live.current.rtl) || e.key === ' ' ? 1 : e.key === prevKey (live.current.rtl) ? -1 : 0;
      if (!dir) return;
      e.preventDefault ();
      const c = begin (dir, live.current.H);
      if (c) c.autoFlip ();
    };
    window.addEventListener ('keydown', k);
    return () => { window.removeEventListener ('keydown', k); clearTimeout (tapTimer.current); };
  }, []);

  // Trackpad / ctrl+tekerlek ile yakınlaştırma
  useEffect (() => {
    const el = stage.current;
    const wheel = e => {
      if (!e.ctrlKey) return;
      e.preventDefault ();
      zoomAt (z.current.s * Math.exp (-e.deltaY / 200), e.clientX, e.clientY);
    };
    el.addEventListener ('wheel', wheel, {passive: false});
    return () => el.removeEventListener ('wheel', wheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="stage" ref={stage}
         onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
         onPointerLeave={() => { if (!ptr.current && curl.current) curl.current.unhover (); }}>
      <div className="zoomer" ref={zoomer} style={{width: W, height: H}}>
        <div className={`book${rtl ? '' : ' ltr-book'}`} ref={book} style={{width: W, height: H}}>
          <div className="shadowbox" /><div className="stack" />
          {slots.map (n => <div className="slot" data-n={n} key={n}><MushafPage m={m} n={n} W={W} source={source} /></div>)}
          <div className="spine" />
        </div>
      </div>
    </div>
  );
}

/* ======================= akış modu =======================
   Dikeyde normal sonsuz kaydırma. Yatay sürükleme: ekranda görünen son satırdan sonrası gelir
   (aşağı kaydırmak yerine sola çevirmek). İleri: ekranın görüntüsü alınır, asıl liste tam
   o satıra kaydırılır ve görüntü üstünden yaprak gibi kalkar. Geri: önceki ekranın görüntüsü
   yaprak gibi geri kapanır. */
const LazyPage = ({m, n, source, fs, W, root}) => {
  const ref = useRef (), [show, setShow] = useState (false);
  useEffect (() => {
    const io = new IntersectionObserver (([e]) => { if (e.isIntersecting) setShow (true); }, {root: root.current, rootMargin: '2400px 0px'});
    io.observe (ref.current);
    return () => io.disconnect ();
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="sp" data-n={n} ref={ref}>
      {show ? <MushafPage m={m} n={n} W={W} source={source} fluid fs={fs} /> : <div className="sp-ph" />}
    </section>
  );
};

// Görünür alanın üst/alt sınırı (üst ve alt çubukların arası)
const viewBand = rootEl => {
  const top = rootEl.querySelector ('.top'), bottom = rootEl.querySelector ('.bottom');
  const t = top ? Math.max (0, top.getBoundingClientRect ().bottom) : 0;
  const b = bottom ? Math.min (window.innerHeight, bottom.getBoundingClientRect ().top) : window.innerHeight;
  return {t, b};
};
// Ekrandaki satırlar: [üst, alt]. Metin parçaları (âyet no, kırmızı kelime vb.) aynı satırda
// birleştirilir; başlık/besmele/sayfa no birer satır sayılır.
const lineBoxes = scroller => {
  const out = [], range = document.createRange (), vh = window.innerHeight;
  scroller.querySelectorAll ('.sp').forEach (sec => {
    const r = sec.getBoundingClientRect ();
    if (r.bottom < -vh || r.top > 2 * vh) return;
    const pdf = sec.querySelector ('.page.pdf');
    if (pdf) { // görüntü: 15 satır + başlık/altlık bantları
      const q = pdf.getBoundingClientRect (), h = q.height / 17;
      for (let i = 0; i < 17; i++) out.push ([q.top + i * h, q.top + (i + 1) * h]);
      return;
    }
    sec.querySelectorAll ('.ph, .pf, .ink > .sure, .ink > .besm').forEach (el => {
      const q = el.getBoundingClientRect ();
      out.push ([q.top, q.bottom]);
    });
    sec.querySelectorAll ('.ink > .txt').forEach (p => {
      range.selectNodeContents (p);
      const rects = [...range.getClientRects ()].filter (q => q.height > 0).sort ((a, b) => (a.top + a.bottom) - (b.top + b.bottom));
      let line = null;
      for (const q of rects) {
        const c = (q.top + q.bottom) / 2;
        if (line && Math.abs (c - line.c) < 0.35 * (line.b - line.t)) { line.t = Math.min (line.t, q.top); line.b = Math.max (line.b, q.bottom); }
        else { line = {t: q.top, b: q.bottom, c}; out.push (line); }
      }
    });
  });
  return out.map (l => (Array.isArray (l) ? l : [l.t, l.b])).sort ((a, b) => a[0] - b[0]);
};
// Bir satır, kutusunun %85'i görünüyorsa okunmuş sayılır (kutunun altındaki boşluk harfsizdir;
// daha azı görünüyorsa harfler kesiktir ve satır bir sonraki ekranda en üstte tekrar gelir)
const SEEN = 0.85;

function ScrollView ({m, page, jump, source, fs, rtl, rootEl, onSeen, flipApi}) {
  const root = useRef (), host = useRef (), quiet = useRef (false), curl = useRef (null), ptr = useRef (null);
  const dragged = useRef (false);
  const live = useRef ({});
  live.current = {page, rtl};
  const W = Math.min (window.innerWidth - 24, 720);

  useLayoutEffect (() => {
    const el = root.current.querySelector (`.sp[data-n="${page}"]`);
    if (!el) return;
    quiet.current = true;
    root.current.scrollTop = el.offsetTop - 70;
    setTimeout (() => { quiet.current = false; }, 250);
  }, [jump, source]); // eslint-disable-line react-hooks/exhaustive-deps

  // Yakınlaştırılmışken yatay kaydırmayı da tarayıcıya bırak
  useEffect (() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const f = () => { root.current.style.touchAction = vv.scale > 1.05 ? 'manipulation' : ''; };
    vv.addEventListener ('resize', f);
    return () => vv.removeEventListener ('resize', f);
  }, []);

  /* Kaydırma sabitleme: yukarıdaki bir sayfa geç çizilip boyu değişince ekran kaymasın.
     (Tarayıcının kendi sabitlemesi kapalı, Safari'de zaten yok.) */
  useEffect (() => {
    const sc = root.current, heights = new Map ();
    const ro = new ResizeObserver (entries => {
      // Yukarıdan aşağı; bir sayfanın eski konumu = yeni konumu − üstündekilerin bu turdaki büyümesi
      let delta = 0;
      const top = sc.scrollTop;
      const els = entries.map (e => e.target).sort ((a, b) => a.offsetTop - b.offsetTop);
      for (const el of els) {
        const h = el.offsetHeight, prev = heights.get (el);
        heights.set (el, h);
        if (prev != null && h !== prev && el.offsetTop - delta + prev <= top + 80) delta += h - prev;
      }
      if (delta) sc.scrollTop += delta;
    });
    sc.querySelectorAll ('.sp').forEach (s => { heights.set (s, s.offsetHeight); ro.observe (s); });
    return () => ro.disconnect ();
  }, []);

  // Şu anki sayfa: ekranın ortasındaki sayfa (kaydırdıkça, kareye bir kez)
  const frame = useRef (0);
  const onScroll = () => {
    if (frame.current || quiet.current || curl.current) return;
    frame.current = requestAnimationFrame (() => {
      frame.current = 0;
      const el = document.elementFromPoint (window.innerWidth / 2, window.innerHeight * 0.45);
      const sec = el && el.closest ('.sp');
      if (sec) onSeen (Number (sec.dataset.n));
    });
  };

  // Yeni scrollTop: ileride son tam görünen satırdan sonraki satır en üste; geride bir önceki ekran
  const target = dir => {
    const sc = root.current, {t, b} = viewBand (rootEl.current), from = sc.scrollTop, boxes = lineBoxes (sc);
    if (dir > 0) { // ilk okunmamış satır en üste
      const next = boxes.find (([top, bot]) => bot > t && (b - top) / (bot - top) < SEEN);
      const T = next ? next[0] : b;
      return from + (T - t > 40 ? T - t : b - t);
    }
    // geride: tam görünen ilk satırın hemen üstündeki satır en alta
    const hidden = boxes.filter (([top, bot]) => top < b && (bot - t) / (bot - top) < SEEN);
    const B = hidden.length ? hidden[hidden.length - 1][1] : t;
    return Math.max (0, from - (b - B > 40 ? b - B : b - t));
  };
  const snapshot = (top, rect) => {
    const wrap = document.createElement ('div');
    wrap.className = 'snap';
    const vh = window.innerHeight;
    root.current.querySelectorAll ('.sp').forEach (s => {
      const y = s.offsetTop - top;
      if (y > vh || y + s.offsetHeight < 0) return;
      const c = s.cloneNode (true);
      c.style.top = y + 'px';
      c.style.width = rect.width + 'px';
      wrap.appendChild (c);
    });
    return wrap;
  };
  const begin = (dir, c0y) => {
    if (curl.current) return curl.current;
    const sc = root.current, from = sc.scrollTop;
    if ((dir < 0 && from <= 0) || (dir > 0 && from >= sc.scrollHeight - sc.clientHeight - 1)) return null;
    const to = target (dir);
    const col = sc.querySelector ('.sp').getBoundingClientRect ();
    const leaf = snapshot (dir > 0 ? from : to, col);
    if (dir > 0) sc.scrollTop = to; // asıl liste alttaki sayfa olur
    sc.style.overflowY = 'hidden';
    curl.current = new Curl (host.current, {
      W: col.width, H: window.innerHeight, left: col.left, top: 0, rtl: live.current.rtl, dir, c0y, leaf,
      onEnd: committed => {
        sc.scrollTop = committed ? to : from; // ileride liste zaten `to`da; geride çevrilince `to`ya geçer
        sc.style.overflowY = '';
        curl.current.destroy ();
        curl.current = null;
        onScroll ();
      },
    });
    return curl.current;
  };
  flipApi.current = dir => { if (!curl.current) { const c = begin (dir, window.innerHeight); if (c) c.autoFlip (); } };
  const local = e => {
    const s = root.current.querySelector ('.sp').getBoundingClientRect (), x = e.clientX - s.left;
    return {x: live.current.rtl ? x : s.width - x, y: e.clientY};
  };
  const onDown = e => {
    if (e.button > 0) return;
    dragged.current = false;
    ptr.current = {p0: local (e), cx: e.clientX, id: e.pointerId, drag: false};
    if (curl.current) {
      curl.current.grab (ptr.current.p0);
      ptr.current.drag = true;
      root.current.setPointerCapture (e.pointerId);
    }
  };
  const onMove = e => {
    const q = ptr.current;
    if (!q || q.id !== e.pointerId) return;
    const p = local (e);
    if (!q.drag) {
      const dx = p.x - q.p0.x, dy = p.y - q.p0.y;
      if (Math.abs (dy) > 12 && Math.abs (dy) > Math.abs (dx)) { ptr.current = null; return; } // dikey kaydırma
      if (Math.abs (dx) < 10) return;
      // tarayıcı yakınlaştırmışsa yatay sürükleme kaydırmadır; çevirme yalnız ekran kenarından
      const vv = window.visualViewport;
      if (vv && vv.scale > 1.05) {
        const rel = (q.cx - vv.offsetLeft) / vv.width;
        if (rel > 0.12 && rel < 0.88) { ptr.current = null; return; }
      }
      const c = begin (dx > 0 ? 1 : -1, q.p0.y > window.innerHeight / 2 ? window.innerHeight : 0);
      if (!c) { ptr.current = null; return; }
      c.grab (q.p0);
      q.drag = true;
      root.current.setPointerCapture (e.pointerId);
    }
    if (curl.current) curl.current.move (p);
  };
  const onUp = e => {
    const q = ptr.current;
    if (!q || q.id !== e.pointerId) return;
    ptr.current = null;
    if (q.drag) dragged.current = true; // ardından gelen tıklama tam ekranı açıp kapatmasın
    if (q.drag && curl.current) curl.current.release ();
  };
  useEffect (() => {
    const k = e => {
      if (typing (e) || curl.current) return;
      const dir = e.key === nextKey (live.current.rtl) ? 1 : e.key === prevKey (live.current.rtl) ? -1 : 0;
      if (!dir) return;
      e.preventDefault ();
      const c = begin (dir, window.innerHeight);
      if (c) c.autoFlip ();
    };
    window.addEventListener ('keydown', k);
    return () => { window.removeEventListener ('keydown', k); if (curl.current) curl.current.destroy (); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <div className="scroller" ref={root} onScroll={onScroll} onClickCapture={e => { if (dragged.current) { dragged.current = false; e.stopPropagation (); } }}
         onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {Array.from ({length: N}, (_, i) =>
        <LazyPage key={i} m={m} n={i + 1} W={W} source={source} fs={fs} root={root} />)}
    </div>
    <div className="curlhost" ref={host} />
  </>;
}

/* ======================= okuyucu ======================= */
const Icon = ({d, ...rest}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>{d}</svg>
);

const initialFrom = search => {
  const q = new URLSearchParams (search);
  const num = k => { const v = parseInt (q.get (k), 10); return v >= 1 && v <= N ? v : null; };
  const bas = num ('bas'), bit = num ('bit');
  const range = bas && bit && bit >= bas ? {start: bas, end: bit} : null;
  const page = num ('sayfa') || (range ? range.start : null) || store.get ('page', 1);
  return {page, range};
};

const MushafReader = () => {
  const history = useHistory ();
  const location = useLocation ();
  const [{page: firstPage, range}] = useState (() => initialFrom (location.search));
  const [m, setM] = useState (null);
  const [failed, setFailed] = useState (false);
  const [page, setPage] = useState (firstPage);
  const [jump, setJump] = useState (0);
  const [mode, setMode] = usePersist ('mode', window.innerWidth >= 900 ? 'page' : 'scroll');
  const [source, setSource] = usePersist ('source', 'text');
  const [color, setColor] = usePersist ('color', true);
  const [theme, setTheme] = usePersist ('theme', 'light');
  const [rtl, setRtl] = usePersist ('rtl', true);
  const [fs, setFs] = usePersist ('fs', 30);
  const [notice, setNotice] = usePersist ('notice', true);
  const [hint, setHint] = usePersist ('hint', true);
  const [immersive, setImmersive] = useState (false);
  const [toast, setToast] = useState (null);
  const rootEl = useRef (), zoomApi = useRef (null), flipApi = useRef (null);
  const vp = useViewport ();

  useEffect (() => {
    let alive = true;
    loadMushaf ().then (data => alive && setM (data), () => alive && setFailed (true));
    return () => { alive = false; };
  }, []);
  useEffect (() => { store.set ('page', page); }, [page]);
  // İlk açılışta bir kez: nasıl çevrileceğini söyle
  useEffect (() => {
    if (!m || !hint) return;
    setToast ({t: 'Sayfayı kenarından tutup çekin ya da alttaki Önceki / Sonraki düğmelerine dokunun', long: true});
    setHint (false);
  }, [m]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect (() => {
    if (!toast) return undefined;
    const t = setTimeout (() => setToast (null), toast.long ? 5000 : 2200);
    return () => clearTimeout (t);
  }, [toast]);
  // Parçanın sonuna gelince haber ver
  const ended = useRef (false);
  useEffect (() => {
    if (range && page === range.end && !ended.current) {
      ended.current = true;
      setToast ({t: 'Parçanızın son sayfasındasınız. Allah kabul etsin 🤲'});
    }
  }, [page, range]);

  const goto = n => { setPage (Math.min (N, Math.max (1, n | 0))); setJump (j => j + 1); };
  const back = () => (history.length > 1 ? history.goBack () : history.push ('/'));
  const H = Math.floor (Math.min (vp.h - (immersive ? 24 : 150), (vp.w - 24) / ASPECT, 1100));
  const W = Math.floor (H * ASPECT);

  // Dokunuş: menü gizliyken ekranın en sağı/solu sayfa çevirir (mushaf yönünde sol = sonraki);
  // başka her yer menüyü açar/kapatır
  const tap = e => {
    const edge = e.clientX < window.innerWidth * 0.18 ? -1 : e.clientX > window.innerWidth * 0.82 ? 1 : 0;
    if (immersive && edge && flipApi.current) flipApi.current (rtl ? -edge : edge);
    else setImmersive (v => !v);
  };

  const s = m ? m.info[page - 1].s1 : 1, juz = juzOfPage (page);
  let hizb = 1;
  for (let i = 1; i <= 4; i++) if (page >= hizbStart (juz, i)) hizb = i;

  return (
    <div ref={rootEl} className={`mr${color ? ' colored' : ''}${immersive ? ' immersive' : ''}`} data-theme={theme}>
      <div className="top">
        <div className="brand">
          <button type="button" className="back" aria-label="Geri" onClick={back}>
            <Icon width="18" height="18" d={<path d="m15 18-6-6 6-6" />} />
          </button>
          <span className="where">
            <b>{SURAHS[s - 1].name}</b>
            <small>{juz}. cüz · {page}. sayfa</small>
          </span>
          {range && <span className="range">Parçanız: {range.start === range.end ? range.start : `${range.start}–${range.end}`}. sayfa</span>}
        </div>
        <div className="seg">
          <button type="button" className={source === 'text' ? 'on' : ''} onClick={() => setSource ('text')}>Hamdullah</button>
          <button type="button" className={source === 'pdf' ? 'on' : ''} onClick={() => setSource ('pdf')}>PDF</button>
        </div>
        <div className="seg">
          <button type="button" className={mode === 'page' ? 'on' : ''} onClick={() => setMode ('page')}>Sayfa</button>
          <button type="button" className={mode === 'scroll' ? 'on' : ''} onClick={() => { setMode ('scroll'); setJump (j => j + 1); }}>Akış</button>
        </div>
        <button type="button" className={`iconbtn${color ? ' on' : ''}`} title="Lafza-i Celal, durak ve medd işaretlerini renklendir" onClick={() => setColor (!color)}>
          <Icon d={<><path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10.5" cy="7.5" r="1" /><circle cx="15" cy="7.5" r="1" /></>} />
        </button>
        <button type="button" className={`iconbtn${theme === 'dark' ? ' on' : ''}`} title="Gece modu" onClick={() => setTheme (theme === 'dark' ? 'light' : 'dark')}>
          <Icon d={<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />} />
        </button>
        <button type="button" className="iconbtn" title="Çevirme yönü"
                onClick={() => { setRtl (!rtl); setToast ({t: !rtl ? 'Mushaf yönü: soldan tut, sağa çevir' : 'Kitap yönü: sağdan tut, sola çevir'}); }}>
          <Icon d={rtl ? <><path d="M4 12h14" /><path d="m13 6 6 6-6 6" /></> : <><path d="M20 12H6" /><path d="m11 6-6 6 6 6" /></>} />
        </button>
        {/* Akışta yazı boyutu; sayfa modunda yakınlaştırma (iki parmak / çift dokunuş da olur) */}
        <button type="button" className="iconbtn" title="Küçült"
                onClick={() => (mode === 'scroll' ? setFs (f => Math.max (18, f - 2)) : zoomApi.current && zoomApi.current.step (1 / 1.25))}>A−</button>
        <button type="button" className="iconbtn" title="Büyüt"
                onClick={() => (mode === 'scroll' ? setFs (f => Math.min (64, f + 2)) : zoomApi.current && zoomApi.current.step (1.25))}>A+</button>
      </div>

      {notice &&
        <div className="notice">
          <div>
            <b>Kaynak:</b> Mushaf metni ve PDF sayfaları T.C. Diyanet İşleri Başkanlığı Kur'an-ı Kerim yayınlarından alınmıştır.
            Bilgi için <a href={DIYANET} target="_blank" rel="noopener noreferrer">kuran.diyanet.gov.tr/yayinlarimiz</a>
          </div>
          <button type="button" aria-label="Kapat" onClick={() => setNotice (false)}>×</button>
        </div>}

      {!m
        ? <div className="loader">
            {failed
              ? <><div>Mushaf yüklenemedi.</div><button type="button" className="iconbtn" onClick={() => { setFailed (false); loadMushaf ().then (setM, () => setFailed (true)); }}>Tekrar dene</button></>
              : <span>﷽</span>}
          </div>
        : mode === 'page'
          ? <Flipper m={m} page={page} go={setPage} W={W} H={H} source={source} rtl={rtl} onCenterTap={tap} zoomApi={zoomApi} flipApi={flipApi} />
          : <div onClick={e => { if (!e.target.closest ('button,a,input,select')) tap (e); }}>
              <ScrollView m={m} page={page} jump={jump} source={source} fs={fs} rtl={rtl} rootEl={rootEl} onSeen={setPage} flipApi={flipApi} />
            </div>}

      <div className="bottom">
        <select title="Cüz" value={juz} onChange={e => goto (juzRange (+e.target.value).start)}>
          {Array.from ({length: 30}, (_, i) => <option key={i} value={i + 1}>{i + 1}. Cüz</option>)}
        </select>
        <select title="Hizb" className="hide-sm" value={hizb} onChange={e => goto (hizbStart (juz, +e.target.value))}>
          {[1, 2, 3, 4].map (i => <option key={i} value={i}>{i}. hizb · s.{hizbStart (juz, i)}</option>)}
        </select>
        <select title="Sûre" className="hide-sm" value={s} onChange={e => goto (surahStart (+e.target.value))}>
          {SURAHS.map (x => <option key={x.number} value={x.number}>{x.number}. {x.name}</option>)}
        </select>
        {/* Kaydırmayı bilmeyenler için: mushaf yönünde Sonraki solda, Önceki sağda */}
        <div className="pager" style={{flexDirection: rtl ? 'row' : 'row-reverse'}}>
          <button type="button" className="turn" onClick={() => flipApi.current && flipApi.current (1)}>
            <Icon width="18" height="18" d={<path d={rtl ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />} /> Sonraki
          </button>
          <input className="pageinput" inputMode="numeric" key={page} defaultValue={page} aria-label="Sayfa"
                 onKeyDown={e => e.key === 'Enter' && goto (+e.target.value)} onBlur={e => goto (+e.target.value)} />
          <button type="button" className="turn" onClick={() => flipApi.current && flipApi.current (-1)}>
            Önceki <Icon width="18" height="18" d={<path d={rtl ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />} />
          </button>
        </div>
        <div className="status hide-sm"><b>{SURAHS[s - 1].name}</b> · {juz}. cüz · {page}/{N}</div>
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast && toast.t}{toast && toast.ar && <span className="ar">{toast.ar}</span>}</div>
    </div>
  );
};

export default MushafReader;
