import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './src/employee-records';
import './src/employee-form';
import './src/nav-menu';
import { Router } from '@vaadin/router';

@customElement('management-app')
export class App extends LitElement {
    static override styles = css`
        :host {
            display: block;
            color: var(--my-app-text-color, #000);
               background: #f6f6f6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f6f6f6;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
    `;

    override firstUpdated() {
        const outlet = this.shadowRoot?.getElementById('outlet');
        if (outlet) {
            const router = new Router(outlet);
            router.setRoutes([
                { path: '/', component: 'employee-records' },
                { path: '/form', component: 'employee-form' },
            ]);
        }
    }

    override render() {
        return html`
            <nav-menu></nav-menu>
            <div class="container">
                <div id="outlet"></div>
            </div>
        `;
    }
} 