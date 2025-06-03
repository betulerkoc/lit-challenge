import { LitElement, html, css } from 'lit';

export class App extends LitElement {

    render() {
        return html`
            <div class="container">
           Employee Management System
            </div>
        `;
    }
}

customElements.define('management-app', App); 