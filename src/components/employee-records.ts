import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store, setEditingEmployee, deleteEmployee } from '../store/store';
import { Employee } from '../store/types';
import { Router } from '@vaadin/router';
import { translate } from '../i18n/i18n';
import './app-modal';

@customElement('employee-records')
export class EmployeeRecords extends LitElement {
  @state()
  private employees: Employee[] = [];

  @state()
  private searchQuery = '';

  @state()
  viewMode: 'table' | 'list' = 'table';

  @state()
  currentPage: number = 1;
  pageSize: number = 10;

  @state() private confirmModalOpen = false;
  @state() private employeeToDelete: Employee | null = null;

  private unsubscribe: (() => void) | null = null;

  static override styles = css`
    :host {
      display: block;
  
    }
    .records-container {
      background: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 1.75rem 0.75rem;
      max-width: 75rem;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .search-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1rem;
    }
    .search-input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      border-color: var(--primary-color);
      outline: none;
    }
    .search-input::placeholder {
      color: #999;
    }
    @media (min-width: 48rem) {
      :host {
        padding: 1rem;
      }
      .records-container {
        padding: 1rem;
      }
      .header {
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .search-container {
        margin-bottom: 1.5rem;
      }
      .search-input {
        font-size: 0.9375rem;
        padding: 0.625rem 0.875rem;
      }
    }
    h2 {
      margin: 0;
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 700;
    }
    @media (min-width: 48rem) {
      h2 {
        font-size: 1.5rem;
      }
    }
    .toggle-view {
      display: flex;
      gap: 0.5rem;
    }
    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.375rem;
      border-radius: 0.375rem;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }
    .toggle-btn.active, .toggle-btn:hover {
      background: #ff6600;
    }
    .toggle-btn svg {
      width: 1.25rem;
      height: 1.25rem;
      fill: #ff6600;
      transition: fill 0.2s;
    }
    @media (min-width: 48rem) {
      .toggle-btn svg {
        width: 1.5rem;
        height: 1.5rem;
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
      padding: 0.75rem 0.5rem;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
      white-space: nowrap;
    }
    @media (min-width: 48rem) {
      .employee-list th,
      .employee-list td {
        padding: 0.875rem 0.625rem;
      }
    }
    .employee-list th {
      color: var(--primary-color);
      background: var(--white);
      font-weight: 600;
      font-size: 0.875rem;
    }
    @media (min-width: 48rem) {
      .employee-list th {
        font-size: 0.9375rem;
      }
    }
    .employee-list td {
      color: #222;
      font-size: 0.875rem;
    }
    @media (min-width: 48rem) {
      .employee-list td {
        font-size: 0.9375rem;
      }
    }
    .employee-list tr:hover {
      background-color: #f9f9f9;
    }
    .checkbox-cell {
      width: 2.25rem;
    }
    .actions-cell {
      width: 5rem;
      text-align: center;
    }
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 1rem;
      margin: 0 0.25rem;
      transition: color 0.2s;
      padding: 0.25rem;
    }
    @media (min-width: 48rem) {
      .action-btn {
        font-size: 1.125rem;
      }
    }
    .action-btn:hover {
      color: #d35400;
    }
    .card-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      margin-top: 1rem;
    }
    @media (min-width: 30rem) {
      .card-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 48rem) {
      .card-list {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }
    .employee-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      padding: 1.5rem;
      border: 1px solid #f0f0f0;
      transition: all 0.2s ease;
      position: relative;
    }
    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    @media (min-width: 48rem) {
      .employee-card {
        padding: 1.75rem;
      }
    }
    .card-details {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 30rem) {
      .card-details {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 48rem) {
      .card-details {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }
    }
    .card-field {
      min-width: 0;
      color: #333;
      font-size: 0.9375rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    @media (min-width: 48rem) {
      .card-field {
        font-size: 1rem;
      }
    }
    .card-label {
      color: var(--primary-color);
      font-size: 0.8125rem;
    }
    .card-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f0f0f0;
    }
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 1rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .action-btn:hover {
      background: rgba(255, 102, 0, 0.1);
      transform: translateY(-1px);
    }
    @media (min-width: 48rem) {
      .action-btn {
        font-size: 1.125rem;
        padding: 0.625rem;
      }
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1.5rem;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    @media (min-width: 48rem) {
      .pagination {
        gap: 0.5rem;
      }
    }
    .pagination-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 50%;
      transition: background 0.2s;
      min-width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: 48rem) {
      .pagination-btn {
        font-size: 1rem;
        padding: 0.375rem 0.75rem;
        min-width: 2.5rem;
        height: 2.5rem;
      }
    }
    .pagination-btn.active, .pagination-btn:hover {
      background: var(--primary-color);
      color: var(--white);
    }
    .add-employee-btn {
      background: linear-gradient(90deg, var(--primary-color) 60%, #ff944d 100%);
      color: var(--white);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 0.125rem 0.5rem rgba(255,102,0,0.08);
      font-size: 0.875rem;
    }
    @media (min-width: 48rem) {
      .add-employee-btn {
        padding: 0.625rem 1.25rem;
        font-size: 1rem;
      }
    }
    .add-employee-btn:hover {
      background: linear-gradient(90deg, #d35400 60%, var(--primary-color) 100%);
      box-shadow: 0 0.25rem 1rem rgba(255,102,0,0.12);
    }
    .add-employee-btn svg {
      width: 1rem;
      height: 1rem;
      fill: currentColor;
    }
    @media (min-width: 48rem) {
      .add-employee-btn svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
    .form-container {
      margin-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
      padding-top: 1.5rem;
    }
    .no-results {
      text-align: center;
      padding: 2rem;
      background: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      margin: 1rem 0;
      color: #666;
      font-size: 1rem;
      border: 1px dashed #ddd;
    }
    @media (min-width: 48rem) {
      .no-results {
        padding: 3rem;
        font-size: 1.125rem;
      }
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

  private get filteredEmployees(): Employee[] {
    if (!this.searchQuery.trim()) {
      return this.employees;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.employees.filter(employee => 
      employee.firstName.toLowerCase().includes(query) ||
      employee.lastName.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query)
    );
  }

  private get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  private get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  private onSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to first page when searching
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

  private showDeleteModal(employee: Employee) {
    this.employeeToDelete = employee;
    this.confirmModalOpen = true;
  }

  private handleDeleteConfirm = () => {
    if (this.employeeToDelete) {
      deleteEmployee(this.employeeToDelete.id);
    }
    this.confirmModalOpen = false;
    this.employeeToDelete = null;
  };

  private handleDeleteCancel = () => {
    this.confirmModalOpen = false;
    this.employeeToDelete = null;
  };

  private onDeleteEmployee(employee: Employee) {
    this.showDeleteModal(employee);
  }

  override render() {
    return html`
      <div class="header">
        <h2>${translate('employeeList.title')}</h2>
        <div style="display: flex; gap: 16px; align-items: center;">
          <div class="toggle-view">
            <button class="toggle-btn ${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this.setViewMode('list')} title="List view">
              <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="3"/><rect x="4" y="10.5" width="16" height="3"/><rect x="4" y="16" width="16" height="3"/></svg>
            </button>
            <button class="toggle-btn ${this.viewMode === 'table' ? 'active' : ''}" @click=${() => this.setViewMode('table')} title="Table view">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="records-container">
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder=${translate('employeeList.searchPlaceholder')}
            .value=${this.searchQuery}
            @input=${this.onSearch}
          />
        </div>
        ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}
        ${this.filteredEmployees.length === 0 ? html`
          <div class="no-results">
            ${translate('employeeList.noResults')}
          </div>
        ` : ''}
        ${this.totalPages > 0 ? html`
          <div class="pagination">
            <button class="pagination-btn" @click=${() => this.goToPage(this.currentPage - 1)} ?disabled=${this.currentPage === 1}>&lt;</button>
            ${Array.from({ length: this.totalPages }, (_, i) => i + 1).slice(0, 5).map(page => html`
              <button class="pagination-btn ${this.currentPage === page ? 'active' : ''}" @click=${() => this.goToPage(page)}>${page}</button>
            `)}
            ${this.totalPages > 5 ? html`<span>...</span><button class="pagination-btn" @click=${() => this.goToPage(this.totalPages)}>${this.totalPages}</button>` : ''}
            <button class="pagination-btn" @click=${() => this.goToPage(this.currentPage + 1)} ?disabled=${this.currentPage === this.totalPages}>&gt;</button>
          </div>
        ` : ''}
        <app-modal
          .open=${this.confirmModalOpen}
          .title=${'Are you sure?'}
          .message=${this.employeeToDelete ? `Selected Employee record of ${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName} will be deleted` : ''}
          .confirmText=${'Proceed'}
          .cancelText=${'Cancel'}
          @confirm=${this.handleDeleteConfirm}
          @cancel=${this.handleDeleteCancel}
          @close=${this.handleDeleteCancel}
        ></app-modal>
      </div>
    `;
  }

  renderTableView() {
    return html`
      <table class="employee-list">
        <thead>
          <tr>
            <th> </th>
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
              <div class="card-field">
                <span class="card-label">${translate('form.firstName')}</span>
                ${employee.firstName}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.lastName')}</span>
                ${employee.lastName}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.dateOfEmployment')}</span>
                ${new Date(employee.dateOfEmployment).toLocaleDateString()}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.dateOfBirth')}</span>
                ${new Date(employee.dateOfBirth).toLocaleDateString()}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.phoneNumber')}</span>
                ${employee.phoneNumber}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.email')}</span>
                ${employee.email}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.department')}</span>
                ${employee.department}
              </div>
              <div class="card-field">
                <span class="card-label">${translate('form.position')}</span>
                ${employee.position}
              </div>
            </div>
            <div class="card-actions">
              <button class="action-btn" title="Edit" @click=${() => this.onEditEmployee(employee)}>
                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#ff6600"/>
                </svg>
              </button>
              <button class="action-btn" title="Delete" @click=${() => this.onDeleteEmployee(employee)}>
                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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