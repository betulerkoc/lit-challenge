import { fixture, html, expect } from '@open-wc/testing';
import '../components/employee-form';
import '../components/app-modal';
import { store, setEmployees, setEditingEmployee } from '../store/store';
import { EmployeeForm } from '../components/employee-form';

describe('<employee-form>', () => {
  beforeEach(() => {
    setEmployees([]);
    setEditingEmployee(null);
    window.removeEventListener('lang-changed', () => {});
  });

  it('renders form title', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    expect(el.shadowRoot!.textContent).to.include('Add New Employee');
  });

  it('renders all form fields', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const form = el.shadowRoot!.querySelector('.form-container');
    expect(form).to.exist;
    expect(form!.innerHTML).to.include('First Name');
    expect(form!.innerHTML).to.include('Last Name');
    expect(form!.innerHTML).to.include('Email Address');
    expect(form!.innerHTML).to.include('Phone Number');
    expect(form!.innerHTML).to.include('Department');
    expect(form!.innerHTML).to.include('Position');
    expect(form!.innerHTML).to.include('Date of Employment');
    expect(form!.innerHTML).to.include('Date of Birth');
  });

  it('shows validation errors for required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    const form = el.shadowRoot!.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('required');
  });

  it('shows error for invalid email', async () => {
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    const emailInput = el.shadowRoot!.querySelector('input[type="email"]') as HTMLInputElement;
    emailInput.value = 'invalid';
    emailInput.dispatchEvent(new Event('input'));
    const form = el.shadowRoot!.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('valid email');
  });

  it('shows error for invalid phone number', async () => {
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    const phoneInput = el.shadowRoot!.querySelector('input[type="tel"]') as HTMLInputElement;
    phoneInput.value = '123';
    phoneInput.dispatchEvent(new Event('input'));
    const form = el.shadowRoot!.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('valid phone number');
  });

  it('validates invalid first name format', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const firstNameInput = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    firstNameInput.value = '1';
    firstNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('should only contain letters');
  });

  it('validates invalid last name format', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const lastNameInput = el.shadowRoot!.querySelectorAll('input[type="text"]')[1] as HTMLInputElement;
    lastNameInput.value = '1';
    lastNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('should only contain letters');
  });

  it('validates date of birth in the future', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const dobInput = el.shadowRoot!.querySelectorAll('input[type="date"]')[1] as HTMLInputElement;
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0];
    dobInput.value = futureDate;
    dobInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('cannot be in the future');
  });

  it('validates underage date of birth', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const dobInput = el.shadowRoot!.querySelectorAll('input[type="date"]')[1] as HTMLInputElement;
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    dobInput.value = underageDate;
    dobInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('at least 18 years old');
  });

  it('clears error on input', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    const firstNameInput = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const errorDiv = el.shadowRoot!.querySelector('.error-message');
    expect(errorDiv?.textContent?.toLowerCase()).to.not.include('first name');
  });

  it('adds a new employee successfully', async () => {
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    const firstNameInput = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    const lastNameInput = el.shadowRoot!.querySelectorAll('input[type="text"]')[1] as HTMLInputElement;
    const dateOfEmploymentInput = el.shadowRoot!.querySelectorAll('input[type="date"]')[0] as HTMLInputElement;
    const dateOfBirthInput = el.shadowRoot!.querySelectorAll('input[type="date"]')[1] as HTMLInputElement;
    const phoneInput = el.shadowRoot!.querySelector('input[type="tel"]') as HTMLInputElement;
    const emailInput = el.shadowRoot!.querySelector('input[type="email"]') as HTMLInputElement;
    const departmentSelect = el.shadowRoot!.querySelector('select') as HTMLSelectElement;
    const positionSelect = el.shadowRoot!.querySelectorAll('select')[1] as HTMLSelectElement;
    firstNameInput.value = 'Test';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'User';
    lastNameInput.dispatchEvent(new Event('input'));
    dateOfEmploymentInput.value = '2022-01-01';
    dateOfEmploymentInput.dispatchEvent(new Event('input'));
    dateOfBirthInput.value = '2000-01-01';
    dateOfBirthInput.dispatchEvent(new Event('input'));
    phoneInput.value = '+90 555 555 55 55';
    phoneInput.dispatchEvent(new Event('input'));
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    departmentSelect.value = 'Tech';
    departmentSelect.dispatchEvent(new Event('change'));
    positionSelect.value = 'Junior';
    positionSelect.dispatchEvent(new Event('change'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(store.getState().employees.some(e => e.email === 'test@example.com')).to.be.true;
  });

  it('edits an employee successfully', async () => {
    setEmployees([{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', phoneNumber: '+90 555 555 55 55', department: 'Tech', position: 'Junior', dateOfEmployment: '2022-01-01', dateOfBirth: '2000-01-01' }]);
    setEditingEmployee(store.getState().employees[0]);
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    const firstNameInput = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    const lastNameInput = el.shadowRoot!.querySelectorAll('input[type="text"]')[1] as HTMLInputElement;
    firstNameInput.value = 'Edited';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'EditedLast';
    lastNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    let modal: Element | null = null;
    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      modal = el.shadowRoot!.querySelector('app-modal[open]');
      if (modal && modal.shadowRoot) break;
    }
    if (!modal || !modal.shadowRoot) throw new Error('Modal not found or not open');

    let confirmBtn: HTMLButtonElement | null = null;
    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      confirmBtn = modal.shadowRoot.querySelector('.confirm-btn') as HTMLButtonElement;
      if (confirmBtn) break;
    }
    if (!confirmBtn) throw new Error('Confirm button not found in modal');

    confirmBtn.click();

    let updated = false;
    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      if (store.getState().employees[0].firstName === 'Edited') {
        updated = true;
        break;
      }
    }
    expect(updated, 'Store did not update employee firstName to Edited').to.be.true;
  });

  it('reacts to language change', async () => {
    const el = await fixture(html`<employee-form></employee-form>`) as EmployeeForm;
    document.documentElement.lang = 'tr';
    window.dispatchEvent(new CustomEvent('lang-changed'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Yeni Çalışan Ekle');
  });

}); 