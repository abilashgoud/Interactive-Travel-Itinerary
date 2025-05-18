import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";

// Remove StrictMode to allow react-beautiful-dnd to work properly
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
