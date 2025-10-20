import React, { RefObject } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@heroui/react";
import { QRCode } from "react-qrcode-logo";


interface PrintStoreStickerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  printData: { id: string; code: string; name: string };
  contentRef: RefObject<HTMLDivElement>;
  onPrint: () => void;
}

const PrintStoreStickerModal: React.FC<PrintStoreStickerModalProps> = ({
  isOpen,
  onOpenChange,
  printData,
  contentRef,
  onPrint,
}) => {
  return (
    <Modal size="5xl" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalBody className="text-default-600">
              <div className="font-body mt-5 font-semibold mb-5">Generate Store Sticker</div>
              <div
                className="py-20 flex flex-col justify-center items-center text-center overflow-y-auto bg-white"
                ref={contentRef}
              >
                <div className="text-5xl font-bold mb-1 text-black font-body">{printData.code}</div>
                <div className="text-5xl font-bold mb-1 text-black font-body">{printData.name}</div>
                <QRCode
                  size={250}
                  ecLevel="L"
                  value={`[${printData.id}:{"sid": ${printData.id}, "name": "${printData.name}", "code": "${printData.code}"}]`}
                />
              </div>
            </ModalBody>
            <ModalFooter className="w-full">
              <Button onPress={onPrint} className="w-full font-body rounded-md" color="primary">
                Print Store Sticker
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


export default PrintStoreStickerModal;
