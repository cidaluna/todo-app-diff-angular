import { Component, OnInit } from '@angular/core';
import { ChatDiffRow2 } from '../../core/models/chat-diff-row.model';
import { diffMock } from '../../core/mocks/diff-chat.mock';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diff-chat-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diff-chat-2.component.html',
  styleUrl: './diff-chat-2.component.scss'
})
export class DiffChat2Component implements OnInit {
  diffRows: ChatDiffRow2[] = [];

  ngOnInit(): void {
    const before = diffMock.diffBefore;
    const after = diffMock.diffAfter;
    console.log('Entrou no ngOnInit com before:', before, ' e after:', after);

    //Constroi o diff alinhado
    this.diffRows = this.buildAlignedDiff(before, after);
  }

  // Coloca id e title no inicio, depois o resto em ordem alfabetica
  sortKeys(keys: string[]): string[] {
    const priorityKeys = ['id', 'title'];
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

  // Ordena as chaves de objetos internos recursivamente
  sortObjectKeys(value: any): any {
    if (Array.isArray(value)) {
      return value.map((v) => this.sortObjectKeys(v));
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const sortedKeys = this.sortKeys(Object.keys(value));
      const sortObj: any = {};
      for (const key of sortedKeys) {
        sortObj[key] = this.sortObjectKeys(value[key]);
      }
      return sortObj;
    }
    return value;
  }

  // Método principal — mantém simples
  buildAlignedDiff(beforeData: any, afterData: any): ChatDiffRow2[] {
    const beforeSorted = this.sortObjectKeys(beforeData);
    const afterSorted = this.sortObjectKeys(afterData);
    return this.compareValues(beforeSorted, afterSorted);
  }

  // 🔹 4. Recursividade e granularidade
  private compareValues(before: any, after: any): ChatDiffRow2[] {
    const diffRows: ChatDiffRow2[] = [];
    const { statusLeft, statusRight } = this.getStatus(before, after);

    // Se ambos forem primitivos
    if (this.isPrimitive(before) && this.isPrimitive(after)) {
      return [{
        key: '',
        leftValue: before,
        rightValue: after,
        statusLeft,
        statusRight
      }];
    }

     // Caso sejam arrays
    if (Array.isArray(before) || Array.isArray(after)) {
      const bArray = before ?? [];
      const aArray = after ?? [];

      const todosSaoPrimitivosAntes = bArray.every((v: any) => this.isPrimitive(v));
      const todosSaoPrimitivosDepois = aArray.every((v: any) => this.isPrimitive(v));
      const { statusLeft, statusRight } = this.getStatus(bArray, aArray);

      // 🔹 Caso seja um array simples de primitivos
      if (todosSaoPrimitivosAntes && todosSaoPrimitivosDepois) {
        return [
          {
            key: '',
            leftValue: `[ ${bArray.join(', ')} ]`,
            rightValue: `[ ${aArray.join(', ')} ]`,
            statusLeft,
            statusRight,
          }
        ];
      }

      // 🔹 Caso tenha objetos dentro, faz diff recursivo
      const maxLen = Math.max(bArray.length, aArray.length);
      const result: ChatDiffRow2[] = [];
      for (let i = 0; i < maxLen; i++) {
        const b = bArray[i];
        const a = aArray[i];
        result.push(...this.compareValues(b, a));
      }
      return result;
    }

    // Caso sejam objetos
    const allKeys = new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ]);

    const result: ChatDiffRow2[] = [];
    for (const key of allKeys) {
      const bVal = before?.[key];
      const aVal = after?.[key];
      const { statusLeft, statusRight } = this.getStatus(bVal, aVal);

      if (this.isComplex(bVal) || this.isComplex(aVal)) {
        result.push({
          key,
          children: this.compareValues(bVal, aVal),
        });
      } else {
        result.push({
          key,
          leftValue: bVal,
          rightValue: aVal,
          statusLeft,
          statusRight,
        });
      }
    }

    return result;
  }

  // Determina status
  private getStatus(before: any, after: any): { statusLeft: 'normal' | 'modified' | 'missing', statusRight: 'normal' | 'modified' | 'missing' } {
    let statusLeft: 'normal' | 'modified' | 'missing' = 'normal';
    let statusRight: 'normal' | 'modified' | 'missing' = 'normal';

    if ((before === '' || before === undefined) && (after !== '' && after !== undefined)) {
      // Valor adicionado
      statusLeft = 'missing';
      statusRight = 'modified';
    } else if ((after === '' || after === undefined) && (before !== '' && before !== undefined)) {
      // Valor removido
      statusLeft = 'modified';
      statusRight = 'missing';
    } else if (before !== after) {
      // Valor modificado
      statusLeft = 'modified';
      statusRight = 'modified';
    }

    return { statusLeft, statusRight };
  }

  // Normaliza linhas
  // private normalizeLines(
  //   beforeValue: string,
  //   afterValue: string
  // ): [string, string] {
  //   const bLines = beforeValue.split('\n').length;
  //   const aLines = afterValue.split('\n').length;
  //   const max = Math.max(bLines, aLines);
  //   const pad = (text: string, total: number) =>
  //     text + '\n'.repeat(total - text.split('\n').length);
  //   return [pad(beforeValue, max), pad(afterValue, max)];
  // }

  // Helpers
  private isPrimitive(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      ['string', 'number', 'boolean'].includes(typeof value)
    );
  }

  private isComplex(value: any): boolean {
    return value && typeof value === 'object';
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      if (value.every((v) => this.isPrimitive(v))) {
        return `[ ${value.join(', ')} ]`; // 👈 Mantém em linha
      }
      return value.map((v) => JSON.stringify(v, null, 2)).join('\n');
    }
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }

  // formatValue(value: any): string {
  //   if (value === null || value === undefined) {
  //     return '';
  //   }

  //   // Caso array
  //   if (Array.isArray(value)) {
  //     if (value.length === 0) return '[]';

  //     // Caso array de valores primitivos, exibe em linha
  //     if (value.every((v) => typeof v !== 'object')) {
  //       //return `[ ${value.map(v => JSON.stringify(v)).join(', ')} ]`;
  //       return `[ ${value.join(', ')} ]`;
  //     }

  //     // Caso contrário, formata cada objeto do array
  //     return value.map((v) => `${JSON.stringify(v, null, 2)}`).join('\n\n');
  //   }

  //   //Caso seja um objeto
  //   if (typeof value === 'object') {
  //     return JSON.stringify(value, null, 2);
  //   }

  //   //Caso seja string, number, boolean
  //   return String(value);
  // }
}
