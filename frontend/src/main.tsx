import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { store } from "./store/store";
import { fetchProfile, rehydrateSession } from "./store/slices/authSlice";
import { sessionStorageAdapter } from "./shared/services/sessionStorage";
import "./shared/styles/global.css";

const savedToken = sessionStorageAdapter.load();
if (savedToken) {
  store.dispatch(rehydrateSession(savedToken));
  void store.dispatch(fetchProfile());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
