import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { translate } from './i18n/i18n';
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
      background: #f6f6f6;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    nav {
      max-width: 100vw;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      min-height: 56px;
      box-sizing: border-box;
      background: #ffffff;
    }
    .logo {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #ff6600;
      letter-spacing: -0.5px;
      gap: 8px;
    }
    .logo-text {
      color: #000000;
      font-size: 20px;
      letter-spacing: -0.5px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #f7a168;
      font-size: 15px;
      text-decoration: none;
      background: none;
      border: none;
      padding: 0 8px;
      border-radius: 4px;
      transition: color 0.2s, background 0.2s;
      cursor: pointer;
      height: 40px;
    }
    .nav-link.active, .nav-link:hover {
      color: #ff6600;
      background: #fff;
    }
    .nav-link svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
      margin-bottom: 1px;
    }
    .add-link {
      color: #ff6600;
    }
    .add-link svg {
      stroke: #ff6600;
      fill: none;
      margin-bottom: 1px;
    }
    language-switcher {
      margin-left: 16px;
    }
    @media (max-width: 600px) {
      nav {
        flex-direction: row;
        align-items: center;
        padding: 0 8px;
      }
      .nav-actions {
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .logo {
        font-size: 18px;
      }
    }
  `;

  override render() {
    const isEmployees = location.pathname === '/';
    const isAdd = location.pathname === '/form';
    return html`
      <nav>
        <div class="logo">
          <img src="/logo.png" alt="Logo" style="width:28px;height:28px;" />
          <span class="logo-text">ING</span>
        </div>
        <div class="nav-actions">
          <a 
            href="/" 
            class="nav-link${isEmployees ? ' active' : ' inactive'}"
            @click=${this._handleNavigation}
          >
            <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.08 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            ${translate('nav.employees')}
          </a>
          <a 
            href="/form" 
            class="nav-link add-link${isAdd ? ' active' : ' inactive'}"
            @click=${(e: Event) => this._handleNavigation(e, '/form')}
          >
            <svg width="18" height="18" fill="none" stroke="#ff6600" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
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