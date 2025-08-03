import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list.component';

export const routes: Routes = [
  { path: '', component: TodoListComponent },
  {
    path: 'nova',
    loadComponent: () => import('./features/todo-form.component').then(m => m.TodoFormComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./features/todo-form.component').then(m => m.TodoFormComponent)
  },
  {
    path: 'diff/:id',
    loadComponent: () =>
      import('./features/todo-diff.component').then(m => m.TodoDiffComponent)
  }
];
