import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phoneNumber: string;
  dateOfEmployment: string;
  dateOfBirth: string;
}

@customElement('employee-records')
export class EmployeeRecords extends LitElement {
  @state()
  private employees: Employee[] = [
    {
      id: 1,
      firstName: 'Betty',
      lastName: 'Erk',
      position: 'Senior',
      department: 'Engineering',
      email: 'betty@example.com',
      phoneNumber: '1234567890',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01',
    },
    {
      id: 2,
      firstName: 'Betty',
      lastName: 'Erk',
      position: 'Medior',
      department: 'Analytics',
      email: 'betty@example.com',
      phoneNumber: '0987654321',
      dateOfEmployment: '2020-02-01',
      dateOfBirth: '1991-01-01',
    },
    {
      id: 3,
      firstName: 'Betty',
      lastName: 'Erk',
      position: 'Medior',
      department: 'Analytics',
      email: 'betty@example.com',
      phoneNumber: '0987654321',
      dateOfEmployment: '2020-02-01',
      dateOfBirth: '1991-01-01',
    },
    {
      id: 4,
      firstName: 'Betty',
      lastName: 'Erk',
      position: 'Medior',
      department: 'Analytics',
      email: 'betty@example.com',
      phoneNumber: '0987654321',
      dateOfEmployment: '2020-02-01',
      dateOfBirth: '1991-01-01',
    }
  ];

  @state()
  viewMode: 'table' | 'list' = 'table';

  @state()
  private showForm = false;
  @state()
  private editingEmployee: Employee | null = null;

  currentPage: number = 1;
  pageSize: number = 10;

