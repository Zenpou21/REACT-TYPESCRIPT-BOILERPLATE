import { Card, CardBody, Spinner, Checkbox } from "@heroui/react";
import NoData from "./NoData";
import React from "react";

interface MobileCardViewProps {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  items: { [key: string]: any; id: string | number }[];
  isLoading?: boolean;
  cardFields: {
    name: string;
    uid: string;
  }[];
  setSelectedKeys?: (keys: (string | number)[]) => void;
  multipleSelection?: boolean;
  visibleColumnsSet: any;
  renderCell: (item: any, uid: string) => React.ReactNode;
}

export default function MobileCardView({
  topContent,
  bottomContent,
  items,
  isLoading,
  cardFields,
  setSelectedKeys,
  multipleSelection,
  visibleColumnsSet,
  renderCell,
}: MobileCardViewProps) {
  const visibleColumn = new Set(
    visibleColumnsSet === "all"
      ? cardFields.map((c) => c.uid)
      : visibleColumnsSet
  );

  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(
    new Set()
  );

  const toggleSelection = (id: string | number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (multipleSelection) {
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      } else {
        newSet.clear();
        newSet.add(id);
      }
      if (setSelectedKeys) {
        setSelectedKeys(Array.from(newSet));
      }
      return newSet;
    });
  };

  return (
    <div className="block sm:hidden">
      {topContent}

      <div className="overflow-y-auto max-h-[500px] mt-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Spinner size="sm" />
          </div>
        ) : items.length > 0 ? (
          <>
            {multipleSelection && (
              <Checkbox
                color="primary"
                className="border rounded-lg mb-0 px-5 ml-[0px] mt-[0px] shadow-sm"
                isSelected={
                  items.length > 0 &&
                  items.every((item) => selectedIds.has(item.id))
                }
                isIndeterminate={
                  items.length > 0 &&
                  items.some((item) => selectedIds.has(item.id)) &&
                  !items.every((item) => selectedIds.has(item.id))
                }
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  if (isChecked) {
                    const allIds = items.map((item) => item.id);
                    setSelectedIds(new Set(allIds));
                    setSelectedKeys?.(allIds);
                  } else {
                    setSelectedIds(new Set());
                    setSelectedKeys?.([]);
                  }
                }}
              >
                <span className="text-xs">Select All</span>
              </Checkbox>
            )}

            {items.map((item, index) => (
              <div key={index} className="my-2">
                <Card
                  disableAnimation
                  className="hover:bg-default-100 border border-default-100 dark:border-default-200 shadow-sm"
                >
                  <CardBody>
                    <div className="flex items-center w-full text-xs">
                      {(multipleSelection) && (
                        <div className="mr-2">
                          <Checkbox
                            isSelected={selectedIds.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                          />
                        </div>
                      )}
                      <div className="basis-11/12 font-light flex flex-col gap-y-1">
                        {cardFields.map((field) => {
                          if (!visibleColumn.has(field.uid)) return null;
                          if (field.uid === "actions") return null;
                          const formattedName = field.name
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                          return (
                            <div key={field.uid}>
                              {formattedName}:{" "}
                              {field.uid === "status"
                                ? renderCell(item, field.uid)
                                : item[field.uid]}
                            </div>
                          );
                        })}
                      </div>
                      <div className="basis-1/12">
                        {visibleColumn.has("actions") &&
                          renderCell(item, "actions")}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </>
        ) : (
          <div className="h-96 flex items-center justify-center my-4 p-4 rounded-lg">
            <NoData />
          </div>
        )}
      </div>

      {bottomContent}
    </div>
  );
}
