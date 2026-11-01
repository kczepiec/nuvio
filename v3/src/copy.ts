/** Angielskie źródło, zgodne z src/locales/en.json. Klucze są krótkie, bo strażnik bundla traktuje light.picker_name jak identyfikator encji. */
const en = {
  lighting: 'Lighting',
  toggle: 'Toggle',
  unavailable: ' – unavailable',
  pickerName: 'Nuvio – Light',
  pickerDescription: 'Light brightness slider',
  brightness: 'Brightness',
  expand: 'Expand',
} as const;

export type CopyKey = keyof typeof en;

export function t(key: CopyKey): string {
  return en[key];
}
