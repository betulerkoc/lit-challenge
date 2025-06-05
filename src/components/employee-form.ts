import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Employee } from '../store/types';
import { store, addEmployee, updateEmployee, setEditingEmployee } from '../store/store';
import { Router } from '@vaadin/router';
import { translate } from '../i18n/i18n';
import './app-modal';

@customElement('employee-form')
export class EmployeeForm extends LitElement {
  @state() private firstName = '';
  @state() private lastName = '';
  @state() private dateOfEmployment = '';
  @state() private dateOfBirth = '';
  @state() private phoneNumber = '';
  @state() private email = '';
  @state() private department = 'Analytics';
  @state() private position = 'Junior';
  @state() private errors: { [key: string]: string } = {};
  @state() private isEditMode = false;
  @state() private modalOpen = false;
  @state() private modalTitle = '';
  @state() private modalMessage = '';
  @state() private modalConfirmText = 'OK';
  @state() private modalCancelText = '';
  @state() private modalOnConfirm: (() => void) | null = null;
  @state() private modalOnCancel: (() => void) | null = null;

  private unsubscribe: (() => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe((state) => {
      if (state.editingEmployee) {
        this.isEditMode = true;
        this.firstName = state.editingEmployee.firstName || '';
        this.lastName = state.editingEmployee.lastName || '';
        this.dateOfEmployment = state.editingEmployee.dateOfEmployment || '';
        this.dateOfBirth = state.editingEmployee.dateOfBirth || '';
        this.phoneNumber = state.editingEmployee.phoneNumber || '';
        this.email = state.editingEmployee.email || '';
        this.department = state.editingEmployee.department || 'Analytics';
        this.position = state.editingEmployee.position || 'Junior';
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    });
    window.addEventListener('lang-changed', this._onLangChanged);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lang-changed', this._onLangChanged);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    setEditingEmployee(null);
  }

  private _onLangChanged = () => {
    this.requestUpdate();
  };

  static override styles = css`
    :host {
      display: block;
      padding: 0.5rem;
    }
    .form-wrapper {
      max-width: 50rem;
      margin: 0 auto;
    }
    .form-title {
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
    @media (min-width: 48rem) {
      .form-title {
        font-size: 1.5rem;
      }
    }
    .form-container {
      background: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 1.5rem;
      max-width: 50rem;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    h2 {
      margin: 0 0 1.5rem 0;
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 700;
    }
    @media (min-width: 48rem) {
      h2 {
        font-size: 1.5rem;
      }
    }
    form {
      display: grid;
      gap: 1rem;
    }
    @media (min-width: 30rem) {
      form {
        grid-template-columns: repeat(2, 1fr);
      }
      .full-width {
        grid-column: 1 / -1;
      }
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    label {
      color: var(--gray);
      font-size: 0.875rem;
    }
    @media (min-width: 48rem) {
      label {
        font-size: 0.9375rem;
      }
    }
    input, select {
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
      padding: 0.5rem 0.75rem;
    }
    @media (min-width: 48rem) {
      input, select {
        font-size: 0.9375rem;
        padding: 0.625rem 0.875rem;
      }
    }
    input:focus, select:focus {
      border-color: var(--primary-color);
    }
    .error-message {
      color: #dc3545;
      font-size: 0.75rem;
    }
    @media (min-width: 48rem) {
      .error-message {
        font-size: 0.8125rem;
      }
    }
    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
      grid-column: 1 / -1;
    }
    @media (min-width: 30rem) {
      .form-actions {
        justify-content: flex-end;
      }
    }
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    @media (min-width: 48rem) {
      button {
        padding: 0.625rem 1.25rem;
        font-size: 0.9375rem;
      }
    }
    button[type="submit"] {
      background: var(--primary-color);
      color: var(--white);
      border: none;
    }
    button[type="submit"]:hover {
      background: #d35400;
    }
    button[type="button"] {
      background: none;
      border: 1px solid #ddd;
      color: #666;
    }
    button[type="button"]:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      background: var(--primary-color);
      color: var(--white);
      border: none;
    }
    .btn:hover {
      background: #d35400;
    }
    @media (min-width: 48rem) {
      .btn {
        padding: 0.625rem 1.25rem;
        font-size: 0.9375rem;
      }
    }
  `;

  private resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.dateOfEmployment = '';
    this.dateOfBirth = '';
    this.phoneNumber = '';
    this.email = '';
    this.department = 'Analytics';
    this.position = 'Junior';
    this.errors = {};
  }

