/* shared/relative-time: Czas względny („5 min temu”). */
const hgAgoRel = (ms) => { const s = Math.round((ms - Date.now()) / 1000), f = new Intl.RelativeTimeFormat(HG_LOC(), { numeric: 'auto' });
  const a = Math.abs(s); return a < 60 ? f.format(0, 'second').replace(/^./, (x) => x.toUpperCase()) : a < 3600 ? f.format(Math.round(s / 60), 'minute') : a < 86400 ? f.format(Math.round(s / 3600), 'hour') : f.format(Math.round(s / 86400), 'day'); };
const hgRel = (d) => {
  const m = Math.max(0, Math.round((Date.now() - d) / 60000));
  if (m < 1) return hgT('common.just_now'); if (m < 60) return hgT('common.ago_minutes', { m });
  const h = Math.round(m / 60); if (h < 24) return hgT('common.ago_hours', { h });
  const dd = Math.round(h / 24); return dd === 1 ? hgT('shared.relative_time.yesterday') : hgT('shared.relative_time.days_ago', { count: dd });
};
