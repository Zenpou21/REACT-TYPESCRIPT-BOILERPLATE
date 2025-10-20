import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  message?: string;
  viceVersa?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  message = "By confirming, this action will be processed accordingly.",
  viceVersa = false,
}) => {
  return (
    <Modal backdrop="blur" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="font-body  text-default-600 2xl:pt-10">
              <div className="flex justify-center mt-5">
                <AlertCircle
                  size={64}
                  className=" text-center flex justify-center"
                />
              </div>
              <span className="font-semibold text-xl text-center">
                Are you sure you want to proceed?
              </span>
              <span className="text-sm text-center">{message}</span>
            </ModalBody>
            <ModalFooter className="flex justify-between font-body">
              <Button
                color="default"
                variant="bordered"
                onPress={viceVersa ? onConfirm : onClose}
              >
                {cancelLabel}
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={viceVersa ? onClose : onConfirm}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
