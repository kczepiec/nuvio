import { css, html } from 'lit';
import { t } from '../copy';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

export class NuvioValueCard extends NuvioCard {
  override defaults() {
    return { entity: null, name: null, icon: null, warn: null, alert: null, decimals: 1 };
  }

  override getGridOptions() {
    return { columns: 3, rows: 2 };
  }

  private onMore = () => {
    const id = this.entityId();
    if (id) this.port?.moreInfo(id);
  };

  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) {
      return html`<ha-card><div class="ph"><b>${t('chooseEntity')}</b>${t('sensorHint')}</div></ha-card>`;
    }
    const value = state.state === '' ? NaN : Number(state.state);
    const numeric = Number.isFinite(value);
    const digits = Number(this.config?.decimals ?? 1) || 0;
    const alert = this.config?.alert;
    const warn = this.config?.warn;
    const level = numeric && alert != null && value >= Number(alert) ? 'a' : numeric && warn != null && value >= Number(warn) ? 'w' : '';
    const unit = String(state.attributes.unit_of_measurement || '');
    const shown = numeric ? (this.port?.formatNumber(value, digits) ?? String(value)) : (this.port?.formatState(id) || state.state);
    const icon = (typeof this.config?.icon === 'string' && this.config.icon) || (typeof state.attributes.icon === 'string' && state.attributes.icon) || 'mdi:numeric';
    const name = (typeof this.config?.name === 'string' && this.config.name) || (typeof state.attributes.friendly_name === 'string' && state.attributes.friendly_name) || id;
    return html`
      <ha-card>
        <button type="button" @click=${this.onMore}>
          <ha-icon icon=${icon}></ha-icon>
          <span>${name}</span>
        </button>
        <span class="big ${level}">${shown}${numeric && unit ? html`<small>${unit}</small>` : ''}</span>
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card { flex-direction: column; justify-content: space-between; gap: 8px; }
    button { display: flex; align-items: center; gap: 8px; }
    .big { font-size: var(--nv-fs-6, 40px); font-weight: 300; letter-spacing: -0.03em; line-height: 1; }
    .big small { font-size: 0.4em; margin-left: 4px; opacity: 0.7; }
    .big.w { color: #c48414; }
    .big.a { color: #c23b2e; }
  `];
}

registerCard('nuvio-value-card', NuvioValueCard, { name: t('valueName'), description: t('valueDescription') });
