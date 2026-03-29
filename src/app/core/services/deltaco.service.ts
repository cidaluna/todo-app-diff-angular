import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class DeltacoService {
public getDelta(before: Task[], after: Task[]): any[] {
    const deltas: any[] = [];

    for (let i = 0; i < before.length; i++) {
      const delta = this.compareObjects(before[i], after[i]);
      if (Object.keys(delta).length > 0) {
        deltas.push({ id: before[i].id, changes: delta });
      }
    }

    return deltas;
  }

  private compareObjects(obj1: any, obj2: any): any {
    const changes: any = {};

    for (const key of new Set([...Object.keys(obj1), ...Object.keys(obj2)])) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (this.isArrayOfObjects(val1)) {
          const arrayChanges = this.compareArrayOfObjects(val1, val2);
          if (arrayChanges.length > 0) {
            changes[key] = arrayChanges;
          }
        } else {
          if (!this.areArraysEqual(val1, val2)) {
            changes[key] = { before: val1, after: val2 };
          }
        }
      } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        const nestedChanges = this.compareObjects(val1, val2);
        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      } else if (val1 !== val2) {
        changes[key] = { before: val1, after: val2 };
      }
    }

    return changes;
  }

  private isArrayOfObjects(arr: any[]): boolean {
    return arr.every(item => typeof item === 'object' && item !== null);
  }

  private compareArrayOfObjects(arr1: any[], arr2: any[]): any[] {
    const changes: any[] = [];

    const length = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < length; i++) {
      const item1 = arr1[i];
      const item2 = arr2[i];

      if (!item1 || !item2) {
        changes.push({ index: i, before: item1, after: item2 });
      } else {
        const diff = this.compareObjects(item1, item2);
        if (Object.keys(diff).length > 0) {
          changes.push({ index: i, changes: diff });
        }
      }
    }

    return changes;
  }

  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}
