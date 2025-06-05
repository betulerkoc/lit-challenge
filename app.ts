import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './src/components/employee-records';
import './src/components/employee-form';
import './src/components/nav-menu';
import { Router } from '@vaadin/router';

@customElement('management-app')
export class App extends LitElement {
    static override styles = css`
        :host {
            display: block;
            padding: 16px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
            background: #f6f6f6;
            margin-top: 2.5rem;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .records-container {
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }
        h2 {
            color: var(--primary-color);
            font-size: 20px;
            font-weight: 700;
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