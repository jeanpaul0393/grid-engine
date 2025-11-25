import type { IGridConfig, IGridItem } from "../types";

export const snapToGrid = (
  item: IGridItem,
  rawX: number,
  rawY: number,
  containerWidth: number,
  config: IGridConfig
): { x: number; y: number } => {
  // real width and height
  const colWidth =
    (containerWidth - (config.cols - 1) * config.gap.col) / config.cols;

  const rowHeight = config.rowHeight;

  // absolute position item
  const absX = item.x * (colWidth + config.gap.col) + rawX;
  const absY = item.y * (rowHeight + config.gap.row) + rawY;

  // new cell grid
  return {
    x: Math.max(
      0,
      Math.min(
        config.cols - item.w,
        Math.round(absX / (colWidth + config.gap.col))
      )
    ),
    y: Math.max(
      0,
      Math.min(
        config.rows - item.h,
        Math.round(absY / (rowHeight + config.gap.row))
      )
    ),
  };
};

export function clampItemToGrid(
  item: IGridItem,
  config: IGridConfig
): IGridItem {
  let { x, y } = item;
  const { w, h } = item;

  // limit width
  if (x + w > config.cols) {
    x = config.cols - w;
  }

  // limit height
  if (y + h > config.rows) {
    y = config.rows - h;
  }

  // Limitar posición
  x = Math.max(0, x);
  y = Math.max(0, y);

  return { ...item, x, y, w, h };
}

export function resolveCollisions(
  items: IGridItem[],
  movedItem: IGridItem,
  movedId: string
): IGridItem[] {
  const layout = items.map((item) => (item.id === movedId ? movedItem : item));

  return layout;
}
