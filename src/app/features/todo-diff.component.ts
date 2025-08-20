import { Component, inject, OnInit } from '@angular/core';
import { Status } from '../core/models/status.enum';
import { ITodo } from '../core/models/todo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../core/services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-diff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-diff.component.html',
  styleUrl: './todo-diff.component.scss'
})
export class TodoDiffComponent implements OnInit {
  /* Objetivo do Todo Diff
  Exibir lado a lado
  A versão original da tarefa (todo)
  A versão proposta para alteração (pendingChange)
  Permitir que um aprovador:
  Aprove as alterações → todo = pendingChange, limpa o pendingChange e muda status para ATIVA
  Rejeite as alterações → limpa apenas pendingChange, mantém a original e volta status para RASCUNHO
  */

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly todoService = inject(TodoService);

  todo!: ITodo;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.todoService.getTodoById(id).subscribe(todo => this.todo = todo);
  }

  aprovar(): void {
    if (!this.todo?.pendingChange) return;

    const atualizada: ITodo = {
      ...this.todo,
      ...this.todo.pendingChange,
      pendingChange: null,
      status: Status.ATIVA
    };

    this.todoService.updateTodo(this.todo.id, atualizada).subscribe(() => {
      alert('Tarefa aprovada!');
      this.router.navigate(['/']);
    });
  }

  rejeitar(): void {
    const revertida: ITodo = {
      ...this.todo,
      pendingChange: undefined,
      status: Status.RASCUNHO
    };

    this.todoService.updateTodo(this.todo.id, revertida).subscribe(() => {
      alert('Alterações rejeitadas!');
      this.router.navigate(['/']);
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
