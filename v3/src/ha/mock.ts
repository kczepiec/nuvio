import { actionStep } from '../cards/action';
import type { CardAction, EntityState, HassPort, ServiceCall } from './types';

export interface MockPort extends HassPort {
  calls: ServiceCall[];
  infos: string[];
  navigations: string[];
  emit(): void;
}

export function mockPort(states: Record<string, EntityState>, host: EventTarget = new EventTarget(), name = ''): MockPort {
  const calls: ServiceCall[] = [];
  const infos: string[] = [];
  const navigations: string[] = [];
  const subs = new Set<() => void>();
  const moreInfo = (entityId: string) => {
    infos.push(entityId);
    host.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  };
  const callService = async (domain: string, service: string, data?: Record<string, unknown>) => {
    calls.push({ domain, service, data });
  };
  return {
    calls,
    infos,
    navigations,
    state: (id) => states[id],
    subscribe(_ids, cb) {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    callService,
    moreInfo,
    formatPercent: (value) => `${Math.round(value)}%`,
    formatNumber: (value, digits) => value.toLocaleString('en', { maximumFractionDigits: digits, minimumFractionDigits: 0 }),
    formatState: (id) => states[id]?.state || '',
    entityIds: (domain) => Object.keys(states).filter((id) => id.startsWith(`${domain}.`)),
    firstName: () => name,
    userId: () => '',
    locale: () => 'en',
    async callWS() {
      return null;
    },
    async history() {
      return [];
    },
    runAction(action: CardAction | null | undefined) {
      const step = actionStep(action);
      if (step.kind === 'navigate') navigations.push(step.path);
      else if (step.kind === 'url') navigations.push(step.url);
      else if (step.kind === 'more-info') moreInfo(step.entityId);
      else if (step.kind === 'service') void callService(step.domain, step.service, step.data);
      else if (step.kind === 'back') navigations.push(step.fallback);
    },
    emit() {
      for (const cb of subs) cb();
    },
  };
}
