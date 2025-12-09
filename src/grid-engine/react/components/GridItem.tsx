import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { IGridItem } from "../../core/types";
import { useGridEngineContext } from "../context/GridEngineContext";
import { GridResizeHandles } from "./GridResizeHandles";

type IProps = {
  item: IGridItem;
  children?: React.ReactNode;
};

export const GridItem = ({ item, children }: IProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { state, dispatch } = useGridEngineContext();
  const {
    config,
    dragPreview,
    selectedItemId,
    resizingItemId,
    draggingItemId,
    isGridSelected,
  } = state;

  const isSelected = selectedItemId === item.id;

  const isResizing = resizingItemId === item.id;
  const isMoving = draggingItemId === item.id;

  const showHoverEffect = isHovered && isGridSelected;
  const showSelectionEffect = isSelected && isGridSelected;

  const { rowHeight, gap, colWidth } = config;

  const factorX = useMemo(() => {
    return (colWidth ?? 0) + gap.col;
  }, [colWidth, gap.col]);

  const factorY = useMemo(() => {
    return rowHeight + gap.row;
  }, [rowHeight, gap.row]);

  const minPxW = useMemo(
    () => (item.minW ?? 1) * factorX - gap.col,
    [item.minW, factorX, gap.col]
  );
  const maxPxW = useMemo(
    () => (item.maxW ?? Infinity) * factorX - gap.col,
    [item.maxW, factorX, gap.col]
  );

  const minPxH = useMemo(
    () => (item.minH ?? 1) * factorY - gap.row,
    [item.minH, factorY, gap.row]
  );
  const maxPxH = useMemo(
    () => (item.maxH ?? Infinity) * factorY - gap.row,
    [item.maxH, factorY, gap.row]
  );

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const visualW = useMotionValue<string | number>("100%");
  const visualH = useMotionValue<string | number>("100%");

  const controls = useAnimationControls();

  const { x, y, w, h } = item;

  const gridArea = useMemo(() => {
    return `${y + 1} / ${x + 1} / ${y + h + 1} / ${x + w + 1}`;
  }, [x, y, w, h]);

  const pendingSnap = useRef<{ dx: number; dy: number } | null>(null);

  useLayoutEffect(() => {
    if (!isResizing) {
      visualW.set("100%");
      visualH.set("100%");
      mx.set(0);
      my.set(0);
    }

    if (pendingSnap.current) {
      const { dx, dy } = pendingSnap.current;
      controls.set({ x: dx, y: dy });

      controls.start({
        x: 0,
        y: 0,
        transition: {
          type: "tween",
          duration: 0.15,
          ease: "easeInOut",
        },
      });

      pendingSnap.current = null;
    }
  }, [x, y, isResizing, w, h]);

  const handleResizeFluid = ({
    mx: dx,
    my: dy,
    direction,
  }: {
    mx: number;
    my: number;
    direction: string;
  }) => {
    // Tamaño base actual en pixeles
    const currentPxW = w * factorX - gap.col;
    const currentPxH = h * factorY - gap.row;

    // --- HORIZONTAL ---
    if (direction.includes("e")) {
      // Calculamos nuevo ancho deseado
      const targetW = currentPxW + dx;
      // Clampeamos entre min y max
      const constrainedW = Math.max(minPxW, Math.min(maxPxW, targetW));
      visualW.set(constrainedW);
    }

    if (direction.includes("w")) {
      // Izquierda:
      const targetW = currentPxW - dx;
      const constrainedW = Math.max(minPxW, Math.min(maxPxW, targetW));

      // Calculamos el DX efectivo (lo que realmente nos movimos después del clamp)
      // Si current era 100 y constrained es 100 (porque llegamos al max), el dx efectivo es 0.
      const effectiveDx = currentPxW - constrainedW;

      visualW.set(constrainedW);
      mx.set(effectiveDx); // Movemos X solo lo permitido
    }

    if (direction.includes("s")) {
      const targetH = currentPxH + dy;
      const constrainedH = Math.max(minPxH, Math.min(maxPxH, targetH));
      visualH.set(constrainedH);
    }

    if (direction.includes("n")) {
      const targetH = currentPxH - dy;
      const constrainedH = Math.max(minPxH, Math.min(maxPxH, targetH));

      const effectiveDy = currentPxH - constrainedH;

      visualH.set(constrainedH);
      my.set(effectiveDy);
    }
  };

  // -------------------------------------------------------------
  // GESTURES
  // -------------------------------------------------------------
  const bind = useGesture(
    {
      onDragStart: () => {
        dispatch({ type: "SELECT_ITEM", payload: { id: item.id } });
        dispatch({ type: "START_DRAG", payload: { id: item.id } });
      },

      onDrag: ({ movement: [dx, dy] }) => {
        mx.set(dx);
        my.set(dy);

        dispatch({
          type: "DRAG_MOVE",
          payload: { x: dx, y: dy },
        });
      },

      onDragEnd: ({ movement: [dx, dy] }) => {
        const prevX = item.x;
        const prevY = item.y;

        const newX = dragPreview?.x ?? prevX;
        const newY = dragPreview?.y ?? prevY;

        const gridShiftX = (newX - prevX) * factorX;
        const gridShiftY = (newY - prevY) * factorY;

        const compensationX = dx - gridShiftX;
        const compensationY = dy - gridShiftY;

        pendingSnap.current = { dx: compensationX, dy: compensationY };

        dispatch({ type: "END_DRAG" });
      },
    },
    {
      drag: {
        filterTaps: true,
        preventScroll: true,
      },
    }
  );

  return (
    // @ts-expect-error motion and gesture
    <motion.div
      className={`grid-item ${showHoverEffect && !isMoving ? "hovered" : ""} ${
        showSelectionEffect && !isMoving ? "selected" : ""
      }`}
      {...bind()}
      animate={controls}
      style={{
        x: mx,
        y: my,
        width: visualW,
        height: visualH,
        gridArea,
        zIndex: draggingItemId === item.id ? 20 : isSelected ? 10 : 2,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_ITEM", payload: { id: item.id } });
      }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {children}
        {isSelected && !draggingItemId && (
          <GridResizeHandles
            item={item}
            factorX={factorX}
            factorY={factorY}
            onResize={handleResizeFluid}
          />
        )}
      </div>
    </motion.div>
  );
};
