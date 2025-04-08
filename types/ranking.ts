export interface Result {
  name: string;
  result: number;
  sub_result: number;
  feeling?: string;
  created_at?: string;
}

export interface SortedResult extends Result {
  id: string;
}

export const RANKING_PAGE_SIZE = 10;
