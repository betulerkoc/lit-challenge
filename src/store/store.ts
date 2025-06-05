import { AppState, Employee, StoreSubscriber } from './types';

const SEED_EMPLOYEES = [
  {
    id: 'seed-1',
    firstName: 'Betul',
    lastName: 'Erkoc',
    email: 'betul.erkoc@example.com',
    phoneNumber: '+90 532 111 11 11',
    department: 'Tech',
    position: 'Senior',
    dateOfEmployment: '2022-09-23',
    dateOfBirth: '1995-05-10'
  },
  {
    id: 'seed-2',
    firstName: 'Ahmet',
    lastName: 'Sourtimes',
    email: 'ahmet@sourtimes.org',
    phoneNumber: '+90 532 123 45 67',
    department: 'Analytics',
    position: 'Junior',
    dateOfEmployment: '2022-09-23',
    dateOfBirth: '2000-09-23'
  },
  {
    id: 'seed-3',
    firstName: 'Gul',
    lastName: 'Erkoc',
    email: 'gul.erkoc@example.com',
    phoneNumber: '+90 532 222 22 22',
    department: 'Tech',
    position: 'Medior',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1998-03-12'
  }
];

class Store {
  private state: AppState;
  private subscribers: StoreSubscriber[] = [];

  constructor() {
    this.state = {
      employees: [],
      editingEmployee: null,
      loading: false,
      error: null
    };
    this.loadState();
  }

  getState(): AppState {
    return this.state;
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    this.saveState();
    this.notifySubscribers();
  }

  subscribe(subscriber: StoreSubscriber) {
    this.subscribers.push(subscriber);
    subscriber(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== subscriber);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber(this.state));
  }

  private saveState() {
    localStorage.setItem('appState', JSON.stringify(this.state));
  }

  loadState() {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      this.state = JSON.parse(savedState);
      this.notifySubscribers();
    } else {
      this.state.employees = SEED_EMPLOYEES;
      this.saveState();
      this.notifySubscribers();
    }
  }

  reset() {
    this.state = {
      employees: [],
      editingEmployee: null,
      loading: false,
      error: null
    };
    this.saveState();
    this.notifySubscribers();
  }
}

export const store = new Store();

export const setEmployees = (employees: Employee[]) => {
  store.setState({ employees });
};

export const setEditingEmployee = (employee: Employee | null) => {
  store.setState({ editingEmployee: employee });
};

export const addEmployee = (employee: Employee) => {
  const currentState = store.getState();
  store.setState({
    employees: [...currentState.employees, employee]
  });
};

export const updateEmployee = (updatedEmployee: Employee) => {
  const currentState = store.getState();
  store.setState({
    employees: currentState.employees.map(emp =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ),
    editingEmployee: null
  });
};

export const deleteEmployee = (id: string) => {
  const currentState = store.getState();
  store.setState({
    employees: currentState.employees.filter(emp => emp.id !== id)
  });
}; 