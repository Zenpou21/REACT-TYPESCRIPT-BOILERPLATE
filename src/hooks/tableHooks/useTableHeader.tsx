import { Selection } from "@heroui/react";
import React from "react";

const useTableHeader = (columns: any) => {
  const INITIAL_VISIBLE_COLUMNS = columns.filter((c: any) => c.init).map((c: any) => c.uid);
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  React.useEffect(() => {
    setVisibleColumns(new Set(columns.filter((c: any) => c.init).map((c: any) => c.uid)));
  }, [columns]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column: any) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const setColumns = (columns: any) => {
    setVisibleColumns(columns);
  };

  return { visibleColumns, headerColumns, setColumns };
};

export default useTableHeader;