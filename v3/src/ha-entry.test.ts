import { describe, expect, it } from 'vitest';
import { installV3Tokens, NUVIO_V3_RUNTIME } from './ha-entry';

describe('v3 tokens inside Home Assistant', () => {
  it('injects one style tag', () => {
    expect(NUVIO_V3_RUNTIME).toBe('nuvio-v3-runtime');
    document.getElementById('nv-tokens')?.remove();
    installV3Tokens(document);
    installV3Tokens(document);
    const tags = document.querySelectorAll('#nv-tokens');
    expect(tags.length).toBe(1);
    expect(tags[0]?.textContent).toContain('--nv-accent:');
    expect(tags[0]?.textContent).not.toMatch(/--hg-[a-z0-9-]+\s*:/);
  });
});
