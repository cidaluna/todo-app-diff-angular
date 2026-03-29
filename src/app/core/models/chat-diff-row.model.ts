export interface ChatDiffRow {
  key: string;
  leftValue: any;
  rightValue: any;
  statusLeft: 'removed' | 'missing' | 'normal' | 'modified';
  statusRight: 'added' | 'missing' | 'normal' | 'modified';
}

export interface ChatDiffRow2 {
  key: string;
  leftValue?: any;
  rightValue?: any;
  statusLeft?: 'normal' | 'modified' | 'missing';
  statusRight?: 'normal' | 'modified' | 'missing';
  children?: ChatDiffRow2[];
}

// Representa um objeto genérico usado no diff (pode conter nested objetos ou arrays)
export type DiffPrimitive = string | number | boolean | null | undefined;
export type DiffValue = DiffPrimitive | DiffObject | DiffArray;
export interface DiffObject {
  [key: string]: DiffValue;
}
export interface DiffArray extends Array<DiffValue> {}

// Estrutura usada na função fillMissingFields
export interface FilledFields {
  before: DiffValue;
  after: DiffValue;
  missingSide?: 'left' | 'right';
}
