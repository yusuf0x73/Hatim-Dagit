//                                     BİSMİLLAHİRRAHMANİRRAHİM

/* Page-curl engine (framework-free so React never re-renders during a drag).

 Logical frame: free edge at x=0, spine at x=W (rtl=true → same as screen,
 i.e. mushaf: spine on the right). The dragged corner C moves; the fold line
 is the perpendicular bisector of C0→C. The part of the leaf beyond the fold
 is reflected over it (the flap). A critically-damped spring pulls C toward
 a target (finger, scripted arc, rest or turned pose), so the sheet has
 weight, can be caught mid-flight and keeps momentum when released. */
const clipPoly = (poly, f) => {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
};
const cssPoly = pts => pts.length < 3 ? "polygon(0 0,0 0,0 0)" : `polygon(${pts.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`;
const mk = (cls, parent) => { const d = document.createElement("div"); d.className = cls; parent && parent.appendChild(d); return d; };

class Curl {
  constructor(host, { W, H, rtl, leaf, dir, c0y, onEnd, left = 0, top = 0 }) {
    Object.assign(this, { W, H, rtl, dir, c0y, onEnd });
    const el = this.el = mk("curl", host);
    el.style.cssText = `left:${left}px;top:${top}px;width:${W}px;height:${H}px`;
    this.us = mk("shade ushade", mk("shadewrap", el));
    this.cur = mk("layer cur", el); this.cur.appendChild(leaf); this.cs = mk("shade cshade", this.cur);
    this.fw = mk("flapwrap", el);
    this.flap = mk("flap", this.fw); this.flap.style.width = W + "px"; this.flap.style.height = H + "px";
    this.flap.appendChild(leaf.cloneNode(true)); mk("backpaper", this.flap); this.fs = mk("shade fshade", this.flap);
    this.C0 = { x: 0, y: c0y }; this.Cend = { x: 2 * W, y: c0y };
    this.C = dir > 0 ? { x: .01, y: c0y } : { x: 2 * W - .01, y: c0y };
    this.V = { x: 0, y: 0 }; this.target = { ...this.C }; this.mode = "hold";
    this.t = performance.now(); this.draw(this.C);
    this.raf = requestAnimationFrame(this.loop);
  }
  logical(x, y) { return { x: this.rtl ? x : this.W - x, y }; }
  get committed() { return this.dir > 0 ? this.target.x > this.W : this.target.x < this.W; }

  grab(p) { this.drag = { p0: p, base: { ...this.C } }; this.mode = "drag"; this.auto = null; }
  move(p) {
    const d = this.drag; if (!d) return;
    this.target = this.constrain({ x: d.base.x + 2 * (p.x - d.p0.x), y: d.base.y + (p.y - d.p0.y) });
    this.moved = true;
  }
  release() {
    this.drag = null;
    // light to turn: ~28% of the way or a quick flick commits; a flick back cancels
    const toward = this.V.x * (this.dir > 0 ? 1 : -1);
    const progress = this.dir > 0 ? this.C.x / (2 * this.W) : 1 - this.C.x / (2 * this.W);
    const commit = toward < -350 ? false : progress > .28 || toward > 350;
    this.target = commit === (this.dir > 0) ? { ...this.Cend } : { ...this.C0 };
    this.mode = "release";
  }
  turn() { this.drag = null; this.target = this.dir > 0 ? { ...this.Cend } : { ...this.C0 }; this.mode = "release"; }
  hover() { this.mode = "hover"; this.target = { x: this.W * .09, y: this.c0y === 0 ? this.W * .06 : this.H - this.W * .06 }; }
  unhover() { if (this.mode === "hover") { this.target = { ...this.C0 }; this.mode = "release"; } }
  autoFlip() {
    const { W, H, c0y } = this, up = c0y === 0 ? 1 : -1;
    const arc = e => ({ x: 2 * W * e, y: c0y + up * Math.sin(Math.PI * e) * H * .2 });
    this.auto = { t0: performance.now(), ms: 520, path: this.dir > 0 ? arc : e => arc(1 - e) };
    this.mode = "auto"; this.target = this.dir > 0 ? { ...this.Cend } : { ...this.C0 };
  }

