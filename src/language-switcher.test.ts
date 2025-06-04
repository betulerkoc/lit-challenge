import { fixture, html, expect } from '@open-wc/testing';
import './language-switcher';

describe('<language-switcher>', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
  });

  it('switches language and dispatches event', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);
    const btn = el.shadowRoot!.querySelector('button')!;
    let eventFired = false;
    window.addEventListener('lang-changed', () => (eventFired = true));
    btn.click();
    expect(document.documentElement.lang).to.equal('tr');
    expect(eventFired).to.be.true;
  });
}); 