import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store"; // Import the Redux store
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap your app inside Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
