import { Button, Card, CardBody } from "@heroui/react";
import { MenuIcon } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const storedSidebarState =
    localStorage.getItem("isSidebarCollapsed") ?? "true";
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
    <Card
      disableAnimation
      className="rounded-none p-3  shadow-xl shadow-blue-gray-900/5"
    >
      <CardBody className="overflow-hidden">
        <div className="flex justify-between items-center">
          {!isMobile || storedSidebarState !== "false" ? (
            <div className="flex items-center gap-x-2">
              <Button
                disableAnimation
                isIconOnly
                variant="light"
                onPress={toggleSidebar}
                className="p-2 "
              >
                <MenuIcon size={24} />
              </Button>
              <div className="hidden md:block">
                {storedSidebarState == "true" && (
                  <div className="flex flex-col gap-x-1 cursor-pointer">
                    <div className="text-sm font-bold">
                      <span className="text-primary">LOGO </span>
                      <span className="text-primary/50">HERE</span>
                    </div>
                    <div className="text-[9px] font-medium">
                      CAPTION HERE
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5"></div>
          )}

          <div className="flex -z-0 items-center justify-center gap-x-10">
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
            {/* <Notification /> */}
            <NavbarUser />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
