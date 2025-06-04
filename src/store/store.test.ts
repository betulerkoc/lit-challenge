import { store, setEmployees, setEditingEmployee, addEmployee, updateEmployee, deleteEmployee } from './store';
import { Employee } from './types';
import { expect } from '@open-wc/testing';

describe('Store', () => {
  const employee1: Employee = {
    id: '1',
    firstName: 'Betty',
    lastName: 'Bet',
    email: 'betty@example.com',
    phoneNumber: '+1234567890',
    department: 'Tech',
    position: 'Senior',
    dateOfEmployment: '2020-01-01',
    dateOfBirth: '1993-01-01',
  };
  const employee2: Employee = {
    id: '2',
    firstName: 'Rose',
    lastName: 'Erk',
    email: 'rose@example.com',
    phoneNumber: '+1234567890',
    department: 'Analytics',
    position: 'Junior',
    dateOfEmployment: '2021-01-01',
    dateOfBirth: '1995-01-01',
  };

  beforeEach(() => {
    store.reset();
    localStorage.clear();
  });

  it('sets employees', () => {
    setEmployees([employee1, employee2]);
    expect(store.getState().employees).to.deep.equal([employee1, employee2]);
  });

  it('sets editing employee', () => {
    setEditingEmployee(employee1);
    expect(store.getState().editingEmployee).to.deep.equal(employee1);
    setEditingEmployee(null);
    expect(store.getState().editingEmployee).to.equal(null);
  });

  it('adds an employee', () => {
    addEmployee(employee1);
    expect(store.getState().employees).to.deep.equal([employee1]);
    addEmployee(employee2);
    expect(store.getState().employees).to.deep.equal([employee1, employee2]);
  });

  it('updates an employee', () => {
    setEmployees([employee1, employee2]);
    const updated = { ...employee1, firstName: 'Alicia' };
    updateEmployee(updated);
    expect(store.getState().employees[0].firstName).to.equal('Alicia');
    expect(store.getState().editingEmployee).to.equal(null);
  });

  it('deletes an employee', () => {
    setEmployees([employee1, employee2]);
    deleteEmployee(employee1.id);
    expect(store.getState().employees).to.deep.equal([employee2]);
  });

  it('resets the store', () => {
    setEmployees([employee1]);
    setEditingEmployee(employee2);
    store.reset();
    expect(store.getState().employees).to.deep.equal([]);
    expect(store.getState().editingEmployee).to.equal(null);
  });
}); 