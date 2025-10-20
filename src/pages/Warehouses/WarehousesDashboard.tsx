import { Tab, Tabs, useDisclosure } from "@heroui/react";
import Breadcrumb from "../../components/common/Breadcrumbs";
import { Download, Plus, Upload } from "lucide-react";
import { ActionButton } from "../../components/common/ActionButton";
import BulkUploadModal from "../../components/common/ModalComponent/BulkUploadModal";
import WarehousesTable from "./WarehousesTable";
import WarehousesCrudForm from "./WarehouseCrudForm";

const warehouseStatus = [
  { id: 1, name: "Active" },
  { id: 0, name: "Inactive" },
];

const actions: {
  label: string;
  icon: React.ReactNode;
  variant: any;
  color?: any;
  onPressKey: string;
}[] = [
  {
    label: "Download CSV Template",
    icon: <Download size={17} />,
    variant: "bordered",
    color: "default",
    onPressKey: "downloadCSV",
  },
  {
    label: "Bulk Upload",
    icon: <Upload size={17} />,
    variant: "solid",
    color: "primary",
    onPressKey: "onBulkUploadOpen",
  },
  {
    label: "Add Warehouse",
    icon: <Plus size={17} />,
    variant: "solid",
    color: "primary",
    onPressKey: "onAddWarehouseOpen",
  },
];

export default function WarehousesDashboard() {
  const {
    isOpen: isBulkUploadOpen,
    onOpen: onBulkUploadOpen,
    onOpenChange: onBulkUploadChange,
  } = useDisclosure();

  const {
    isOpen: isAddWarehouseOpen,
    onOpen: onAddWarehouseOpen,
    onClose: onAddWarehouseClose,
    onOpenChange: onAddWarehouseChange,
  } = useDisclosure();


  const actionHandlers: Record<string, () => void> = {
    onBulkUploadOpen,
    onAddWarehouseOpen,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="basis-6/12">
          <Breadcrumb title="Warehouses" items={[]} />
        </div>
        <div className="basis-6/12 flex justify-end gap-x-3">
          {actions.map(({ label, icon, variant, color, onPressKey }, idx) => (
            <ActionButton
              key={label + idx}
              label={label}
              icon={icon}
              variant={variant}
              color={color}
              onPress={actionHandlers[onPressKey]}
            />
          ))}
        </div>
      </div>
      <div className="pt-3">
        <Tabs
          aria-label="Tabs colors"
          color="primary"
          classNames={{ tab: "py-5 px-4 text-xs" }}
        >
          {warehouseStatus.map((item) => (
            <Tab key={item.id} title={item.name}>
              <WarehousesTable status={item.id} />
            </Tab>
          ))}
        </Tabs>
      </div>

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onOpenChange={onBulkUploadChange}
        apiUrl="warehouse/bulk"
        mutateUrl={["warehouse/0", "warehouse/1"]}
      />

      <WarehousesCrudForm
        operation="Add"
        isOpen={isAddWarehouseOpen}
        onOpenChange={onAddWarehouseChange}
        onClose={onAddWarehouseClose}
      />
    </div>
  );
}
