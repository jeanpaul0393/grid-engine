import { useMemo } from "react";
import { useGridEngineContext } from "../context/GridEngineContext";
import { motion } from "framer-motion";

export const GridItemShadow = () => {
  const { state } = useGridEngineContext();
  const { dragPreview } = state;

  const { x, y, w, h } = dragPreview || {};

  const gridArea = useMemo(() => {
    if (
      x === undefined ||
      y === undefined ||
      w === undefined ||
      h === undefined
    ) {
      return "";
    }
    return `${y + 1} / ${x + 1} / ${y + h + 1} / ${x + w + 1}`;
  }, [x, y, w, h]);

  if (!dragPreview) {
    return null;
  }

  return (
    <motion.div
      className="grid-item-shadow"
      layout
      transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
      style={{
        gridArea: gridArea,
      }}
    />
  );
};
