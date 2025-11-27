import {
  clampItemToGrid,
  resolveCollisions,
  snapToGrid,
} from "../../core/helpers/gridMath";
import type { IGridConfig, IGridItem } from "../../core/types";
import { v4 as uuidv4 } from "uuid";

export interface IGridEngineState {
  config: IGridConfig;
  items: IGridItem[];
  isEditing: boolean;
  containerWidth: number;

  // Drag & Drop
  draggingItemId: string | null;
  dragPreview: IGridItem | null;

  // Resize
  resizingItemId: string | null;

  // Hover / selección
  selectedItemId: string | null;
  isGridSelected: boolean;

  draggingExternal: { w: number; h: number; component: React.ReactNode } | null;
}

export type TGridEngineAction =
  | { type: "SET_CONFIG"; payload: Partial<IGridConfig> }
  | { type: "ADD_ITEM"; payload: IGridItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_ITEM"; payload: { id: string; patch: Partial<IGridItem> } }
  | { type: "SET_CONTAINER_WIDTH"; payload: number }

  // Drag
  | { type: "START_DRAG"; payload: { id: string } }
  | { type: "DRAG_MOVE"; payload: { x: number; y: number } }
  | { type: "END_DRAG" }

  // Resize
  | { type: "START_RESIZE"; payload: { id: string } }
  | {
      type: "RESIZE_MOVE";
      payload: { x: number; y: number; w: number; h: number };
    }
  | { type: "END_RESIZE" }
  | { type: "SET_GRID_SELECTION"; payload: boolean }

  // Select
  | { type: "SELECT_ITEM"; payload: { id: string | null } }

  // Modo edición
  | { type: "SET_EDITING"; payload: boolean }

  //External drag
  | {
      type: "START_EXTERNAL_DRAG";
      payload: { w: number; h: number; component: React.ReactNode };
    }
  | { type: "EXTERNAL_DRAG_MOVE"; payload: { x: number; y: number } } // x,y en pixeles relativos al container
  | { type: "END_EXTERNAL_DRAG" }
  | { type: "CANCEL_EXTERNAL_DRAG" };

export const initialGridEngineState: IGridEngineState = {
  config: {
    cols: 12,
    rows: 60,
    rowHeight: 30,
    gap: { row: 8, col: 8 },
  },
  containerWidth: 0,
  items: [],
  isEditing: true,
  draggingItemId: null,
  dragPreview: null,
  resizingItemId: null,
  selectedItemId: null,
  isGridSelected: false,
  draggingExternal: null,
};

export function gridEngineReducer(
  state: IGridEngineState,
  action: TGridEngineAction
): IGridEngineState {
  switch (action.type) {
    // ------------------------------------------
    // CONFIG
    // ------------------------------------------
    case "SET_CONFIG": {
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
    }

    case "SET_CONTAINER_WIDTH": {
      return {
        ...state,
        containerWidth: action.payload,
      };
    }

    // ------------------------------------------
    // ITEMS
    // ------------------------------------------
    case "ADD_ITEM": {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    }

    case "UPDATE_ITEM": {
      console.log(action.payload.patch);
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.patch }
            : item
        ),
      };
    }

    case "SET_GRID_SELECTION": {
      return {
        ...state,
        isGridSelected: action.payload,
        selectedItemId: action.payload ? state.selectedItemId : null,
      };
    }

    // ------------------------------------------
    // SELECT ITEM
    // ------------------------------------------
    case "SELECT_ITEM": {
      return {
        ...state,
        selectedItemId: action.payload.id,
        isGridSelected: true,
      };
    }

    // ------------------------------------------
    // DRAG & DROP
    // ------------------------------------------
    case "START_DRAG": {
      return {
        ...state,
        draggingItemId: action.payload.id,
        dragPreview: null,
      };
    }

    case "DRAG_MOVE": {
      if (!state.draggingItemId) return state;

      const item = state.items.find((i) => i.id === state.draggingItemId);
      if (!item) return state;

      const { x: newX, y: newY } = snapToGrid(
        item,
        action.payload.x,
        action.payload.y,
        state.containerWidth,
        state.config
      );

      const preview = clampItemToGrid(
        { ...item, x: newX, y: newY },
        state.config
      );

      return {
        ...state,
        dragPreview: preview,
      };
    }

    case "END_DRAG": {
      if (!state.draggingItemId || !state.dragPreview) {
        return {
          ...state,
          draggingItemId: null,
          dragPreview: null,
        };
      }

      const movedItem = state.dragPreview;

      // resolver colisiones
      const resolvedLayout = resolveCollisions(
        state.items,
        movedItem,
        state.draggingItemId
      );

      return {
        ...state,
        draggingItemId: null,
        dragPreview: null,
        items: resolvedLayout,
      };
    }

    // ------------------------------------------
    // RESIZE
    // ------------------------------------------
    case "START_RESIZE": {
      return {
        ...state,
        resizingItemId: action.payload.id,
      };
    }

    case "RESIZE_MOVE": {
      if (!state.resizingItemId) return state;

      const item = state.items.find((i) => i.id === state.resizingItemId);
      if (!item) return state;

      // Usamos el payload completo (x, y, w, h) calculados desde el componente
      // Clamp para asegurar que no se salga de los límites globales del grid
      const resizedPreview = clampItemToGrid(
        {
          ...item,
          x: action.payload.x,
          y: action.payload.y,
          w: action.payload.w,
          h: action.payload.h,
        },
        state.config
      );

      return {
        ...state,
        dragPreview: resizedPreview,
      };
    }

    case "END_RESIZE": {
      if (!state.resizingItemId || !state.dragPreview) {
        return {
          ...state,
          resizingItemId: null,
          dragPreview: null,
        };
      }

      const resizedItem = state.dragPreview;

      const newItems = state.items.map((i) =>
        i.id === state.resizingItemId ? resizedItem : i
      );

      return {
        ...state,
        resizingItemId: null,
        dragPreview: null,
        items: newItems,
      };
    }

    // ------------------------------------------
    // EDITING MODE
    // ------------------------------------------
    case "SET_EDITING": {
      return {
        ...state,
        isEditing: action.payload,
      };
    }

    // ------------------------------------------
    // EXTERNAL DRAG (Toolbar -> Grid)
    // ------------------------------------------
    case "START_EXTERNAL_DRAG": {
      return {
        ...state,
        draggingExternal: action.payload,
        selectedItemId: null,
        isGridSelected: true,
      };
    }

    case "EXTERNAL_DRAG_MOVE": {
      if (!state.draggingExternal) return state;

      const tempItem = {
        id: "temp",
        x: 0,
        y: 0,
        w: state.draggingExternal.w,
        h: state.draggingExternal.h,
        component: null,
      };

      const { x: newX, y: newY } = snapToGrid(
        tempItem,
        action.payload.x,
        action.payload.y,
        state.containerWidth,
        state.config
      );

      const preview = clampItemToGrid(
        { ...tempItem, x: newX, y: newY },
        state.config
      );

      return {
        ...state,
        dragPreview: preview,
      };
    }

    case "CANCEL_EXTERNAL_DRAG": {
      return {
        ...state,
        draggingExternal: null,
        dragPreview: null,
      };
    }

    case "END_EXTERNAL_DRAG": {
      if (!state.draggingExternal || !state.dragPreview) {
        return {
          ...state,
          draggingExternal: null,
          dragPreview: null,
        };
      }

      const newItem: IGridItem = {
        id: uuidv4(),
        x: state.dragPreview.x,
        y: state.dragPreview.y,
        w: state.draggingExternal.w,
        h: state.draggingExternal.h,
        component: state.draggingExternal.component,
      };

      const resolvedLayout = resolveCollisions(
        [...state.items, newItem],
        newItem,
        newItem.id
      );

      return {
        ...state,
        draggingExternal: null,
        dragPreview: null,
        items: resolvedLayout,
        selectedItemId: newItem.id,
      };
    }

    // ------------------------------------------
    // DEFAULT
    // ------------------------------------------
    default:
      return state;
  }
}
