import { useState } from "react";
import useDataFetcher from "../../../hooks/useDataFetcher";
import useTableManager from "../../../hooks/useTableManager";
import { useDisclosure } from "@heroui/react";
import { useRenderCell } from "../../../components/common/Table/RenderCell";
import ResponsiveView from "../../../components/common/Table/ResponsiveView";
import useCrud from "../../../hooks/useCRUD";
import { mutate } from "swr";
import API_BASE_URL from "../../../globals/apiConfig";
import ConfirmationModal from "../../../components/common/ModalComponent/ConfirmationModal";
import WarehouseSettingsLayersCrudForm from "./WarehouseSettingsLayersCrudForm";
import { useToast } from "../../../hooks/useToast";

export const columns = [
  {
    name: "UNIT CODE",
    uid: "code",
    sortable: true,
    init: true,
  },
  {
    name: "NUMBER OF LAYERS",
    uid: "layer_count_label",
    sortable: true,
    init: true,
  },
  {
    name: "STORAGE LOCATION",
    uid: "storage_location_short_name_label",
    sortable: true,
    init: true,
  },
  { name: "STATUS", uid: "status", init: true },
  { name: "ACTION", uid: "actions", init: true },
];
const filterOptions = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "1" },
      { label: "Inactive", value: "0" },
    ],
  },
];
export default function WarehouseSettingsLayersTable(params: any) {
  const { POST } = useCrud();
  const [formData, setFormData] = useState<any>(null);

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [filterState, setFilterState] = useState({ status: "all" });
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const { data: data, isLoading: dataLoading } = useDataFetcher(params.api);

  const detailApi = formData?.id
    ? params.api.replace("all", "get").replace(/\/\d+$/, "") +
      `/${formData.id}`
    : params.api;
  const { data: currentData, isLoading: currentDataLoading } =
    useDataFetcher(detailApi);

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
    isOpen: isChangeStatusOpen,
    onOpen: onChangeStatusOpen,
    onClose: onChangeStatusClose,
    onOpenChange: onChangeStatusOpenChange,
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

  const actions = ["Edit", "Delete"];

  const handleFunction = (action: string) => {
    if (action === "Edit" || action === "Add") {
      onOpenDrawer();
    } else if (action === "Delete") {
      onConfirmOpen();
    }
  };

  const renderCell = useRenderCell({
    formData,
    setFormData,
    handleFunction,
    actions,
  });

  const handleAddNew = () => {
    setFormData({ operation: "Add" });
    setSelectedKeys([]);
    onOpenChangeDrawer();
  };

  const handleSelectedKeys = (keys: any) => {
    const result =
      keys === "all"
        ? data.map((item: any) => String(item.id))
        : Array.from(keys).map(String);
    setSelectedKeys(result);
  };

  function getTableActions(onChangeStatus: () => void, onAddNew: () => void) {
    return [
      {
        label: "Change Status",
        onClick: onChangeStatus,
        color: "primary",
        variant: "bordered",
        disabled: selectedKeys.length === 0,
      },
      {
        label: "Add New",
        onClick: onAddNew,
        color: "primary",
      },
    ];
  }

  const handleChangeStatus = async () => {
    try {
      setSubmitIsLoading(true);
      await POST(`${params.initialApi}/change-status`, {
        selected_ids: JSON.stringify(selectedKeys),
      });
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}${params.api}`);
      setSubmitIsLoading(false);
      onChangeStatusClose();
    }
  };
  const handleDelete = async (id: string) => {
    try {
      setSubmitIsLoading(true);
      await POST(`${params.initialApi}/delete/${id}`, formData);
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}${params.api}`);
      setSubmitIsLoading(false);
      onConfirmClose();
    }
  };

  return (
    <>
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
        selectedKeys={selectedKeys}
        setSelectedKeys={handleSelectedKeys}
        multipleSelection
        cardFields={columns}
        headerColumns={headerColumns}
        renderCell={renderCell}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        filters={filterOptions}
        filterState={filterState}
        setFilterState={setFilterState}
        actions={getTableActions(onChangeStatusOpen, handleAddNew)}
      />

      <WarehouseSettingsLayersCrudForm
        operation={formData?.operation}
        isOpen={isOpenDrawer}
        onOpenChange={onOpenChangeDrawer}
        isLoading={currentDataLoading}
        title={"Unit"}
        tabId={params.id}
        api={`${params.api}`}
        initialApi={`${params.initialApi}`}
        data={currentData || []}
      />
      <ConfirmationModal
        isOpen={isChangeStatusOpen}
        onOpenChange={onChangeStatusOpenChange}
        onConfirm={handleChangeStatus}
        isLoading={submitIsLoading}
        message="By confirming, you will change the status of the selected entries."
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={() => handleDelete(formData?.id)}
        isLoading={submitIsLoading}
        message="By confirming, you will delete this entry."
      />
    </>
  );
}
