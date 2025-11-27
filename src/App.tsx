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

function App() {
  return (
    <div className="layout">
      {/* SIDEBAR GENÉRICO */}
      <aside>
        {/* Ítem 1: Ocupa 4x4 */}
        <DraggableSource w={4} h={4} className="sidebar-item">
          <MiGraficoVentas />
        </DraggableSource>

        {/* Ítem 2: Ocupa 2x1 */}
        <DraggableSource w={2} h={1} className="sidebar-item">
          <TarjetaUsuario name="Pepe" />
        </DraggableSource>

        {/* Ítem 3: Algo inline */}
        <DraggableSource w={2} h={1} className="sidebar-item">
          <button style={{ width: "100%", height: "100%" }}>
            Botón Simple
          </button>
        </DraggableSource>
      </aside>

      {/* GRILLA GENÉRICA */}
      <main>
        <FrameRenderer>
          <div className="section-header"></div>
          <div className="section">
            <div className="section-grid-container">
              <GridEngineProvider
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