  private validateForm(): boolean {
    const errors: { [key: string]: string } = {};
    const currentState = store.getState();
  
    if (!this.firstName.trim()) {
      errors.firstName = translate('validation.firstName.required');
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(this.firstName)) {
      errors.firstName = translate('validation.firstName.format');
    }

    if (!this.lastName.trim()) {
      errors.lastName = translate('validation.lastName.required');
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(this.lastName)) {
      errors.lastName = translate('validation.lastName.format');
    }

    if (!this.dateOfEmployment) {
      errors.dateOfEmployment = translate('validation.dateOfEmployment.required');
    } else {
      const employmentDate = new Date(this.dateOfEmployment);
      const today = new Date();
      if (employmentDate > today) {
        errors.dateOfEmployment = translate('validation.dateOfEmployment.future');
      }
    }

    if (!this.dateOfBirth) {
      errors.dateOfBirth = translate('validation.dateOfBirth.required');
    } else {
      const birthDate = new Date(this.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (birthDate > today) {
        errors.dateOfBirth = translate('validation.dateOfBirth.future');
      } else if (age < 18) {
        errors.dateOfBirth = translate('validation.dateOfBirth.age');
      }
    }

    if (!this.phoneNumber) {
      errors.phoneNumber = translate('validation.phoneNumber.required');
    } else {
      const digits = this.phoneNumber.replace(/\D/g, '');
      if (digits.length < 11 || digits.length > 15) {
        errors.phoneNumber = translate('validation.phoneNumber.format');
      }
    }

    if (!this.email) {
      errors.email = translate('validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = translate('validation.email.format');
    } else {
      const existingEmployee = currentState.employees.find(emp => 
        emp.email.toLowerCase() === this.email.toLowerCase() && 
        (!this.isEditMode || emp.id !== currentState.editingEmployee?.id)
      );
      if (existingEmployee) {
        errors.email = translate('validation.email.unique');
      }
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  private onInput(e: Event, field: string) {
    (this as any)[field] = (e.target as HTMLInputElement).value;
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: '' };
    }
  }

  private showModal({ title, message, confirmText = 'OK', cancelText = '', onConfirm = null, onCancel = null }: { title: string, message: string, confirmText?: string, cancelText?: string, onConfirm?: (() => void) | null, onCancel?: (() => void) | null }) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalConfirmText = confirmText;
    this.modalCancelText = cancelText;
    this.modalOnConfirm = onConfirm;
    this.modalOnCancel = onCancel;
    this.modalOpen = true;
  }

  private handleModalConfirm = () => {
    this.modalOpen = false;
    if (this.modalOnConfirm) this.modalOnConfirm();
  };

  private handleModalCancel = () => {
    this.modalOpen = false;
    if (this.modalOnCancel) this.modalOnCancel();
  };

  private async onSubmit(e: Event) {
    e.preventDefault();
    if (!this.validateForm()) return;
    const employeeData: Employee = {
      id: store.getState().editingEmployee?.id || crypto.randomUUID(),
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      email: this.email,
      department: this.department,
      position: this.position
    };
    try {
      if (this.isEditMode) {
        this.showModal({
          title: 'Are you sure?',
          message: translate('alert.updateConfirm'),
          confirmText: 'Proceed',
          cancelText: 'Cancel',
          onConfirm: async () => {
            updateEmployee(employeeData);
            setEditingEmployee(null);
            this.resetForm();
            Router.go('/');
          }
        });
        return;
      } else {
        addEmployee(employeeData);
        setEditingEmployee(null);
        this.resetForm();
        Router.go('/');
      }
    } catch (error) {
      this.showModal({
        title: 'Error',
        message: translate('alert.error'),
        confirmText: 'OK',
      });
      console.error('Error saving employee:', error);
    }
  }

  override render() {
    return html`
      <div class="form-wrapper">
        <div class="form-title">
          ${this.isEditMode ? translate('form.title.edit') : translate('form.title.add')}
        </div>
        <form class="form-container" @submit=${this.onSubmit}>
          <div class="form-group">
            <label>${translate('form.firstName')}</label>
            <input 
              type="text" 
              .value=${this.firstName} 
              @input=${(e: Event) => this.onInput(e, 'firstName')} 
              class=${this.errors.firstName ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.firstName || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.lastName')}</label>
            <input 
              type="text" 
              .value=${this.lastName} 
              @input=${(e: Event) => this.onInput(e, 'lastName')} 
              class=${this.errors.lastName ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.lastName || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.dateOfEmployment')}</label>
            <input 
              type="date" 
              .value=${this.dateOfEmployment} 
              @input=${(e: Event) => this.onInput(e, 'dateOfEmployment')} 
              class=${this.errors.dateOfEmployment ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.dateOfEmployment || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.dateOfBirth')}</label>
            <input 
              type="date" 
              .value=${this.dateOfBirth} 
              @input=${(e: Event) => this.onInput(e, 'dateOfBirth')} 
              class=${this.errors.dateOfBirth ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.dateOfBirth || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.phoneNumber')}</label>
            <input 
              type="tel" 
              .value=${this.phoneNumber} 
              @input=${(e: Event) => this.onInput(e, 'phoneNumber')} 
              class=${this.errors.phoneNumber ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.phoneNumber || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.email')}</label>
            <input 
              type="email" 
              .value=${this.email} 
              @input=${(e: Event) => this.onInput(e, 'email')} 
              class=${this.errors.email ? 'error' : ''}
              required 
            />
            <div class="error-message">${this.errors.email || ''}</div>
          </div>

          <div class="form-group">
            <label>${translate('form.department')}</label>
            <select 
              .value=${this.department} 
              @change=${(e: Event) => this.onInput(e, 'department')} 
              required
            >
              <option value="Analytics">${translate('department.analytics')}</option>
              <option value="Tech">${translate('department.tech')}</option>
            </select>
            <div class="error-message"></div>
          </div>

          <div class="form-group">
            <label>${translate('form.position')}</label>
            <select 
              .value=${this.position} 
              @change=${(e: Event) => this.onInput(e, 'position')} 
              required
            >
              <option value="Junior">${translate('position.junior')}</option>
              <option value="Medior">${translate('position.medior')}</option>
              <option value="Senior">${translate('position.senior')}</option>
            </select>
            <div class="error-message"></div>
          </div>

          <div class="form-actions">
            <button class="btn" type="submit">
              ${this.isEditMode ? translate('form.submit.edit') : translate('form.submit.add')}
            </button>
          </div>
        </form>
        <app-modal
          .open=${this.modalOpen}
          .title=${this.modalTitle}
          .message=${this.modalMessage}
          .confirmText=${this.modalConfirmText}
          .cancelText=${this.modalCancelText}
          @confirm=${this.handleModalConfirm}
          @cancel=${this.handleModalCancel}
          @close=${this.handleModalCancel}
        ></app-modal>
      </div>
    `;
  }
}