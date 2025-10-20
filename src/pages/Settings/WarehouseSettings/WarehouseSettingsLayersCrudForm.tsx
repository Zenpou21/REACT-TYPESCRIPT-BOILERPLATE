import {
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import TableDrawer from "../../../components/common/Table/TableDrawer";
import ConfirmationModal from "../../../components/common/ModalComponent/ConfirmationModal";
import useCrud from "../../../hooks/useCRUD";
import useDataFetcher from "../../../hooks/useDataFetcher";
import API_BASE_URL from "../../../globals/apiConfig";
import { mutate } from "swr";
import { useToast } from "../../../hooks/useToast";

interface WarehouseSettingsLayersCrudProps {
  operation: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  isLoading?: boolean;
  title: string;
  tabId?: string;
  api?: string;
  initialApi?: string;
  data?: any;
}

const getFieldProps = (operation: string) => ({
  readOnly: operation === "View",
  size: "sm" as const,
});

const WarehouseSettingsLayersCrudForm: React.FC<
  WarehouseSettingsLayersCrudProps
> = ({
  operation,
  isOpen,
  onOpenChange,
  onClose,
  title,
  isLoading,
  api,
  initialApi,
  data,
}) => {
  const codes = useDataFetcher(api ?? "");
  const id = api?.split("/").pop();
  const storageLocations = useDataFetcher("setting/storage-locations");
  const { POST } = useCrud();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const [formData, setFormData] = useState<any>({});
  const [layers, setLayers] = useState<any[]>([]);
  const [originalLayers, setOriginalLayers] = useState<any[]>([]);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [formOperation, setFormOperation] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [missingLayers, setMissingLayers] = useState<number[]>([]);

  useEffect(() => {
    const op = operation?.toLowerCase();
    setFormOperation(op === "view" ? "View" : op === "edit" ? "Edit" : "Add");
  }, [operation]);

  useEffect(() => {
    if (formOperation === "Edit" && data) {
      setFormData({
        code: data.code,
        storage_location_id: data.storage_location_id,
        storage_unit_id: data.storage_unit_id,
      });

      const originalLayers = data.setting_storage_location_layers || [];

      const sortedLayers = originalLayers
        .map((l: any) => ({
          no: l.layer_number,
          min: l.min,
          max: l.max,
        }))
        .sort((a: any, b: any) => a.no - b.no);

      setLayers(sortedLayers);
      setOriginalLayers(sortedLayers);
    } else if (formOperation === "Add") {
      setFormData({ storage_unit_id: id });
      setLayers([{ no: 1, min: 0, max: 1 }]);
    }
  }, [data, formOperation]);

  useEffect(() => {
    const existingNos = layers.map((l) => l.no).sort((a, b) => a - b);
    const missing = [];
    for (let i = 1; i < Math.max(...existingNos, 0); i++) {
      if (!existingNos.includes(i)) missing.push(i);
    }
    setMissingLayers(missing);
  }, [layers, setMissingLayers]);

  const isCodeInvalid =
    Array.isArray(codes?.data) &&
    codes.data.some((c: any) =>
      formOperation === "Edit"
        ? c.code === formData.code && c.id !== data?.id
        : c.code === formData.code
    );

  const handleSubmit = async () => {
    try {
      setSubmitIsLoading(true);
      const url =
        formOperation === "Edit"
          ? `${initialApi}/update/${data?.id}`
          : `${initialApi}/create`;

      const currentLayerNos = layers.map((l) => l.no);
      const deletedLayers = originalLayers
        .filter((ol) => !currentLayerNos.includes(ol.no))
        .map((ol) => ({ ...ol, del: 1 }));

      const mergedLayers = [...layers, ...deletedLayers].sort(
        (a, b) => a.no - b.no
      );

      const payload = {
        ...formData,
        layers: JSON.stringify(
          mergedLayers.map((l) => ({
            no: l.no,
            min: l.min,
            max: l.max,
            ...(l.del ? { del: 1 } : {}),
          }))
        ),
      };

      const res = await POST(url, payload);

      if (res.success) {
        onConfirmClose();
        onClose?.();
        onOpenChange(false);
      }
    } catch (error) {
      useToast(error || "Something went wrong.", "danger");
    } finally {
      mutate(`${API_BASE_URL}${api}`);
      setSubmitIsLoading(false);
      setFormOperation(operation);
    }
  };

 const handleLayerChange = (
  idx: number,
  key: "min" | "max",
  value: number
) => {
  setLayers((prev) =>
    prev.map((l, i) => {
      if (i !== idx) return l;

      let newMin = l.min;
      let newMax = l.max;

      if (key === "min") {
        newMin = Math.min(Math.max(0, value), l.max - 1); 
      } else {
        newMax = Math.max(value, l.min + 1);
      }

      return {
        ...l,
        min: newMin,
        max: newMax,
      };
    })
  );
};


  const handleRemoveLayer = (no: number) => {
    setLayers((prev) => prev.filter((l) => l.no !== no));
  };

  const handleAddLayer = (layerNo: number) => {
    const newLayer = { no: layerNo, min: 0, max: 1 };
    const newLayers = [...layers, newLayer].sort((a, b) => a.no - b.no);
    setLayers(newLayers);
  };

  const nextLayerNo = layers.length
    ? Math.max(...layers.map((l) => l.no)) + 1
    : 1;

  return (
    <div>
      <TableDrawer
        title={`${formOperation} ${title}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        isLoading={isLoading ?? false}
        sizing="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirmOpen();
          }}
          className="overflow-y-auto text-sm h-[calc(100vh-175px)] md:h-[calc(100vh-160px)] sm:px-2"
        >
          <Select
            isRequired
            size="sm"
            label="Storage Location"
            selectedKeys={
              formData.storage_location_id
                ? [String(formData.storage_location_id)]
                : []
            }
            onChange={(val) =>
              setFormData({
                ...formData,
                storage_location_id: val.target.value,
              })
            }
          >
            {(storageLocations?.data || []).map((item: any) => (
              <SelectItem key={item.id}>{item.short_name}</SelectItem>
            ))}
          </Select>

          <div className="my-3">
            <Input
              {...getFieldProps(formOperation)}
              label="Unit Code"
              value={formData.code || ""}
              isRequired
              isInvalid={isCodeInvalid}
              errorMessage="Unit Code already exists."
              onValueChange={(val) => setFormData({ ...formData, code: val })}
            />
          </div>

          {formOperation !== "View" && (
            <div className="my-3 flex justify-end items-center gap-2">
              {missingLayers.length > 0 && (
                <Select
                  size="sm"
                  label="Select Missing Layers"
                  selectionMode="multiple"
                  selectedKeys={selected}
                  onSelectionChange={(keys) => {
                    const selectedNos = Array.from(keys).map((k) => Number(k));
                    const newLayers = selectedNos.map((no) => ({
                      no,
                      min: 0,
                      max: 1,
                    }));

                    setLayers((prev) =>
                      [...prev, ...newLayers].sort((a, b) => a.no - b.no)
                    );

                    setSelected(new Set()); 
                  }}
                >
                  {missingLayers.map((m) => (
                    <SelectItem key={String(m)} textValue={`Layer ${m}`}>
                      Layer {m}
                    </SelectItem>
                  ))}
                </Select>
              )}

              <Button
                color="primary"
                variant="solid"
                onPress={() => handleAddLayer(nextLayerNo)}
              >
                Add Layer {nextLayerNo}
              </Button>
            </div>
          )}

          <div className="overflow-y-auto max-h-[57vh] sm:max-h-[63vh]">
            {layers.map((layer, idx) => (
              <div key={idx} className="mb-2">
                <div className="text-xs mb-1 flex justify-between items-center">
                  <span>Layer {layer.no}</span>
                  {formOperation !== "View" && layers.length > 1 && (
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleRemoveLayer(layer.no)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="flex gap-x-3 items-center">
                  {["min", "max"].map((key) => (
                    <Input
                      key={key}
                      label={key.toUpperCase()}
                      value={layer[key as "min" | "max"].toString()}
                      classNames={{ input: "text-center" }}
                      onValueChange={(v) =>
                        handleLayerChange(
                          idx,
                          key as "min" | "max",
                          Number(v) || 0
                        )
                      }
                      startContent={
                        <Minus
                          className="cursor-pointer"
                          onClick={() =>
                            handleLayerChange(
                              idx,
                              key as "min" | "max",
                              layer[key as "min" | "max"] - 1
                            )
                          }
                        />
                      }
                      endContent={
                        <Plus
                          className="cursor-pointer"
                          onClick={() =>
                            handleLayerChange(
                              idx,
                              key as "min" | "max",
                              layer[key as "min" | "max"] + 1
                            )
                          }
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex absolute bottom-0 right-0 left-0 px-5 pb-5 w-full justify-between ">
            <Button
              variant="bordered"
              className="px-10"
              onPress={() => {
                onClose?.();
                onOpenChange(false);
                setFormOperation(operation);
              }}
            >
              Close
            </Button>
            {formOperation === "View" ? (
              <Button
                variant="bordered"
                color="primary"
                className="px-8"
                onPress={() => setFormOperation("Edit")}
              >
                Edit
              </Button>
            ) : (
              <Button
                type="submit"
                variant="solid"
                color="primary"
                className="px-8"
                isDisabled={isCodeInvalid}
              >
                {formOperation}
              </Button>
            )}
          </div>
        </form>
      </TableDrawer>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={handleSubmit}
        isLoading={submitIsLoading}
      />
    </div>
  );
};

export default WarehouseSettingsLayersCrudForm;
