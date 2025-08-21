import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list.component';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: TodoListComponent },
  {
    path: 'nova',
    loadComponent: () => import('./features/todo-form.component').then(m => m.TodoFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['EDITOR'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./features/todo-form.component').then(m => m.TodoFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['EDITOR'] }
  },
  {
    path: 'diff/:id',
    loadComponent: () =>
      import('./features/todo-diff.component').then(m => m.TodoDiffComponent),
      canActivate: [RoleGuard],
      data: { roles: ['APROVADOR'] }
  }
];
