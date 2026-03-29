import { Injectable } from '@angular/core';
import { JsonLine } from '../models/json-line.model';

@Injectable({ providedIn: 'root' })
export class JsonDiffService {
  generateDiffLines(before: any, after: any, changes: any): { before: JsonLine[]; after: JsonLine[] } {
    const changedKeys = this.collectChangedKeys(changes);
    const beforeLines = this.parseJsonLines(before, changedKeys);
    const afterLines = this.parseJsonLines(after, changedKeys);

    const maxLength = Math.max(beforeLines.length, afterLines.length);
    const paddedBefore = this.padLines(beforeLines, maxLength);
    const paddedAfter = this.padLines(afterLines, maxLength);

    return { before: paddedBefore, after: paddedAfter };
  }

  private parseJsonLines(obj: any, changedKeys: Set<string>): JsonLine[] {
    if (!obj) return [{ content: 'null', isHighlighted: false, isPlaceholder: false }];

    return JSON.stringify(obj, null, 2).split('\n').map(line => {
      const match = line.match(/^\s*"([^"]+)":/);
      const key = match?.[1];
      const isHighlighted = !!(key && this.isKeyChanged(key, changedKeys));
      return { content: line, isHighlighted, isPlaceholder: false };
    });
  }

  private padLines(lines: JsonLine[], targetLength: number): JsonLine[] {
    const paddingCount = targetLength - lines.length;
    const padding = Array(paddingCount).fill(null).map(() => ({
      content: '',
      isHighlighted: false,
      isPlaceholder: true
    }));
    return [...lines, ...padding];
  }




  private extractArrayLines(lines: string[], startIndex: number): string[] {
  const arrayLines: string[] = [];
  let depth = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('[')) depth++;
    if (line.includes(']')) depth--;

    arrayLines.push(line);
    if (depth === 0) break;
  }

  return arrayLines;
}

  private collectChangedKeys(changes: any, path: string = ''): Set<string> {
    const keys = new Set<string>();
    for (const key in changes) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = changes[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nested = this.collectChangedKeys(value, fullPath);
        nested.forEach(k => keys.add(k));
      } else {
        keys.add(fullPath);
      }
    }
    return keys;
  }

  private isKeyChanged(lineKey: string, changedKeys: Set<string>): boolean {
    for (const fullKey of changedKeys) {
      const segments = fullKey.split('.');
      if (segments.includes(lineKey)) return true;
    }
    return false;
  }
}
