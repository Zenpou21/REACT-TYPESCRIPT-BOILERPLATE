import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { useEffect, useRef } from "react";
export function useDrawer() {
  return useDisclosure();
}

export function DrawerComponent({
  isOpen,
  onOpenChange,
  width = "5xl",
  title,
  children,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  width?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Move focus to the drawer
      drawerRef.current?.focus();
    } else {
      previouslyFocusedElement.current?.focus();
    }
  }, [isOpen]);
  return (
    <Drawer
      isDismissable={false}
      hideCloseButton
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        header: "mt-5 sm:mt-0",
        closeButton: "absolute top-6 sm:top-2 right-3",
        body: "px-2",
        base: ` ${width}`,
      }}
    >
      <DrawerContent>
        {() => (
          <div ref={drawerRef} tabIndex={-1} aria-hidden={!isOpen}>
            <DrawerHeader className="flex flex-col gap-1 text-md font-body">
              {title}
            </DrawerHeader>
            <Divider className="ml-2 w-[98%]" />
            <DrawerBody className="font-body">{children}</DrawerBody>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
