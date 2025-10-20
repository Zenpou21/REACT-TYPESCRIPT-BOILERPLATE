import React, { useCallback } from "react";
import { Chip } from "@heroui/react";
import RenderAction from "./RenderAction";

interface UseRenderCellProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleFunction: (e: any) => void;
  actions?: any;
}

type Clients = Record<string, any>;

export function useRenderCell({
  formData,
  setFormData,
  handleFunction,
  actions,
}: UseRenderCellProps) {
  const renderCell = useCallback(
    (item: Clients, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof Clients];

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={item.status == 1 ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {item.status == 1 ? "Active" : "Inactive"}
            </Chip>
          );
        case "long_name":
          return item.long_name || "--";

        case "actions":
          return (
            <RenderAction
              item={item}
              formData={formData}
              setFormData={setFormData}
              onFunction={handleFunction}
              actions={actions}
            />
          );

        default:
          return cellValue;
      }
    },
    [formData, setFormData, handleFunction]
  );

  return renderCell;
}