  constrain(C) {
    const { W, H, c0y } = this, B = [W, c0y], A = [W, H - c0y], diag = Math.hypot(W, H);
    let x = C.x, y = C.y, r = Math.hypot(x - B[0], y - B[1]);
    if (r > W) { x = B[0] + (x - B[0]) * W / r; y = B[1] + (y - B[1]) * W / r; }
    r = Math.hypot(x - A[0], y - A[1]);
    if (r > diag) { x = A[0] + (x - A[0]) * diag / r; y = A[1] + (y - A[1]) * diag / r; }
    return { x, y };
  }

  loop = now => {
    const dt = Math.min(1 / 30, (now - this.t) / 1000); this.t = now;
    let target = this.target;
    if (this.auto) {
      const k = Math.min(1, (now - this.auto.t0) / this.auto.ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      target = this.auto.path(e);
      if (k >= 1) { this.auto = null; this.mode = "release"; }
    }
    const k = this.mode === "drag" || this.auto ? 1200 : this.mode === "hover" ? 260 : 360, c = 2 * Math.sqrt(k);
    for (let i = 0; i < 3; i++) {                 // semi-implicit Euler substeps
      const h = dt / 3, C = this.C, V = this.V;
      V.x += (k * (target.x - C.x) - c * V.x) * h; V.y += (k * (target.y - C.y) - c * V.y) * h;
      this.C = this.constrain({ x: C.x + V.x * h, y: C.y + V.y * h });
    }
    this.draw(this.C);
    const settled = Math.hypot(this.target.x - this.C.x, this.target.y - this.C.y) < .8 && Math.hypot(this.V.x, this.V.y) < 8;
    if (this.mode === "release" && settled) { this.onEnd(this.committed); return; }
    this.raf = requestAnimationFrame(this.loop);
  };

  draw(C) {
    const { W, H, c0y, rtl } = this;
    const dx = C.x, dy = C.y - c0y, dist = Math.hypot(dx, dy);
    if (dist < .5) {
      this.cur.style.clipPath = ""; this.fw.style.visibility = "hidden";
      this.us.style.opacity = this.cs.style.opacity = 0; return;
    }
    const phys = p => rtl ? p : [W - p[0], p[1]];
    const n = [-dx / dist, -dy / dist], M = [C.x / 2, (C.y + c0y) / 2];
    const side = p => (p[0] - M[0]) * n[0] + (p[1] - M[1]) * n[1];
    const rect = [[0, 0], [W, 0], [W, H], [0, H]];
    const foldedL = clipPoly(rect, side), L = Math.max(1, ...foldedL.map(side));
    const pM = phys(M), pn = rtl ? n : [-n[0], n[1]], d = [-pn[1], pn[0]];
    const a = 2 * d[0] * d[0] - 1, b = 2 * d[0] * d[1], dd = 2 * d[1] * d[1] - 1;
    const e = pM[0] - (a * pM[0] + b * pM[1]), f = pM[1] - (b * pM[0] + dd * pM[1]);
    this.cur.style.clipPath = cssPoly(clipPoly(rect, p => -side(p)).map(phys));
    this.flap.style.transform = `matrix(${a},${b},${b},${dd},${e},${f})`;
    this.flap.style.clipPath = cssPoly(foldedL.map(phys));
    this.fw.style.visibility = "visible";
    const ang = Math.atan2(pn[1], pn[0]) * 180 / Math.PI, lift = Math.min(1, dist / (W * .5));
    const place = (el, an, len, op) => {
      el.style.width = Math.max(0, len) + "px"; el.style.opacity = op;
      el.style.transform = `translate(${pM[0]}px,${pM[1]}px) rotate(${an}deg) translateY(-50%)`;
    };
    place(this.fs, ang, L, .6 + .4 * lift);
    place(this.us, ang, Math.min(L * 1.1, W * .45), Math.min(1, lift * 1.5));
    place(this.cs, ang + 180, Math.min(L * .6, W * .14), lift * .9);
  }

  destroy() { cancelAnimationFrame(this.raf); this.el.remove(); }
}
export default Curl;
