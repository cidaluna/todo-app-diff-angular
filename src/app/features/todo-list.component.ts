import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../core/services/todo.service';
import { ITodo } from '../core/models/todo.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../core/services/auth.service';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TodoDetailComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit{
  role: UserRole;
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  todos: ITodo[] = [];
  selectedTodo: ITodo | null = null;

  constructor(private readonly authService: AuthService) {
    this.role = this.authService.getUserRole(); // confere o perfil do usuário
  }

  ngOnInit(): void {
    this.todoService.loadTodos();
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  trocarUsuario() {
    // Alterna entre EDITOR e APROVADOR
    this.role = this.role === 'EDITOR' ? 'APROVADOR' : 'EDITOR';
    this.authService.setUserRole(this.role);
    // Opcional: recarregar a lista ou atualizar a tela
  }

  goNewTask() {
    this.router.navigate(['/nova']);
  }

  editar(id: number) {
    // exemplo: navegar para rota /editar/:id
    console.log('editar', id);
    this.router.navigate(['/editar', id]);
  }

  verDiff(id: number) {
    // exemplo: navegar para rota /diff/:id
    console.log('verDiff', id);
    this.router.navigate(['/diff', id]);
  }

  verDetalhes(todoId: number) {
    const todo = this.todos.find(t => t.id === todoId);
    console.log('Abrindo modal para:', todo);
    if (todo) {
        this.selectedTodo = todo; // Abre o modal todo detail      }
    }
  }

  fecharModal() {
    this.selectedTodo = null;
  }
}
