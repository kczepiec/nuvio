import { css, html } from 'lit';
import { t } from '../copy';
import type { CardAction } from '../ha/types';
import { energyLoad, watts } from './migrate';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

function entityList(config: Record<string, unknown> | null): string[] {
  const list = config?.entities;
  return Array.isArray(list) ? list.filter((id): id is string => typeof id === 'string') : [];
}

export class NuvioEnergyCard extends NuvioCard {
  override defaults() {
    return {
      title: t('energyTitle'),
      icon: 'mdi:star-four-points',
      entities: [],
      max_power: 17250,
      thresholds: { low: 30, high: 70 },
      compact: false,
    };
  }

  override getGridOptions() {
    return { columns: 6, rows: 2 };
  }

  private onExpand = () => {
    const action = this.config?.expand;
    if (action && typeof action === 'object') this.port?.runAction(action as CardAction);
  };

  override render() {
    const ids = entityList(this.config);
    const values = ids.map((id) => watts(this.port?.state(id))).filter((value): value is number => value != null);
    const thresholds = (this.config?.thresholds || {}) as { low?: number; high?: number };
    const load = energyLoad(values, Number(this.config?.max_power) || 17250, Number(thresholds.low ?? 30), Number(thresholds.high ?? 70));
    const title = typeof this.config?.title === 'string' ? this.config.title : t('energyTitle');
    const icon = typeof this.config?.icon === 'string' ? this.config.icon : 'mdi:star-four-points';
    const labels: Record<string, string> = { low: t('lowUsage'), medium: t('mediumUsage'), high: t('highUsage') };
    const head = html`
      <div class="hd">
        <ha-icon icon=${icon}></ha-icon>
        <span>${title}</span>
        ${this.config?.expand ? html`<button type="button" aria-label=${t('expand')} @click=${this.onExpand}><ha-icon icon="mdi:arrow-expand"></ha-icon></button>` : ''}
      </div>`;
    if (!load) return html`<ha-card>${head}<div class="ph"><b>${t('noSource')}</b>${t('powerMissing')}</div></ha-card>`;
    const pct = Math.round(load.pct);
    const label = `${this.port?.formatPercent(pct) ?? pct + '%'} · ${labels[load.level]}`;
    const amount = load.tot >= 1000
      ? `${this.port?.formatNumber(load.tot / 1000, 2) ?? (load.tot / 1000).toFixed(2)} kW`
      : `${this.port?.formatNumber(load.tot, 0) ?? Math.round(load.tot)} W`;
    return html`
      <ha-card class=${this.config?.compact ? 'cmp' : ''}>
        ${head}
        ${this.config?.compact ? html`<div class="row"><b>${amount}</b><span>${label}</span></div>` : html`<div class="sub">${label}</div>`}
        <div class="bar" role="meter" aria-label=${t('load')} aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
          <div class="fill" style="width: ${load.pct}%"></div>
        </div>
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card { flex-direction: column; gap: 10px; }
    .hd { display: flex; align-items: center; gap: 8px; }
    .hd button { margin-left: auto; }
    ha-icon { color: var(--nv-accent-tx, #1a4607); }
    .sub, .row span { font-size: var(--nv-fs-2, 13px); opacity: 0.75; }
    .row { display: flex; align-items: baseline; gap: 8px; }
    .row b { font-size: 17px; font-weight: 600; }
    .bar { position: relative; height: 46px; border-radius: var(--nv-radius-in, 16px); background: color-mix(in srgb, var(--nv-ink, #1c1c1e) 8%, transparent); overflow: hidden; }
    ha-card.cmp .bar { height: 10px; }
    .fill { position: absolute; inset: 0 auto 0 0; min-width: 8px; background: var(--nv-accent, #63d71e); border-radius: inherit; }
  `];
}

registerCard('nuvio-energy-card', NuvioEnergyCard, { name: t('energyName'), description: t('energyDescription') });
