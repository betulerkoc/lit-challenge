import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { translate } from '../i18n/i18n';
import './language-switcher';

@customElement('nav-menu')
export class NavMenu extends LitElement {
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

  static override styles = css`
    :host {
      display: block;
      background: var(--background);
    }
    nav {
      background: var(--white);
      box-shadow: var(--box-shadow);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      min-height: 3.5rem;
      padding: 0 2rem;
      width: 100%;
      box-sizing: border-box;
    }
    .logo-text {
      color: var(--black);
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-link {
      color: var(--primary-color);
      font-size: 1rem;
      font-weight: 600;
      background: none;
      border: none;
      padding: 0 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      text-decoration: none;
      cursor: pointer;
      height: 2.5rem;
    }
    .nav-link.active, .nav-link:hover {
      color: var(--primary-color);
    }
    .nav-link svg {
      width: 1.125rem;
      height: 1.125rem;
      fill: var(--primary-color);
      margin-bottom: 1px;
    }
    .add-link svg {
      stroke: var(--primary-color);
      fill: none;
      margin-bottom: 1px;
    }
    language-switcher {
      margin-left: 1rem;
    }
    @media (max-width: 37.5rem) {
      nav {
        padding: 0 0.5rem;
      }
      .nav-actions {
        gap: 0.5rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .logo {
        font-size: 1rem;
      }
    }
  `;

  override render() {
    const isEmployees = location.pathname === '/';
    const isAdd = location.pathname === '/form';
    return html`
      <nav>
        <a class="nav-link add-link${isAdd ? ' active' : ''}" href="/"  @click=${(e: Event) => this._handleNavigation(e, '/')}>
          <img src="/logo.png" alt="Logo" style="width:28px;height:28px;" />
          <span class="logo-text">ING</span>
        </a>
        <div class="nav-actions">
          <a 
            href="/" 
            class="nav-link${isEmployees ? ' active' : ''}"
            @click=${this._handleNavigation}
          >
            <svg fill="var(--primary-color)" width="18" height="18" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.08 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            ${translate('nav.employees')}
          </a>
          <a 
            href="/form" 
            class="nav-link add-link${isAdd ? ' active' : ''}"
            @click=${(e: Event) => this._handleNavigation(e, '/form')}
          >
            <svg width="18" height="18" fill="none" stroke="var(--primary-color)" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            ${translate('nav.addNew')}
          </a>
          <language-switcher></language-switcher>
        </div>
      </nav>
    `;
  }

  private _handleNavigation(e: Event, path?: string) {
    e.preventDefault();
    let navPath = path;
    if (!navPath) {
      const link = e.currentTarget as HTMLAnchorElement;
      navPath = link.getAttribute('href') || '/';
    }
    Router.go(navPath);
  }
} 