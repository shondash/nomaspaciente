import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NoMasPaciente from "../no_mas_paciente";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NoMasPaciente />
  </StrictMode>
);
