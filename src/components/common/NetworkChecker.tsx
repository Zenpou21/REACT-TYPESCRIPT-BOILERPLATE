import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function NetworkChecker() {
  const {
    isOpen: isOpenCheckNetwork,
    onOpen: onOpenCheckNetwork,
    onOpenChange: onOpenChangeCheckNetwork,
    onClose: onCloseCheckNetwork,
  } = useDisclosure();

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Effect to handle network status changes
  useEffect(() => {
    // Function to update the state based on the online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set up event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Log the network status to the console
  useEffect(() => {

    if (!isOnline) {
      onOpenCheckNetwork();
    } else {
      onCloseCheckNetwork();
    }
  }, [isOnline]);
  return (
    <>
      <Modal
        backdrop={"blur"}
        size="lg"
        hideCloseButton
        isDismissable={false}
        className="rounded-md"
        isOpen={isOpenCheckNetwork}
        onOpenChange={onOpenChangeCheckNetwork}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="text-default-600 border border-primary rounded-lg">
                <div className="font-body flex flex-col items-center text-center py-10">
                  <AlertCircle
                    size={64}
                    className="text-primary text-center justify-center"
                  />
                  <span className="font-semibold text-lg text-primary my-4">
                    YOU HAVE LOST CONNECTION <br />
                    PLEASE WAIT A MOMENT
                    <br />
                    <Spinner className="mt-5" color="primary" />
                  </span>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
