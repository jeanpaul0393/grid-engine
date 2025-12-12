// CMSEditor.tsx
import { Trash2, Copy, Settings } from "lucide-react";
import type { ISelectionMenuProps } from "./grid-engine/core/types";

export const MyCMSMenu = ({ item, dispatch }: ISelectionMenuProps) => {
  const handleDelete = () => {
    if (confirm("¿Eliminar elemento?")) {
      dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
    }
  };

  return (
    <div
      className="cms-context-menu-wrapper"
      style={{
        display: "flex",
        gap: 4,
        background: "white",
        padding: 4,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.2s",
      }}
    >
      <button onClick={handleDelete} className="btn-icon-danger">
        <Trash2 size={16} />
      </button>
      <button className="btn-icon">
        <Copy size={16} />
      </button>
      <button className="btn-icon">
        <Settings size={16} />
      </button>
    </div>
  );
};
