import { useGridEngine } from "../hooks/useGridEngine";

export const GridGuideOverlay = () => {
  const { state } = useGridEngine();
  const { config, isGridSelected } = state;
  const { cols, rows, rowHeight, gap } = config;

  return (
    <div
      className={`grid-guide-overlay ${isGridSelected ? "visible" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
        gap: `${gap.row}px ${gap.col}px`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="grid-cell" />
      ))}
    </div>
  );
};
