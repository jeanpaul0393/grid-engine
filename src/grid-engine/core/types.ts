import type { ReactNode } from "react";

export interface IGridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: ReactNode;
}

export type Layout = IGridItem[];

export interface IDragState {
  itemId: string | null;
  original: IGridItem | null;
  current: IGridItem | null;
}

export interface IGridConfig {
  cols: number;
  rows: number;
  rowHeight: number;
  colWidth?: number;
  gap: {
    row: number;
    col: number;
  };
}
