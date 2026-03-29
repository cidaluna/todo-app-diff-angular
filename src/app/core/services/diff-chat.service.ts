import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { DiffObject, DiffValue } from '../models/chat-diff-row.model';

@Injectable({
  providedIn: 'root',
})
export class DiffChatService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  /**
   * Busca os dados before e after e aplica ordenação antes de retornar.
   */
  getDiffData(): Observable<{ before: DiffValue; after: DiffValue }> {
    return forkJoin({
      before: this.http.get<DiffValue[]>(`${this.API_URL}/adminBefore`),
      after: this.http.get<DiffValue[]>(`${this.API_URL}/adminAfter`),
    }).pipe(
      map(({ before, after }) => {
        // Garante que estamos pegando o primeiro elemento dos arrays
        const beforeItem = before?.[0] || {};
        const afterItem = after?.[0] || {};

        // Aplica a ordenação recursiva antes de retornar
        return {
          before: this.sortObjectKeysRecursive(beforeItem),
          after: this.sortObjectKeysRecursive(afterItem),
        };
      })
    );
  }

  /**
   * Reordena as chaves priorizando `id` e `title`,
   * e depois organiza as demais em ordem alfabética.
   *
   * @param keys - Lista de chaves a serem ordenadas.
   * @returns string[] - Um novo array de chaves ordenadas com prioridade.
   */
  sortKeys(keys: string[]): string[] {
    const priorityKeys = ['title', 'description'];
    return keys.sort((a, b) => {
      const aPriority = priorityKeys.indexOf(a);
      const bPriority = priorityKeys.indexOf(b);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority; // Ambos sao prioritarios, mantem ordem
      } else if (aPriority !== -1) {
        return -1; // a vem antes
      } else if (bPriority !== -1) {
        return 1; // b vem antes
      } else {
        return a.localeCompare(b); // Ordem alfabetica
      }
    });
  }

  /**
   * Ordena recursivamente as chaves internas,
   * aplicando a função `sortKeys` para garantir consistência visual no diff.
   *
   *
   * @param value - Objeto, array ou valor primitivo que será ordenado.
   * @returns DiffValue - Retorna o mesmo tipo de dado, mas com chaves ordenadas.
   */
  sortObjectKeysRecursive(value: DiffValue): DiffValue {
    if (Array.isArray(value)) {
      return value.map((v) => this.sortObjectKeysRecursive(v));
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const sortedKeys = this.sortKeys(Object.keys(value));
      const sortObj: DiffObject = {};
      for (const key of sortedKeys) {
        sortObj[key] = this.sortObjectKeysRecursive(value[key]);
      }
      return sortObj;
    }
    return value;
  }
}
