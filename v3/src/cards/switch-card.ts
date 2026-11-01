import { css, html } from 'lit';
import { t } from '../copy';
import { switchCall } from './migrate';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

function idsOf(config: Record<string, unknown> | null): string[] {
  const list = config?.entities;
  if (Array.isArray(list)) return list.filter((id): id is string => typeof id === 'string' && !!id);
  return typeof config?.entity === 'string' && config.entity ? [config.entity] : [];
}

export class NuvioSwitchCard extends NuvioCard {
  override defaults() {
    return { title: null, subtitle: null, icon: 'mdi:toggle-switch-outline', layout: 'row', more: true };
  }

  override getGridOptions() {
    return { columns: 6, rows: 1 };
  }

  private rows() {
    return idsOf(this.config).map((id) => ({ id, state: this.port?.state(id)?.state }));
  }

  private onToggle = () => {
    const call = switchCall(this.rows());
    if (!call || !this.port) return;
    void this.port.callService('homeassistant', call.service, { entity_id: call.entity_id });
  };

  private onMore = () => {
    const id = (typeof this.config?.more_entity === 'string' && this.config.more_entity) || idsOf(this.config)[0];
    if (id) this.port?.moreInfo(id);
  };

  override render() {
    const rows = this.rows();
    const known = rows.filter((row) => row.state != null && row.state !== 'unavailable');
    const onCount = known.filter((row) => row.state === 'on').length;
    const on = onCount > 0;
    const title = typeof this.config?.title === 'string' && this.config.title
      ? this.config.title
      : (rows[0] ? this.port?.state(rows[0].id)?.attributes.friendly_name : '') || rows[0]?.id || '';
    const name = typeof title === 'string' ? title : String(title);
    const tile = this.config?.layout === 'tile';
    const status = !known.length ? t('unavailableState') : on
      ? (rows.length > 1 ? `${t('on')} · ${onCount}/${rows.length}` : t('on'))
      : t('off');
    const icon = typeof this.config?.icon === 'string' ? this.config.icon : 'mdi:toggle-switch-outline';
    const subtitle = typeof this.config?.subtitle === 'string' ? this.config.subtitle : '';
    const more = this.config?.more !== false;
    const infoId = typeof this.config?.info_entity === 'string' ? this.config.info_entity : '';
    const info = infoId ? this.port?.state(infoId) : undefined;
    const tip = info ? `${status} · ${info.state === 'on' ? t('connected') : t('disconnected')}` : status;
    return html`
      <ha-card class=${tile ? 'tile' : 'row'} title=${tip}>
        <ha-icon class=${on ? 'on' : ''} icon=${icon}></ha-icon>
        ${tile ? '' : html`<span class="tt">${name}${subtitle ? html`<small> (${subtitle})</small>` : ''}</span>`}
        <span class="sp"></span>
        <button type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${name} ?disabled=${!known.length} @click=${this.onToggle}><i></i></button>
        ${more ? html`<button type="button" data-act="more" aria-label=${t('more')} @click=${this.onMore}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>` : ''}
        ${tile ? html`<div class="nm">${name}</div><div class="st">${status}</div>` : ''}
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card { flex-direction: row; align-items: center; gap: 8px; }
    ha-card.tile { flex-wrap: wrap; align-items: stretch; }
    .tt, .nm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tt small, .st { opacity: 0.65; font-size: var(--nv-fs-2, 13px); }
    .sp { flex: 1; }
    ha-icon.on { color: var(--nv-accent-tx, #1a4607); }
    button[role='switch'] {
      width: 44px; height: 28px; border-radius: 999px; background: color-mix(in srgb, var(--nv-ink, #1c1c1e) 16%, transparent); position: relative;
    }
    button[role='switch'][aria-checked='true'] { background: var(--nv-accent, #63d71e); }
    button[role='switch'] i {
      position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: var(--nv-on-accent, #0b0f0a); transition: transform var(--nv-t-base, 200ms);
    }
    button[role='switch'][aria-checked='true'] i { transform: translateX(16px); background: #fff; }
    .nm, .st { flex: 1 0 100%; }
  `];
}

registerCard('nuvio-switch-card', NuvioSwitchCard, { name: t('switchName'), description: t('switchDescription') });
