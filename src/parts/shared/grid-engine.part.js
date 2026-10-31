/* Studio: czysty silnik siatki 2D (bez DOM, nie mutuje wejścia). Ukryte elementy zachowują pozycję, ale nie kolidują. */
const HGGrid = (() => {
  const BP = [{ id: 'lg', min: 1024, cols: 12 }, { id: 'md', min: 600, cols: 8 }, { id: 'sm', min: 0, cols: 4 }];
  const I = (n, d) => { n = Math.round(Number(n)); return Number.isFinite(n) ? n : d; };
  const vis = (a) => !a.hidden;
  const cmp = (a, b) => a.y - b.y || a.x - b.x;
  const bp = (width) => { const b = BP.find((q) => width >= q.min) || BP[BP.length - 1]; return { id: b.id, cols: b.cols }; };
  const collides = (a, b) => a !== b && vis(a) && vis(b) && a.id !== b.id && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const normOne = (it, cols) => {
    const minW = Math.min(Math.max(I(it.minW, 1), 1), cols), maxW = Math.min(it.maxW ? Math.max(I(it.maxW, cols), minW) : cols, cols);
    const minH = Math.max(I(it.minH, 1), 1), maxH = it.maxH ? Math.max(I(it.maxH, Infinity), minH) : Infinity;
    const w = Math.min(Math.max(I(it.w, minW), minW), maxW), h = Math.min(Math.max(I(it.h, minH), minH), maxH);
    return { ...it, w, h, x: Math.min(Math.max(I(it.x, 0), 0), cols - w), y: Math.max(I(it.y, 0), 0) };
  };
  const norm = (items, cols) => items.map((it) => normOne(it, cols));
  /* przesuwa w dół elementy kolidujące z kotwicą (łańcuchowo); mutuje tylko lokalną kopię */
  const push = (arr, anchorIds) => {
    const q = anchorIds.slice();
    while (q.length) {
      const aid = q.shift(), a = arr.find((o) => o.id === aid);
      arr.filter((o) => collides(a, o)).sort(cmp).forEach((o) => { if (collides(a, o)) { o.y = a.y + a.h; q.push(o.id); } });
    }
    return arr;
  };
  const compact = (items) => {
    const out = items.map((it) => ({ ...it })), placed = [];
    out.map((it, i) => [it, i]).filter(([it]) => vis(it)).sort(([a, i], [b, j]) => cmp(a, b) || i - j).forEach(([it]) => {
      while (placed.some((p) => collides(it, p))) it.y++;
      while (it.y > 0 && !placed.some((p) => collides({ ...it, y: it.y - 1 }, p))) it.y--;
      placed.push(it);
    });
    return out;
  };
  const free = (arr, it, cols) => {
    for (let y = 0; ; y++) for (let x = 0; x <= cols - it.w; x++) if (!arr.some((o) => collides({ ...it, x, y }, o))) return { x, y };
  };
  const place = (items, item, cols) => {
    const n = normOne(item, cols), arr = items.map((it) => ({ ...it }));
    if (Number.isFinite(item.x) && Number.isFinite(item.y)) { arr.push(n); return push(arr, [n.id]); }
    const p = free(arr, n, cols); arr.push({ ...n, ...p }); return arr;
  };
  const move = (items, id, x, y, cols) => {
    const arr = items.map((it) => (it.id === id ? normOne({ ...it, x, y }, cols) : { ...it }));
    return compact(push(arr, [id]));
  };
  const resize = (items, id, w, h, cols) => {
    const arr = items.map((it) => (it.id === id ? normOne({ ...it, w, h }, cols) : { ...it }));
    return compact(push(arr, [id]));
  };
  const snap = (px, py, { cw, ch, gap }) => ({ x: Math.max(0, Math.round(px / (cw + gap))), y: Math.max(0, Math.round(py / (ch + gap))) });
  const derive = (items, fromCols, toCols) => {
    if (fromCols === toCols) return norm(items, toCols);
    const k = toCols / fromCols, order = items.map((it, i) => [it, i]).sort(([a, i], [b, j]) => cmp(a, b) || i - j);
    const res = new Map(), placed = []; let ly = 0, lx = 0;
    order.forEach(([it]) => {
      const n = normOne({ ...it, x: Math.round(it.x * k), w: Math.max(Math.round(it.w * k), 1) }, toCols);
      if (!vis(n)) { res.set(it.id, n); return; }
      let y = Math.max(n.y, ly);
      while (placed.some((p) => collides({ ...n, y }, p)) || (y === ly && n.x < lx)) y++;
      n.y = y; ly = y; lx = n.x; placed.push(n); res.set(it.id, n);
    });
    return compact(items.map((it) => res.get(it.id)));
  };
  const layoutFor = (L, bpId) => {
    const cols = (BP.find((b) => b.id === bpId) || BP[0]).cols;
    return (L.bps && L.bps[bpId]) || derive(L.items || [], 12, cols);
  };
  return { BP, bp, norm, collides, compact, place, move, resize, snap, derive, layoutFor };
})();
