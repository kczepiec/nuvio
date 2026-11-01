import { nuvioCardTag, nuvioCardType, nuvioHGL } from './nuvio-env.js';
import { syncSchemeFromDocument } from './theme.js';

/** Nadpisania pod podgląd (bez siatki HA): :host + ha-card bez height:100%. */
const SB_HOST_FIX = `
:host{ height:auto !important; min-height:0 !important; display:block !important; }
ha-card.glass.nuvio-sb-inner{ height:auto !important; min-height:0 !important; display:flex !important; flex-direction:column !important; gap:var(--s2,12px) !important; padding:var(--s2,12px) var(--s3,16px) !important; box-sizing:border-box !important; width:100% !important; }
.nv-arc{ max-width:100%; flex:none; }
`;

/** Montuje fragment UI w szkle (klocki hgUI) — jak tests/ui-gallery.html. */
export function mountGlass(boot, html, { width = 320, minHeight = 0 } = {}) {
  syncSchemeFromDocument();
  const ui = boot.ui || boot;
  const wrap = document.createElement('div');
  wrap.className = 'nuvio-sb-glass';
  wrap.style.width = `${width}px`;
  wrap.style.maxWidth = '100%';
  wrap.style.containerType = 'inline-size';
  if (minHeight) wrap.style.minHeight = `${minHeight}px`;
  const sh = wrap.attachShadow({ mode: 'open' });
  const css = ui.base() + ui.css() + SB_HOST_FIX;
  sh.innerHTML = `<style>${css}</style><ha-card class="glass nuvio-sb-inner">${html}</ha-card>`;
  return wrap;
}

/** Karty zakładają slot siatki: :host i ha-card mają height:100%. */
const SB_CARD_PIN = `
:host{ display:block !important; width:100% !important; height:100% !important; min-height:0 !important; min-width:0 !important; }
.root{ height:100% !important; width:100% !important; min-height:0 !important; min-width:0 !important; overflow:hidden !important; }
ha-card, ha-card.glass{ display:flex !important; flex-direction:column !important; width:100% !important; height:100% !important; min-width:0 !important; min-height:0 !important; max-height:100% !important; overflow:auto !important; box-sizing:border-box !important; }
`;

function pinCardLayout(el) {
  const sr = el.shadowRoot;
  if (!sr || sr.querySelector('style[data-sb-pin]')) return;
  const st = document.createElement('style');
  st.dataset.sbPin = '1';
  st.textContent = SB_CARD_PIN;
  sr.appendChild(st);
}

/** Montuje kartę Nuvio (tag jak w dist: nuvio-*-card).
 *  frame: true — stała ramka (katalog); inaczej szerokość w px i min-height. */
export function mountCard(tagName, config, hass, boot, { width = 920, minHeight = 400, frame = false } = {}) {
  syncSchemeFromDocument();
  const tag = nuvioCardTag(tagName);
  if (!customElements.get(tag)) {
    const wrap = document.createElement('div');
    wrap.className = 'nuvio-sb-err';
    wrap.textContent = `Nie zarejestrowano ${tag} — czy bundel się wczytał?`;
    return wrap;
  }
  const wrap = document.createElement('div');
  wrap.className = 'nuvio-sb-card-host';
  if (frame) {
    wrap.style.cssText = `position:relative;width:100%;height:${minHeight}px;container-type:size;overflow:hidden;border-radius:24px`;
  } else {
    wrap.style.cssText = `position:relative;width:${width}px;max-width:100%;height:${minHeight}px;box-sizing:border-box;container-type:size;overflow:hidden`;
  }
  const el = document.createElement(tag);
  el.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%';
  wrap.appendChild(el);
  requestAnimationFrame(() => {
    try {
      el.setConfig(Object.assign({ type: nuvioCardType(tag) }, config));
    } catch (e) {
      console.error('setConfig', tag, e);
    }
    pinCardLayout(el);
    el.hass = hass;
    window.__nuvioHass = window.__hgHass = hass;
    const th = window.__nuvioTheme || window.__hgTheme;
    if (th?.pick) th.pick(hass);
    const HGL = boot?.HGL || nuvioHGL();
    if (HGL?.notify) {
      try {
        HGL.notify();
      } catch (e) {
        /* HGApp.apply bez pełnej strony HA */
      }
    }
  });
  return wrap;
}

/** S / M / L obok siebie (container queries) — jak .box.s / .m / .l w galerii. */
export function mountGlassSizes(boot, htmlFn, labels = ['S', 'M', 'L'], opts = {}) {
  const row = document.createElement('div');
  row.className = 'nuvio-sb-sizes';
  const widths = { S: 180, M: 300, L: 460 };
  const minHeights = opts.minHeights || { S: 0, M: 0, L: 0 };
  for (const lab of labels) {
    const col = document.createElement('div');
    col.className = 'nuvio-sb-size-col';
    col.innerHTML = `<div class="nuvio-sb-size-lab">${lab}</div>`;
    col.appendChild(
      mountGlass(boot, htmlFn(lab), { width: widths[lab] || 300, minHeight: minHeights[lab] || opts.minHeight || 0 }),
    );
    row.appendChild(col);
  }
  return row;
}

export function stackCol(...parts) {
  return `<div class="nuvio-sb-stack">${parts.join('')}</div>`;
}
