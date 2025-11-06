import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChatDiffRow, DiffObject, DiffValue } from '../../core/models/chat-diff-row.model';
import { CommonModule } from '@angular/common';
import { DiffChatService } from '../../core/services/diff-chat.service';

@Component({
  selector: 'app-diff-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diff-chat.component.html',
  styleUrl: './diff-chat.component.scss',
})
export class DiffChatComponent implements OnInit {
  diffRows: ChatDiffRow[] = [];

  constructor(private diffChatService: DiffChatService) {}

  /**
   *  - Lifecycle hook executado uma única vez, logo após a inicialização do componente.
   * @returns void
   */
  ngOnInit(): void {
    this.loadDataDiff();
  }

  /**
   *  - Chama o serviço para obter os dados de diff.
   *  - Atualiza a propriedade `diffRows` com os dados formatados e alinhados.
   * @returns void
   */
  loadDataDiff(): void {
    this.diffChatService.getDiffData().subscribe(({ before, after }) => {
      console.log('Dados obtidos do serviço - Before:', before, ' After:', after);
      this.diffRows = this.buildAlignedDiff(before, after);
    });
  }


   /**
   * - Exibe a comparação visual entre dois objetos:
   * - Realiza a ordenação das chaves em ambos os lados (`before` e `after`)
   * - Compara os valores campo a campo
   * - Define o status de modificação (normal, missing, modified)
   * - Mantém o alinhamento visual, preenchendo linhas vazias quando necessário
   *
   * @param beforeData - Objeto de referência "antes da modificação"
   * @param afterData - Objeto de referência "depois da modificação"
   * @returns ChatDiffRow[] - Lista de linhas de diff formatadas e alinhadas.
   */
  buildAlignedDiff(beforeData: DiffValue, afterData: DiffValue): ChatDiffRow[] {

    const customSortedBefore = this.diffChatService.sortObjectKeysRecursive(beforeData) as DiffObject;
    const customSortedAfter = this.diffChatService.sortObjectKeysRecursive(afterData) as DiffObject;

    const allKeys = new Set([
      ...Object.keys(customSortedBefore || {}),
      ...Object.keys(customSortedAfter || {}),
    ]);

    console.log('All keys for diff:', allKeys);

    // Aplica a ordem title, description, depois alfabetico
    const sortedKeys = this.diffChatService
      .sortKeys(Array.from(allKeys))
      .filter(key => key.toLowerCase() !== 'id'); // ignora o campo 'id'
    const diffRows: ChatDiffRow[] = [];

    for (const key of sortedKeys) {
      const beforeValue = this.formatValue(customSortedBefore?.[key]);
      const afterValue = this.formatValue(customSortedAfter?.[key]);

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


      // const placeLines = (text: string, total: number) => {
      //   const lines = text.split('\n');
      //   const missing = total - lines.length;

      //   // Adiciona linhas vazias visíveis (ex: espaço simples)
      //   if (missing > 0) {
      //     for (let i = 0; i < missing; i++) {
      //       lines.push(' '); // mantém alinhamento visual
      //     }
      //   }

      //   return lines.join('\n');
      // };

      const placeLines = (text: string, total: number) => {
      const lines = text.split('\n');
      const missing = total - lines.length;

      const result = lines.map(line => ({ text: line, isPadding: false }));

      // Adiciona linhas de padding visuais (com fundo cinza)
      if (missing > 0) {
        for (let i = 0; i < missing; i++) {
          result.push({ text: ' ', isPadding: true });
        }
      }

      return result;
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

  hasPadding(value: any): boolean {
    if (Array.isArray(value)) {
      return value.some(v => this.hasPadding(v));
    }

    if (value && typeof value === 'object') {
      if ('isPadding' in value && value.isPadding === true) {
        return true;
      }
      return Object.values(value).some(v => this.hasPadding(v));
    }

    return false;
  }

  /**
   * Converte diferentes tipos de valores (primitivos, objetos ou arrays)
   * em uma representação de string legível e formatada.
   * Usado para exibir os dados de forma organizada nas colunas do diff.
   *
   * @param value - Valor a ser formatado (pode ser primitivo, array ou objeto)
   * @returns string - Representação textual legível e formatada do valor.
   */
  formatValue(value: DiffValue): string {
    if (value === null || value === undefined) return '';

    // Array
    if (Array.isArray(value)) {
      // Array vazio
      if (value.length === 0) return '[]';

      // Array simples (string, number, boolean)
      if (value.every(v => typeof v !== 'object')) {
        return `[ ${value.join(', ')} ]`;
      }

      // Array de objetos — formatado multiline
      return '[\n' + value.map(v => '  ' + JSON.stringify(v, null, 2)).join(',\n') + '\n]';
    }

    // Objeto
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    // Valor primitivo
    return String(value);
  }
}
