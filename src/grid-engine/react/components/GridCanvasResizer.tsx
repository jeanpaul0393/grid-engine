import type { IGridItem } from "../../core/types";

import { useDrag } from "@use-gesture/react";
import { useGridEngineContext } from "../context/GridEngineContext";
import { useMemo, useState } from "react";
import { GripHorizontal } from "lucide-react";

const getMinRequiredRows = (items: IGridItem[]): number => {
  if (items.length === 0) return 1;

  return Math.max(...items.map((i) => i.y + i.h));
};

export const GridCanvasResizer = () => {
  const { state, dispatch } = useGridEngineContext();
  const { config, items, isGridSelected } = state;
  const { rowHeight, gap, rows } = config;

  const [isResizing, setIsResizing] = useState(false);

  const minRowsLimit = useMemo(() => getMinRequiredRows(items), [items]);

  const bind = useDrag(
    ({ movement: [, dy], first, active, memo }) => {
      if (first) {
        setIsResizing(true);
        return rows;
      }

      if (!active) {
        setIsResizing(false);
        return;
      }

      const initialRows = memo as number;

      const rowUnit = rowHeight + gap.row;

      const deltaRows = Math.round(dy / rowUnit);

      const targetRows = initialRows + deltaRows;

      const newRows = Math.max(minRowsLimit, Math.max(1, targetRows));

      if (newRows !== rows) {
        dispatch({
          type: "SET_CONFIG",
          payload: { rows: newRows },
        });
      }

      return memo;
    },
    {
      pointer: { keys: false },
    }
  );

  if (!isGridSelected) return null;

  return (
    <div
      {...bind()}
      className={`grid-canvas-resizer ${isResizing ? "active" : ""}`}
    >
      <div className="resizer-handle-button">
        <GripHorizontal size={12} strokeWidth={2.5} />
      </div>
    </div>
  );
};
