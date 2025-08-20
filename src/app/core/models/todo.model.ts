import { Status } from './status.enum';

export interface ITodo {
  id: number;
  title: string;
  description?: string;
  subtasks: ISubtask[];
  status: Status;
  pendingChange?: Partial<ITodo> | null; // usado na tela diff, é uma propriedade opcional, pode ser undefined e pode conter subconjunto de ITodo
}

export interface ISubtask {
  title: string;
  done: boolean;
}
