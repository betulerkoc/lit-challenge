import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './src/employee-records';
import './src/employee-form';
import './src/nav-menu';

@customElement('management-app')
export class App extends LitElement {
    static override styles = css`
        :host {
            display: block;
            color: var(--my-app-text-color, #000);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
    `;

    @state()
    private currentPage = 'records';

    override render() {
        return html`
            <nav-menu 
                .currentPage=${this.currentPage}
                @navigation=${this._handleNavigation}
            ></nav-menu>
            <div class="container">
                ${this._renderPage()}
            </div>
        `;
    }

    private _renderPage() {
        switch (this.currentPage) {
            case 'form':
                return html`<employee-form></employee-form>`;
            case 'records':
            default:
                return html`<employee-records></employee-records>`;
        }
    }

    private _handleNavigation(e: CustomEvent) {
        const path = e.detail.path;
        this.currentPage = path === '/' ? 'records' : path.slice(1);
    }
} 