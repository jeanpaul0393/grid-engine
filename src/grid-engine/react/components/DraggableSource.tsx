import type { ReactNode } from "react";
import { DragBridge } from "../../core/DragBridge";

interface IProps {
  targetGridId: string;
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
}

export const DraggableSource = ({
  targetGridId,
  w,
  h,
  children,
  className,
}: IProps) => {
  return (
    <div
      className={className}
      draggable={true}
      onDragStart={(e) => {
        DragBridge.setPayload({
          targetGridId,
          w,
          h,
          component: children,
        });

        e.dataTransfer.setData(`application/x-grid-w${w}-h${h}`, "");
        e.dataTransfer.effectAllowed = "copy";

        e.dataTransfer.setDragImage(e.currentTarget, 10, 10);

        window.dispatchEvent(
          new CustomEvent("GRID_EXTERNAL_DRAG_START", {
            detail: { targetGridId },
          })
        );
      }}
      onDragEnd={() => {
        DragBridge.clear();

        window.dispatchEvent(
          new CustomEvent("GRID_EXTERNAL_DRAG_END", {
            detail: { targetGridId },
          })
        );
      }}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
};
