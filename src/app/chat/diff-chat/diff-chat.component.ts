import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChatDiffRow } from '../../core/models/chat-diff-row.model';
import { CommonModule } from '@angular/common';
import { diffMock } from '../../core/mocks/diff-chat.mock';

@Component({
  selector: 'app-diff-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diff-chat.component.html',
  styleUrl: './diff-chat.component.scss',
})
export class DiffChatComponent implements OnInit {
  diffRows: ChatDiffRow[] = [];

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

  buildAlignedDiff(beforeData: any, afterData: any): ChatDiffRow[] {
    const customSortedBefore = this.sortObjectKeys(beforeData);
    const customSortedAfter = this.sortObjectKeys(afterData);

    const allKeys = new Set([
      ...Object.keys(customSortedBefore || {}),
      ...Object.keys(customSortedAfter || {}),
    ]);

    console.log('All keys for diff:', allKeys);

    // Aplica a ordem id, title, depois alfabetico
    const sortedKeys = this.sortKeys(Array.from(allKeys));
    const diffRows: ChatDiffRow[] = [];

    for (const key of sortedKeys) {
      const beforeValue = this.formatValue(customSortedBefore?.[key]);
      const afterValue = this.formatValue(customSortedAfter?.[key]);

      //if (beforeValue === undefined && afterValue === undefined) continue;

      // conta quantas linha cada lado ocupa
      const beforeLines = beforeValue.split('\n').length;
      const afterLines = afterValue.split('\n').length;
      const maxLines = Math.max(beforeLines, afterLines);

      console.log('beforeLines:', beforeLines, ' afterLines:', afterLines, ' maxLines:', maxLines);

      // define o status de cada lado
      let statusBefore: ChatDiffRow['statusLeft'] = 'normal';
      let statusAfter: ChatDiffRow['statusRight'] = 'normal';

      if (beforeValue === '' && afterValue !== '') {
        statusBefore = 'missing'; // nao existe no before
        statusAfter = 'modified';    // adicionado no after - seria 'added' para usar o verde
      } else if (afterValue === '' && beforeValue !== '') {
        statusBefore = 'modified';  // removido no after - seria 'removed' para usar o vermelho
        statusAfter = 'missing';  // nao existe no after
      } else if (beforeValue !== afterValue) {
        statusBefore = 'modified';
        statusAfter = 'modified';
      }

      // cria placeholders do mesmo número de linhas
      // const balancedBefore = beforeValue || '\n'.repeat(maxLines - 1);
      // const balancedAfter = afterValue || '\n'.repeat(maxLines - 1);

      const placeLines = (text: string, total: number) => {
        const current = text.split('\n').length;
        if (current < total) {
          const customPadding = '\n'.repeat(total - current);
          return text + customPadding;
        }

        return text;
      };

      const balancedBefore = placeLines(beforeValue, maxLines);
      const balancedAfter = placeLines(afterValue, maxLines);

      diffRows.push({
        key,
        leftValue: balancedBefore,
        rightValue: balancedAfter,
        statusLeft: statusBefore,
        statusRight: statusAfter,
      });
    }

    return diffRows;
  }


  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Caso array
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';

      // Caso array de valores primitivos, exibe em linha
      if (value.every((v) => typeof v !== 'object')) {
        //return `[ ${value.map(v => JSON.stringify(v)).join(', ')} ]`;
        return `[ ${value.join(', ')} ]`;
      }

      // Caso contrário, formata cada objeto do array
      return value
        .map((v) => `${JSON.stringify(v, null, 2)}`)
        .join('\n\n');
    }

    //Caso seja um objeto
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    //Caso seja string, number, boolean
    return String(value);
  }
}
