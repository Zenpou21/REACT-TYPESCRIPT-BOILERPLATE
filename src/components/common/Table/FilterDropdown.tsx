// FilterDropdown.tsx
import React from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

type FilterDropdownProps = {
  label: string;
  options: { name: string; uid: string }[];
  selectedKey: "all" | Iterable<string> | undefined;
  onSelectionChange: (keys: any) => void;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedKey,
  onSelectionChange,
}) => {
  return (
    <div>
      <Dropdown aria-label="Dropdown">
        <DropdownTrigger>
          <Button
            disableAnimation
            size="md"
            className="text-xs bg-[#f4f4f5] dark:bg-[#27272a] rounded-md md:w-auto text-default-500 w-full flex justify-between"
            variant="flat"
            endContent={<ChevronDown size={14} />}
          >
            {label}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          className="font-body"
          disallowEmptySelection
          closeOnSelect={false}
          selectedKeys={selectedKey as "all" | Iterable<string> | undefined}
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
        >
          {options.map((item) => (
            <DropdownItem key={item.uid}>{item.name}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default FilterDropdown;
