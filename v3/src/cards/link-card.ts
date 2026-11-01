import { css, html } from 'lit';
import { t } from '../copy';
import type { CardAction } from '../ha/types';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

export class NuvioLinkCard extends NuvioCard {
  override defaults() {
    return { title: t('open'), subtitle: '', icon: 'mdi:open-in-new', action: null, entity: null };
  }

  private onGo = () => {
    const action = this.config?.action;
    if (action && typeof action === 'object') this.port?.runAction(action as CardAction);
  };

  override render() {
    const title = typeof this.config?.title === 'string' ? this.config.title : t('open');
    const icon = typeof this.config?.icon === 'string' ? this.config.icon : 'mdi:open-in-new';
    const id = this.entityId();
    const configured = typeof this.config?.subtitle === 'string' ? this.config.subtitle : '';
    const sub = configured || (id ? this.port?.formatState(id) || '' : '');
    return html`
      <ha-card role="link" tabindex="0" @click=${this.onGo} @keydown=${(ev: KeyboardEvent) => { if (ev.key === 'Enter') this.onGo(); }}>
        <ha-icon icon=${icon}></ha-icon>
        <span><b>${title}</b>${sub ? html`<small>${sub}</small>` : ''}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card { flex-direction: row; align-items: center; gap: 12px; cursor: pointer; }
    b { display: block; font-weight: 500; }
    small { display: block; opacity: 0.65; font-size: var(--nv-fs-2, 13px); }
    span { min-width: 0; }
    .chev { margin-left: auto; }
  `];
}

registerCard('nuvio-link-card', NuvioLinkCard, { name: t('linkName'), description: t('linkDescription') });
