import type { CardAction } from '../ha/types';

export type ActionStep =
  | { kind: 'navigate'; path: string }
  | { kind: 'url'; url: string }
  | { kind: 'more-info'; entityId: string }
  | { kind: 'service'; domain: string; service: string; data?: Record<string, unknown> }
  | { kind: 'back'; fallback: string }
  | { kind: 'noop' };

export function actionStep(action: CardAction | null | undefined): ActionStep {
  if (!action) return { kind: 'noop' };
  if (action.navigate) return { kind: 'navigate', path: action.navigate };
  if (action.url) return action.url.startsWith('/') ? { kind: 'navigate', path: action.url } : { kind: 'url', url: action.url };
  if (action.more_info) return { kind: 'more-info', entityId: action.more_info };
  if (action.back) return { kind: 'back', fallback: action.fallback || '/' };
  if (action.service) {
    const [domain, service] = action.service.split('.');
    if (!domain || !service) return { kind: 'noop' };
    return { kind: 'service', domain, service, data: action.data };
  }
  return { kind: 'noop' };
}
