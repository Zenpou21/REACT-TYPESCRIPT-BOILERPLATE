import { Tab, Tabs } from "@heroui/react";
import Breadcrumb from "../../components/common/Breadcrumbs";
import ClientSettingsDashboard from "./ClientSettings/ClientSettingsDashboard";
import WarehouseSettingsDashboard from "./WarehouseSettings/WarehouseSettingsDashboard";
import ItemSettingsDashboard from "./ItemSettings/ItemSettingsDashboard";

export default function SettingsDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">
          <Breadcrumb title="Settings" items={[]} />
        </div>
      </div>
      <div className="mt-3.5">
        <Tabs
          aria-label="Tabs colors"
          color="primary"
          classNames={{ tab: "py-5 px-4 text-xs", base: "w-[100%]" }}
        >
          <Tab key="Client Settings" title="Client Settings">
            <ClientSettingsDashboard />
          </Tab>
          <Tab key="Warehouse Settings" title="Warehouse Settings">
            <WarehouseSettingsDashboard />
          </Tab>
            <Tab key="Item Settings" title="Item Settings">
              <ItemSettingsDashboard />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
