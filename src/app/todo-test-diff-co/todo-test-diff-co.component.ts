import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Task } from '../core/models/task.model';
import { DeltacoService } from '../core/services/deltaco.service';
import { CommonModule } from '@angular/common';
import { TASK_MOCK } from '../core/mocks/task.mock';
import { JsonLine } from '../core/models/json-line.model';
import { JsonDiffService } from '../core/services/json-diff.service';
import { JsonRendererLineComponent } from '../json-renderer-line/json-renderer-line.component';

@Component({
  selector: 'app-todo-test-diff-co',
  standalone: true,
  imports: [CommonModule, JsonRendererLineComponent],
  templateUrl: './todo-test-diff-co.component.html',
  styleUrls: ['./todo-test-diff-co.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TodoTestDiffCoComponent implements OnInit {
  responseBefore: Task[] | any =
    TASK_MOCK.find((t) => t.type === 'mockBefore')?.data || [];
  responseAfter: Task[] | any =
    TASK_MOCK.find((t) => t.type === 'mockAfter')?.data || [];

  beforeLines: JsonLine[] = [];
  afterLines: JsonLine[] = [];

  constructor(
    private readonly deltaService: DeltacoService,
  ) {}

  ngOnInit(): void {
    const delta = this.deltaService.getDelta(
      this.responseBefore,
      this.responseAfter
    );
    const changes = delta[0]?.changes || {};
    const result = this.generateJsonLines(this.responseBefore[0], this.responseAfter[0]);
    this.beforeLines = result.before;
    this.afterLines = result.after;
  }

  // Orquestrador da renderização linha a linha, percorre cada
  // propriedade do objeto original e modificado
  generateJsonLines(
    before: any,
    after: any
  ): { before: JsonLine[]; after: JsonLine[] } {
    const beforeLines: JsonLine[] = [];
    const afterLines: JsonLine[] = [];

    for (const key of Object.keys({ ...before, ...after })) {
      const valBefore = before?.[key];
      const valAfter = after?.[key];

      if (Array.isArray(valBefore) || Array.isArray(valAfter)) {
        const arrayDiff = this.generateArrayLines(
          valBefore ?? [],
          valAfter ?? [],
          key
        );
        beforeLines.push(...arrayDiff.before);
        afterLines.push(...arrayDiff.after);
      } else if (
        typeof valBefore === 'object' ||
        typeof valAfter === 'object'
      ) {
        const objectDiff = this.generateObjectLines(
          valBefore ?? {},
          valAfter ?? {},
          key
        );
        beforeLines.push(...objectDiff.before);
        afterLines.push(...objectDiff.after);
      } else {
        const isChanged =
          JSON.stringify(valBefore) !== JSON.stringify(valAfter);
        beforeLines.push({
          content: `"${key}": ${JSON.stringify(valBefore, null, 2)},`,
          isHighlighted: isChanged,
          isPlaceholder: false,
        });
        afterLines.push({
          content: `"${key}": ${JSON.stringify(valAfter, null, 2)},`,
          isHighlighted: isChanged,
          isPlaceholder: false,
        });
      }
    }

    return { before: beforeLines, after: afterLines };
  }

  generateObjectLines(
    beforeObj: any,
    afterObj: any,
    parentKey: string
  ): { before: JsonLine[]; after: JsonLine[] } {
    const beforeLines: JsonLine[] = [];
    const afterLines: JsonLine[] = [];

    // Adiciona a linha de abertura do objeto
    beforeLines.push({
      content: `"${parentKey}": {`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });
    afterLines.push({
      content: `"${parentKey}": {`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });

    // Itera sobre todas as chaves dos dois objetos
    for (const key of Object.keys({ ...beforeObj, ...afterObj })) {
      const beforeVal = beforeObj?.[key];
      const afterVal = afterObj?.[key];

      if (Array.isArray(beforeVal) || Array.isArray(afterVal)) {
        // Se o valor for um array, delega para o método `generateArrayLines`
        const arrayDiff = this.generateArrayLines(
          beforeVal ?? [],
          afterVal ?? [],
          key
        );
        beforeLines.push(...arrayDiff.before);
        afterLines.push(...arrayDiff.after);
      } else if (
        typeof beforeVal === 'object' ||
        typeof afterVal === 'object'
      ) {
        // Se o valor for um objeto, delega para o próprio `generateObjectLines`
        const objectDiff = this.generateObjectLines(
          beforeVal ?? {},
          afterVal ?? {},
          key
        );
        beforeLines.push(...objectDiff.before);
        afterLines.push(...objectDiff.after);
      } else {
        // Caso contrário, trata como valor simples
        const isChanged =
          JSON.stringify(beforeVal) !== JSON.stringify(afterVal);

        beforeLines.push({
          content: `  "${key}": ${JSON.stringify(beforeVal, null, 2)},`,
          isHighlighted: isChanged, // Destaca se houver diferença
          isPlaceholder: beforeVal === undefined, // Aplica cinza se for um placeholder
        });

        afterLines.push({
          content: `  "${key}": ${JSON.stringify(afterVal, null, 2)},`,
          isHighlighted: isChanged, // Destaca se houver diferença
          isPlaceholder: afterVal === undefined, // Aplica cinza se for um placeholder
        });
      }
    }

    // Adiciona a linha de fechamento do objeto
    beforeLines.push({
      content: `},`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });
    afterLines.push({
      content: `},`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });

    return { before: beforeLines, after: afterLines };
  }

  private generateArrayLines(
    beforeArr: any[],
    afterArr: any[],
    key: string
  ): { before: JsonLine[]; after: JsonLine[] } {
    const maxLength = Math.max(beforeArr.length, afterArr.length);
    const beforeLines: JsonLine[] = [];
    const afterLines: JsonLine[] = [];

    // Adiciona a linha de abertura do array
    beforeLines.push({
      content: `"${key}": [`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });
    afterLines.push({
      content: `"${key}": [`,
      isHighlighted: true, // A chave pai está destacada
      isPlaceholder: false,
    });

    // Itera sobre os valores do array
    for (let i = 0; i < maxLength; i++) {
      const beforeVal = beforeArr[i];
      const afterVal = afterArr[i];

      const isPlaceholderBefore = beforeVal === undefined;
      const isPlaceholderAfter = afterVal === undefined;

      beforeLines.push({
        content:
          beforeVal !== undefined
            ? `    ${JSON.stringify(beforeVal, null, 2)},`
            : '    null,',
        isHighlighted: !isPlaceholderBefore, // Herda o destaque da chave pai
        isPlaceholder: isPlaceholderBefore, // Aplica cinza se for um placeholder
      });

      afterLines.push({
        content:
          afterVal !== undefined
            ? `    ${JSON.stringify(afterVal, null, 2)},`
            : '    null,',
        isHighlighted: !isPlaceholderAfter,
        isPlaceholder: isPlaceholderAfter,
      });
    }

    // Adiciona a linha de fechamento do array
    beforeLines.push({
      content: `  ],`,
      isHighlighted: true,
      isPlaceholder: false,
    });
    afterLines.push({
      content: `  ],`,
      isHighlighted: true,
      isPlaceholder: false,
    });

    return { before: beforeLines, after: afterLines };
  }

  formatJson(obj: any): JsonLine[] {
    if (!obj) {
      return [
        {
          content: 'null',
          isHighlighted: false,
          isPlaceholder: true,
        },
      ];
    }

    return JSON.stringify(obj, null, 2)
      .split('\n')
      .map((line) => ({
        content: line,
        isHighlighted: false,
        isPlaceholder: false,
      }));
  }

  formatJsonWithHighlights(obj: any, changes: any): string {
    if (!obj) {
      return '<div class="json-line placeholder">null</div>';
    }

    const changedKeys = this.collectChangedKeys(changes);
    const lines = JSON.stringify(obj, null, 2).split('\n');

    return lines
    .map((line) => {
      const match = line.match(/^\s*"([^"]+)":/); // Captura a chave da linha
      const key = match?.[1];
      const isHighlighted = key && this.isKeyChanged(key, changedKeys); // Verifica se a chave foi alterada
      const cssClass = isHighlighted
        ? 'json-line highlight'
        : 'json-line'; // Define a classe CSS

      return `<div class="${cssClass}">${this.escapeHtml(line)}</div>`;
    })
    .join(''); // Junta todas as linhas em uma única string
  }

  isKeyChanged(lineKey: string, changedKeys: Set<string>): boolean {
    return Array.from(changedKeys).some((fullKey) =>
      fullKey.split('.').includes(lineKey)
    );
  }

  collectChangedKeys(changes: any, path: string = ''): Set<string> {
    const keys = new Set<string>();
    for (const key in changes) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = changes[key];
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nested = this.collectChangedKeys(value, fullPath);
        nested.forEach((k) => keys.add(k));
      } else {
        keys.add(fullPath);
      }
    }
    return keys;
  }

  // isKeyChanged(lineKey: string, changedKeys: Set<string>): boolean {
  //   for (const fullKey of changedKeys) {
  //     const segments = fullKey.split('.');
  //     if (segments.includes(lineKey)) return true;
  //   }
  //   return false;
  // }

  escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
