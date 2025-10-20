import { Button, Divider, useDisclosure } from "@heroui/react";
import ModalComponent from "./ModalComponent";
import { FileUploader } from "react-drag-drop-files";
import { File, TriangleAlert } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import useCrud from "../../../hooks/useCRUD";
import { mutate } from "swr";
import API_BASE_URL from "../../../globals/apiConfig";

type BulkUploadModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  apiUrl: string;
  mutateUrl?: any;
  onImported?: () => void;
};

export default function BulkUploadModal({
  isOpen,
  onOpenChange,
  apiUrl,
  mutateUrl,
  onImported,
}: BulkUploadModalProps) {
  const {
    isOpen: isExistingOpen,
    onOpen: onExistingOpen,
    onOpenChange: onExistingChange,
  } = useDisclosure();

  const { POST } = useCrud();
  const [errors, setErrors] = useState<any[]>([]);
  const [existingData, setExistingData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (file: File) => setFile(file);
  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) resolve(reader.result.toString());
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  const parseCSV = (csvData: string): any[] => {
    return Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
  };
  const importConfirm = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const csvData = await readFileAsync(file);
      const parsedData = parseCSV(csvData);
      const body = { bulk_data: JSON.stringify(parsedData) };
      let result = await POST(apiUrl, body);
      if (result?.error_thrown) {
        setExistingData(result.error_thrown);
        onExistingOpen();
      }
      if (Array.isArray(mutateUrl)) {
        mutateUrl.forEach((url: string) => mutate(`${API_BASE_URL}${url}`));
      } else {
        mutate(`${API_BASE_URL}${mutateUrl}`);
      }
      setFile(null);
      if (onImported) onImported();
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const result = Object.entries(existingData).flatMap(([field, entries]) =>
      entries.map(({ message, value, row }: any) => ({
        message,
        row,
        field,
        value,
      }))
    );

    setErrors(result);
  }, [existingData]);

  return (
    <div>
      <ModalComponent
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={() => onOpenChange(false)}
        hideCloseButton={false}
        confirmLabel="Import"
        onConfirm={importConfirm}
        isLoading={loading}
      >
        <div className="mt-6 2xl:mt-0 mb-3">
          <div className="text-sm">Import CSV File</div>
          <Divider className="my-4" />
          <div className="p-4 border border-primary border-dashed rounded-md">
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={["CSV", "csv", "text/csv", "application/vnd.ms-excel"]}
            >
              <div className="flex flex-col justify-center items-center ">
                <div>
                  <File className="text-primary" size={17} />
                </div>
                <div className="text-sm">Drag & drop to upload file</div>
                <div className="flex items-center w-full my-2">
                  <span className="flex-1 border-t border-gray-500"></span>
                  <span className="mx-2 text-xs text-gray-500">Or</span>
                  <span className="flex-1 border-t border-gray-500"></span>
                </div>
                <div className="w-full">
                  <Button size="sm" color="primary" className="w-full">
                    Browse File
                  </Button>
                </div>
                <div className="text-default-600 text-xs mt-4">
                  {file && `Selected File: ${file.name}`}
                </div>
              </div>
            </FileUploader>
          </div>
        </div>
      </ModalComponent>
      <ModalComponent
        size="2xl"
        backdrop="blur"
        isOpen={isExistingOpen}
        onOpenChange={onExistingChange}
        hideCloseButton={true}
        showFooterButtons={false}
        onConfirm={importConfirm}
      >
        <div className="mt-6 2xl:mt-0 mb-3">
          <div className="flex flex-col items-center justify-center">
            <TriangleAlert className="text-yellow-500" size={50} />
            <div className="my-4">Invalid Entries</div>
            <div className="text-xs text-center">
              The following {`${errors.length > 0 ? "entries" : "entry"}`} in
              your uploaded CSV file already exists in the system. Please update
              or remove them before re-uploading.
            </div>
          </div>
          <div className="flex gap-x-2 mt-4 text-xs text-center   py-1 ">
            <div className="basis-3/12">ROW</div>
            <div className="basis-3/12">NAME</div>
            <div className="basis-3/12">MESSAGE</div>
            <div className="basis-3/12">VALUE</div>
          </div>
          <div className="overflow-y-auto max-h-[50vh]">
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex gap-x-2 py-2 text-center text-xs"
              >
                <div className="basis-3/12">{error.row}</div>
                <div className="basis-3/12">{error.field}</div>
                <div className="basis-3/12">{error.message}</div>
                <div className="basis-3/12">{error.value}</div>
              </div>
            ))}
          </div>
          <div>
            <Button
              size="sm"
              className="w-full my-3"
              color="primary"
              onPress={onExistingChange}
            >
              Understood
            </Button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
