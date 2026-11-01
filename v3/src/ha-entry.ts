import aliasCss from './tokens/aliases.css?inline';
import './cards/light-card';
import './cards/clock-card';
import './cards/switch-card';
import './cards/value-card';
import './cards/link-card';
import './cards/energy-card';
import './cards/hero-card';
import './cards/wave-cards';
import './cards/host-cards';

/** Znacznik kolejności w bundlu: tools/build.py wymaga, żeby był przed hgReg karty legacy. */
export const NUVIO_V3_RUNTIME = 'nuvio-v3-runtime';

const STYLE_ID = 'nv-tokens';

export function installV3Tokens(doc: Document = document) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = aliasCss;
  (doc.head || doc.documentElement).appendChild(style);
}

installV3Tokens();
