import { Tab, Tabs } from "@heroui/react";
import ClientSettingsTable from "./ClientSettingsTable";
import { useEffect, useState } from "react";

const tabs = [
  { id: 1, title: "Account Type", api: "setting/account-types" },
  { id: 2, title: "Charging Scheme", api: "setting/charging-schemes" },
  { id: 3, title: "Payment Terms", api: "setting/payment-terms" },
  { id: 4, title: "Credit Terms", api: "setting/credit-terms" },
];

export default function ClientSettingsDashboard() {
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
            <ClientSettingsTable title={title} api={api} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
