import React, { useMemo, useState, useEffect } from "react";
import DesktopTableView from "./DesktopTableView";
import TableFilter from "./TableFilter";
import CustomPagination from "./CustomPagination";
import MobileCardView from "./MobileCardView";
import FilterDropdown from "./FilterDropdown";

interface ResponsiveViewProps {
  dataList: any[];
  filterValue: any;
  onSearchChange: any;
  visibleColumns: any;
  setColumns: (cols: any[]) => void;
  columns: any[];
  RowsPerPage: any;
  onRowsPerPageChange: any;
  pages: number;
  page: number;
  setPage: (page: number) => void;
  items: any[];
  sortedItems: any[];
  isLoading: boolean;
  selectedKeys?: any[];
  setSelectedKeys?: (keys: any[]) => void;
  multipleSelection?: boolean;
  cardFields: any[];
  headerColumns: any[];
  renderCell: (item: any, columnKey: React.Key) => React.ReactNode;
  sortDescriptor: any;
  setSortDescriptor: (descriptor: any) => void;
  isMobile?: boolean;
  filters: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  filterState: Record<string, string>;
  setFilterState: any;
  actions?: { label: string; onClick: () => void; color?: string }[];
}

const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  dataList,
  filterValue,
  onSearchChange,
  visibleColumns,
  setColumns,
  columns,
  RowsPerPage,
  onRowsPerPageChange,
  pages,
  page,
  setPage,
  items,
  sortedItems,
  isLoading,
  selectedKeys,
  setSelectedKeys,
  multipleSelection = false,
  cardFields,
  headerColumns,
  renderCell,
  sortDescriptor,
  setSortDescriptor,
  isMobile,
  filters,
  filterState,
  setFilterState,
  actions,
}) => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const isMobileView = isMobile !== undefined ? isMobile : mobile;

  const topContent = useMemo(
    () => (
      <TableFilter
        title="Table Filters"
        filterValue={filterValue}
        setFilterValue={onSearchChange}
        visibleColumns={visibleColumns}
        setColumns={setColumns}
        columns={columns}
        RowsPerPage={RowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        actions={actions}
      >
        {filters.map(({ key, label, options }, index) => (
          <FilterDropdown
            key={index}
            label={label}
            options={options.map(({ label, value }) => ({
              name: label,
              uid: value,
            }))}
            selectedKey={filterState[key]}
            onSelectionChange={(val) =>
              setFilterState((prev: any) => ({ ...prev, [key]: val }))
            }
          />
        ))}
      </TableFilter>
    ),
    [
      filterValue,
      visibleColumns,
      onSearchChange,
      onRowsPerPageChange,
      filterState,
      filters,
    ]
  );

  const bottomContent = useMemo(
    () => (
      <CustomPagination
        data={dataList}
        pages={pages}
        page={page}
        setPage={setPage}
      />
    ),
    [items.length, page, pages, filterValue]
  );

  if (isMobileView) {
    return (
      <MobileCardView
        topContent={topContent}
        bottomContent={bottomContent}
        items={items}
        isLoading={isLoading}
        cardFields={cardFields}
        setSelectedKeys={setSelectedKeys}
        multipleSelection={multipleSelection}
        visibleColumnsSet={visibleColumns}
        renderCell={renderCell}
      />
    );
  }

  return (
    <DesktopTableView
      headerColumns={headerColumns}
      sortedItems={sortedItems}
      renderCell={renderCell}
      bottomContent={bottomContent}
      topContent={topContent}
      isLoading={isLoading}
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
      multipleSelection={multipleSelection}
      sortDescriptor={sortDescriptor}
      setSortDescriptor={setSortDescriptor}
    />
  );
};

export default ResponsiveView;
