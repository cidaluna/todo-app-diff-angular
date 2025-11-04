export interface ChatDiffRow {
  key: string;
  leftValue: any;
  rightValue: any;
  statusLeft: 'removed' | 'missing' | 'normal' | 'modified';
  statusRight: 'added' | 'missing' | 'normal' | 'modified';
}
