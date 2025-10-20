import React from "react";


const normalizeFilterValue = (filterValue: any) => {
  if (filterValue === undefined) {
    return []; // Exclude filtering if filterValue is undefined
  }
  if (filterValue instanceof Set) {
    return Array.from(filterValue);
  }
  if (Array.isArray(filterValue)) {
    return filterValue;
  }
  if (
    typeof filterValue === "object" &&
    filterValue !== null &&
    "value" in filterValue
  ) {
    return [filterValue.value];
  }
  return [filterValue];
};

const useTableFilter = (
    dataList: any[],
    setPage: React.Dispatch<React.SetStateAction<number>>,
    additionalFilters: { [key: string]: any } = {} // Default to empty object
  ) => {
    const [filterValue, setFilterValue] = React.useState("");
  
    if (!Array.isArray(dataList)) {
      return { filteredItems: [] };
    }
  
    const filteredItems = dataList.filter((data) => {
      const lowerCaseFilterValue = filterValue.toLowerCase();
  
      // Search across all fields of the object
      const matchesFilterValue =
        !filterValue ||
        Object.values(data).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseFilterValue)
        );
  
      // Check if additional filters are applied and not undefined
      const matchesAdditionalFilters = Object.entries(additionalFilters).every(
        ([key, filterValue]) => {
          if (filterValue === undefined) {
            return true; // Exclude this filter if filterValue is undefined
          }
          const value = data[key];
          const normalValue = normalizeFilterValue(filterValue);
          const normalizedFilterValue = normalValue.toString();
  
          if (normalizedFilterValue === "all") {
            return true;
          }
  
          if (Array.isArray(normalValue)) {
            return normalValue.includes(value?.toString());
          }
          return value?.toString() === normalizedFilterValue;
        }
      );
      
  
      return matchesFilterValue && matchesAdditionalFilters;
    });
  
    const onSearchChange = (search: any) => {
      setFilterValue(search);
      setPage(1);
    };
  
    const onClear = () => {
      setFilterValue("");
      setPage(1);
    };
  
    return { filteredItems, filterValue, onSearchChange, onClear };
  };
  
  export default useTableFilter;
 