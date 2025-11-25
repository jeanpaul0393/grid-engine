import { createContext, useContext, type ActionDispatch } from "react";
import type { IGridEngineState, TGridEngineAction } from "./gridEngineReducer";

type IContextValue = {
  state: IGridEngineState;
  dispatch: ActionDispatch<[action: TGridEngineAction]>;
};

export const GridEngineContext = createContext<IContextValue>(
  {} as IContextValue
);

export const useGridEngineContext = () => {
  return useContext(GridEngineContext);
};
