import type { ReactNode } from "react";
import type { TGridEngineAction } from "../react/context/gridEngineReducer";

export interface IGridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;

  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;

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

export interface ITool {
  label: string;
  defaultW: number;
  defaultH: number;
  component: React.ReactNode;
}

export type GridEventType =
  | "ITEM_MOVED"
  | "ITEM_RESIZED"
  | "ITEM_ADDED"
  | "ITEM_SELECTED"
  | "ITEM_DELETED";

export interface IGridEventPayload {
  type: GridEventType;
  item?: IGridItem;
  items: IGridItem[];
}

export interface ISelectionMenuProps {
  item: IGridItem;
  dispatch: React.Dispatch<TGridEngineAction>;
}
