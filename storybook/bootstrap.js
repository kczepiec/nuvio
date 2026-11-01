/** Ładuje dist/nuvio-core.* (wymaga wcześniejszego tools/build.py). */
import { nuvioHGL, nuvioUI, nuvioOverlay } from './nuvio-env.js';
import { applyStorybookScheme } from './theme.js';

let booted = null;

function stubHaElements() {
  if (!customElements.get('ha-card')) {
    customElements.define(
      'ha-card',
      class extends HTMLElement {
        connectedCallback() {
          this.style.cssText = 'display:block;width:100%;height:100%;min-width:0;box-sizing:border-box';
        }
      },
    );
  }
  if (!customElements.get('ha-icon')) {
    const cache = {};
    customElements.define(
      'ha-icon',
      class extends HTMLElement {
        static get observedAttributes() {
          return ['icon'];
        }
        set icon(v) {
          this.setAttribute('icon', v || '');
        }
        get icon() {
          return this.getAttribute('icon');
        }
        connectedCallback() {
          this.attributeChangedCallback();
        }
        attributeChangedCallback() {
          const name = (this.getAttribute('icon') || '').replace(/^mdi:/, '');
          if (!name || this._name === name) return;
          this._name = name;
          const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
          const paint = (svg) => {
            root.innerHTML =
              '<style>:host{display:inline-flex;vertical-align:middle;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);flex:none}svg{width:100%;height:100%;fill:currentColor}</style>' +
              (svg || '');
          };
          const url = 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/svg/' + encodeURIComponent(name) + '.svg';
          cache[name] = cache[name] || fetch(url).then((r) => (r.ok ? r.text() : '')).catch(() => '');
          cache[name].then(paint);
        }
      },
    );
  }
}

async function preloadLocale(lang, ver) {
  const code = lang === 'en' ? null : lang;
  if (!code || !ver.locales || !ver.locales[code]) return;
  const file = ver.locales[code];
  const pre = { code, file, p: fetch(`/dist/${file}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null) };
  window.__nuvioI18nPre = window.__hgI18nPre = pre;
}

function ensureHGL(HGL) {
  if (!HGL) return null;
  if (!HGL.data) HGL.data = { v: 1, ts: 0, s: {} };
  if (!HGL.subs) HGL.subs = new Set();
  if (!HGL.get) {
    HGL.get = (sc) => {
      const x = HGL.data.s[sc] || {};
      return { order: x.order || [], hidden: x.hidden || [], size: x.size || {}, added: x.added || [], names: x.names || {}, conf: x.conf || {} };
    };
  }
  if (!HGL.sort) HGL.sort = (list) => list;
  return HGL;
}

export async function bootNuvio(opts = {}) {
  if (booted?.ui && booted?.HGL) return booted;
  stubHaElements();
  window.__hgDryRun = true;
  window.__nuvioNoPause = window.__hgNoPause = true;
  window.__nuvioNoVer = window.__hgNoVer = true;
  const lang = opts.lang || 'pl';
  window.__nuvioLangOpt = window.__hgLangOpt = lang;

  const res = await fetch('/dist/nuvio-version.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Brak dist/nuvio-version.json — uruchom: npm run build');
  const ver = await res.json();
  const core = ver.core;
  if (!core) throw new Error('nuvio-version.json bez pola core');

  await preloadLocale(lang, ver);
  await import(/* @vite-ignore */ `/dist/${core}`);
  await new Promise((r) => queueMicrotask(r));
  await new Promise((r) => queueMicrotask(r));

  const ui = nuvioUI();
  const HGL = ensureHGL(nuvioHGL());
  if (!ui) throw new Error('Bundel załadowany, ale brak window.__nuvioUI — uruchom: npm run build');
  if (!HGL) {
    throw new Error('Bundel załadowany, ale brak window.__nuvioL (layout). Sprawdź konsolę pod kątem błędu importu core.');
  }

  applyStorybookScheme(document.documentElement.getAttribute('data-hg-scheme') === 'dark');
  const th = window.__nuvioTheme || window.__hgTheme;
  if (th?.pick) th.pick({ themes: { darkMode: document.documentElement.getAttribute('data-hg-scheme') === 'dark' } });

  booted = { ui, overlay: nuvioOverlay(), HGL };
  return booted;
}

export function requireNuvio(context) {
  const n = context?.loaded?.nuvio || booted;
  if (!n?.ui || !n?.HGL) {
    throw new Error('Nuvio nie jest gotowy — odśwież story lub: npm run build && npm run storybook');
  }
  return n;
}

export function resetBootForTests() {
  booted = null;
}
