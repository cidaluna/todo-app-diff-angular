import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../core/services/todo.service';
import { ITodo } from '../core/models/todo.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit{
private readonly todoService = inject(TodoService);
  todos: ITodo[] = [];

  ngOnInit(): void {
    this.todoService.loadTodos();
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  editar(id: number) {
    // exemplo: navegar para rota /editar/:id
    console.log('editar', id);
  }

  verDiff(id: number) {
    // exemplo: navegar para rota /diff/:id
    console.log('verDiff', id);
  }
}
