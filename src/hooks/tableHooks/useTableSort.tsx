import React from "react";

interface SortDescriptor {
    column: string;
    direction: "ascending" | "descending";
}

interface UseTableSortResult {
    items: any[];
    sortedItems: any[];
    pages: number;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    RowsPerPage: { label: string; value: string }[];
}

const useTableSort = (
    filteredItems: any[],
    page: number,
    rowsPerPage: number,
    sortDescriptor: SortDescriptor,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
): UseTableSortResult => {

    const RowsPerPage = [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
    ];

    const pages = Math.max(Math.ceil(filteredItems.length / rowsPerPage), 1);

    if (
        !Array.isArray(filteredItems) ||
        typeof page !== "number" ||
        typeof rowsPerPage !== "number"
    ) {
        return { items: [], sortedItems: [], pages: 1, onRowsPerPageChange: () => {}, RowsPerPage };
    }
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const items = filteredItems.slice(start, end);
    const sortedItems = items.sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        if (first < second)
            return sortDescriptor.direction === "descending" ? 1 : -1;
        if (first > second)
            return sortDescriptor.direction === "descending" ? -1 : 1;
        return 0;
    });

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },[]
    );

    return { items, sortedItems , pages , onRowsPerPageChange , RowsPerPage };
};

export default useTableSort;
