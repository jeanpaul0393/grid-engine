import { useEffect, useReducer } from "react";
import type { IGridConfig, IGridItem } from "../../core/types";
import { gridEngineReducer, initialGridEngineState } from "./gridEngineReducer";
import { GridEngineContext } from "./GridEngineContext";
import "../../styles/styles.scss";

type IProps = {
  gridConfig: IGridConfig;
  initialLayout?: IGridItem[];
  children: React.ReactNode;
};

export const GridEngineProvider = ({
  children,
  initialLayout = [],
  gridConfig,
}: IProps) => {
  const [state, dispatch] = useReducer(gridEngineReducer, {
    ...initialGridEngineState,
    config: gridConfig,
    items: initialLayout,
  });

  const { config, containerWidth } = state;
  const { cols, gap } = config;

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
