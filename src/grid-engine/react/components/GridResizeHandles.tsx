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

      // ---------------------------------------------------------
      // 4) Lógica de Resize Libre con Snap
      // ---------------------------------------------------------

      // Convertimos el movimiento en píxeles (mx, my) a unidades de grilla (cols, rows)
      // Math.round es lo que hace el "Snap" magnético
      const deltaCol = Math.round(mx / factorX);
      const deltaRow = Math.round(my / factorY);

      let newX = item.x;
      let newY = item.y;
      let newW = item.w;
      let newH = item.h;

      // Aplicamos la lógica según la dirección
      if (dir.includes("e")) newW = Math.max(1, item.w + deltaCol);
      if (dir.includes("s")) newH = Math.max(1, item.h + deltaRow);

      if (dir.includes("w")) {
        // Al mover a la izquierda, reducimos x y aumentamos w
        // Pero no podemos permitir que w sea < 1
        const maxDelta = item.w - 1;
        const validDelta = Math.min(deltaCol, maxDelta); // Evitar inversión
        newX = item.x + validDelta;
        newW = item.w - validDelta;
      }

      if (dir.includes("n")) {
        const maxDelta = item.h - 1;
        const validDelta = Math.min(deltaRow, maxDelta);
        newY = item.y + validDelta;
        newH = item.h - validDelta;
      }

      // Despachamos el movimiento (Actualiza la sombra)
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
