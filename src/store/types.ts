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
}

export interface AppState {
  employees: Employee[];
  editingEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

export type StoreSubscriber = (state: AppState) => void; 