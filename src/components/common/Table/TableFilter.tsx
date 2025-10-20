import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import ModalComponent from "../ModalComponent/ModalComponent";

interface TableFilterProps {
  title?: any;
  filterValue: any;
  setFilterValue: any;
  visibleColumns: any;
  setColumns: (selected: any) => void;
  columns: any;
  RowsPerPage: any;
  onRowsPerPageChange: any;
  hideFilters?: any;
  children?: React.ReactNode;
  filterDown?: boolean;
  actions?: any;
}

const TableFilter: React.FC<TableFilterProps> = ({
  filterValue,
  setFilterValue,
  visibleColumns,
  setColumns,
  columns,
  RowsPerPage,
  onRowsPerPageChange,
  children = null,
  filterDown = false,
  actions,
}) => {
  const onSearchChange = (value?: string) => {
    setFilterValue(value || "");
  };

  const onClear = () => {
    setFilterValue("");
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div
        className={`flex flex-col ${
          filterDown ? `3xl:flex-row` : `xl:flex-row`
        } justify-between gap-4`}
      >
        <div className="flex gap-x-2">
          <div className="basis-11/12">
            <Input
              disableAnimation
              isClearable
              size="md"
              classNames={{ input: "text-xs" }}
              className={`w-full sm:w-96 max-w-full`}
              placeholder="Search"
              startContent={<Search size={16} />}
              value={filterValue || ""}
              onClear={onClear}
              onValueChange={onSearchChange}
            />
          </div>
          <div className="sm:hidden basis-1/12">
            <Button
              isIconOnly
              onPress={onOpen}
              className=" "
              disableAnimation
            >
              <SlidersHorizontal size={17} className="text-primary" />
            </Button>
          </div>
        </div>

        <div className="hidden sm:flex w-86 sm:w-full xl:w-auto !overflow-y-hidden xl:overflow-auto gap-x-2">
          <div>
            <Select
              disallowEmptySelection
              size="md"
              aria-label="select"
              onChange={onRowsPerPageChange}
              items={RowsPerPage}
              placeholder="Rows"
              className="w-28"
              classNames={{ value: "text-xs" }}
              disableSelectorIconRotation
            >
              {(rowsPerPage: any) => (
                <SelectItem key={rowsPerPage.value}>
                  {rowsPerPage.label}
                </SelectItem>
              )}
            </Select>
          </div>
          <div>
            <Dropdown aria-label="dropdown">
              <DropdownTrigger className="bg-default-100 shadow-sm">
                <Button
                  disableAnimation
                  className="text-default-500 text-xs rounded-md"
                  size="md"
                  endContent={
                    <ChevronDown className="text-default-500" size={15} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setColumns}
              >
                {columns.map((column: any) => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize font-body"
                  >
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {children}
          {actions &&
            actions.length > 0 &&
            actions.map((action: any, idx: any) => (
              <Button
                key={idx}
                color={action.color || "primary"}
                onPress={action.onClick}
                variant={action.variant}
                isDisabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
        </div>
      </div>

      <ModalComponent
        backdrop={"blur"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        showFooterButtons={false}
        hideCloseButton={true}
        isDismissable={true}
      >
        {/* Filters Section */}
        <div className="mt-7 mb-3 grid grid-cols-2 gap-3">
          <div>
            <Select
              disallowEmptySelection
              size="md"
              aria-label="select"
              onChange={onRowsPerPageChange}
              items={RowsPerPage}
              placeholder="Rows"
              classNames={{ value: "text-xs" }}
              disableSelectorIconRotation
            >
              {(rowsPerPage: any) => (
                <SelectItem key={rowsPerPage.value}>
                  {rowsPerPage.label}
                </SelectItem>
              )}
            </Select>
          </div>
          <div>
            <Dropdown aria-label="dropdown">
              <DropdownTrigger className="bg-default-100 shadow-sm">
                <Button
                  disableAnimation
                  className="text-default-500 text-xs rounded-md w-full flex justify-between"
                  size="md"
                  endContent={
                    <ChevronDown className="text-default-500" size={15} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setColumns}
              >
                {columns.map((column: any) => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize font-body"
                  >
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {children}
        </div>

        {actions && actions.length > 0 && (
          <div className=" border-t-1 pt-5 mb-4 grid grid-cols-2 gap-3">
            {actions.map((action: any, idx: number) => (
              <Button
                key={idx}
                color={action.color || "primary"}
                onPress={action.onClick}
                variant={action.variant}
                isDisabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </ModalComponent>
    </div>
  );
};

export default TableFilter;
