import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Accessibility } from "accessibility/src/main";

//Disable Logs
if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}

window.addEventListener(
  "load",
  function () {
    new Accessibility({
      icon: {
        useEmojis: [false],
      },
    });
  },
  false
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
