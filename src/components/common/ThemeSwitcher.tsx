import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../../hooks/useThemeContext";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Switch
        isSelected={theme === "dark"}
        onChange={toggleTheme}
        size="md"
        color="primary"
        startContent={<MoonIcon />}
        endContent={<SunIcon />}
      />
    </div>
  );
}
