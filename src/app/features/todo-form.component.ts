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
    console.log('ID TODO:', this.todoId);

    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      channels: this.fb.group({
        API: [true],
        WEB: [false],
      }),
      subtasks: this.fb.array([]),
    });

    if (this.todoId) {
      this.isEditing = true;
      this.todoService.getTodoById(this.todoId).subscribe((todo) => {
        console.log('Dados do TODO:', todo);
        this.form.patchValue({
          id: todo.id,
          title: todo.title.trim(),
          description: todo.description?.trim(),
          channels: {
            API: todo.channels.includes('API'),
            WEB: todo.channels.includes('WEB'),
          },
        });

        if (todo.subtasks) {
          todo.subtasks.forEach((sub) => {
            const subtaskGroup = this.fb.group({
              subtitle: [sub.subtitle, [Validators.required, Validators.minLength(3)]],
              done: [sub.done],
              transaction: this.fb.array([]),
            });

            if (sub.transaction) {
              sub.transaction.forEach((tx) => {
                const transactionGroup = this.fb.group({
                  label: [tx.label],
                  location: this.fb.array(
                    tx.location || []
                  ),
                });

                (subtaskGroup.get('transaction') as FormArray).push(
                  transactionGroup
                );
              });
            }

            this.subtasks.push(subtaskGroup);
          });
        }
      });
    }
  }

  get subtasks(): FormArray {
    return this.form.get('subtasks') as FormArray;
  }

  createSubtask(): FormGroup {
    return this.fb.group({
      subtitle: ['', [Validators.required, Validators.minLength(3)]],
      done: [false],
    });
  }

  addSubtask(): void {
    const subtask = this.fb.group({
      subtitle: ['', [Validators.required, Validators.minLength(3)]],
      done: [false],
      transaction: this.fb.array([]), // Inicializa o array de transações vazio
    });
    this.subtasks.push(subtask);
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

    if (this.isEditing && !this.hasChanges()) {
      alert('Nenhuma alteração detectada para salvar.');
      return;
    }

    const trimmedTitle = this.form.value.title.trim();
    const trimmedDescription = this.form.value.description.trim();

    const currentData: Partial<ITodo> = {
      ...this.form.value,
      channels: Object.keys(this.form.value.channels).filter(
        (key) => this.form.value.channels[key]
      ),
      subtasks: this.form.value.subtasks.map((sub: any) => ({
        ...sub,
        transaction: sub.transaction.map((tx: any) => ({
          ...tx,
          location: tx.location || [],
        })),
      })),
    };

    if (this.isEditing) {
      this.todoService.updateTodo(this.todoId, currentData).subscribe(() => {
        alert('Rascunho atualizado com sucesso!');
        this.router.navigate(['/']);
      });
    } else {
      const todo: ITodo = {
        ...currentData,
        id: `${Date.now()}`, // Só gera novo ID no modo criação
        title: trimmedTitle, // Usando "!" para afirmar que não é undefined
        description: trimmedDescription || '', // Fallback vazio se for undefined
        channels: currentData.channels || [],
        subtasks: currentData.subtasks || [],
        status: Status.RASCUNHO,
      };
      this.todoService.saveTodo(todo).subscribe(() => {
        alert('Tarefa salva como rascunho!');
        this.router.navigate(['/']);
      });
    }
  }

  saveForApproval(): void {
    console.log('Chamou saveForApproval');
    const edited: Partial<ITodo> = {
      ...this.form.value,
      status: Status.PENDENTE_APROVACAO,
    };

    this.todoService
      .updateTodo(this.todoId, {
        pendingChange: edited,
        status: Status.PENDENTE_APROVACAO,
      })
      .subscribe(() => {
        alert('Alterações salvas para aprovação!');
        this.router.navigate(['/']);
      });
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  private hasChanges(): boolean {
    const trimmedTitle = this.form.value.title.trim();
    const trimmedDescription = this.form.value.description.trim();
    const currentSubtasks = JSON.stringify(this.form.value.subtasks);
    const originalSubtasks = JSON.stringify(this.originalTodo.subtasks);

    return (
      trimmedTitle !== this.originalTodo.title.trim() ||
      trimmedDescription !== this.originalTodo.description?.trim() ||
      currentSubtasks !== originalSubtasks
    );
  }

  getTransactions(subtaskIndex: number): FormArray {
    const subtask = this.subtasks.at(subtaskIndex);
    if (!subtask) {
      throw new Error(`Subtask no índice ${subtaskIndex} não encontrada.`);
    }
    return subtask.get('transaction') as FormArray;
  }

  addTransaction(subtaskIndex: number): void {
    const transaction = this.fb.group({
      label: ['', Validators.required],
      location: this.fb.array([]), // Inicializa o array de locations vazio
    });
    this.getTransactions(subtaskIndex).push(transaction);
  }

  getLocationArray(subtaskIndex: number, transactionIndex: number): FormArray {
    const transaction = this.getTransactions(subtaskIndex).at(transactionIndex);
    return transaction.get('location') as FormArray;
  }

  removeTransaction(subtaskIndex: number, transactionIndex: number): void {
    this.getTransactions(subtaskIndex).removeAt(transactionIndex);
  }

  // addLocation(subtaskIndex: number, transactionIndex: number): void {
  //   const locationControl = this.fb.control('', Validators.required); // Cria um novo campo de location
  //   const locationArray = this.getTransactions(subtaskIndex)
  //     .at(transactionIndex)
  //     .get('location') as FormArray;

  //   if (locationArray) {
  //     locationArray.push(locationControl);
  //   } else {
  //     console.error(`O FormArray 'location' não foi encontrado na transação ${transactionIndex} da subtarefa ${subtaskIndex}.`);
  //   }
  // }

  // removeLocation(
  //   subtaskIndex: number,
  //   transactionIndex: number,
  //   locationIndex: number
  // ): void {
  //   const locationArray = this.getTransactions(subtaskIndex)
  //     .at(transactionIndex)
  //     .get('location') as FormArray;

  //   if (locationArray) {
  //     locationArray.removeAt(locationIndex);
  //   } else {
  //     console.error(`O FormArray 'location' não foi encontrado na transação ${transactionIndex} da subtarefa ${subtaskIndex}.`);
  //   }
  // }
}
