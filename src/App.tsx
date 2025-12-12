import { v4 } from "uuid";
import { FrameRenderer } from "./FrameRenderer";
import { SidebarButton } from "./components/SidebarButton";
import { Image, SquareMinus, Type } from "lucide-react";
import { MyCMSMenu } from "./MyCMSMenu";
import {
  DraggableSource,
  GridContainer,
  GridEngineProvider,
  type IGridConfig,
  type IGridItem,
} from "./grid-engine";

const gridConfig: IGridConfig = {
  cols: 20,
  rows: 15,
  rowHeight: 30,
  gap: {
    col: 5,
    row: 5,
  },
};

const TextElement = () => (
  <div style={{ height: "100%", width: "100%" }}>
    Qui in Lorem ullamco est labore magna velit nostrud amet non officia
    reprehenderit.
  </div>
);
const ImageElement = () => (
  <div style={{ height: "100%", width: "100%" }}>
    <img
      src="https://picsum.photos/700/500"
      style={{ height: "100%", width: "100%" }}
      draggable={false}
    />
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
          w={8}
          h={2}
          minW={4}
          minH={1}
          className="sidebar-item"
          targetGridId={idGrid1}
          component={<TextElement />}
        >
          <SidebarButton icon={<Type size={18} />} text="Text" />
        </DraggableSource>

        <DraggableSource
          w={7}
          h={5}
          minW={4}
          minH={3}
          className="sidebar-item"
          targetGridId={idGrid1}
          component={<ImageElement />}
        >
          <SidebarButton
            icon={<Image size={18} style={{ backgroundColor: "#f2f2f2" }} />}
            text="Image"
          />
        </DraggableSource>

        <DraggableSource
          w={3}
          h={1}
          minW={2}
          className="sidebar-item"
          targetGridId={idGrid1}
          component={
            <button
              className="btn-modern"
              style={{ width: "100%", height: "100%" }}
            >
              Button
            </button>
          }
        >
          <SidebarButton icon={<SquareMinus size={18} />} text="Button" />
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
                selectionMenuComponent={MyCMSMenu}
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
                selectionMenuComponent={MyCMSMenu}
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
