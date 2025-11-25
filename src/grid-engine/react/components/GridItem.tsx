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

  // Verificamos si este ítem está seleccionado
  const isSelected = selectedItemId === item.id;

  // Ocultamos el ítem real si se está redimensionando (para ver solo la sombra)
  // O puedes dejarlo visible, depende de tu gusto. Normalmente se oculta o se baja opacidad.
  const isResizing = resizingItemId === item.id;
  const isMoving = draggingItemId === item.id;

  const showHoverEffect = isHovered && isGridSelected;
  const showSelectionEffect = isSelected && isGridSelected;

  const { rowHeight, gap, colWidth } = config;

  // -------------------------------------------------------------
  // FACTORES EN PX PARA TRADUCIR COLUMNAS → PIXELES
  // -------------------------------------------------------------
  const factorX = useMemo(() => {
    return (colWidth ?? 0) + gap.col;
  }, [colWidth, gap.col]);

  const factorY = useMemo(() => {
    return rowHeight + gap.row;
  }, [rowHeight, gap.row]);

  // -------------------------------------------------------------
  // MOTION VALUES PARA MOVER EL ÍTEM LIBREMENTE DURANTE EL DRAG
  // -------------------------------------------------------------
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const visualW = useMotionValue<string | number>("100%");
  const visualH = useMotionValue<string | number>("100%");

  const controls = useAnimationControls();

  const { x, y, w, h } = item;

  // -------------------------------------------------------------
  // GRID AREA DEL ÍTEM SEGÚN SU POSICIÓN DEFINITIVA
  // -------------------------------------------------------------
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
    // 1. Calcular tamaño base en píxeles (si no lo hemos hecho aún en este gesto)
    // Pero como esto corre en cada frame, recalculamos la base:
    const currentW = w * factorX - gap.col;
    const currentH = h * factorY - gap.row;

    // 2. Aplicar lógica según dirección
    if (direction.includes("e")) {
      // Derecha: Solo aumenta ancho
      visualW.set(currentW + dx);
    }
    if (direction.includes("s")) {
      // Abajo: Solo aumenta alto
      visualH.set(currentH + dy);
    }
    if (direction.includes("w")) {
      // Izquierda: Aumenta ancho (inverso al drag) Y mueve X
      visualW.set(currentW - dx);
      mx.set(dx); // Movemos visualmente el ítem a la izquierda
    }
    if (direction.includes("n")) {
      // Arriba: Aumenta alto (inverso al drag) Y mueve Y
      visualH.set(currentH - dy);
      my.set(dy); // Movemos visualmente el ítem hacia arriba
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
        // Mover libremente el ítem durante el drag
        mx.set(dx);
        my.set(dy);

        // Pedir a la grilla que actualice la sombra
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
        // opacity: isResizing ? 0.5 : 1,
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
