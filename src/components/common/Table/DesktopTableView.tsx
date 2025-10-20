import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import NoData from "../../common/Table/NoData";

interface DesktopTableViewProps {
  headerColumns: any[];
  sortedItems: any[];
  renderCell: (item: any, columnKey: any) => React.ReactNode;
  bottomContent: React.ReactNode;
  topContent: React.ReactNode;
  isLoading?: boolean;
  selectedKeys?: any[];
  setSelectedKeys?: any;
  multipleSelection?: boolean;
  sortDescriptor: any;
  setSortDescriptor: (desc: any) => void;
}

const DesktopTableView: React.FC<DesktopTableViewProps> = ({
  headerColumns,
  sortedItems,
  renderCell,
  bottomContent,
  topContent,
  isLoading,
  selectedKeys,
  multipleSelection,
  sortDescriptor,
  setSortDescriptor,
  setSelectedKeys,
}) => {
  return (
    <div className="hidden sm:block">
      <Table
        aria-label="Employee Table"
        isHeaderSticky
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
        selectionMode={multipleSelection ? "multiple" : "none"}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className="rounded-md"
        classNames={{
          wrapper: "max-h-[500px] rounded-md ",
          th: "font-medium text-default-600",
        }}
        topContent={topContent}
        topContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn
              className={`${column.uid == "actions" && `text-center`}`}
              key={column.uid}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner size="sm" />}
          emptyContent={
            <div className="flex justify-center py-10">
              <NoData />
            </div>
          }
          items={sortedItems}
          isLoading={isLoading}
        >
          {(item) => (
            <TableRow key={item.id || item.reference_number}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopTableView;
