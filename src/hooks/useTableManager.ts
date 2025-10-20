// hooks/useTableManager.ts
import { useState } from "react";
import useTableHeader from "./tableHooks/useTableHeader";
import useTableFilter from "./tableHooks/useTableFilter";
import useTableSort from "./tableHooks/useTableSort";

export default function useTableManager(
  rawData: any[],
  columns: any[],
  additionalFilters?: any,
  descending: boolean = false
)
 {

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "id",
    direction: descending ? "descending" : "ascending",
  });
  

  const { visibleColumns, headerColumns, setColumns } = useTableHeader(columns);
  const { filteredItems, filterValue, onSearchChange } = useTableFilter(
    rawData,
    setPage,
    additionalFilters
  );

  const {
    items,
    sortedItems,
    pages,
    RowsPerPage,
    onRowsPerPageChange,
  } = useTableSort(
    filteredItems,
    page,
    rowsPerPage,
    sortDescriptor,
    setPage,
    setRowsPerPage
  );

  return {
    // Pagination and Sorting
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortDescriptor,
    setSortDescriptor,
    pages,
    RowsPerPage,
    onRowsPerPageChange,

    // Column visibility
    visibleColumns,
    headerColumns,
    setColumns,

    // Filtering
    filteredItems,
    filterValue,
    onSearchChange,

    // Final Data
    items,
    sortedItems,
    descending
  };
}
