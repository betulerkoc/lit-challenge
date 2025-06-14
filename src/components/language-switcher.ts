import { LitElement, html, css, svg } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('language-switcher')
export class LanguageSwitcher extends LitElement {
  static override styles = css`
    .lang-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
      outline: none;
    }
    .active {
      border: 0.125rem solid var(--primary-color);
      border-radius: 50%;
    }
    svg {
      width: 1.75rem;
      height: 1.25rem;
      vertical-align: middle;
    }
  `;

  private setLang(lang: string) {
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('lang-changed'));
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('lang-changed', this._onLangChanged);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lang-changed', this._onLangChanged);
  }

  private _onLangChanged = () => {
    this.requestUpdate();
  };

  private trFlag = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 356.18"><g fill-rule="nonzero"><path fill="#E30A17" d="M28.137 0H483.86C499.337 0 512 12.663 512 28.14v299.9c0 15.477-12.663 28.14-28.14 28.14H28.137C12.663 356.18 0 343.517 0 328.04V28.14C0 12.663 12.663 0 28.137 0z"/><path fill="#fff" d="M253.365 130.516c-15.783-24.923-43.598-41.473-75.281-41.473-49.179 0-89.047 39.868-89.047 89.047 0 49.179 39.868 89.047 89.047 89.047 31.684 0 59.498-16.55 75.282-41.475-13.042 14.526-31.963 23.665-53.021 23.665-39.342 0-71.237-31.893-71.237-71.237 0-39.344 31.895-71.237 71.237-71.237 21.058 0 39.978 9.138 53.02 23.663zm-4.785 47.574l80.543 26.169-49.778-68.514v84.688l49.778-68.514-80.543 26.171z"/></g></svg>`;
  private enFlag = svg`<svg viewBox="0 0 55.2 38.4"><g><path fill="#FEFEFE" d="M2.87,38.4h49.46c1.59-0.09,2.87-1.42,2.87-3.03V3.03c0-1.66-1.35-3.02-3.01-3.03H3.01 C1.35,0.01,0,1.37,0,3.03v32.33C0,36.98,1.28,38.31,2.87,38.4L2.87,38.4z"/><polygon fill="#C8102E" points="23.74,23.03 23.74,38.4 31.42,38.4 31.42,23.03 55.2,23.03 55.2,15.35 31.42,15.35 31.42,0 23.74,0 23.74,15.35 0,15.35 0,23.03 23.74,23.03"/><path fill="#012169" d="M33.98,12.43V0h18.23c1.26,0.02,2.34,0.81,2.78,1.92L33.98,12.43L33.98,12.43z"/><path fill="#012169" d="M33.98,25.97V38.4h18.35c1.21-0.07,2.23-0.85,2.66-1.92L33.98,25.97L33.98,25.97z"/><path fill="#012169" d="M21.18,25.97V38.4H2.87c-1.21-0.07-2.24-0.85-2.66-1.94L21.18,25.97L21.18,25.97z"/><path fill="#012169" d="M21.18,12.43V0H2.99C1.73,0.02,0.64,0.82,0.21,1.94L21.18,12.43L21.18,12.43z"/><polygon fill="#012169" points="0,12.8 7.65,12.8 0,8.97 0,12.8"/><polygon fill="#012169" points="55.2,12.8 47.51,12.8 55.2,8.95 55.2,12.8"/><polygon fill="#012169" points="55.2,25.6 47.51,25.6 55.2,29.45 55.2,25.6"/><polygon fill="#012169" points="0,25.6 7.65,25.6 0,29.43 0,25.6"/><polygon fill="#C8102E" points="55.2,3.25 36.15,12.8 40.41,12.8 55.2,5.4 55.2,3.25"/><polygon fill="#C8102E" points="19.01,25.6 14.75,25.6 0,32.98 0,35.13 19.05,25.6 19.01,25.6"/><polygon fill="#C8102E" points="10.52,12.81 14.78,12.81 0,5.41 0,7.55 10.52,12.81"/><polygon fill="#C8102E" points="44.63,25.59 40.37,25.59 55.2,33.02 55.2,30.88 44.63,25.59"/></g></svg>`;

  override render() {
    const currentLang = document.documentElement.lang || 'en';
    return html`
      ${currentLang === 'en'
        ? html`<button class="lang-btn" @click=${() => this.setLang('tr')} title="Türkçe">${this.trFlag}</button>`
        : html`<button class="lang-btn" @click=${() => this.setLang('en')} title="English">${this.enFlag}</button>`
      }
    `;
  }
} 