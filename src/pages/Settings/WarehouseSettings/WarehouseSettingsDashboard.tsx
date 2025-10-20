import { Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import WarehouseSettingsTable from "./WarehouseSettingsTable";

const tabs = [
  { id: 1, title: "Storage Locations", api: "setting/storage-locations" },
  { id: 2, title: "Storage Units", api: "setting/storage-units" },
  { id: 3, title: "Storage Condition", api: "setting/storage-conditions" },
];

export default function WarehouseSettingsDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full flex-col mt-5">
      <Tabs
        placement={isMobile ? "top" : "start"}
        aria-label="Tabs colors"
        classNames={{
          tab: " lg:p-5 text-xs w-52",
          panel: "lg:px-5 w-full",
          base: isMobile ? "w-[100%]" : "w-auto",
        }}
      >
        {tabs.map(({ id, title, api }) => (
          <Tab key={id} title={title}>
            <WarehouseSettingsTable id={id} title={title} api={api} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
