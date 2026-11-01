import { css, html } from 'lit';
import { t, type CopyKey } from '../copy';
import type { HassPort } from '../ha/types';
import { fillName, greetingPart, needsAttention } from './migrate';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

const PART: Record<string, CopyKey> = { night: 'night', morning: 'morning', afternoon: 'afternoon', evening: 'evening' };

function listed(config: Record<string, unknown> | null): string[] {
  const list = config?.status_entities;
  return Array.isArray(list) ? list.filter((id): id is string => typeof id === 'string') : [];
}

function attention(port: HassPort | null, config: Record<string, unknown> | null): number {
  if (!port) return 0;
  const chosen = listed(config);
  const ids = chosen.length ? chosen : [...port.entityIds('lock'), ...port.entityIds('alarm_control_panel'), ...port.entityIds('binary_sensor')];
  return ids.filter((id) => needsAttention(id, port.state(id))).length;
}

export class NuvioHeroCard extends NuvioCard {
  static getStubConfig() {
    return {};
  }

  override defaults() {
    return { title: null, subtitle: null, image: null, entity: null, glass: false, studio: false, auto_greeting: false, status: false };
  }

  override getGridOptions() {
    return { columns: 12, rows: 2 };
  }

  private onMore = () => {
    const id = this.entityId();
    if (id) this.port?.moreInfo(id);
  };

  override render() {
    const greet = this.config?.studio === true || this.config?.auto_greeting === true;
    const showStatus = this.config?.studio === true || this.config?.status === true;
    const name = this.port?.firstName() || '';
    const hour = new Date().getHours();
    const part = PART[greetingPart(hour)] ?? 'hey';
    const template = typeof this.config?.title === 'string' ? this.config.title : t(greet ? part : 'hey');
    const text = fillName(template, name);
    const split = (greet || this.config?.status === true) ? text.indexOf(', ') : -1;
    const rawSub = this.config?.subtitle;
    const subtitle = this.config?.studio === true ? '' : typeof rawSub === 'string' ? fillName(rawSub, name) : t('tagline');
    const count = showStatus ? attention(this.port, this.config) : 0;
    const note = count === 1 ? t('attentionOne').replace('{count}', '1') : t('attentionOther').replace('{count}', String(count));
    const image = typeof this.config?.image === 'string' ? this.config.image : '';
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    return html`
      <ha-card class=${image ? 'img' : ''} style=${image ? `--img:url('${encodeURI(image)}')` : ''}>
        <h1>${split > 0 ? html`<span>${text.slice(0, split + 1)}</span> <span>${text.slice(split + 2)}</span>` : text}</h1>
        ${subtitle ? html`<p>${subtitle}</p>` : ''}
        ${showStatus ? html`<div class="stl"><i class=${count ? 'warn' : ''}></i><span>${count ? note : t('allSet')}</span></div>` : ''}
        ${state ? html`<button type="button" @click=${this.onMore}>${this.port?.formatState(id) || state.state}</button>` : ''}
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card {
      flex-direction: column; justify-content: flex-end; gap: 4px; min-height: 120px;
      background: none; box-shadow: none; color: #fff;
      text-shadow: 0 1px 10px color-mix(in srgb, black 35%, transparent);
    }
    ha-card.img {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.55)), var(--img) center / cover no-repeat;
      box-shadow: var(--nv-edge, none), var(--nv-shadow-lg, none);
    }
    h1 { margin: 0; font-size: clamp(16px, min(9cqi, 20cqh), 64px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; }
    p { margin: 0; font-size: clamp(12px, min(5cqi, 11cqh), 32px); font-weight: 300; }
    .stl { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: clamp(11px, min(4cqi, 9cqh), 18px); }
    i { width: 9px; height: 9px; border-radius: 50%; background: #34c759; }
    i.warn { background: #ff9f0a; }
    button { align-self: flex-start; margin-top: 8px; padding: 6px 12px; border-radius: 999px; background: color-mix(in srgb, black 28%, transparent); color: #fff; }
  `];
}

registerCard('nuvio-hero-card', NuvioHeroCard, { name: t('heroName'), description: t('heroDescription') });
