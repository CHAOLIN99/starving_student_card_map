import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainView from "./pages/mainView";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainView />
  </StrictMode>
);
