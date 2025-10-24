
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <CollaborationProvider>
        <App />
      </CollaborationProvider>
    </AuthProvider>
  </ThemeProvider>
);
  