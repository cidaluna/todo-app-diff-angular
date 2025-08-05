import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TodoService } from './../core/services/todo.service';
import { Status } from './../core/models/status.enum';
import { ITodo } from './../core/models/todo.model';
import { AuthService, UserRole } from '../core/services/auth.service';

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
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  form!: FormGroup;
  isEditing = false;
  todoId!: number;
  originalTodo!: ITodo;
  perfilUsuario!: UserRole;

  ngOnInit(): void {
    this.perfilUsuario = this.authService.getUserRole();
    this.todoId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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
    console.log('Chamou saveAsDraft()');
    if (this.form.invalid) {
      console.warn('Formulário inválido!');
      this.form.markAllAsTouched(); // mostra os erros no template
      return;
    }

    const todoData: Partial<ITodo> = {
      ...this.form.value,
      status: Status.RASCUNHO,
      pendingChange: null,
    };

    if(this.isEditing){
      this.todoService.updateTodo(this.todoId, todoData).subscribe(() => {
        alert('Rascunho atualizado com sucesso!');
      });
    } else {
      const formValue = this.form.value;
      const todo: ITodo = {
        ...todoData,
        id: Date.now(), // Só gera novo ID no modo criação
        title: formValue.title!,          // Usando "!" para afirmar que não é undefined
        description: formValue.description || '', // Fallback vazio se for undefined
        subtasks: todoData.subtasks || [],
        status: Status.RASCUNHO,
      };
      this.todoService.saveTodo(todo).subscribe(() => {
        alert('Tarefa salva como rascunho!');
        this.router.navigate(['/']);
      });
    }
  }

  saveForApproval(): void {
    if (this.perfilUsuario !== 'APROVADOR') {
      console.warn('Acesso negado: somente aprovadores podem enviar para aprovação.');
      return;
    }

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

  voltar(): void {
    this.router.navigate(['/']);
  }
}
