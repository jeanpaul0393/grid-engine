import type { ReactNode } from "react";
import { DragBridge } from "../../core/DragBridge";

interface IProps {
  targetGridId: string;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  children: ReactNode;
  className?: string;
  component: ReactNode;
}

export const DraggableSource = ({
  targetGridId,
  w,
  h,
  minW,
  maxW,
  minH,
  maxH,
  children,
  className,
  component,
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
          minW,
          maxW,
          minH,
          maxH,
          component,
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
