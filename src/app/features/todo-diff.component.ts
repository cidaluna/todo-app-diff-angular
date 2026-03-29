import { Component, inject, OnInit } from '@angular/core';
import { Status } from '../core/models/status.enum';
import { ITodo } from '../core/models/todo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../core/services/todo.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-todo-diff',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './todo-diff.component.html',
  styleUrl: './todo-diff.component.scss',
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
  delta: any = {};
  isLoading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.todoService.getTodoById(id).subscribe((todo) => {
      this.todo = todo;
      // Só gera o delta se todo e pendingChange existirem
      if (this.todo && this.todo.pendingChange) {
        this.delta = this.compareObjects(this.todo, this.todo.pendingChange);
        console.log('Delta:', this.delta);
      }
      // Loading termina assim que os dados chegam
      this.isLoading = false;

      // Simula 5 segundos de loading
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 5000);
    });
  }

  aprovar(): void {
    if (!this.todo?.pendingChange) return;

    const atualizada: ITodo = {
      ...this.todo,
      ...this.todo.pendingChange,
      pendingChange: null,
      status: Status.ATIVA,
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
      status: Status.RASCUNHO,
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
      ...Object.keys(edited || {}),
    ]);

    // Percorre cada chave
    allKeys.forEach((key) => {
      const origVal = original?.[key];
      const editVal = edited?.[key];

      // Campo adicionado
      if (origVal === undefined && editVal !== undefined) {
        delta[key] = 'added';
      }
      // Campo removido
      else if (origVal !== undefined && editVal === undefined) {
        delta[key] = 'removed';
      }
      // Arrays
      else if (Array.isArray(origVal) && Array.isArray(editVal)) {
        delta[key] = [];
        const maxLen = Math.max(origVal.length, editVal.length);
        for (let i = 0; i < maxLen; i++) {
          if (origVal[i] === undefined && editVal[i] !== undefined) {
            delta[key][i] = 'added';
          } else if (origVal[i] !== undefined && editVal[i] === undefined) {
            delta[key][i] = 'removed';
          } else if (
            typeof origVal[i] === 'object' &&
            typeof editVal[i] === 'object'
          ) {
            delta[key][i] = this.compareObjects(origVal[i], editVal[i]);
          } else if (origVal[i] !== editVal[i]) {
            delta[key][i] = 'changed';
          } else {
            delta[key][i] = 'equal';
          }
        }
      }
      // Objetos aninhados
      else if (
        typeof origVal === 'object' &&
        origVal !== null &&
        typeof editVal === 'object' &&
        editVal !== null
      ) {
        delta[key] = this.compareObjects(origVal, editVal);
      }
      // Primitivos e booleanos
      else if (origVal !== editVal) {
        delta[key] = 'changed';
      }
      // Igual
      else {
        delta[key] = 'equal';
      }
    });

    // Retorna o objeto delta, indicando diferenças por campo
    return delta;
  }

  getDeltaClass(deltaObj: any): string {
    if (!deltaObj) return '';
    if (typeof deltaObj === 'string') return deltaObj; // 'changed', 'added', 'removed', 'equal'
    // Se for objeto, verifica recursivamente todos os campos
    for (const value of Object.values(deltaObj)) {
      const result = this.getDeltaClass(value);
      if (result === 'changed' || result === 'added' || result === 'removed') {
        return result;
      }
    }
    return '';
  }
}
