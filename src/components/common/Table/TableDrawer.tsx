import React from "react";

import { Spinner } from "@heroui/react";
import { DrawerComponent } from "../ModalComponent/DrawerComponent";

interface TableDrawerProps {
  title?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  isLoading: boolean;
  sizing?: "sm" | "md" | "lg" | "full";
  children?: React.ReactNode;
}

const sizingWidths: Record<"sm" | "md" | "lg" | "full", string> = {
  sm: "max-w-auto md:max-w-[50%] xl:max-w-[30%]",
  md: "max-w-auto xl:max-w-[50%]",
  lg: "max-w-auto xl:max-w-[90%] 2xl:max-w-[70%]",
  full: "w-full max-w-full",
};

const TableDrawer: React.FC<TableDrawerProps> = ({
  title,
  isOpen,
  onOpenChange,
  isLoading,
  sizing = "lg",
  children,
}) => {
  const drawerWidth = sizingWidths[sizing];

  return (
    <DrawerComponent
      title={title}
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(true)}
      width={drawerWidth}
    >
      {isLoading ? (
        <div className="h-[90vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="">
          <div className="gap-x-3 mt-2.5">{children}</div>
        </div>
      )}
    </DrawerComponent>
  );
};

export default TableDrawer;
