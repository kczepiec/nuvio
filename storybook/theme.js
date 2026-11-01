/** Motyw Nuvio (tokeny na :root) — jak na dashboardzie HA. */
export function nuvioTheme() {
  return window.__nuvioTheme || window.__hgTheme;
}

export function applyStorybookScheme(dark) {
  const th = nuvioTheme();
  if (th?.apply) th.apply(!!dark);
  else document.documentElement.setAttribute('data-hg-scheme', dark ? 'dark' : 'light');
}

export function syncSchemeFromDocument() {
  applyStorybookScheme(document.documentElement.getAttribute('data-hg-scheme') === 'dark');
}
