import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import { ANotify } from "./comp/AToastify.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <App />
          <ANotify />
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
