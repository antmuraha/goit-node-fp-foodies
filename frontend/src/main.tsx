import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { fetchProfile, rehydrateSession } from "./store/slices/authSlice";
import { sessionStorageAdapter } from "./shared/services/sessionStorage";
import "./shared/styles/global.css";
import { appRouter } from "./app";

const savedToken = sessionStorageAdapter.load();
if (savedToken) {
  store.dispatch(rehydrateSession(savedToken));
  void store.dispatch(fetchProfile());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </React.StrictMode>,
);
