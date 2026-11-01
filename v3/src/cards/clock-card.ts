import { css, html } from 'lit';
import { t } from '../copy';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

export class NuvioClockCard extends NuvioCard {
  private timer = 0;

  override defaults() {
    return { title: null, seconds: false, date: true, hour12: false };
  }

  override getGridOptions() {
    return { columns: 6, rows: 2 };
  }

  override connectedCallback() {
    super.connectedCallback();
    this.arm();
  }

  override setConfig(config: Record<string, unknown>) {
    super.setConfig(config);
    this.arm();
  }

  override disconnectedCallback() {
    window.clearInterval(this.timer);
    super.disconnectedCallback();
  }

  private arm() {
    window.clearInterval(this.timer);
    if (!this.isConnected) return;
    const seconds = this.config?.seconds === true;
    this.timer = window.setInterval(() => this.requestUpdate(), seconds ? 1000 : 15000);
  }

  private now() {
    const date = new Date();
    const locale = this.port?.locale() || navigator.language;
    const hour12 = this.config?.hour12 === true;
    const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12 });
    const seconds = this.config?.seconds === true ? String(date.getSeconds()).padStart(2, '0') : '';
    const day = date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
    return { time, seconds, day };
  }

  override render() {
    const clock = this.now();
    const title = this.config?.title;
    const showDate = this.config?.date !== false;
    return html`
      <ha-card>
        ${typeof title === 'string' && title ? html`<span class="tt">${title}</span>` : ''}
        <span class="tm" role="timer">${clock.time}${clock.seconds ? html`<small>${clock.seconds}</small>` : ''}</span>
        ${showDate ? html`<span class="dt">${clock.day}</span>` : ''}
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card { flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; }
    .tt { font-size: var(--nv-fs-1, 11px); letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.6; }
    .tm { font-size: clamp(34px, 22cqi, 96px); font-weight: 300; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
    .tm small { font-size: 0.38em; opacity: 0.6; margin-left: 4px; }
    .dt { font-size: 14px; opacity: 0.75; text-transform: capitalize; }
  `];
}

registerCard('nuvio-clock-card', NuvioClockCard, { name: t('clockName'), description: t('clockDescription') });
