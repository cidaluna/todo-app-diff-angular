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

  /**
 * Compara dois objetos e retorna um objeto delta indicando quais campos são diferentes.
 * Suporta tipos: string, number, boolean, arrays, arrays de objetos, objetos aninhados.
 */
compareObjects(original: any, edited: any): any {
  const delta: any = {};

  // Junta todas as chaves dos dois objetos para garantir que todos os campos sejam comparados
  const allKeys = new Set([
    ...Object.keys(original || {}),
    ...Object.keys(edited || {})
  ]);

  // Percorre cada chave
  allKeys.forEach(key => {
    const origVal = original?.[key];
    const editVal = edited?.[key];

    // Usa switch(true) para tratar diferentes tipos de campo
    switch (true) {
      // Caso ambos sejam arrays
      case Array.isArray(origVal) && Array.isArray(editVal):
        delta[key] = [];
        // Compara cada item do array, considerando o maior tamanho
        const maxLen = Math.max(origVal.length, editVal.length);
        for (let i = 0; i < maxLen; i++) {
          switch (true) {
            // Se o item for objeto, compara recursivamente
            case typeof origVal[i] === 'object' && typeof editVal[i] === 'object':
              delta[key][i] = this.compareObjects(origVal[i], editVal[i]);
              break;
            // Caso contrário, compara valores primitivos
            default:
              delta[key][i] = origVal[i] !== editVal[i];
          }
        }
        break;

      // Caso ambos sejam objetos (e não null)
      case typeof origVal === 'object' && origVal !== null &&
           typeof editVal === 'object' && editVal !== null:
        // Compara recursivamente objetos aninhados
        delta[key] = this.compareObjects(origVal, editVal);
        break;

      // Caso padrão: compara valores primitivos (string, number, boolean)
      default:
        delta[key] = origVal !== editVal;
    }
  });

  // Retorna o objeto delta, indicando diferenças por campo
  return delta;
}
}
