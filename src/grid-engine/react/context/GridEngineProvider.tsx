import { useEffect, useReducer, useRef } from "react";
import type {
  IGridConfig,
  IGridEventPayload,
  IGridItem,
  ISelectionMenuProps,
} from "../../core/types";
import {
  gridEngineReducer,
  initialGridEngineState,
  type TGridEngineAction,
} from "./gridEngineReducer";
import { GridEngineContext } from "./GridEngineContext";

type IProps = {
  id: string;
  gridConfig: IGridConfig;
  initialLayout?: IGridItem[];
  children: React.ReactNode;

  onEvent?: (event: IGridEventPayload) => void;
  selectionMenuComponent?: React.ComponentType<ISelectionMenuProps>;
};

export const GridEngineProvider = ({
  id,
  children,
  initialLayout = [],
  gridConfig,
  onEvent,
  selectionMenuComponent,
}: IProps) => {
  const [state, dispatchOriginal] = useReducer(gridEngineReducer, {
    ...initialGridEngineState,
    gridId: id,
    config: gridConfig,
    items: initialLayout,

    selectionMenuComponent: selectionMenuComponent,
  });

  const { config, containerWidth } = state;
  const { cols, gap } = config;

  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const dispatch = (action: TGridEngineAction) => {
    dispatchOriginal(action);

    if (onEventRef.current) {
      switch (action.type) {
        case "END_DRAG":
          onEventRef.current({ type: "ITEM_MOVED", items: state.items });
          break;
        case "END_RESIZE":
          onEventRef.current({ type: "ITEM_RESIZED", items: state.items });
          break;
        case "END_EXTERNAL_DRAG":
          onEventRef.current({ type: "ITEM_ADDED", items: state.items });
          break;
        case "SELECT_ITEM": {
          const selected = state.items.find(
            (item) => item.id === action.payload.id
          );

          onEventRef.current({
            type: "ITEM_SELECTED",
            item: selected,
            items: state.items,
          });
          break;
        }
        case "REMOVE_ITEM":
          onEventRef.current({ type: "ITEM_DELETED", items: state.items });
          break;
      }
    }
  };

  useEffect(() => {
    const colWidth = (containerWidth - gap.col * (cols - 1)) / cols;

    dispatch({ type: "SET_CONFIG", payload: { colWidth } });
  }, [containerWidth, gap.col, cols]);

  return (
    <GridEngineContext.Provider value={{ state, dispatch }}>
      {children}
    </GridEngineContext.Provider>
  );
};
