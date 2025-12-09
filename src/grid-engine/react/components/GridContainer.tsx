import { useGridEngine } from "../hooks/useGridEngine";
import { useEffect, useRef } from "react";
import { GridGuideOverlay } from "./GridGuideOverlay";
import { useGridEngineContext } from "../context/GridEngineContext";
import { GridItem } from "./GridItem";
import { GridItemShadow } from "./GridItemShadow";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { DragBridge } from "../../core/DragBridge";
import { GridCanvasResizer } from "./GridCanvasResizer";

export const GridContainer = () => {
  const { config } = useGridEngine();

  const { dispatch, state } = useGridEngineContext();

  const { gridId } = state;

  const refContainer = useRef<HTMLDivElement>(null);

  const { items, isGridSelected } = state;
  const { rows, cols, rowHeight, gap, colWidth } = config;

  useEffect(() => {
    if (!refContainer.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === refContainer.current) {
          dispatch({
            type: "SET_CONTAINER_WIDTH",
            payload: entry.contentRect.width,
          });
        }
      }
    });

    resizeObserver.observe(refContainer.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useOnClickOutside(refContainer, () => {
    if (isGridSelected) {
      dispatch({ type: "SET_GRID_SELECTION", payload: false });
    }
  });

  const handleDragEnter = (e: React.DragEvent) => {
    const payload = DragBridge.getPayload();

    if (payload && payload.targetGridId === gridId) {
      e.preventDefault();

      dispatch({
        type: "START_EXTERNAL_DRAG",
        payload: {
          w: payload.w,
          h: payload.h,
          component: payload.component,
        },
      });
      return;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    if (!refContainer.current) return;

    const rect = refContainer.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (colWidth || 0) / 2;
    const y =
      e.clientY - rect.top + refContainer.current.scrollTop - rowHeight / 2;

    dispatch({ type: "EXTERNAL_DRAG_MOVE", payload: { x, y } });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    dispatch({ type: "END_EXTERNAL_DRAG" });

    DragBridge.clear();
  };

  useEffect(() => {
    const handleDragStart = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetId = customEvent.detail?.targetGridId as string | undefined;

      if (targetId && targetId !== gridId) {
        return;
      }

      dispatch({ type: "SET_GRID_SELECTION", payload: true });
    };

    const handleDragEnd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetId = customEvent.detail?.targetGridId as string | undefined;

      if (targetId && targetId !== gridId) {
        return;
      }

      dispatch({ type: "CANCEL_EXTERNAL_DRAG" });
    };

    window.addEventListener("GRID_EXTERNAL_DRAG_START", handleDragStart);
    window.addEventListener("GRID_EXTERNAL_DRAG_END", handleDragEnd);

    return () => {
      window.removeEventListener("GRID_EXTERNAL_DRAG_START", handleDragStart);
      window.removeEventListener("GRID_EXTERNAL_DRAG_END", handleDragEnd);
    };
  }, [dispatch]);

  return (
    <div style={{ position: "relative" }} ref={refContainer}>
      <div
        className="grid-container"
        ref={refContainer}
        style={{
          height: rows * rowHeight + (rows - 1) * gap.row,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
          gap: `${gap.row}px ${gap.col}px`,
        }}
        id="grid-canvas-container"
        onMouseDownCapture={() => {
          if (!isGridSelected) {
            dispatch({ type: "SET_GRID_SELECTION", payload: true });
          }
        }}
        onClick={() => {
          console.log("pasó");
          dispatch({ type: "SELECT_ITEM", payload: { id: null } });
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <GridGuideOverlay />
        {items.map((gridItem) => {
          return (
            <GridItem key={gridItem.id} item={gridItem}>
              {gridItem.component}
            </GridItem>
          );
        })}

        <GridItemShadow />
        <GridCanvasResizer />
      </div>
    </div>
  );
};
