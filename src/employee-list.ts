import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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

@customElement('employee-list')
export class EmployeeList extends LitElement {
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
            dateOfBirth: '1990-01-01'
        },
        {
            id: 2,
            firstName: 'Betty',
            lastName: 'Erk',
            position: 'Medior',
            department: 'Analytics',
            email: 'jane@example.com',
            phoneNumber: '0987654321',
            dateOfEmployment: '2020-02-01',
            dateOfBirth: '1991-01-01'
        }
    ];

    @state()
    private currentPage: number = 1;
    private pageSize: number = 10;

    static styles = css`
        :host {
            display: block;
            padding: 32px 0;
            background: #f6f6f6;
        }
        .employee-list-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            padding: 32px 24px;
            max-width: 1200px;
            margin: 0 auto;
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
        .header {
            margin-bottom: 24px;
        }
        h2 {
            margin: 0;
            color: #ff6600;
            font-size: 24px;
            font-weight: 700;
        }
    `;

    private get paginatedEmployees() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.employees.slice(start, start + this.pageSize);
    }

    private get totalPages() {
        return Math.ceil(this.employees.length / this.pageSize);
    }

    private goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    render() {
        return html`
            <div class="employee-list-container">
                <div class="header">
                    <h2>Employee List</h2>
                </div>
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
                                   
                                </td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        `;
    }
} 