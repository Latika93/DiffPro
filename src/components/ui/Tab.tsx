import React from "react";

interface TabProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: string;
}

export const Tab: React.FC<TabProps> = ({
  children,
  active,
  onClick,
  icon,
}) => {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      {icon && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};
