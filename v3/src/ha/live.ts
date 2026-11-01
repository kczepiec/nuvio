import { actionStep } from '../cards/action';
import type { HassLike, HassPort } from './types';

function go(path: string) {
  history.pushState(null, '', path);
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
}

/** Jedyna ścieżka z surowego hass do portu. Woła ją setter `hass` na karcie. */
export function fromHass(hass: HassLike, host: EventTarget): HassPort {
  const locale = () => hass.locale?.language || hass.language || navigator.language || 'en';
  const moreInfo = (entityId: string) => {
    host.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  };
  const callService = async (domain: string, service: string, data?: Record<string, unknown>) => {
    await hass.callService(domain, service, data);
  };
  return {
    state(entityId) {
      const row = hass.states[entityId];
      if (!row) return undefined;
      return { state: row.state, attributes: row.attributes, lastUpdated: row.last_updated };
    },
    subscribe() {
      return () => {};
    },
    callService,
    moreInfo,
    formatPercent(value) {
      return `${Math.round(value)}%`;
    },
    formatNumber(value, digits) {
      return value.toLocaleString(locale(), { maximumFractionDigits: digits, minimumFractionDigits: 0 });
    },
    formatState(entityId) {
      const row = hass.states[entityId];
      if (!row) return '';
      try {
        return hass.formatEntityState?.(row) || row.state;
      } catch {
        return row.state;
      }
    },
    entityIds(domain) {
      const prefix = `${domain}.`;
      return Object.keys(hass.states).filter((id) => id.startsWith(prefix));
    },
    firstName() {
      return String(hass.user?.name || '').trim().split(/\s+/)[0] || '';
    },
    userId() {
      return hass.user?.id || '';
    },
    locale,
    runAction(action) {
      const step = actionStep(action);
      if (step.kind === 'navigate') go(step.path);
      else if (step.kind === 'url') window.open(step.url, '_blank', 'noopener');
      else if (step.kind === 'more-info') moreInfo(step.entityId);
      else if (step.kind === 'service') void callService(step.domain, step.service, step.data);
      else if (step.kind === 'back') history.length > 1 ? history.back() : go(step.fallback);
    },
    async callWS(message) {
      return hass.callWS ? hass.callWS(message) : null;
    },
    async history(entityId, hours) {
      if (!hass.callWS || !entityId) return [];
      try {
        const raw = await hass.callWS({
          type: 'history/history_during_period',
          start_time: new Date(Date.now() - hours * 3600e3).toISOString(),
          entity_ids: [entityId],
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false,
        }) as Record<string, Array<{ lu?: number; lc?: number; last_changed?: string; last_updated?: string; s?: string; state?: string }>> | null;
        return ((raw && raw[entityId]) || []).map((row) => ({
          t: (row.lu || row.lc || 0) * 1000 || Date.parse(row.last_changed || row.last_updated || ''),
          v: parseFloat(row.s ?? row.state ?? ''),
        })).filter((row) => Number.isFinite(row.v));
      } catch {
        return [];
      }
    },
  };
}
