import { v4 } from "uuid";
import { FrameRenderer } from "./FrameRenderer";
import type { IGridConfig, IGridItem } from "./grid-engine/core/types";
import { DraggableSource } from "./grid-engine/react/components/DraggableSource";
import { GridContainer } from "./grid-engine/react/components/GridContainer";
import { GridEngineProvider } from "./grid-engine/react/context/GridEngineProvider";

const gridConfig: IGridConfig = {
  cols: 20,
  rows: 15,
  rowHeight: 30,
  gap: {
    col: 5,
    row: 5,
  },
};

const MiGraficoVentas = () => (
  <div style={{ background: "pink", height: "100%", width: "100%" }}>
    Gráfico 1
  </div>
);
const TarjetaUsuario = ({ name }: { name: string }) => (
  <div style={{ background: "cyan", height: "100%", width: "100%" }}>
    User: {name}
  </div>
);

const layout: IGridItem[] = [
  {
    id: "algo",
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    minW: 2,
    maxW: 5,
    minH: 2,
    maxH: 3,
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
        max and min size
      </div>
    ),
  },
  {
    id: "otraCosa",
    x: 17,
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

const idGrid1 = v4();
const idGrid2 = v4();

function App() {
  return (
    <div className="layout">
      <aside>
        <DraggableSource
          w={4}
          h={4}
          className="sidebar-item"
          targetGridId={idGrid1}
        >
          <MiGraficoVentas />
        </DraggableSource>

        <DraggableSource
          w={2}
          h={1}
          className="sidebar-item"
          targetGridId={idGrid1}
        >
          <TarjetaUsuario name="Pepe" />
        </DraggableSource>

        <DraggableSource
          w={2}
          h={1}
          className="sidebar-item"
          targetGridId={idGrid1}
        >
          <button style={{ width: "100%", height: "100%" }}>
            Botón Simple
          </button>
        </DraggableSource>
      </aside>

      <main>
        <FrameRenderer>
          <div className="section-header"></div>
          <div className="section section-1">
            <div className="section-grid-container">
              <GridEngineProvider
                id={idGrid1}
                gridConfig={gridConfig}
                initialLayout={layout}
              >
                <GridContainer />
              </GridEngineProvider>
            </div>
          </div>
          <div className="section section-2">
            <div className="section-grid-container">
              <GridEngineProvider
                id={idGrid2}
                gridConfig={gridConfig}
                initialLayout={layout}
              >
                <GridContainer />
              </GridEngineProvider>
            </div>
          </div>
        </FrameRenderer>
      </main>
    </div>
  );
}

export default App;
