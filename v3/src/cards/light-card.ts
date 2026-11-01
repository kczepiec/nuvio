import { css, html } from 'lit';
import { t } from '../copy';
import type { HassLike } from '../ha/types';
import { commandFor, lightView, nextPending } from './light';
import { NuvioCard, registerCard } from './nuvio-card';

const TAG = 'nuvio-light-card';

export class NuvioLightCard extends NuvioCard {
  private drag: number | null = null;
  private pending: number | null = null;
  private pendingTimer = 0;

  override defaults() {
    return { title: t('lighting'), icon: 'mdi:lightbulb-outline', name: null };
  }

  static getStubConfig(hass: HassLike) {
    const entity = Object.keys(hass.states).find((id) => id.startsWith('light.')) ?? 'light.example';
    return { entity };
  }

  override getGridOptions() {
    return { columns: 6, rows: 2 };
  }

  override set hass(hass: HassLike) {
    const prev = this.port?.state(this.entityId())?.lastUpdated;
    super.hass = hass;
    const next = this.port?.state(this.entityId())?.lastUpdated;
    this.pending = nextPending(this.pending, prev, next);
  }

  override get hass(): HassLike | null {
    return super.hass;
  }

  private heading(): string {
    const title = this.config?.title;
    return typeof title === 'string' ? title : t('lighting');
  }

  private icon(): string {
    const icon = this.config?.icon;
    return typeof icon === 'string' ? icon : 'mdi:lightbulb-outline';
  }

  private configuredName(): string | null {
    const name = this.config?.name;
    return typeof name === 'string' ? name : null;
  }

  private async run(action: 'toggle' | 'more' | 'brightness', percent?: number) {
    const port = this.port;
    const entity = this.entityId();
    if (!port || !entity) return;
    const state = port.state(entity);
    const command = commandFor(action, entity, state, percent);
    if (command.kind === 'noop') return;
    if (command.kind === 'more-info') {
      port.moreInfo(entity);
      return;
    }
    if (action === 'brightness' && percent != null) {
      this.pending = percent;
      window.clearTimeout(this.pendingTimer);
      this.pendingTimer = window.setTimeout(() => {
        this.pending = null;
        this.requestUpdate();
      }, 4000);
    }
    await port.callService(command.domain, command.service, command.data);
    this.requestUpdate();
  }

  private onToggle = () => {
    void this.run('toggle');
  };

  private onMore = () => {
    void this.run('more');
  };

  private point(ev: PointerEvent, track: HTMLElement): number {
    const rect = track.getBoundingClientRect();
    const width = rect.width || 1;
    return Math.round(Math.max(0, Math.min(1, (ev.clientX - rect.left) / width)) * 100);
  }

  private onDown = (ev: PointerEvent) => {
    const track = ev.currentTarget as HTMLElement;
    if (track.getAttribute('aria-disabled') === 'true') return;
    track.setPointerCapture(ev.pointerId);
    this.drag = this.point(ev, track);
    this.requestUpdate();
  };

  private onMove = (ev: PointerEvent) => {
    if (this.drag == null) return;
    this.drag = this.point(ev, ev.currentTarget as HTMLElement);
    this.requestUpdate();
  };

  private onUp = (ev: PointerEvent) => {
    if (this.drag == null) return;
    const value = this.drag;
    this.drag = null;
    void this.run('brightness', value);
  };

