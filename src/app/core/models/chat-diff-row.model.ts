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
