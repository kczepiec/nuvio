/** Atrapy ha-card i ha-icon na Storybook i testy. W Home Assistant elementów nie podmieniamy. */
export function installHaStubs() {
  if (!customElements.get('ha-card')) {
    customElements.define('ha-card', class extends HTMLElement {
      connectedCallback() {
        this.style.display = 'block';
      }
    });
  }
  if (!customElements.get('ha-icon')) {
    customElements.define('ha-icon', class extends HTMLElement {
      connectedCallback() {
        this.style.display = 'inline-block';
        this.style.width = '18px';
        this.style.height = '18px';
        this.style.borderRadius = '50%';
        this.style.background = 'currentColor';
      }
    });
  }
}
