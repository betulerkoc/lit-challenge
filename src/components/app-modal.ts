import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-modal')
export class AppModal extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '';
  @property({ type: String }) message = '';
  @property({ type: String }) confirmText = 'Proceed';
  @property({ type: String }) cancelText = 'Cancel';

  static override styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2000;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.18);
      z-index: 1;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 0.75rem;
      box-shadow: 0 0.25rem 1rem rgba(0,0,0,0.12);
      min-width: 320px;
      max-width: 90vw;
      padding: 2rem 1.5rem 1.5rem 1.5rem;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      animation: modal-in 0.18s cubic-bezier(.4,0,.2,1);
    }
    @keyframes modal-in {
      from { opacity: 0; transform: translate(-50%, -60%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .modal-title {
      color: var(--primary-color, #ff6600);
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      text-align: left;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #ff6600;
      cursor: pointer;
      line-height: 1;
      padding: 0.25rem;
      border-radius: 50%;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background: #ffe5d0;
    }
    .modal-message {
      color: #444;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .confirm-btn {
      background: var(--primary-color, #ff6600);
      color: #fff;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.75rem 0;
      cursor: pointer;
      transition: background 0.2s;
    }
    .confirm-btn:hover {
      background: #d35400;
    }
    .cancel-btn {
      background: #fff;
      color: #444;
      border: 2px solid #bdbdbd;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      padding: 0.7rem 0;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }
    .cancel-btn:hover {
      background: #f6f6f6;
      border-color: #ff6600;
    }
    @media (max-width: 30rem) {
      .modal {
        min-width: 0;
        width: 95vw;
        padding: 1.25rem 0.5rem 1rem 0.5rem;
      }
      .modal-title {
        font-size: 1.1rem;
      }
      .modal-message {
        font-size: 0.95rem;
      }
      .confirm-btn, .cancel-btn {
        font-size: 0.95rem;
        padding: 0.6rem 0;
      }
    }
  `;

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  protected override willUpdate(changedProps: PropertyValues) {
    if (changedProps.has('open') && this.open) {
      setTimeout(() => {
        const firstBtn = this.renderRoot.querySelector('.confirm-btn') as HTMLElement;
        if (firstBtn) firstBtn.focus();
      }, 0);
    }
  }

  override render() {
    if (!this.open) return null;
    return html`
      <div class="overlay" @click=${this._onClose}></div>
      <div class="modal" role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-header">
          <div class="modal-title">${this.title}</div>
          <button class="close-btn" @click=${this._onClose} aria-label="Close">&times;</button>
        </div>
        <div class="modal-message">${this.message}</div>
        <div class="modal-actions">
          <button class="confirm-btn" @click=${this._onConfirm}>${this.confirmText}</button>
          <button class="cancel-btn" @click=${this._onCancel}>${this.cancelText}</button>
        </div>
      </div>
    `;
  }
} 