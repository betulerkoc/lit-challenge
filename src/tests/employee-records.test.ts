import { fixture, html, expect } from '@open-wc/testing';
import '../components/employee-records';
import { store, setEmployees } from '../store/store';
import { EmployeeRecords } from '../components/employee-records';

describe('<employee-records>', () => {
  beforeEach(() => {
    setEmployees([]);
    window.removeEventListener('lang-changed', () => {});
  });

  it('renders employee list', async () => {
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    expect(el.shadowRoot!.textContent).to.include('Employee List');
  });

  it('displays employees in both table and list views', async () => {
    const employees = [
      { id: '1', firstName: 'Betty', lastName: 'Bet', email: 'betty@example.com', phoneNumber: '+1234567890', department: 'Tech', position: 'Senior', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01' },
      { id: '2', firstName: 'Rose', lastName: 'Erk', email: 'rose@example.com', phoneNumber: '+0987654321', department: 'Analytics', position: 'Junior', dateOfEmployment: '2021-01-01', dateOfBirth: '1995-01-01' }
    ];
    setEmployees(employees);
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    await new Promise(resolve => setTimeout(resolve, 0));
    await el.updateComplete;

    const table = el.shadowRoot!.querySelector('table');
    expect(table).to.exist;
    expect(table!.textContent).to.include('Betty');
    expect(table!.textContent).to.include('Rose');

    el.setViewMode('list');
    await el.updateComplete;
    const list = el.shadowRoot!.querySelector('.card-list');
    expect(list).to.exist;
    expect(list!.textContent).to.include('Betty');
    expect(list!.textContent).to.include('Rose');
  });

  it('paginates employees correctly', async () => {
    const employees = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      firstName: `Employee ${i + 1}`,
      lastName: 'Test',
      email: `employee${i + 1}@example.com`,
      phoneNumber: '+1234567890',
      department: 'Tech',
      position: 'Junior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01'
    }));
    setEmployees(employees);
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    await new Promise(resolve => setTimeout(resolve, 0));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Employee 1');
    el.goToPage(2);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('tbody tr').length).to.equal(5);
  });

  it('handles edit employee action', async () => {
    const employees = [
      { id: '1', firstName: 'Betty', lastName: 'Bet', email: 'betty@example.com', phoneNumber: '+1234567890', department: 'Tech', position: 'Senior', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01' }
    ];
    setEmployees(employees);
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    await new Promise(resolve => setTimeout(resolve, 0));
    await el.updateComplete;
    const editButton = el.shadowRoot!.querySelector('button[title="Edit"]') as HTMLButtonElement; 
    editButton.click();
    await el.updateComplete;
    expect(store.getState().editingEmployee).to.deep.equal(employees[0]);
  });

  it('handles delete employee action', async () => {
    const employees = [
      { id: '1', firstName: 'Betty', lastName: 'Bet', email: 'betty@example.com', phoneNumber: '+1234567890', department: 'Tech', position: 'Senior', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01' }
    ];
    setEmployees(employees);
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    await new Promise(resolve => setTimeout(resolve, 0));
    await el.updateComplete;
    const deleteButton = el.shadowRoot!.querySelector('button[title="Delete"]') as HTMLButtonElement;
    deleteButton.click();
    await el.updateComplete;
    const modal = el.shadowRoot!.querySelector('app-modal')!;
    await new Promise(resolve => setTimeout(resolve, 0));
    (modal.shadowRoot!.querySelector('.confirm-btn') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(store.getState().employees.length).to.equal(0);
  });

  it('reacts to language change', async () => {
    const el = await fixture<EmployeeRecords>(html`<employee-records></employee-records>`);
    document.documentElement.lang = 'tr';
    window.dispatchEvent(new CustomEvent('lang-changed'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include('Çalışan Listesi');
  });
}); 