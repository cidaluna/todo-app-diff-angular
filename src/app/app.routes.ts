import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list.component';
import { RoleGuard } from './core/guards/role.guard';
import { TodoTestDiffCoComponent } from './todo-test-diff-co/todo-test-diff-co.component';
import { DiffChatComponent } from './chat/diff-chat/diff-chat.component';
import { DiffChat2Component } from './chat/diff-chat-2/diff-chat-2.component';


export const routes: Routes = [
  // { path: '', component: TodoListComponent },
  // { path: '', component: TodoTestDiffCoComponent },
   { path: '', component: DiffChatComponent },  //rever objetos aninhados
  //{ path: '', component: DiffChat2Component },
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
