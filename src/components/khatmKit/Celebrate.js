//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useRef} from 'react';

/*
  Parça alınınca tebrik: ekranın ortasından her yöne patlayan konfeti, yıldız ve hilal.
  Kütüphanesiz, tek canvas; ~2.6 sn sonra kendini temizler. "Hareketi azalt" açıksa çalışmaz.
*/
const COLORS = ['#c8a047', '#e0bf6a', '#a8822f', '#1e9470', '#167a5b', '#bfe3d2', '#fdf6e3'];

const star = (ctx, r) => {
  ctx.beginPath ();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo (Math.cos (a) * rr, Math.sin (a) * rr);
  }
  ctx.closePath ();
  ctx.fill ();
};
const crescent = (ctx, r) => {
  ctx.beginPath ();
  ctx.arc (0, 0, r, Math.PI * 0.25, Math.PI * 1.75, false);
  ctx.arc (r * 0.42, 0, r * 0.78, Math.PI * 1.62, Math.PI * 0.38, true);
  ctx.closePath ();
  ctx.fill ();
};

const Celebrate = ({fire}) => {
  const ref = useRef (null);

  useEffect (() => {
    if (!fire) return undefined;
    if (window.matchMedia && window.matchMedia ('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = ref.current, ctx = canvas.getContext ('2d');
    const dpr = Math.min (window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale (dpr, dpr);

    const parts = [];
    const burst = (x, y) => {
      for (let i = 0; i < 140; i++) {
        const angle = Math.random () * Math.PI * 2;                    // her yöne
        const speed = (0.35 + Math.random () * 0.65) * Math.min (W, H) * 1.6;
        const r = Math.random ();
        parts.push ({
          x, y,
          vx: Math.cos (angle) * speed,
          vy: Math.sin (angle) * speed - Math.min (W, H) * 0.5,        // biraz yukarı savrulsun
          rot: Math.random () * Math.PI * 2, vr: (Math.random () - 0.5) * 12,
          size: 5 + Math.random () * 7,
          kind: r < 0.62 ? 'paper' : r < 0.88 ? 'star' : 'moon',
          color: COLORS[(Math.random () * COLORS.length) | 0],
          flip: Math.random () * Math.PI * 2,
          delay: Math.random () * 0.08,
        });
      }
    };
    burst (W / 2, H * 0.45);

    let raf, t0 = performance.now (), last = t0;
    const DURATION = 2.6;
    const tick = now => {
      const dt = Math.min (0.033, (now - last) / 1000), t = (now - t0) / 1000;
      last = now;
      ctx.clearRect (0, 0, W, H);
      for (const p of parts) {
        if (t < p.delay) continue;
        p.vy += 1500 * dt;                 // yerçekimi
        p.vx *= 1 - 1.6 * dt; p.vy *= 1 - 1.1 * dt; // hava direnci
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt; p.flip += 9 * dt;
        ctx.save ();
        ctx.globalAlpha = Math.max (0, Math.min (1, (DURATION - t) / 0.6));
        ctx.translate (p.x, p.y);
        ctx.rotate (p.rot);
        ctx.fillStyle = p.color;
        if (p.kind === 'paper') {
          ctx.scale (1, Math.cos (p.flip)); // havada dönen kâğıt
          ctx.fillRect (-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.kind === 'star') star (ctx, p.size * 0.8);
        else crescent (ctx, p.size * 0.8);
        ctx.restore ();
      }
      if (t < DURATION) raf = requestAnimationFrame (tick);
      else ctx.clearRect (0, 0, W, H);
    };
    raf = requestAnimationFrame (tick);
    return () => cancelAnimationFrame (raf);
  }, [fire]);

  return (
    <canvas ref={ref} aria-hidden="true"
            style={{position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 3000}} />
  );
};

export default Celebrate;
