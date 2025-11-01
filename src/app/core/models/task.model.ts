export interface Transaction {
  label?: string;
  location?: string[];
}

export interface Subtask {
  subtitle?: string;
  done?: boolean;
  transaction?: Transaction[];
}

export interface Task {
  id?: string;
  title?: string;
  description?: string;
  channels?: string[];
  subtasks?: Subtask[];
  status?: string;
  pendingChange?: any;
}
