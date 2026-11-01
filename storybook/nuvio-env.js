/** Zgodność ze źródłem (hg-*) i bundlem dist (nuvio-*, window.__nuvio*). */

export function nuvioUI() {
  return window.__nuvioUI || window.__hgUI;
}

export function nuvioHGL() {
  return window.__nuvioL || window.__hgL;
}

export function nuvioOverlay() {
  return window.__nuvioOverlay || window.__hgOverlay;
}

/** `hg-areas-card` lub `areas` → `nuvio-areas-card` (jak po brand() w build.py). */
export function nuvioCardTag(name) {
  let t = name;
  if (!t.includes('-card')) t = `hg-${t}-card`;
  if (t.startsWith('nuvio-')) return t;
  if (t.startsWith('hg-')) return `nuvio-${t.slice(3)}`;
  return t;
}

export function nuvioCardType(tag) {
  return `custom:${tag}`;
}
