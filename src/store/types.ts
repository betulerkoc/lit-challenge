export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  dateOfEmployment: string;
  dateOfBirth: string;
  salary?: number;
}

export interface AppState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

export type StoreSubscriber = (state: AppState) => void; 