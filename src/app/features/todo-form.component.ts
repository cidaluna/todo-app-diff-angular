import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodoService } from './../core/services/todo.service';
import { Status } from './../core/models/status.enum';
import { ITodo } from './../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements OnInit {
private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([
        this.createSubtask()
      ])
    });
  }

  get subtasks(): FormArray {
    return this.form.get('subtasks') as FormArray;
  }

  createSubtask(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      done: [false]
    });
  }

  addSubtask(): void {
    this.subtasks.push(this.createSubtask());
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  saveAsDraft(): void {
    const todo: ITodo = {
      id: Date.now(), // para simular um ID único
      ...this.form.value,
      status: Status.RASCUNHO,
      pendingChange: null
    };
    this.todoService.saveTodo(todo).subscribe(() => {
      alert('Tarefa salva como rascunho!');
    });
  }
}
