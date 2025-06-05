import { fixture, html, expect } from '@open-wc/testing';
import '../components/employee-form';
import { setEditingEmployee } from '../store/store';
import { EmployeeForm } from '../components/employee-form';

describe('<employee-form>', () => {
  beforeEach(() => {
    setEditingEmployee(null);
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

  it('validates required fields', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error-message')).to.exist;
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

  it('validates email format', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const emailInput = el.shadowRoot!.querySelector('input[type="email"]') as HTMLInputElement;
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error-message')).to.exist;
  });

  it('validates phone number format', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const phoneInput = el.shadowRoot!.querySelector('input[type="tel"]') as HTMLInputElement;
    phoneInput.value = '123';
    phoneInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error-message')).to.exist;
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

  it('submits form in add mode', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const [firstNameInput, lastNameInput] = el.shadowRoot!.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
    const [dateOfEmploymentInput, dateOfBirthInput] = el.shadowRoot!.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    const phoneInput = el.shadowRoot!.querySelector('input[type="tel"]') as HTMLInputElement;
    const emailInput = el.shadowRoot!.querySelector('input[type="email"]') as HTMLInputElement;
    const departmentSelect = el.shadowRoot!.querySelector('select') as HTMLSelectElement;
    const positionSelect = el.shadowRoot!.querySelectorAll('select')[1] as HTMLSelectElement;
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    dateOfEmploymentInput.value = '2020-01-01';
    dateOfEmploymentInput.dispatchEvent(new Event('input'));
    dateOfBirthInput.value = '2000-01-01';
    dateOfBirthInput.dispatchEvent(new Event('input'));
    phoneInput.value = '+1234567890';
    phoneInput.dispatchEvent(new Event('input'));
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    departmentSelect.value = 'Tech';
    departmentSelect.dispatchEvent(new Event('change'));
    positionSelect.value = 'Senior';
    positionSelect.dispatchEvent(new Event('change'));
    window.alert = () => {};
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error-message')).to.not.exist;
  });

  it('submits form in edit mode with confirmation', async () => {
    const testEmployee = {
      id: '1',
      firstName: 'Betty',
      lastName: 'Bet',
      email: 'betty@example.com',
      phoneNumber: '+1234567890',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01'
    };
    setEditingEmployee(testEmployee);
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    const [firstNameInput, lastNameInput] = el.shadowRoot!.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
    const [dateOfEmploymentInput, dateOfBirthInput] = el.shadowRoot!.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    const phoneInput = el.shadowRoot!.querySelector('input[type="tel"]') as HTMLInputElement;
    const emailInput = el.shadowRoot!.querySelector('input[type="email"]') as HTMLInputElement;
    const departmentSelect = el.shadowRoot!.querySelector('select') as HTMLSelectElement;
    const positionSelect = el.shadowRoot!.querySelectorAll('select')[1] as HTMLSelectElement;
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    dateOfEmploymentInput.value = '2020-01-01';
    dateOfEmploymentInput.dispatchEvent(new Event('input'));
    dateOfBirthInput.value = '1990-01-01';
    dateOfBirthInput.dispatchEvent(new Event('input'));
    phoneInput.value = '+1234567890';
    phoneInput.dispatchEvent(new Event('input'));
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    departmentSelect.value = 'Tech';
    departmentSelect.dispatchEvent(new Event('change'));
    positionSelect.value = 'Senior';
    positionSelect.dispatchEvent(new Event('change'));
    window.confirm = () => true;
    window.alert = () => {};
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.error-message')).to.not.exist;
  });

  it('switches to edit mode when editingEmployee is set', async () => {
    const testEmployee = {
      id: '1',
      firstName: 'Betty',
      lastName: 'Bet',
      email: 'betty@example.com',
      phoneNumber: '+1234567890',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01'
    };
    setEditingEmployee(testEmployee);
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    await new Promise(resolve => setTimeout(resolve, 0));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Edit Employee');
    const firstNameInput = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    expect(firstNameInput.value).to.equal(testEmployee.firstName);
  });

  it('reacts to language change', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`);
    document.documentElement.lang = 'tr';
    window.dispatchEvent(new CustomEvent('lang-changed'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Yeni Çalışan Ekle');
  });
}); 