import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

@customElement('nav-menu')
export class NavMenu extends LitElement {
  static override styles = css`
    :host {
      display: block;
      background: #f6f6f6;
      border-bottom: 1px solid #ececec;
      font-family: 'Inter', Arial, sans-serif;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 2rem;
      background: #fff;
      min-height: 56px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo-img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #fff;
      border: 1px solid #ececec;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-text {
      font-weight: 600;
      font-size: 1.1rem;
      letter-spacing: 1px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #FF6600;
      font-weight: 500;
      text-decoration: none;
      font-size: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
    }
    .nav-link.active {
      color: #d35400;
    }
    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: none;
      border: none;
      color: #FF6600;
      font-weight: 500;
      font-size: 1rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    .add-btn:hover, .nav-link:hover {
      color: #d35400;
    }
    .flag {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #ececec;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
    }
    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
      }
      .nav-actions {
        gap: 0.7rem;
      }
    }
  `;

  override render() {
    return html`
      <header class="header">
        <div class="logo">
          <span class="logo-text">ING</span>
        </div>
        <div class="nav-actions">
          <a 
            href="/" 
            class="nav-link"
            @click=${this._handleNavigation}
          >
          <svg fill="#FF6600" width="18" height="18" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path>
          </svg>
            Employees
          </a>
          <button 
            class="add-btn"
            @click=${(e: Event) => this._handleNavigation(e, '/form')}
          >
            <svg width="18" height="18" fill="none" stroke="#FF6600" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Add New
          </button>
        </div>
      </header>
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