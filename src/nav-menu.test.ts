import { fixture, html, expect } from '@open-wc/testing';
import './nav-menu';
import { LitElement } from 'lit';

describe('<nav-menu>', () => {
  it('renders navigation links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    expect(el.shadowRoot!.textContent).to.include('Employees');
  });

  it('reacts to language change', async () => {
    const el = await fixture<LitElement>(html`<nav-menu></nav-menu>`);
    document.documentElement.lang = 'tr';
    window.dispatchEvent(new CustomEvent('lang-changed'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Çalışanlar');
  });
}); 