import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";

import App from "./App";
import "./index.css";

import { store } from "./store/store";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthListener from "./components/AuthListener";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthListener />
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);