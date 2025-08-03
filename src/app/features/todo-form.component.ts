import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TodoService } from './../core/services/todo.service';
import { Status } from './../core/models/status.enum';
import { ITodo } from './../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnInit {
  // TodoFormComponent alterado para funcionar como "criação ou edição"
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);

  form!: FormGroup;
  isEditing = false;
  todoId!: number;
  originalTodo!: ITodo;

  ngOnInit(): void {
    this.todoId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([]),
    });

    if (this.todoId) {
      this.isEditing = true;
      this.todoService.getTodoById(this.todoId).subscribe((todo) => {
        this.originalTodo = todo;
        this.form.patchValue({
          title: todo.title,
          description: todo.description,
        });

        todo.subtasks.forEach((sub) => {
          this.subtasks.push(
            this.fb.group({
              title: [sub.title],
              done: [sub.done],
            })
          );
        });
      });
    } else {
      this.subtasks.push(this.createSubtask());
    }
  }

  get subtasks(): FormArray {
    return this.form.get('subtasks') as FormArray;
  }

  createSubtask(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      done: [false],
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
      pendingChange: null,
    };
    this.todoService.saveTodo(todo).subscribe(() => {
      alert('Tarefa salva como rascunho!');
    });
  }

  saveForApproval(): void {
    const edited: Partial<ITodo> = {
      ...this.form.value,
      status: Status.PENDENTE_APROVACAO,
      pendingChange: null,
    };

    this.todoService
      .updateTodo(this.todoId, {
        pendingChange: edited,
        status: Status.PENDENTE_APROVACAO,
      })
      .subscribe(() => {
        alert('Alterações salvas para aprovação!');
      });
  }
}
