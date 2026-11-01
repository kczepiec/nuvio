/* Tworzenie karty potomnej zostaje tutaj, bo strona, studio i edytor wołają hgFromHA / hgMakeCard.
   Same kontenery (stos, siatka, zakładki, warunek) są elementami Lit w v3/. */
const hgMakeCard = (cfg, done) => { cfg = hgCardClean(hgFromHA(cfg)); const t = String((cfg && cfg.type) || '');
  const mk = (tag) => { const el = document.createElement(tag); try { el.setConfig(cfg); } catch (e) { el.textContent = String(e.message || e); } return el; };
  if (t.startsWith('custom:')) { const tag = t.slice(7); if (customElements.get(tag)) return done(mk(tag)); customElements.whenDefined(tag).then(() => done(mk(tag))); return; }
  if (window.loadCardHelpers) window.loadCardHelpers().then((hl) => done(hl.createCardElement(cfg))).catch(() => {});
  else customElements.whenDefined('hui-' + t + '-card').then(() => done(mk('hui-' + t + '-card'))); };
const HG_CONT = ['custom:hg-stack-card', 'custom:hg-grid-card', 'custom:hg-tabs-card', 'custom:hg-conditional-card'];
const hgIsCont = (c) => !!c && (HG_CONT.includes(c.type) || ['grid', 'vertical-stack', 'horizontal-stack', 'conditional'].includes(c.type));
const hgFromHA = (c) => { if (!c || typeof c !== 'object' || c.keep_ha) return c;
  const kids = Array.isArray(c.cards) ? c.cards.map(hgFromHA) : c.cards, base = Object.assign({}, c.title ? { title: c.title } : {}, { cards: kids });
  if (c.type === 'grid') return Object.assign({ type: 'custom:hg-grid-card', columns: c.columns || 3 }, c.square ? { square: true } : {}, base);
  if (c.type === 'vertical-stack') return Object.assign({ type: 'custom:hg-stack-card', direction: 'vertical' }, base);
  if (c.type === 'conditional' && c.card) return Object.assign({ type: 'custom:hg-conditional-card', conditions: c.conditions || [], cards: [hgFromHA(c.card)] });
  if (c.type === 'horizontal-stack') return Object.assign({ type: 'custom:hg-stack-card', direction: 'horizontal' }, base);
  return kids !== c.cards ? Object.assign({}, c, { cards: kids }) : c; };
const hgCardClean = (c) => { if (!c || typeof c !== 'object') return c; const o = {}; for (const k in c) if (!/^nv_/.test(k) && k !== 'span' && k !== 'keep_ha') o[k] = c[k];
  if (c.single && !c.single.t && c.nv_comp && typeof HG_COMP !== 'undefined') { const C = HG_COMP.find((x) => x.id === c.nv_comp); if (C && C.tile) o.single = Object.assign({}, c.single, { t: C.tile }); }
  return o; };
const HG_CONT_MAX = 3;
