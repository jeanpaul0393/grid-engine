import { useDrag } from "@use-gesture/react";
import { useGridEngineContext } from "../context/GridEngineContext";
import type { IGridItem } from "../../core/types";

type Direction = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface IProps {
  item: IGridItem;
  factorX: number;
  factorY: number;
  onResize: (delta: { mx: number; my: number; direction: Direction }) => void;
}

export const GridResizeHandles = ({
  item,
  factorX,
  factorY,
  onResize,
}: IProps) => {
  const { dispatch } = useGridEngineContext();

  const minW = item.minW ?? 1;
  const minH = item.minH ?? 1;
  const maxW = item.maxW ?? Infinity;
  const maxH = item.maxH ?? Infinity;

  const bindResize = useDrag(
    ({ event, args: [direction], active, movement: [mx, my], first, last }) => {
      event.stopPropagation();
      const dir = direction as Direction;

      if (first) {
        dispatch({ type: "START_RESIZE", payload: { id: item.id } });
      }

      if (active) {
        onResize({ mx, my, direction: dir });
      }

      const deltaCol = Math.round(mx / factorX);
      const deltaRow = Math.round(my / factorY);

      let newX = item.x;
      let newY = item.y;
      let newW = item.w;
      let newH = item.h;

      if (dir.includes("e")) {
        newW = Math.max(minW, Math.min(maxW, item.w + deltaCol));
      }
      if (dir.includes("s")) {
        newH = Math.max(minH, Math.min(maxH, item.h + deltaRow));
      }

      if (dir.includes("w")) {
        const rawNewW = item.w - deltaCol;
        newW = Math.max(minW, Math.min(maxW, rawNewW));
        const effectiveDelta = item.w - newW;
        newX = item.x + effectiveDelta;
      }

      if (dir.includes("n")) {
        const rawNewH = item.h - deltaRow;
        newH = Math.max(minH, Math.min(maxH, rawNewH));
        const effectiveDelta = item.h - newH;
        newY = item.y + effectiveDelta;
      }

      if (active) {
        dispatch({
          type: "RESIZE_MOVE",
          payload: { x: newX, y: newY, w: newW, h: newH },
        });
      }

      if (last) {
        dispatch({ type: "END_RESIZE" });
      }
    }
  );

  return (
    <div className="resize-handles-container">
      {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as Direction[]).map(
        (dir) => (
          <div
            key={dir}
            className={`resize-handle ${dir}`}
            {...bindResize(dir)}
          />
        )
      )}
    </div>
  );
};
