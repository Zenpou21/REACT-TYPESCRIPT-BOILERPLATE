import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./hooks/useThemeContext.tsx";
import "./index.css";
import App from "./App.tsx";
createRoot(document.getElementById("root")!).render(
  <Router>
      <HeroUIProvider>
        <ThemeProvider>
          <main>
            <App />
          </main>
        </ThemeProvider>
      </HeroUIProvider>
  </Router>
);
