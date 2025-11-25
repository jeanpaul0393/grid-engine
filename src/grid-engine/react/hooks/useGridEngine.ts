import { useCallback } from "react";
import { useGridEngineContext } from "../context/GridEngineContext";
import type { IGridItem, IGridConfig } from "../../core/types";

export const useGridEngine = () => {
  const { state, dispatch } = useGridEngineContext();

  // -------------------------------------------------------
  // CONFIG
  // -------------------------------------------------------
  const setConfig = useCallback(
    (patch: Partial<IGridConfig>) => {
      dispatch({ type: "SET_CONFIG", payload: patch });
    },
    [dispatch]
  );

  // -------------------------------------------------------
  // ITEMS
  // -------------------------------------------------------
  const addItem = useCallback(
    (item: IGridItem) => {
      dispatch({ type: "ADD_ITEM", payload: item });
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    },
    [dispatch]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<IGridItem>) => {
      dispatch({ type: "UPDATE_ITEM", payload: { id, patch } });
    },
    [dispatch]
  );

  // -------------------------------------------------------
  // SELECT ITEM
  // -------------------------------------------------------
  const selectItem = useCallback(
    (id: string | null) => {
      dispatch({ type: "SELECT_ITEM", payload: { id } });
    },
    [dispatch]
  );

  // -------------------------------------------------------
  // DRAG
  // -------------------------------------------------------
  const startDrag = useCallback(
    (id: string) => {
      dispatch({ type: "START_DRAG", payload: { id } });
    },
    [dispatch]
  );

  const dragMove = useCallback(
    (x: number, y: number) => {
      dispatch({ type: "DRAG_MOVE", payload: { x, y } });
    },
    [dispatch]
  );

  const endDrag = useCallback(() => {
    dispatch({ type: "END_DRAG" });
  }, [dispatch]);

  // -------------------------------------------------------
  // RESIZE
  // -------------------------------------------------------
  const startResize = useCallback(
    (id: string) => {
      dispatch({ type: "START_RESIZE", payload: { id } });
    },
    [dispatch]
  );

  const resizeMove = useCallback(
    (w: number, h: number) => {
      dispatch({ type: "RESIZE_MOVE", payload: { w, h } });
    },
    [dispatch]
  );

  const endResize = useCallback(() => {
    dispatch({ type: "END_RESIZE" });
  }, [dispatch]);

  // -------------------------------------------------------
  // EDITING MODE
  // -------------------------------------------------------
  const setEditing = useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_EDITING", payload: value });
    },
    [dispatch]
  );

  // -------------------------------------------------------
  // OUTPUT DEL HOOK
  // -------------------------------------------------------
  return {
    // STATE
    state,
    items: state.items,
    config: state.config,
    dragPreview: state.dragPreview,
    selectedItemId: state.selectedItemId,
    draggingItemId: state.draggingItemId,
    resizingItemId: state.resizingItemId,
    isEditing: state.isEditing,

    // ACTIONS
    setConfig,

    addItem,
    removeItem,
    updateItem,

    selectItem,

    startDrag,
    dragMove,
    endDrag,

    startResize,
    resizeMove,
    endResize,

    setEditing,
  };
};
