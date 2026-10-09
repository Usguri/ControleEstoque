import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routers.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./styles/theme.tsx";
import { AuthProvider } from "./hooks/useAuth";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
);
