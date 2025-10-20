import React from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { EllipsisVertical, Eye, Pen, Trash2 } from "lucide-react";

interface RenderActionProps {
  item: any;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onFunction: (e: any) => void;
  actions?: any;
}

export default function RenderAction({
  item,
  formData,
  setFormData,
  onFunction,
  actions,
}: RenderActionProps) {
  const handleAction = (operation: "View" | "Edit" | "Delete") => {
    setFormData({ ...formData, id: item.id, operation });
    onFunction(operation);
  };
  return (
    <div className="flex items-center justify-center">
      <div className="block sm:hidden items-center gap-2 ml-1">
        <Dropdown
          classNames={{
            content: "!rounded-md py-0",
          }}
        >
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <EllipsisVertical className="text-primary sm:text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu className="font-body">
            {actions?.includes("View") && (
              <DropdownItem key="View" onPress={() => handleAction("View")}>
                View
              </DropdownItem>
            )}
            {actions?.includes("Edit") && (
              <DropdownItem key="Edit" onPress={() => handleAction("Edit")}>
                Edit
              </DropdownItem>
            )}
            {actions?.includes("Delete") && (
              <DropdownItem key="Delete" onPress={() => handleAction("Delete")}>
                Delete
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="hidden sm:flex items-center">

        {actions?.includes("View") && (
          <Button
            onPress={() => handleAction("View")}
            isIconOnly
            variant="light"
            className="text-info"
          >
            <Eye size={18} />
          </Button>
        )}
        {actions?.includes("Edit") && (
          <Button
            onPress={() => handleAction("Edit")}
            isIconOnly
          variant="light"
          className="text-warning"
        >
          <Pen size={18} />
        </Button>
        )}
        {actions?.includes("Delete") && (
          <Button
            onPress={() => handleAction("Delete")}
            isIconOnly
            variant="light"
            className="text-danger"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
