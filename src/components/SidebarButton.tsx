import type { ReactNode } from "react";

type TProps = {
  icon: ReactNode;
  text: string;
};

export const SidebarButton = ({ icon, text }: TProps) => {
  return (
    <div className="sidebar-button">
      {icon}
      <div className="sidebar-button-text">{text}</div>
    </div>
  );
};
