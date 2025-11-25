import type { IGridConfig, IGridItem } from "./grid-engine/core/types";
import { GridContainer } from "./grid-engine/react/components/GridContainer";
import { GridEngineProvider } from "./grid-engine/react/context/GridEngineProvider";

const gridConfig: IGridConfig = {
  cols: 25,
  rows: 20,
  rowHeight: 30,
  gap: {
    col: 5,
    row: 5,
  },
};

const layout: IGridItem[] = [
  {
    id: "algo",
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    component: (
      <div
        style={{
          border: "solid 1px rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        item 1
      </div>
    ),
  },
  {
    id: "otraCosa",
    x: 22,
    y: 1,
    w: 3,
    h: 2,
    component: (
      <div
        style={{
          border: "solid 2px rgba(250,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        item 2
      </div>
    ),
  },
];

function App() {
  return (
    <div style={{ backgroundColor: "greenyellow" }}>
      <GridEngineProvider gridConfig={gridConfig} initialLayout={layout}>
        <GridContainer />
      </GridEngineProvider>
    </div>
  );
}

export default App;
