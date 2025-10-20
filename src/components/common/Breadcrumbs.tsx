import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home } from "lucide-react"; // Import the home icon
type BreadcrumbItemType = {
  name: any;
  path?: string;
};

type BreadcrumbProps = {
  title?: string; // Add title as a separate prop
  items: BreadcrumbItemType[];
};

const Breadcrumb = ({ title, items }: BreadcrumbProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dropDownNavigate = (item: any) => {
    navigate(item?.children?.props?.to);
  };

  return (
    <div className="mb-5 pt-5 md:flex items-center flex-wrap gap-3 md:flex-row">
      <div className="flex flex-col  md:flex-row gap-y-2 md:gap-x-3 md:items-center">
        {title && <h1 className="text-lg font-bold -mt-0.5 md:mr-4">{title}</h1>}
        <nav className="flex items-center">
          <div className="flex items-center gap-2 text-xs md:text-small">
            <Breadcrumbs
              maxItems={isMobile ? 3 : items.length}
              itemsBeforeCollapse={2}
              itemsAfterCollapse={1}
              renderEllipsis={({ items, ellipsisIcon, separator }) =>
                isMobile ? (
                  <div className="flex items-center">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className="min-w-6 w-6 h-6 rounded-md"
                          size="sm"
                          variant="flat"
                        >
                          {ellipsisIcon}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Routes">
                        {items.map((item, dropDownMenuIndex) => (
                          <DropdownItem
                            className="font-body"
                            key={`dropdown-${dropDownMenuIndex}`}
                            textValue={
                              typeof item.children === "string"
                                ? item.children
                                : `item-${dropDownMenuIndex}`
                            }
                            onPress={() => dropDownNavigate(item)}
                          >
                            {item.children}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    {separator}
                  </div>
                ) : (
                  items.map((item, dropDownItemIndex) => (
                    <div
                      key={`ellipsis-item-${dropDownItemIndex}`}
                      className="flex items-center"
                    >
                      <BreadcrumbItem>{item.children}</BreadcrumbItem>
                      {separator}
                    </div>
                  ))
                )
              }
            >
              {items.map((item, index) => (
                <BreadcrumbItem key={`breadcrumb-item-${index}`}>
                  {item.path ? (
                    <Link to={item.path} className="text-xs md:text-small">
                      {item.path === "/dashboard" ? (
                        <Home size={16} className="inline-block -mt-1" />
                      ) : (
                        item.name
                      )}
                    </Link>
                  ) : (
                    <span className="text-primary text-xs md:text-small">
                      {item.name}
                    </span>
                  )}
                </BreadcrumbItem>
              ))}
            </Breadcrumbs>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;