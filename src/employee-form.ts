import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Employee } from './store/types';
import { store, addEmployee, updateEmployee, setEditingEmployee } from './store/store';
import { Router } from '@vaadin/router';
import { translate } from './i18n/i18n';

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
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener('lang-changed', this._onLangChanged);
  }

  private _onLangChanged = () => {
    this.requestUpdate();
  };

  static override styles = css`
    .form-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 32px;
    }
    .form-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ff6600;
      margin-bottom: 18px;
      letter-spacing: 0.5px;
    }
    .form-container {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.04);
      padding: 36px 36px 28px 32px;
      max-width: 420px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border: 1px solid #f0f0f0;
    }
    label {
      font-weight: 600;
      color: #ff6600;
      margin-bottom: 4px;
      font-size: 1rem;
    }
    input, select {
      padding: 10px 12px;
      font-size: 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
      width: 100%;
      background: #fafbfc;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    input:focus, select:focus {
      border-color: #ff6600;
      box-shadow: 0 0 0 2px rgba(255,102,0,0.08);
      background: #fff;
    }
    .btn {
      padding: 12px 0;
      border: none;
      border-radius: 8px;
      font-size: 1.08rem;
      cursor: pointer;
      background: linear-gradient(90deg, #ff6600 60%, #ff944d 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: background 0.2s, box-shadow 0.2s;
      margin-top: 10px;
      box-shadow: 0 2px 8px rgba(255,102,0,0.08);
    }
    .btn:hover {
      background: linear-gradient(90deg, #d35400 60%, #ff6600 100%);
      box-shadow: 0 4px 16px rgba(255,102,0,0.12);
    }
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: -6px;
      margin-bottom: 8px;
    }
    input.error, select.error {
      border-color: #dc3545;
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
    } else if (!/^\+?[\d\s-]{10,15}$/.test(this.phoneNumber)) {
      errors.phoneNumber = translate('validation.phoneNumber.format');
    }

    if (!this.email) {
      errors.email = translate('validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = translate('validation.email.format');
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

  private async onSubmit(e: Event) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

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
        if (!window.confirm(translate('alert.updateConfirm'))) {
          return;
        }
        updateEmployee(employeeData);
        await new Promise(resolve => {
          alert(translate('alert.updateSuccess'));
          resolve(true);
        });
      } else {
        addEmployee(employeeData);
        await new Promise(resolve => {
          alert(translate('alert.createSuccess'));
          resolve(true);
        });
      }
      
      setEditingEmployee(null);
      this.resetForm();
      Router.go('/');
    } catch (error) {
      alert(translate('alert.error'));
      console.error('Error saving employee:', error);
    }
  }

  override render() {
    return html`
      <div class="form-wrapper">
        <div class="form-title">${this.isEditMode ? translate('form.title.edit') : translate('form.title.add')}</div>
        <form class="form-container" @submit=${this.onSubmit}>
          <label>${translate('form.firstName')}</label>
          <input 
            type="text" 
            .value=${this.firstName} 
            @input=${(e: Event) => this.onInput(e, 'firstName')} 
            class=${this.errors.firstName ? 'error' : ''}
            required 
          />
          ${this.errors.firstName ? html`<div class="error-message">${this.errors.firstName}</div>` : ''}

          <label>${translate('form.lastName')}</label>
          <input 
            type="text" 
            .value=${this.lastName} 
            @input=${(e: Event) => this.onInput(e, 'lastName')} 
            class=${this.errors.lastName ? 'error' : ''}
            required 
          />
          ${this.errors.lastName ? html`<div class="error-message">${this.errors.lastName}</div>` : ''}

          <label>${translate('form.dateOfEmployment')}</label>
          <input 
            type="date" 
            .value=${this.dateOfEmployment} 
            @input=${(e: Event) => this.onInput(e, 'dateOfEmployment')} 
            class=${this.errors.dateOfEmployment ? 'error' : ''}
            required 
          />
          ${this.errors.dateOfEmployment ? html`<div class="error-message">${this.errors.dateOfEmployment}</div>` : ''}

          <label>${translate('form.dateOfBirth')}</label>
          <input 
            type="date" 
            .value=${this.dateOfBirth} 
            @input=${(e: Event) => this.onInput(e, 'dateOfBirth')} 
            class=${this.errors.dateOfBirth ? 'error' : ''}
            required 
          />
          ${this.errors.dateOfBirth ? html`<div class="error-message">${this.errors.dateOfBirth}</div>` : ''}

          <label>${translate('form.phoneNumber')}</label>
          <input 
            type="tel" 
            .value=${this.phoneNumber} 
            @input=${(e: Event) => this.onInput(e, 'phoneNumber')} 
            class=${this.errors.phoneNumber ? 'error' : ''}
            required 
          />
          ${this.errors.phoneNumber ? html`<div class="error-message">${this.errors.phoneNumber}</div>` : ''}

          <label>${translate('form.email')}</label>
          <input 
            type="email" 
            .value=${this.email} 
            @input=${(e: Event) => this.onInput(e, 'email')} 
            class=${this.errors.email ? 'error' : ''}
            required 
          />
          ${this.errors.email ? html`<div class="error-message">${this.errors.email}</div>` : ''}

          <label>${translate('form.department')}</label>
          <select 
            .value=${this.department} 
            @change=${(e: Event) => this.onInput(e, 'department')} 
            required
          >
            <option value="Analytics">${translate('department.analytics')}</option>
            <option value="Tech">${translate('department.tech')}</option>
          </select>

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

          <button class="btn" type="submit">${this.isEditMode ? translate('form.submit.edit') : translate('form.submit.add')}</button>
        </form>
      </div>
    `;
  }
}