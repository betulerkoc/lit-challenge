import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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
  `;

  private onInput(e: Event, field: string) {
    (this as any)[field] = (e.target as HTMLInputElement).value;
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    const newEmployee = {
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      email: this.email,
      department: this.department,
      position: this.position,
    };
    this.dispatchEvent(new CustomEvent('employee-created', {
      detail: newEmployee,
      bubbles: true,
      composed: true
    }));

    this.firstName = '';
    this.lastName = '';
    this.dateOfEmployment = '';
    this.dateOfBirth = '';
    this.phoneNumber = '';
    this.email = '';
    this.department = 'Analytics';
    this.position = 'Junior';
  }

  override render() {
    return html`
      <div class="form-wrapper">
        <div class="form-title">Add New Employee</div>
        <form class="form-container" @submit=${this.onSubmit}>
          <label>First Name</label>
          <input type="text" .value=${this.firstName} @input=${(e: Event) => this.onInput(e, 'firstName')} required />
          <label>Last Name</label>
          <input type="text" .value=${this.lastName} @input=${(e: Event) => this.onInput(e, 'lastName')} required />
          <label>Date of Employment</label>
          <input type="date" .value=${this.dateOfEmployment} @input=${(e: Event) => this.onInput(e, 'dateOfEmployment')} required />
          <label>Date of Birth</label>
          <input type="date" .value=${this.dateOfBirth} @input=${(e: Event) => this.onInput(e, 'dateOfBirth')} required />
          <label>Phone Number</label>
          <input type="text" .value=${this.phoneNumber} @input=${(e: Event) => this.onInput(e, 'phoneNumber')} required />
          <label>Email Address</label>
          <input type="email" .value=${this.email} @input=${(e: Event) => this.onInput(e, 'email')} required />
          <label>Department</label>
          <select .value=${this.department} @change=${(e: Event) => this.onInput(e, 'department')} required>
            <option value="Analytics">Analytics</option>
            <option value="Tech">Tech</option>
          </select>
          <label>Position</label>
          <select .value=${this.position} @change=${(e: Event) => this.onInput(e, 'position')} required>
            <option value="Junior">Junior</option>
            <option value="Medior">Medior</option>
            <option value="Senior">Senior</option>
          </select>
          <button class="btn" type="submit">Create Employee</button>
        </form>
      </div>
    `;
  }
} 