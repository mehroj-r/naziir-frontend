import "./scss/global.scss";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { persistor, store } from "./store/store";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import { ChProvider } from "./components/ui/provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ChProvider>
          <ToastContainer />
          <Router />
        </ChProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
