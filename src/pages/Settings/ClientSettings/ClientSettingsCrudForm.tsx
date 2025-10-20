import { Button, Input, useDisclosure } from "@heroui/react";
import TableDrawer from "../../../components/common/Table/TableDrawer";
import { useEffect, useState } from "react";
import ConfirmationModal from "../../../components/common/ModalComponent/ConfirmationModal";
import useCrud from "../../../hooks/useCRUD";
import API_BASE_URL from "../../../globals/apiConfig";
import { mutate } from "swr";
import useDataFetcher from "../../../hooks/useDataFetcher";
import { useToast } from "../../../hooks/useToast";

interface ClientSettingsCrudProps {
  operation: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  isLoading?: boolean;
  title: string;
  api?: string;
  data?: any;
}

const fieldProps = (formOperation: string) => ({
  readOnly: formOperation === "View",
  size: "sm" as "sm",
});

const ClientSettingsCrudForm: React.FC<ClientSettingsCrudProps> = ({
  operation,
  isOpen,
  onOpenChange,
  onClose,
  title,
  isLoading,
  api,
  data,
}) => {
  const codes = useDataFetcher(api ?? "");
  const { POST } = useCrud();
  const [formData, setFormData] = useState<any>({});
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [formOperation, setFormOperation] = useState("");

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  useEffect(() => {
    if (operation) {
      const op = operation.toLowerCase();
      setFormOperation(op === "view" ? "View" : op === "edit" ? "Edit" : "Add");
    }
  }, [operation]);

  useEffect(() => {
    if (data) {
      setFormData({
        code: data.code,
        short_name: data.short_name,
        long_name: data.long_name,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      let url =
        formOperation === "Edit" ? `${api}/update/${data.id}` : `${api}/create`;
      setSubmitIsLoading(true);
      const res = await POST(url, formData);
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

  const isCodeInvalid =
    codes.data?.some((c: any) => c.code == formData.code) ?? false;

  return (
    <div>
      <TableDrawer
        title={formOperation + " " + title}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        isLoading={isLoading ?? false}
        sizing="md"
      >
        <form
          className="w-full max-w-full"
          onSubmit={(e) => {
            e.preventDefault();
            onConfirmOpen();
          }}
        >
          <div className="text-sm overflow-y-auto h-[calc(100vh-175px)] md:h-[calc(100vh-160px)] sm:px-2">
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Input
                {...fieldProps(formOperation)}
                label="Code"
                className="basis-4/12"
                isRequired
                value={formData.code || ""}
                errorMessage="Client Code already exists."
                isInvalid={data?.code != formData?.code && isCodeInvalid}
                onValueChange={(value) =>
                  setFormData({ ...formData, code: value })
                }
              />
              <Input
                {...fieldProps(formOperation)}
                label="Short Name"
                className="basis-4/12"
                isRequired
                value={formData.short_name || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, short_name: value })
                }
              />
              <Input
                {...fieldProps(formOperation)}
                label="Long Name"
                className="basis-4/12"
                value={formData.long_name || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, long_name: value })
                }
              />
            </div>
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
                type="submit"
                variant="solid"
                className="px-8"
                color="primary"
                isDisabled={data?.code != formData?.code && isCodeInvalid}
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

export default ClientSettingsCrudForm;
