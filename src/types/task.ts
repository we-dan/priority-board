export type ColumnId = 'now' | 'next' | 'later';

export interface Task {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  columnId: ColumnId;
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'now', title: 'Nu' },
  { id: 'next', title: 'Nästa' },
  { id: 'later', title: 'Senare' },
];
