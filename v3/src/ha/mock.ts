import type { EntityState, HassPort, ServiceCall } from './types';

export interface MockPort extends HassPort {
  calls: ServiceCall[];
  infos: string[];
  emit(): void;
}

export function mockPort(states: Record<string, EntityState>, host: EventTarget = new EventTarget()): MockPort {
  const calls: ServiceCall[] = [];
  const infos: string[] = [];
  const subs = new Set<() => void>();
  return {
    calls,
    infos,
    state: (id) => states[id],
    subscribe(_ids, cb) {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    async callService(domain, service, data) {
      calls.push({ domain, service, data });
    },
    moreInfo(entityId) {
      infos.push(entityId);
      host.dispatchEvent(new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }));
    },
    formatPercent: (value) => `${Math.round(value)}%`,
    entityIds: (domain) => Object.keys(states).filter((id) => id.startsWith(`${domain}.`)),
    emit() {
      for (const cb of subs) cb();
    },
  };
}
