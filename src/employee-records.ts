import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store, setEditingEmployee, deleteEmployee } from './store/store';
import { Employee } from './store/types';
import { Router } from '@vaadin/router';
import { translate } from './i18n/i18n';

@customElement('employee-records')
export class EmployeeRecords extends LitElement {
  @state()
  private employees: Employee[] = [];

  @state()
  viewMode: 'table' | 'list' = 'table';

  @state()
  currentPage: number = 1;
  pageSize: number = 10;

  private unsubscribe: (() => void) | null = null;

  static override styles = css`
    :host {
      display: block;
      padding: 16px;
      background: #f6f6f6;
    }
    .records-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (min-width: 768px) {
      .header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    h2 {
      margin: 0;
      color: #ff6600;
      font-size: 20px;
    }
    @media (min-width: 768px) {
      h2 {
        font-size: 24px;
      }
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
      width: 20px;
      height: 20px;
      fill: #ff6600;
      transition: fill 0.2s;
    }
    @media (min-width: 768px) {
      .toggle-btn svg {
        width: 24px;
        height: 24px;
      }
    }
    .toggle-btn.active svg, .toggle-btn:hover svg {
      fill: #fff;
    }
    .employee-list {
      width: 100%;
      border-collapse: collapse;
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .employee-list th,
    .employee-list td {
      padding: 12px 8px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
      white-space: nowrap;
    }
    @media (min-width: 768px) {
      .employee-list th,
      .employee-list td {
        padding: 14px 10px;
      }
    }
    .employee-list th {
      color: #ff6600;
      background: #fff;
      font-size: 14px;
    }
    @media (min-width: 768px) {
      .employee-list th {
        font-size: 15px;
      }
    }
    .employee-list td {
      color: #222;
      font-size: 14px;
    }
    @media (min-width: 768px) {
      .employee-list td {
        font-size: 15px;
      }
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
      font-size: 16px;
      margin: 0 4px;
      transition: color 0.2s;
      padding: 4px;
    }
    @media (min-width: 768px) {
      .action-btn {
        font-size: 18px;
      }
    }
    .action-btn:hover {
      color: #d35400;
    }
    .card-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 12px;
    }
    @media (min-width: 480px) {
      .card-list {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    }
    @media (min-width: 768px) {
      .card-list {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 24px;
      }
    }
    .employee-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.04);
      padding: 16px;
      border: 1px solid #f0f0f0;
      transition: box-shadow 0.2s, transform 0.2s;
      position: relative;
    }
    @media (min-width: 768px) {
      .employee-card {
        flex-direction: row;
        align-items: flex-start;
        gap: 32px;
        padding: 28px 32px;
        border-radius: 16px;
      }
    }
    .card-checkbox {
      margin-right: 12px;
    }
    .card-details {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 480px) {
      .card-details {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 768px) {
      .card-details {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }
    .card-field {
      min-width: 0;
      color: #222;
      font-size: 14px;
    }
    @media (min-width: 768px) {
      .card-field {
        font-size: 15px;
      }
    }
    .card-label {
      color: #ff6600;
      margin-right: 4px;
    }
    .card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      gap: 4px;
      flex-wrap: wrap;
    }
    @media (min-width: 768px) {
      .pagination {
        gap: 8px;
      }
    }
    .pagination-btn {
      background: none;
      border: none;
      color: #ff6600;
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 50%;
      transition: background 0.2s;
      min-width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: 768px) {
      .pagination-btn {
        font-size: 16px;
        padding: 6px 12px;
        min-width: 40px;
        height: 40px;
      }
    }
    .pagination-btn.active, .pagination-btn:hover {
      background: #ff6600;
      color: #fff;
    }
    .add-employee-btn {
      background: linear-gradient(90deg, #ff6600 60%, #ff944d 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(255,102,0,0.08);
      font-size: 14px;
    }
    @media (min-width: 768px) {
      .add-employee-btn {
        padding: 10px 20px;
        font-size: 16px;
      }
    }
    .add-employee-btn:hover {
      background: linear-gradient(90deg, #d35400 60%, #ff6600 100%);
      box-shadow: 0 4px 16px rgba(255,102,0,0.12);
    }
    .add-employee-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    @media (min-width: 768px) {
      .add-employee-btn svg {
        width: 20px;
        height: 20px;
      }
    }
    .form-container {
      margin-top: 24px;
      border-top: 1px solid #f0f0f0;
      padding-top: 24px;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('lang-changed', this._onLangChanged);
    this.unsubscribe = store.subscribe((state) => {
      this.employees = state.employees;
      this.requestUpdate();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lang-changed', this._onLangChanged);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private _onLangChanged = () => {
    this.requestUpdate();
  };

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

  private onEditEmployee(employee: Employee) {
    setEditingEmployee(employee);
    Router.go('/form');
  }

  private onDeleteEmployee(employee: Employee) {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(employee.id);
    }
  }

  override render() {
    return html`
      <div class="records-container">
        <div class="header">
          <h2>${translate('employeeList.title')}</h2>
          <div style="display: flex; gap: 16px; align-items: center;">
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
            <th>${translate('form.firstName')}</th>
            <th>${translate('form.lastName')}</th>
            <th>${translate('form.dateOfEmployment')}</th>
            <th>${translate('form.dateOfBirth')}</th>
            <th>${translate('form.phoneNumber')}</th>
            <th>${translate('form.email')}</th>
            <th>${translate('form.department')}</th>
            <th>${translate('form.position')}</th>
            <th class="actions-cell">${translate('employeeList.actions')}</th>
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
                <button class="action-btn" title="Delete" @click=${() => this.onDeleteEmployee(employee)}>
                  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7H6V19ZM19 4H15.5L14.79 3.29C14.6134 3.1134 14.351 3 14.08 3H9.92C9.64903 3 9.3866 3.1134 9.21 3.29L8.5 4H5V6H19V4Z" fill="#ff6600"/>
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
              <div class="card-field"><span class="card-label">${translate('form.firstName')}:</span> ${employee.firstName}</div>
              <div class="card-field"><span class="card-label">${translate('form.lastName')}:</span> ${employee.lastName}</div>
              <div class="card-field"><span class="card-label">${translate('form.dateOfEmployment')}:</span> ${new Date(employee.dateOfEmployment).toLocaleDateString()}</div>
              <div class="card-field"><span class="card-label">${translate('form.dateOfBirth')}:</span> ${new Date(employee.dateOfBirth).toLocaleDateString()}</div>
              <div class="card-field"><span class="card-label">${translate('form.phoneNumber')}:</span> ${employee.phoneNumber}</div>
              <div class="card-field"><span class="card-label">${translate('form.email')}:</span> ${employee.email}</div>
              <div class="card-field"><span class="card-label">${translate('form.department')}:</span> ${employee.department}</div>
              <div class="card-field"><span class="card-label">${translate('form.position')}:</span> ${employee.position}</div>
            </div>
            <div class="card-actions">
              <button class="action-btn" title="Edit" @click=${() => this.onEditEmployee(employee)}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#ff6600"/>
                </svg>
              </button>
              <button class="action-btn" title="Delete" @click=${() => this.onDeleteEmployee(employee)}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7H6V19ZM19 4H15.5L14.79 3.29C14.6134 3.1134 14.351 3 14.08 3H9.92C9.64903 3 9.3866 3.1134 9.21 3.29L8.5 4H5V6H19V4Z" fill="#ff6600"/>
                </svg>
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }
} 