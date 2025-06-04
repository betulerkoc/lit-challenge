import { AppState, Employee, StoreSubscriber } from './types';

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