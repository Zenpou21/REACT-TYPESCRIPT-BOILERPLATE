import { useState } from "react";
import useDataFetcher from "../../../hooks/useDataFetcher";
import useTableManager from "../../../hooks/useTableManager";
import { Button, useDisclosure } from "@heroui/react";
import { useRenderCell } from "../../../components/common/Table/RenderCell";
import ResponsiveView from "../../../components/common/Table/ResponsiveView";
import useCrud from "../../../hooks/useCRUD";
import { mutate } from "swr";
import API_BASE_URL from "../../../globals/apiConfig";
import ConfirmationModal from "../../../components/common/ModalComponent/ConfirmationModal";
import { MoveLeft } from "lucide-react";
import WarehouseSettingsLayersTable from "./WarehouseSettingsLayersTable";
import WarehouseSettingsCrudForm from "./WarehouseSettingsCrudForm";
import { useToast } from "../../../hooks/useToast";

export const InitialColumns = [
  {
    name: "CODE",
    uid: "code",
    sortable: true,
    init: true,
  },
  {
    name: "SHORT NAME",
    uid: "short_name",
    sortable: true,
    init: true,
  },
  {
    name: "LONG NAME",
    uid: "long_name",
    sortable: true,
    init: true,
  },
  { name: "STATUS", uid: "status", sortable: true, init: true },
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
export default function WarehouseSettingsTable(params: any) {
  const { POST } = useCrud();
  const [formData, setFormData] = useState<any>(null);
  const [api] = useState<any>({ url: params.api, id: params.id });
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [viewLayers, setViewLayers] = useState(false);
  const [filterState, setFilterState] = useState({ status: "all" });
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const { data: data, isLoading: dataLoading } = useDataFetcher(api.url);

  const { data: currentData, isLoading: currentDataLoading } = useDataFetcher(
    `${api.url}${formData?.id ? `/get/${formData.id}` : ""}`
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
  } = useTableManager(data, InitialColumns, filterState, false);

  const actions =
    params.id == 2 ? ["View", "Edit", "Delete"] : ["Edit", "Delete"];

  const handleFunction = (action: string) => {
    if (action === "View" && params.id == 2) {
      setViewLayers(true);
    } else if (action === "Edit" || action === "Add") {
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
      await POST(`${api.url}/change-status`, {
        selected_ids: JSON.stringify(selectedKeys),
      });
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}${api.url}`);
      setSubmitIsLoading(false);
      onChangeStatusClose();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitIsLoading(true);
      await POST(`${api.url}/delete/${id}`, formData);
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}${api.url}`);
      setSubmitIsLoading(false);
      onConfirmClose();
    }
  };

  return (
    <>
      {viewLayers ? (
        <div>
          <Button
            size="sm"
            variant="bordered"
            color="primary"
            startContent={<MoveLeft size={17} />}
            onPress={() => setViewLayers(false)}
            className="mb-3"
          >
            Go Back
          </Button>
          <WarehouseSettingsLayersTable
            api={`setting/storage-unit-sets/all/${formData.id}`}
            initialApi={`setting/storage-unit-sets`}
          />
        </div>
      ) : (
        <div>
          <ResponsiveView
            dataList={data}
            filterValue={filterValue}
            onSearchChange={onSearchChange}
            visibleColumns={visibleColumns}
            setColumns={setColumns}
            columns={InitialColumns}
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
            cardFields={InitialColumns}
            headerColumns={headerColumns}
            renderCell={renderCell}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
            filters={filterOptions}
            filterState={filterState}
            setFilterState={setFilterState}
            actions={getTableActions(onChangeStatusOpen, handleAddNew)}
          />

          <WarehouseSettingsCrudForm
            operation={formData?.operation}
            isOpen={isOpenDrawer}
            onOpenChange={onOpenChangeDrawer}
            isLoading={currentDataLoading}
            title={params.title}
            tabId={params.id}
            api={api.url}
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
        </div>
      )}
    </>
  );
}
