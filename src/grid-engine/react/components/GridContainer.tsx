import { useGridEngine } from "../hooks/useGridEngine";
import { useEffect, useRef } from "react";
import { GridGuideOverlay } from "./GridGuideOverlay";
import { useGridEngineContext } from "../context/GridEngineContext";
import { GridItem } from "./GridItem";
import { GridItemShadow } from "./GridItemShadow";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export const GridContainer = () => {
  const { config } = useGridEngine();

  const { dispatch, state } = useGridEngineContext();

  const refContainer = useRef<HTMLDivElement>(null);

  const { items, isGridSelected } = state;
  const { rows, cols, rowHeight, gap } = config;

  useEffect(() => {
    if (!refContainer.current) return;
    dispatch({
      type: "SET_CONTAINER_WIDTH",
      payload: refContainer.current.offsetWidth,
    });
  }, []);

  useOnClickOutside(refContainer, () => {
    if (isGridSelected) {
      dispatch({ type: "SET_GRID_SELECTION", payload: false });
    }
  });

  return (
    <div style={{ position: "relative" }} ref={refContainer}>
      <div
        className="grid-container"
        ref={refContainer}
        style={{
          height: rows * rowHeight + (rows - 1) * gap.row,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
          gap: `${gap.row}px ${gap.col}px`,
        }}
        onMouseDownCapture={() => {
          if (!isGridSelected) {
            dispatch({ type: "SET_GRID_SELECTION", payload: true });
          }
        }}
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
      </div>
    </div>
  );
};
