/* shared/avatar: Awatar osoby (zdjęcie albo inicjały). */
/* ===================== PERSON ===================== */
const hgAvatar = (hass, e, cls = 'av') => {
  const s = H.st(hass, e); const nm = H.name(hass, e, e);
  const pic = s && s.attributes.entity_picture;
  const ini = nm.split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const hues = [32, 200, 280, 140, 350]; const h = hues[[...nm].reduce((a, ch) => a + ch.charCodeAt(0), 0) % hues.length];
  return pic ? `<span class="${cls}" style="background-image:url('${H.cssUrl(pic)}')"></span>`
    : `<span class="${cls} ini" style="background:hsl(${h},55%,50%)">${H.esc(ini)}</span>`;
};
/* Użytkownik z config/auth/list -> encja person: najpierw atrybut user_id, potem jedyna zgodna friendly_name (i jedyny taki użytkownik). */
const hgUserKey = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const hgUserPerson = (states, user, users) => {
  if (!states || !user || user.id == null || user.id === '') return null;
  const ids = Object.keys(states).filter((e) => e.startsWith('person.') && states[e] && states[e].attributes);
  const byId = ids.find((e) => states[e].attributes.user_id === user.id);
  if (byId) return byId;
  const nm = hgUserKey(user.name);
  if (!nm) return null;
  if (users && users.filter((u) => u && hgUserKey(u.name) === nm).length !== 1) return null;
  const named = ids.filter((e) => {
    const a = states[e].attributes;
    if (a.user_id && a.user_id !== user.id) return false;
    return hgUserKey(a.friendly_name) === nm;
  });
  return named.length === 1 ? named[0] : null;
};
/* Kółko na liście użytkowników: zdjęcie osoby (jak hgAvatar), inaczej pierwsza litera. */
const hgUserAv = (hass, user, users) => {
  const e = hgUserPerson(hass && hass.states, user, users);
  const s = e && H.st(hass, e);
  const pic = s && s.attributes && typeof s.attributes.entity_picture === 'string' ? s.attributes.entity_picture.trim() : '';
  if (pic) return `<span class="us-av pic" aria-hidden="true" style="background-image:url('${H.cssUrl(pic)}')"></span>`;
  const ini = H.esc(Array.from(String((user && (user.name || user.username)) || '?').trim())[0] || '?').toUpperCase();
  return `<span class="us-av" aria-hidden="true">${ini}</span>`;
};
