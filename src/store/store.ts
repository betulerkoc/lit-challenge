import { AppState, Employee, StoreSubscriber } from './types';

class Store {
  private state: AppState;
  private subscribers: StoreSubscriber[] = [];
  private readonly STORAGE_KEY = 'employee-management-state';

  constructor() {
    this.state = {
      employees: [],
      loading: false,
      error: null
    };
    this.loadState();
  }

  private loadState(): void {
    try {
      const storedState = localStorage.getItem(this.STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (this.isValidState(parsedState)) {
          this.state = parsedState;
          this.notifySubscribers();
        } else {
          console.warn('Invalid state structure in localStorage, using default state');
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }

  private isValidState(state: any): state is AppState {
    return (
      state &&
      Array.isArray(state.employees) &&
      typeof state.loading === 'boolean' &&
      (state.error === null || typeof state.error === 'string')
    );
  }

  private saveState(): void {
    try {
      const stateToSave = JSON.stringify(this.state);
      localStorage.setItem(this.STORAGE_KEY, stateToSave);
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
      this.setError('Failed to save state to storage');
    }
  }

  private notifySubscribers(): void {
    const stateCopy = JSON.parse(JSON.stringify(this.state));
    this.subscribers.forEach(subscriber => subscriber(stateCopy));
  }

  subscribe(subscriber: StoreSubscriber): () => void {
    this.subscribers.push(subscriber);
    subscriber(JSON.parse(JSON.stringify(this.state)));
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    };
  }

  getState(): AppState {
    return JSON.parse(JSON.stringify(this.state));
  }

  addEmployee(employee: Employee): void {
    this.state = {
      ...this.state,
      employees: [...this.state.employees, employee]
    };
    this.saveState();
    this.notifySubscribers();
  }

  updateEmployee(employee: Employee): void {
    this.state = {
      ...this.state,
      employees: this.state.employees.map(emp => 
        emp.id === employee.id ? employee : emp
      )
    };
    this.saveState();
    this.notifySubscribers();
  }

  deleteEmployee(id: string): void {
    this.state = {
      ...this.state,
      employees: this.state.employees.filter(emp => emp.id !== id)
    };
    this.saveState();
    this.notifySubscribers();
  }

  setLoading(loading: boolean): void {
    this.state = {
      ...this.state,
      loading
    };
    this.notifySubscribers();
  }

  setError(error: string | null): void {
    this.state = {
      ...this.state,
      error
    };
    this.notifySubscribers();
  }

  clearError(): void {
    this.state = {
      ...this.state,
      error: null
    };
    this.notifySubscribers();
  }

  debugStorage(): void {
    console.log('Current localStorage state:', localStorage.getItem(this.STORAGE_KEY));
    console.log('Current in-memory state:', this.state);
  }
}

export const store = new Store(); 