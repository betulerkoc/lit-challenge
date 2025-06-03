import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './src/employee-records';

@customElement('management-app')
export class App extends LitElement {
    static styles = css`
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

    render() {
        return html`
            <div class="container">
                <employee-records></employee-records>
            </div>
        `;
    }
} 