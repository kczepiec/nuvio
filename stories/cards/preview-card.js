import { requireNuvio } from '../../storybook/bootstrap.js';
import { mountCard } from '../../storybook/mount.js';
import { nuvioCardTag } from '../../storybook/nuvio-env.js';
import { catalogHass, withEntityState } from '../../storybook/mocks/hass.js';
import { CARD_VARIANTS } from '../../storybook/mocks/card-states.js';

const TALL = new Set(['areas', 'room', 'map', 'month', 'agenda', 'cameras', 'robots', 'sensors', 'net', 'week', 'players']);
const SIZE = { areas: { width: 1080, minHeight: 340 } };

function stubConfig(tag, hass) {
  const Cls = customElements.get(tag);
  try {
    if (Cls && typeof Cls.getStubConfig === 'function') {
      const c = Cls.getStubConfig(hass);
      if (c && typeof c === 'object') return c;
    }
  } catch (e) {
    /* brak stubu */
  }
  return {};
}

function variantRow(spec, variantId) {
  return (spec?.variants || []).find((v) => v[0] === variantId) || null;
}

function variantEntity(spec, variantId) {
  const row = variantRow(spec, variantId);
  return (row && row[5]) || spec?.entity || null;
}

function applyVariant(hass, spec, variantId) {
  const row = variantRow(spec, variantId);
  if (!row) return hass;
  const apply = row[4];
  if (typeof apply === 'function') return apply(hass);
  const state = row[2];
  const entity = (row && row[5]) || spec?.entity;
  if (state == null || !entity) return hass;
  return withEntityState(hass, entity, state, row[3] || {});
}

/** Jeden stan karty. variantId = null → bogaty mock bez podmiany. */
export function cardStory(hgTag, variantId) {
  const spec = CARD_VARIANTS[hgTag];
  const row = spec?.variants?.find((v) => v[0] === variantId);
  const name = hgTag.replace(/^hg-/, '').replace(/-card$/, '');
  return {
    name: row ? row[1] : 'Dane',
    render: (_, ctx) => {
      requireNuvio(ctx);
      let hass = catalogHass();
      hass = applyVariant(hass, spec, variantId);
      const tag = nuvioCardTag(hgTag);
      const cfg = Object.assign({}, stubConfig(tag, hass), spec?.config || {});
      const entity = variantEntity(spec, variantId);
      if (entity) cfg.entity = entity;
      const size = SIZE[name] || { width: 480, minHeight: TALL.has(name) ? 420 : 280 };
      return mountCard(tag, cfg, hass, null, size);
    },
  };
}

export function variantIds(hgTag) {
  const list = CARD_VARIANTS[hgTag]?.variants;
  return list?.length ? list.map((v) => v[0]) : ['Dane'];
}
