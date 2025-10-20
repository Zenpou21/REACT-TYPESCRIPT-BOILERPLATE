import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import {
  CogIcon,
  FileCheck2,
  LayoutDashboard,
  Table2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useThemeContext";
import logo from '../../assets/images/logo.png';
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    children: [],
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: "Sample Table",
    href: "/sample-table",
    children: [],
    icon: <Table2 size={18} />,
  },
  
  {
    title: "Sample Drawer List",
    icon: <FileCheck2 size={18} />,
    children: [
      {
        title: "Item 1",
        href: "/sample-drawer-list/item-1",
        children: [],
      },
       {
        title: "Item 2",
        href: "/sample-drawer-list/item-2",
        children: [],
      },
    ],
  },
 
  {
    title: "Settings",
    href: "/settings",
    children: [],
    icon: <CogIcon size={18} />,
  },
];

const renderSidebarItems = (
  items: any,
  location: any,
  isCollapsed: boolean,
  navigate: any,
  toggleSidebar: () => void
) => {
  return !isCollapsed ? (
    items.map((item: any, index: any) => {
      const isActive =
        location.pathname.startsWith(item.href) ||
        item.children?.some((child: any) =>
          location.pathname.startsWith(child.href)
        );
      return item.children && item.children.length > 0 ? (
        <div key={`accordion-${index}`}>
          <Accordion
            key={`accordion-${index}`}
            isCompact
            itemClasses={{
              trigger: `font-body h-8 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] w-full px-1 rounded-md my-0 pl-2 ${
                isActive ? "text-primary" : ""
              }`,
            }}
            showDivider={false}
          >
            <AccordionItem
              classNames={{
                title: `font-body text-[13px] ${
                  isActive && `text-primary`
                } -ml-1`,
                startContent: "pl-2",
                content: "ml-4 pl-0.5 !overflow-x-hidden",
                indicator: `${isActive && `text-primary`}`,
              }}
              key={`accordion-item-${item.title}`}
              aria-label={item.title}
              title={item.title}
              startContent={item.icon}
            >
              <div className="!-mr-1.5 ">
                {renderSidebarItems(
                  item.children,
                  location,
                  isCollapsed,
                  navigate,
                  toggleSidebar
                )}
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        <Button
          disableAnimation
          key={`button-${index}`}
          variant="light"
          size="sm"
          className={`font-body data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] text-[13px] w-[93.5%] rounded-md flex justify-start px-3 mx-2 my-1 pl-4 ${
            isActive ? "text-primary" : ""
          }`}
          onPress={() => {
            navigate(item.href);
            if (window.innerWidth < 1280) toggleSidebar();
          }}
          startContent={item.icon}
        >
          {item.title}
        </Button>
      );
    })
  ) : (
    <div className="ml-3">
      {items.map((item: any, index: any) => {
        const isActive =
          location.pathname === item.href ||
          item.children.some((child: any) => location.pathname === child.href);

        return item.children && item.children.length > 0 ? (
          <Tooltip
            key={`tooltip-${index}`}
            content={
              <div>
                {item.children.map((child: any, childIndex: number) => (
                  <div key={`child-${childIndex}`} className="py-1 w-full">
                    <Link
                      to={child.href}
                      onClick={() => {
                        if (window.innerWidth < 1280) toggleSidebar();
                      }}
                    >
                      <span>{child.title}</span>
                    </Link>
                  </div>
                ))}
              </div>
            }
            placement={`right`}
            classNames={{
              content: "font-body p-2 cursor-pointer px-4",
            }}
          >
            <Button
              disableAnimation
              isIconOnly
              key={`icon-button-${index}`}
              variant="light"
              size="sm"
              className={`"data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] text-sm w-10 flex justify-center ml-[1px] my-1 ${
                isActive ? "text-primary" : ""
              }`}
              startContent={item.icon}
            />
          </Tooltip>
        ) : (
          <Tooltip
            key={`tooltip-${index}`}
            content={
              <div className="w-fit">
                <Link
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1280) toggleSidebar();
                  }}
                >
                  <span>{item.title}</span>
                </Link>
              </div>
            }
            placement={`right`}
            classNames={{
              content: "font-body p-2 cursor-pointer px-4",
            }}
          >
            <Button
              disableAnimation
              isIconOnly
              key={`icon-button-${index}`}
              variant="light"
              size="sm"
              className={`data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] text-sm w-10 flex justify-center ml-[1px]  my-1 px-0 ${
                isActive ? "text-primary" : ""
              }`}
              onPress={() => {
                navigate(item.href);
                if (window.innerWidth < 1280) toggleSidebar();
              }}
              startContent={item.icon}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}
export function Sidebar({ isCollapsed = true, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`flex ${
        isCollapsed ? "xl:w-full xl:max-w-[5.5rem]" : `xl:w-full max-w-[17rem]`
      }`}
    >
      <Card
        disableAnimation
        className={`rounded-none h-full z-50 absolute xl:static ${
          isCollapsed
            ? "w-0 xl:w-full xl:max-w-[5.5rem]"
            : `w-full sm:w-80 py-3`
        } shadow-xl shadow-blue-gray-900/5`}
      >
        <CardBody className="!overflow-hidden relative mt-4 md:mt-0">
          <div className="absolute right-3 top-3 block xl:hidden">
            <Button
              onPress={toggleSidebar}
              size="sm"
              isIconOnly
              variant="light"
            >
              <X size={17} />
            </Button>
          </div>
          <div className="pt-[2px] ml-1.5">
            {!isCollapsed ? (
              <div className="text-md pl-2 flex px-2 gap-x-1 items-center font-header">
                <div> <img className="h-8" src={logo} /></div>
                <div className="flex flex-col gap-x-1 cursor-pointer">
                  <div className="text-sm font-bold">
                    <span className="text-primary">LOGO </span>
                    <span className="text-primary/50">HERE</span>
                  </div>
                  <div className="text-[9px]">CAPTION HERE</div>
                </div>
              </div>
            ) : (
              <div className="pt-[13px] pb-[1px] ml-2">
                <img className="h-8" src={logo} />
              </div>
            )}
          </div>
          <div className="mt-7">
            {renderSidebarItems(
              sidebarItems,
              location,
              isCollapsed,
              navigate,
              toggleSidebar
            )}
          </div>

          <div className="block md:hidden absolute bottom-2 ml-5 text-xs text-gray-500">
            <Select
              disallowEmptySelection
              defaultSelectedKeys={theme === "dark" ? ["Dark"] : ["Light"]}
              onChange={toggleTheme}
              variant="bordered"
              size="sm"
              classNames={{
                base: "w-40",
                popoverContent: "rounded-md",
                label: "text-xs",
                value: "text-xs",
                listbox: "font-header",
              }}
              label="Theme"
            >
              <SelectItem key="Light">Light</SelectItem>
              <SelectItem key="Dark">Dark</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
