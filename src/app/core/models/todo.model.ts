import { Status } from './status.enum';

export interface ITodo {
  id: string | number;
  title: string;
  description?: string;
  channels: string[];
  subtasks: ISubtask[];
  status: Status;
  pendingChange?: Partial<ITodo> | null; // usado na tela diff, é uma propriedade opcional, pode ser undefined e pode conter subconjunto de ITodo
}

export interface ISubtask {
  subtitle: string;
  done: boolean;
  transaction?: ITransaction[];
}

export interface ITransaction {
  label?: string;
  location?: string[];
}
