import { Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import ItemSettingsTable from "./ItemSettingsTable";

const tabs = [
  { id: 1, title: "Brand", api: "setting/item-brands" },
  { id: 2, title: "Category", api: "setting/item-categories" },
  { id: 3, title: "Unit of Measurement", api: "setting/item-uoms" },
  { id: 4, title: "Packaging Type", api: "setting/item-packaging-types" },
];

export default function ItemSettingsDashboard() {
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
            <ItemSettingsTable title={title} api={api} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
