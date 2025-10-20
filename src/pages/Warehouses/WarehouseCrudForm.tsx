import {
  Button,
  Chip,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import TableDrawer from "../../components/common/Table/TableDrawer";
import { useEffect, useState } from "react";
import useDataFetcher from "../../hooks/useDataFetcher";
import ConfirmationModal from "../../components/common/ModalComponent/ConfirmationModal";
import useCrud from "../../hooks/useCRUD";
import { useToast } from "../../hooks/useToast";
import API_BASE_URL from "../../globals/apiConfig";
import { mutate } from "swr";
import ModalComponent from "../../components/common/ModalComponent/ModalComponent";
import { ChevronDown, TriangleAlert } from "lucide-react";

interface WarehousesCrudProps {
  operation: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  isLoading?: boolean;
  data?: any;
}

const fieldProps = (formOperation: string) => ({
  isRequired: formOperation === "View" ? false : true,
  readOnly: formOperation === "View",
  size: "sm" as "sm",
});

const warehouseStatus = {
  data: [
    { id: 1, short_name: "Active" },
    { id: 0, short_name: "Inactive" },
  ],
};

const WarehousesCrudForm: React.FC<WarehousesCrudProps> = ({
  operation,
  isOpen,
  onOpenChange,
  onClose,
  isLoading,
  data,
}) => {
  const warehouseCodes = useDataFetcher(`warehouse`);
  const storageLocations = useDataFetcher(`setting/storage-locations`);
  const defaultReceivingLocation = useDataFetcher(
    `setting/storage-locations/get-default-location/0/1`
  );
  const defaultPickingLocation = useDataFetcher(
    `setting/storage-locations/get-default-location/1/1`
  );
  const { POST } = useCrud();
  const [formData, setFormData] = useState<any>({});
  const [validateUpdate, setValidateUpdate] = useState<any>([]);
  const [validateIsLoading, setValidateIsLoading] = useState(false);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [formOperation, setFormOperation] = useState(operation);
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const {
    isOpen: isValidateOpen,
    onOpen: onValidateOpen,
    onClose: onValidateClose,
    onOpenChange: onValidateOpenChange,
  } = useDisclosure();

  const isWarehouseCodeInvalid =
    Array.isArray(warehouseCodes?.data) &&
    warehouseCodes.data.some((c: any) => c.code == formData?.code);

  useEffect(() => {
    if (operation) {
      const op = operation.toLowerCase();
      setFormOperation(op === "view" ? "View" : op === "edit" ? "Edit" : "Add");
    }
  }, [operation]);

  useEffect(() => {
    if (data) {
      const d = data || {};
      const parseIfStringified = (v: any) =>
        Array.isArray(v)
          ? v
          : typeof v === "string"
          ? JSON.parse(v || "[]")
          : [];
      setFormData({
        code: d.code,
        short_name: d.short_name,
        address: d.address,
        status: d.status,
        contact_person: d.contact_person,
        email: d.email,
        contact_number: d.contact_number,
        default_receiving_locations: parseIfStringified(
          d.default_receiving_locations
        ),
        default_picking_locations: parseIfStringified(
          d.default_picking_locations
        ),
        zones: parseIfStringified(d.zones),
      });
    }
  }, [data]);

  // DRY helper for multi-selects
  const renderMultiSelect = (
    label: string,
    items: any[],
    valueKey: string,
    disabled = false
  ) => (
    <Select
      className="basis-4/12"
      classNames={{ trigger: "min-h-12 py-2" }}
      isMultiline={true}
      isRequired={formOperation !== "View"}
      selectorIcon={selectorIcon}
      isDisabled={formOperation === "View" || disabled}
      items={items}
      label={label}
      renderValue={(items: SelectedItems<any>) => (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Chip size="sm" color="primary" key={item.key}>
              {item.data?.short_name}
            </Chip>
          ))}
        </div>
      )}
      selectionMode="multiple"
      variant="flat"
      selectedKeys={
        Array.isArray(formData[valueKey])
          ? formData[valueKey].map(String)
          : []
      }
      onSelectionChange={(keys) => {
        setFormData({
          ...formData,
          [valueKey]: Array.from(keys).map(Number),
        });
      }}
    >
      {(item: any) => (
        <SelectItem key={item.id} textValue={item.short_name}>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <span className="text-small">{item.code}</span>
              <span className="text-tiny text-default-400">
                {item.long_name}
              </span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );

  const handleSubmit = async () => {
    try {
      let updatedFormData = { ...formData };

      if (formOperation === "Add") {
        ["default_receiving_locations", "default_picking_locations"].forEach(
          (key) => {
            if (!updatedFormData[key]?.length) {
              const filterKey =
                key === "default_receiving_locations"
                  ? "is_default_receiving_location"
                  : "is_default_picking_location";
              updatedFormData[key] =
                storageLocations.data
                  ?.filter((item: any) => item[filterKey] === 1)
                  .map((item: any) => item.id) || [];
            }
          }
        );
      }

      [
        "default_picking_locations",
        "default_receiving_locations",
        "zones",
      ].forEach((key) => {
        if (Array.isArray(updatedFormData[key])) {
          updatedFormData[key] = JSON.stringify(updatedFormData[key]);
        }
      });

      let url = data ? `warehouse/update/${data.id}` : `warehouse/create`;
      setSubmitIsLoading(true);
      const res = await POST(url, updatedFormData);
      if (res.success) {
        onClose?.();
        onOpenChange(false);
        setFormOperation(operation);
      }
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      setFormData({});
      mutate(`${API_BASE_URL}warehouse/0`);
      mutate(`${API_BASE_URL}warehouse/1`);
      setSubmitIsLoading(false);
      onValidateClose();
      onConfirmClose();
    }
  };

  const handleValidateUpdate = async () => {
    try {
      let url = `warehouse/update/validate/${data.id}`;
      setValidateIsLoading(true);

      const formDataToSend = {
        updated_data: JSON.stringify({
          ...formData,
          default_picking_locations: JSON.stringify(
            formData.default_picking_locations
          ),
          default_receiving_locations: JSON.stringify(
            formData.default_receiving_locations
          ),
          zones: JSON.stringify(formData.zones),
        }),
      };
      const res = await POST(url, formDataToSend, "", false);
      if (res?.success) {
        const dataResult = getChanges(res?.success?.data);
        setValidateUpdate(dataResult);
        Object.keys(dataResult).length === 0
          ? useToast("No changes detected.", "foreground")
          : onValidateOpen();
      }
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      setValidateIsLoading(false);
      onConfirmClose();
    }
  };

  const selectFields: any = {
    status: warehouseStatus,
    default_picking_locations: storageLocations,
    default_receiving_locations: storageLocations,
    zones: storageLocations,
  };

  const getNameById = (list: any, id: any) =>
    list?.data?.find((item: any) => item.id == id)?.short_name ?? id;

  const capitalizeWords = (str: string) =>
    str
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  function parseIfJson(val: any) {
    try {
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        return JSON.parse(val);
      }
    } catch {}
    return val;
  }

  function areValuesEqual(a: any, b: any): boolean {
    const valA = parseIfJson(a);
    const valB = parseIfJson(b);

    if (Array.isArray(valA) && Array.isArray(valB)) {
      return valA.length === valB.length && valA.every((v, i) => v == valB[i]);
    }

    return valA == valB;
  }

  function getDisplayValue(field: string, value: any) {
    const parsed = parseIfJson(value);
    const selectList = selectFields[field];

    if (Array.isArray(parsed) && selectList) {
      return parsed.map((id: any) => getNameById(selectList, id)).join(", ");
    }
    if (selectList) {
      return getNameById(selectList, parsed);
    }
    return parsed;
  }

  function getChanges(
    data: Record<string, { before_value: any; after_value: any }>
  ) {
    const changes: Array<{
      field: string;
      before: any;
      after: any;
    }> = [];

    for (const key in data) {
      const { before_value, after_value } = data[key];
      if (!areValuesEqual(before_value, after_value)) {
        changes.push({
          field: capitalizeWords(key),
          before: getDisplayValue(key, before_value),
          after: getDisplayValue(key, after_value),
        });
      }
    }
    return changes;
  }

  const selectorIcon = formOperation === "View" ? <div></div> : <ChevronDown />;

  return (
    <div>
      <TableDrawer
        title={formOperation + " " + `Warehouse`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        isLoading={isLoading ?? false}
      >
        <form
          className="w-full max-w-full"
          onSubmit={(e) => {
            e.preventDefault();
            data?.id ? handleValidateUpdate() : onConfirmOpen();
          }}
        >
          <div className="text-sm overflow-y-auto h-[calc(100vh-175px)] md:h-[calc(100vh-160px)] sm:px-2">
            {/* General Details */}
            <div>
              <div className="  p-3 rounded-md">
                General Details
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Input
                  {...fieldProps(formOperation)}
                  label="Warehouse Code"
                  className="basis-4/12"
                  errorMessage="Warehouse Code already exists."
                  isInvalid={
                    data?.code != formData?.code && isWarehouseCodeInvalid
                  }
                  value={formData.code || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, code: value })
                  }
                />
                <Input
                  {...fieldProps(formOperation)}
                  label="Warehouse Name"
                  className="basis-4/12"
                  value={formData.short_name || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, short_name: value })
                  }
                />
                <Select
                  isRequired={formOperation !== "View"}
                  isDisabled={formOperation === "View"}
                  selectedKeys={
                    formData.status !== undefined && formData.status !== null
                      ? [formData.status.toString()]
                      : []
                  }
                  onChange={(val) => {
                    setFormData({
                      ...formData,
                      status: val.target.value,
                    });
                  }}
                  size="sm"
                  selectorIcon={selectorIcon}
                  label="Status"
                  className="basis-4/12 opacity-100"
                >
                  {warehouseStatus?.data?.map((item: any) => (
                    <SelectItem key={item.id}>{item.short_name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="pt-2">
                <Textarea
                  {...fieldProps(formOperation)}
                  label="Business Address"
                  className="w-full"
                  value={formData.address || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, address: value })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Input
                  {...fieldProps(formOperation)}
                  label="Contact Person"
                  className="basis-4/12"
                  value={formData.contact_person || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, contact_person: value })
                  }
                />
                <Input
                  {...fieldProps(formOperation)}
                  label="Contact Number"
                  className="basis-4/12"
                  value={formData.contact_number || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      contact_number: value.replace(/\D/g, ""),
                    })
                  }
                />
                <Input
                  {...fieldProps(formOperation)}
                  type="email"
                  label="Email Address"
                  className="basis-4/12"
                  value={formData.email || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                />
              </div>
            </div>
            {/* Zones and Locations */}
            <div>
              <div className="  p-3 mt-5 rounded-md">
                Zones
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {renderMultiSelect(
                  "Default Receiving Locations",
                  defaultReceivingLocation.data || [],
                  "default_receiving_locations"
                )}
                {renderMultiSelect(
                  "Default Picking Locations",
                  defaultPickingLocation.data || [],
                  "default_picking_locations"
                )}
                {renderMultiSelect(
                  "Zones",
                  storageLocations.data || [],
                  "zones"
                )}
              </div>
            </div>
            {/* Submit Buttons */}
          </div>
          <div className="flex justify-between mt-5 pr-2 sm:pr-4 sm:pl-2">
            <Button
              onPress={() => {
                onClose?.();
                onOpenChange(false);
                setFormOperation(operation);
              }}
              variant="bordered"
              className="px-10"
            >
              Close
            </Button>
            {formOperation === "View" && (
              <Button
                type="button"
                onPress={() => setFormOperation("Edit")}
                variant="bordered"
                className="px-8"
                color="primary"
              >
                Edit
              </Button>
            )}
            {formOperation !== "View" && (
              <Button
                isDisabled={
                  data?.code !== formData?.code && isWarehouseCodeInvalid
                }
                isLoading={validateIsLoading}
                type="submit"
                variant="solid"
                className="px-8"
                color="primary"
              >
                {data ? "Update Warehouse" : "Add Warehouse"}
              </Button>
            )}
          </div>
        </form>
      </TableDrawer>

      <ModalComponent
        size="2xl"
        backdrop="blur"
        isOpen={isValidateOpen}
        onOpenChange={onValidateOpenChange}
        hideCloseButton={true}
        showFooterButtons={false}
        onConfirm={onConfirmOpen}
      >
        <div className="mt-6 2xl:mt-0 mb-3">
          <div className="flex flex-col items-center justify-center">
            <TriangleAlert className="text-yellow-500" size={50} />
            <div className="my-4">Are you sure you want to proceed?</div>
            <div className="text-xs text-center">
              By confirming, the system will update the warehouse information
              with the following changes:
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-4 text-xs text-center   py-1 ">
            <div className="basis-4/12">FIELD</div>
            <div className="basis-4/12">PREVIOUS</div>
            <div className="basis-4/12">UPDATED</div>
          </div>
          <div className="overflow-y-auto max-h-[50vh]">
            {validateUpdate.length > 0 &&
              validateUpdate.map((item: any, index: any) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 py-2 text-center text-xs"
                >
                  <div className="basis-4/12">{item.field}</div>
                  <div className="basis-4/12">{item.before}</div>
                  <div className="basis-4/12">{item.after}</div>
                </div>
              ))}
          </div>
          <div className="my-10 text-center text-xs">
            This action will permanently apply the changes to the warehouse
            record.
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="bordered"
              size="sm"
              className="my-3"
              color="primary"
              onPress={onValidateClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="my-3"
              color="primary"
              onPress={onConfirmOpen}
            >
              Confirm
            </Button>
          </div>
        </div>
      </ModalComponent>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={handleSubmit}
        isLoading={submitIsLoading}
      />
    </div>
  );
};

export default WarehousesCrudForm;