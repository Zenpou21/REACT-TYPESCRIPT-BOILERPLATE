import React, { useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ModalComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  showFooterButtons?: boolean;
  backdrop?: any;
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  children,
  showFooterButtons = true,
  backdrop = "blur",
  hideCloseButton = true,
  isDismissable = false,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previouslyFocusedElement.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
    
      size={size}
      backdrop={backdrop}
      isDismissable={isDismissable}
      hideCloseButton={hideCloseButton}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!outline-none !ring-0",
        wrapper: "!outline-none !ring-0",
        body: "!outline-none !ring-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <div ref={modalRef} tabIndex={-1} aria-hidden={!isOpen}>
            <ModalBody className="font-body text-default-600 2xl:pt-10">
              {children}
            </ModalBody>
            {showFooterButtons && (
              <ModalFooter className="flex justify-between font-body">
                <Button color="default" variant="bordered" onPress={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </ModalFooter>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
