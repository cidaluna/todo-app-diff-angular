import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../core/services/todo.service';
import { ITodo } from '../core/models/todo.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit{
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  todos: ITodo[] = [];

  ngOnInit(): void {
    this.todoService.loadTodos();
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
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
}
