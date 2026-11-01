import { css } from 'lit';

export const face = css`
  :host { display: block; }
  ha-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    min-height: 64px;
    padding: var(--nv-space-2, 16px) var(--nv-space-3, 21px);
    border-radius: var(--nv-radius, 24px);
    color: var(--nv-ink, #1c1c1e);
    background: var(--nv-glass-sheen, none), var(--nv-glass-bg, rgba(234, 238, 243, 0.66));
    box-shadow: var(--nv-edge, none), var(--nv-shadow-lg, none);
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  button { all: unset; cursor: pointer; box-sizing: border-box; }
  button:focus-visible, ha-card:focus-visible { outline: 2px solid var(--nv-accent, #63d71e); outline-offset: 2px; }
  ha-icon { width: 18px; height: 18px; color: inherit; }
  .ph { opacity: 0.7; }
  .ph b { display: block; font-weight: 600; }
`;
