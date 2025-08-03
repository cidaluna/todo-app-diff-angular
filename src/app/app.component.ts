import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITodo } from './core/models/todo.model';
import { TodoService } from './core/services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'todo-app-diff-angular';
  private readonly todoService = inject(TodoService);
  todos: ITodo[] = [];

  ngOnInit(): void {
    this.todoService.loadTodos();
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }
}
