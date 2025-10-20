import { Button } from "@heroui/react";
import React from "react";

type ActionButtonProps = {
  onPress: () => void;
  label: string;
  icon: React.ReactNode;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "flat"
    | "bordered"
    | "light"
    | "faded"
    | "shadow"
    | "ghost";
};

export function ActionButton({
  onPress,
  label,
  icon,
  color,
  variant = "solid",
}: ActionButtonProps) {
  return (
    <div className="flex gap-x-2">
      <Button
        disableAnimation
        variant={variant}
        color={color}
        onPress={onPress}
        className={`hidden sm:inline-flex ${
          variant === "bordered" ? "" : `text-white bg-${color}`
        } `}
      >
        {label}
      </Button>
      <Button
        disableAnimation
        isIconOnly
        aria-label={label}
        variant={variant}
        color={color}
        onPress={onPress}
        className={`inline-flex sm:hidden ${
          variant === "bordered" ? "" : `text-white bg-${color}`
        }`}
        startContent={icon}
      />
    </div>
  );
}
