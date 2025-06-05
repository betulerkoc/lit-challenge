import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../components/app-modal';

describe('<app-modal>', () => {
  it('renders with title, message, and buttons', async () => {
    const el = await fixture(html`<app-modal open title="Test Title" message="Test message" confirmText="Yes" cancelText="No"></app-modal>`);
    expect(el.shadowRoot!.textContent).to.include('Test Title');
    expect(el.shadowRoot!.textContent).to.include('Test message');
    expect(el.shadowRoot!.textContent).to.include('Yes');
    expect(el.shadowRoot!.textContent).to.include('No');
  });

  it('fires confirm event when confirm button is clicked', async () => {
    const el = await fixture(html`<app-modal open title="Confirm?" message="Are you sure?" confirmText="OK"></app-modal>`);
    setTimeout(() => {
      el.shadowRoot!.querySelector('.confirm-btn')!.dispatchEvent(new Event('click'));
    });
    const event = await oneEvent(el, 'confirm');
    expect(event).to.exist;
  });

  it('fires cancel event when cancel button is clicked', async () => {
    const el = await fixture(html`<app-modal open title="Cancel?" message="Cancel it?" confirmText="OK" cancelText="Cancel"></app-modal>`);
    setTimeout(() => {
      el.shadowRoot!.querySelector('.cancel-btn')!.dispatchEvent(new Event('click'));
    });
    const event = await oneEvent(el, 'cancel');
    expect(event).to.exist;
  });

  it('fires close event when overlay or close button is clicked', async () => {
    const el = await fixture(html`<app-modal open title="Close?" message="Close it?" confirmText="OK"></app-modal>`);
    setTimeout(() => {
      el.shadowRoot!.querySelector('.overlay')!.dispatchEvent(new Event('click'));
    });
    const event1 = await oneEvent(el, 'close');
    expect(event1).to.exist;

    (el as any).open = true;
    setTimeout(() => {
      el.shadowRoot!.querySelector('.close-btn')!.dispatchEvent(new Event('click'));
    });
    const event2 = await oneEvent(el, 'close');
    expect(event2).to.exist;
  });
}); 