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
  employees: Employee[] = [
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
  currentPage: number = 1;
  pageSize: number = 10;

  static styles = css`
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
  `;

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

  override render() {
    return html`
      <div class="records-container">
        <div class="header">
          <h2>Employee List</h2>
          <div class="toggle-view">
            <button class="toggle-btn ${this.viewMode === 'table' ? 'active' : ''}" @click=${() => this.setViewMode('table')} title="Table view">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button class="toggle-btn ${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this.setViewMode('list')} title="List view">
              <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="3"/><rect x="4" y="10.5" width="16" height="3"/><rect x="4" y="16" width="16" height="3"/></svg>
            </button>
          </div>
        </div>
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
          </div>
        `)}
      </div>
    `;
  }
} 