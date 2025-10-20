import { useState } from "react";
import useTableManager from "../../hooks/useTableManager";
import { useDisclosure } from "@heroui/react";
import { useRenderCell } from "../../components/common/Table/RenderCell";
import ResponsiveView from "../../components/common/Table/ResponsiveView";
import WarehousesCrudForm from "./WarehouseCrudForm";
import ConfirmationModal from "../../components/common/ModalComponent/ConfirmationModal";
import useCrud from "../../hooks/useCRUD";
import { useToast } from "../../hooks/useToast";
import { mutate } from "swr";
import API_BASE_URL from "../../globals/apiConfig";

export const columns = [
  {
    name: "WAREHOUSE CODE",
    uid: "code",
    sortable: true,
    init: true,
  },
  {
    name: "NAME",
    uid: "short_name",
    sortable: true,
    init: true,
  },
  { name: "ADDRESS", uid: "address", sortable: true, init: true },
  { name: "STATUS", uid: "status", sortable: true, init: true },
  { name: "ACTION", uid: "actions", init: true },
];

export default function WarehousesTable(params: any) {
  const { POST, GET } = useCrud();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [filterState, setFilterState] = useState({
    account_type: "all",
  });

  const { data: data, isLoading: dataLoading } = GET(
    `warehouse/${params.status}`
  );
  console.log(data)
  const { data: currentData, isLoading: currentDataLoading } = GET(
    `warehouse/get/${formData?.id}`
  );

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onOpenChange: onOpenChangeDrawer,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const {
    page,
    setPage,
    sortDescriptor,
    setSortDescriptor,
    pages,
    RowsPerPage,
    onRowsPerPageChange,
    visibleColumns,
    headerColumns,
    setColumns,
    filterValue,
    onSearchChange,
    items,
    sortedItems,
  } = useTableManager(data, columns, filterState, false);
  const handleFunction = (e: any) => {
    if (e != "Delete") {
      onOpenDrawer();
    } else {
      onConfirmOpen();
    }
  };
  const renderCell = useRenderCell({
    formData,
    setFormData,
    handleFunction,
    actions: ["View", "Edit", "Delete"],
  });

  const handleDelete = async (id: string) => {
    try {
      setSubmitIsLoading(true);
      const res = await POST(`warehouse/delete/${id}`, formData);
      console.log("res", res)
      if (res.success) {
      }
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}warehouse/0`);
      mutate(`${API_BASE_URL}warehouse/1`);
      setSubmitIsLoading(false);
      onConfirmClose();
    }
  };

  return (
    <div className="mt-5">
      <ResponsiveView
        dataList={data}
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        visibleColumns={visibleColumns}
        setColumns={setColumns}
        columns={columns}
        RowsPerPage={RowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        pages={pages}
        page={page}
        setPage={setPage}
        items={items}
        sortedItems={sortedItems}
        isLoading={dataLoading}
        cardFields={columns}
        headerColumns={headerColumns}
        renderCell={renderCell}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        filters={[]}
        filterState={filterState}
        setFilterState={setFilterState}
      />

      <WarehousesCrudForm
        operation={formData?.operation}
        isOpen={isOpenDrawer}
        onOpenChange={onOpenChangeDrawer}
        isLoading={currentDataLoading}
        data={currentData || []}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={() => handleDelete(formData?.id)}
        isLoading={submitIsLoading}
        message="By confirming, you will delete this entry."
      />
    </div>
  );
}
