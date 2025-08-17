import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// fonts (Inter for 'sans', Cormorant for 'serif')
import "@fontsource/inter"; // Default weight 400
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold
import "@fontsource/cormorant-garamond/600.css"; // Only need weight 600
import "@fontsource/architects-daughter";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
