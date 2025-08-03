import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITodo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/todos';

  private readonly todos$ = new BehaviorSubject<ITodo[]>([]);

  getTodos(): Observable<ITodo[]> {
    return this.todos$.asObservable();
  }

  loadTodos(): void {
    this.http.get<ITodo[]>(this.baseUrl).subscribe(todos => {
      this.todos$.next(todos);
    });
  }

  saveTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(this.baseUrl, todo);
  }

  updateTodo(id: number, todo: Partial<ITodo>): Observable<ITodo> {
    return this.http.patch<ITodo>(`${this.baseUrl}/${id}`, todo);
  }
}
