import type { HassLike, HassPort } from './types';

/** Jedyna ścieżka z surowego hass do portu. Woła ją setter `hass` na karcie. */
export function fromHass(hass: HassLike, host: EventTarget): HassPort {
  return {
    state(entityId) {
      const row = hass.states[entityId];
      if (!row) return undefined;
      return { state: row.state, attributes: row.attributes, lastUpdated: row.last_updated };
    },
    subscribe() {
      return () => {};
    },
    async callService(domain, service, data) {
      await hass.callService(domain, service, data);
    },
    moreInfo(entityId) {
      host.dispatchEvent(new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }));
    },
    formatPercent(value) {
      return `${Math.round(value)}%`;
    },
    entityIds(domain) {
      const prefix = `${domain}.`;
      return Object.keys(hass.states).filter((id) => id.startsWith(prefix));
    },
  };
}