  static override styles = css`
    :host {
      display: block;
      padding: 32px 0;
      background: #f6f6f6;
    }
    .records-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      padding: 32px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h2 {
      margin: 0;
      color: #ff6600;
      font-size: 24px;
      font-weight: 700;
    }
    .toggle-view {
      display: flex;
      gap: 8px;
    }
    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }
    .toggle-btn.active, .toggle-btn:hover {
      background: #ff6600;
    }
    .toggle-btn svg {
      width: 24px;
      height: 24px;
      fill: #ff6600;
      transition: fill 0.2s;
    }
    .toggle-btn.active svg, .toggle-btn:hover svg {
      fill: #fff;
    }
    .employee-list {
      width: 100%;
      border-collapse: collapse;
    }
    .employee-list th,
    .employee-list td {
      padding: 14px 10px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .employee-list th {
      color: #ff6600;
      background: #fff;
      font-weight: 600;
      font-size: 15px;
    }
    .employee-list td {
      color: #222;
      font-size: 15px;
    }
    .employee-list tr:hover {
      background-color: #f9f9f9;
    }
    .checkbox-cell {
      width: 36px;
    }
    .actions-cell {
      width: 80px;
      text-align: center;
    }
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #ff6600;
      font-size: 18px;
      margin: 0 4px;
      transition: color 0.2s;
    }
    .action-btn:hover {
      color: #d35400;
    }
    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-top: 12px;
    }
    .employee-card {
      display: flex;
      align-items: flex-start;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.04);
      padding: 28px 32px;
      gap: 32px;
      border: 1px solid #f0f0f0;
      transition: box-shadow 0.2s, transform 0.2s;
      position: relative;
    }
    .card-checkbox {
      margin-right: 12px;
    }
    .card-details {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
    .card-field {
      min-width: 160px;
      color: #222;
      font-size: 15px;
    }
    .card-label {
      color: #ff6600;
      font-weight: 600;
      margin-right: 4px;
    }
    .card-actions {
      display: flex;
      gap: 8px;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      gap: 8px;
    }
    .pagination-btn {
      background: none;
      border: none;
      color: #ff6600;
      font-size: 16px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .pagination-btn.active, .pagination-btn:hover {
      background: #ff6600;
      color: #fff;
    }
    .add-employee-btn {
      background: linear-gradient(90deg, #ff6600 60%, #ff944d 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(255,102,0,0.08);
    }
    .add-employee-btn:hover {
      background: linear-gradient(90deg, #d35400 60%, #ff6600 100%);
      box-shadow: 0 4px 16px rgba(255,102,0,0.12);
    }
    .add-employee-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .form-container {
      margin-top: 24px;
      border-top: 1px solid #f0f0f0;
      padding-top: 24px;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('employee-created', this.handleNewEmployee as EventListener);
    this.addEventListener('form-submitted', this.handleFormSubmitted as EventListener);
    this.addEventListener('employee-updated', this.handleEmployeeUpdated as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('employee-created', this.handleNewEmployee as EventListener);
    this.removeEventListener('form-submitted', this.handleFormSubmitted as EventListener);
    this.removeEventListener('employee-updated', this.handleEmployeeUpdated as EventListener);
  }

  private handleFormSubmitted() {
    this.showForm = false;
    this.editingEmployee = null;
  }

  private handleNewEmployee(e: CustomEvent) {
    const newEmployee = e.detail;
    const employee: Employee = {
      id: this.employees.length + 1,
      ...newEmployee
    };

    const isDuplicate = this.employees.some(emp => emp.email === employee.email);
    if (isDuplicate) {
      alert('An employee with this email already exists.');
      return;
    }

    this.employees = [...this.employees, employee];
    this.currentPage = Math.ceil(this.employees.length / this.pageSize);
  }

  private handleEmployeeUpdated(e: CustomEvent) {
    const updated = e.detail;
    this.employees = this.employees.map(emp => emp.id === updated.id ? { ...emp, ...updated } : emp);
  }

  private get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employees.slice(start, start + this.pageSize);
  }

  private get totalPages() {
    return Math.ceil(this.employees.length / this.pageSize);
  }

  setViewMode(mode: 'table' | 'list') {
    this.viewMode = mode;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingEmployee = null;
    }
  }

  private onEditEmployee(employee: Employee) {
    this.editingEmployee = employee;
    this.showForm = true;
  }

  override render() {
    return html`
      <div class="records-container">
        <div class="header">
          <h2>Employee List</h2>
          <div style="display: flex; gap: 16px; align-items: center;">
            <button class="add-employee-btn" @click=${this.toggleForm}>
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              ${this.showForm && !this.editingEmployee ? 'Cancel' : 'Add Employee'}
            </button>
            <div class="toggle-view">
              <button class="toggle-btn ${this.viewMode === 'table' ? 'active' : ''}" @click=${() => this.setViewMode('table')} title="Table view">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button class="toggle-btn ${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this.setViewMode('list')} title="List view">
                <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="3"/><rect x="4" y="10.5" width="16" height="3"/><rect x="4" y="16" width="16" height="3"/></svg>
              </button>
            </div>
          </div>
        </div>
        ${this.showForm ? html`
          <div class="form-container">
            <employee-form .employee=${this.editingEmployee}></employee-form>
          </div>
        ` : ''}
        ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}
        <div class="pagination">
          <button class="pagination-btn" @click=${() => this.goToPage(this.currentPage - 1)} ?disabled=${this.currentPage === 1}>&lt;</button>
          ${Array.from({ length: this.totalPages }, (_, i) => i + 1).slice(0, 5).map(page => html`
            <button class="pagination-btn ${this.currentPage === page ? 'active' : ''}" @click=${() => this.goToPage(page)}>${page}</button>
          `)}
          ${this.totalPages > 5 ? html`<span>...</span><button class="pagination-btn" @click=${() => this.goToPage(this.totalPages)}>${this.totalPages}</button>` : ''}
          <button class="pagination-btn" @click=${() => this.goToPage(this.currentPage + 1)} ?disabled=${this.currentPage === this.totalPages}>&gt;</button>
        </div>
      </div>
    `;
  }

  renderTableView() {
    return html`
      <table class="employee-list">
        <thead>
          <tr>
            <th class="checkbox-cell"><input type="checkbox" /></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th class="actions-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.map(employee => html`
            <tr>
              <td class="checkbox-cell"><input type="checkbox" /></td>
              <td>${employee.firstName}</td>
              <td>${employee.lastName}</td>
              <td>${new Date(employee.dateOfEmployment).toLocaleDateString()}</td>
              <td>${new Date(employee.dateOfBirth).toLocaleDateString()}</td>
              <td>${employee.phoneNumber}</td>
              <td>${employee.email}</td>
              <td>${employee.department}</td>
              <td>${employee.position}</td>
              <td class="actions-cell">
                <button class="action-btn" title="Edit" @click=${() => this.onEditEmployee(employee)}>
                  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#ff6600"/>
                  </svg>
                </button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="card-list">
        ${this.paginatedEmployees.map(employee => html`
          <div class="employee-card">
            <div class="card-details">
              <div class="card-field"><span class="card-label">First Name:</span> ${employee.firstName}</div>
              <div class="card-field"><span class="card-label">Last Name:</span> ${employee.lastName}</div>
              <div class="card-field"><span class="card-label">Date of Employment:</span> ${new Date(employee.dateOfEmployment).toLocaleDateString()}</div>
              <div class="card-field"><span class="card-label">Date of Birth:</span> ${new Date(employee.dateOfBirth).toLocaleDateString()}</div>
              <div class="card-field"><span class="card-label">Phone:</span> ${employee.phoneNumber}</div>
              <div class="card-field"><span class="card-label">Email:</span> ${employee.email}</div>
              <div class="card-field"><span class="card-label">Department:</span> ${employee.department}</div>
              <div class="card-field"><span class="card-label">Position:</span> ${employee.position}</div>
            </div>
            <div class="card-actions">
              <button class="action-btn" title="Edit" @click=${() => this.onEditEmployee(employee)}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#ff6600"/>
                </svg>
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }
} 