  private onKey = (ev: KeyboardEvent) => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    const track = ev.currentTarget as HTMLElement;
    if (track.getAttribute('aria-disabled') === 'true') return;
    ev.preventDefault();
    const entity = this.entityId();
    const state = this.port?.state(entity);
    const view = lightView(state, entity, this.configuredName(), this.drag, this.pending);
    const step = ev.key === 'ArrowRight' ? 10 : -10;
    void this.run('brightness', Math.max(0, Math.min(100, view.percent + step)));
  };

  override render() {
    const entity = this.entityId();
    const state = this.port?.state(entity);
    const view = lightView(state, entity, this.configuredName(), this.drag, this.pending);
    const percent = `${view.percent}%`;
    const label = view.unavailable ? '—' : (this.port?.formatPercent(view.percent) ?? percent);
    const tip = `${view.name}${view.unavailable ? t('unavailable') : ''}`;
    return html`
      <ha-card class=${view.unavailable ? 'un' : view.percent ? '' : 'off'} title=${tip}>
        <div class="hd">
          <button type="button" data-act="toggle" aria-label="${t('toggle')} ${view.name}" @click=${this.onToggle}>
            <ha-icon class=${view.on ? 'on' : ''} icon=${this.icon()}></ha-icon>
          </button>
          <span class="tt">${this.heading()}</span>
          <button type="button" data-act="more" aria-label=${t('expand')} @click=${this.onMore}>
            <ha-icon icon="mdi:arrow-expand"></ha-icon>
          </button>
        </div>
        <div
          class="trk ${this.drag != null ? 'drag' : ''}"
          role="slider"
          tabindex=${view.unavailable ? -1 : 0}
          aria-label="${t('brightness')} ${view.name}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${view.percent}
          aria-disabled=${view.unavailable ? 'true' : 'false'}
          @pointerdown=${this.onDown}
          @pointermove=${this.onMove}
          @pointerup=${this.onUp}
          @pointercancel=${this.onUp}
          @keydown=${this.onKey}
        >
          <div class="fl" style="width: ${view.percent}%"></div>
          <span class="pc">${label}</span>
        </div>
      </ha-card>
    `;
  }

  override disconnectedCallback() {
    window.clearTimeout(this.pendingTimer);
    super.disconnectedCallback();
  }

  static override styles = css`
    :host { display: block; }
    ha-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      box-sizing: border-box;
      min-height: 112px;
      padding: var(--nv-space-2, 16px) var(--nv-space-3, 21px);
      border-radius: var(--nv-radius, 24px);
      color: var(--nv-ink, #1c1c1e);
      background: var(--nv-glass-sheen, none), var(--nv-glass-bg, rgba(234, 238, 243, 0.66));
      box-shadow: var(--nv-edge, none), var(--nv-shadow-lg, none);
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    .hd { display: flex; align-items: center; gap: 4px; }
    .tt { font-size: var(--nv-fs-3, 15px); font-weight: 400; }
    button {
      all: unset;
      cursor: pointer;
      box-sizing: border-box;
      width: var(--nv-btn-touch, 44px);
      height: var(--nv-btn-touch, 44px);
      display: grid;
      place-items: center;
      border-radius: var(--nv-radius-pill, 999px);
    }
    button:focus-visible { outline: 2px solid var(--nv-accent, #63d71e); outline-offset: 2px; }
    ha-icon { width: 18px; height: 18px; color: var(--nv-ink, #1c1c1e); }
    ha-icon.on { color: var(--nv-accent-tx, #1a4607); }
    .trk {
      position: relative;
      height: var(--nv-btn-touch, 44px);
      border-radius: var(--nv-track, 21px);
      background: var(--nv-glass-bg, rgba(255, 255, 255, 0.6));
      box-shadow: var(--nv-edge, inset 0 0 0 1px rgba(255, 255, 255, 0.34));
      touch-action: none;
      cursor: pointer;
      overflow: hidden;
    }
    .fl {
      position: absolute;
      inset: 0 auto 0 0;
      min-width: 28px;
      border-radius: inherit;
      background: var(--nv-accent-faint, rgba(99, 215, 30, 0.1));
      transition: width var(--nv-t-base, 200ms) var(--nv-ease-out, ease);
    }
    .drag .fl { transition: none; }
    .off .fl { background: color-mix(in srgb, var(--nv-ink, #1c1c1e) 12%, transparent); }
    .pc {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--nv-fs-2, 13px);
      pointer-events: none;
    }
    .un .trk { cursor: not-allowed; }
    button[data-act='more'] { margin-left: auto; }
  `;
}

registerCard(TAG, NuvioLightCard, {
  name: t('pickerName'),
  description: t('pickerDescription'),
});
