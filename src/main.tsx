import React from "react"
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import 'primeicons/primeicons.css';
import { initTheme } from "./utils/theme";
import debounce from "debounce";

const container = document.getElementById("root");

initTheme();

const KEY = "redux_v1_counter";
async function saveState(state: any) {
  try {
    console.log("state: ", state);
    const serializedState = JSON.stringify(state.counter);
    localStorage.setItem(KEY, serializedState);
  } catch (e) {
    console.error("e");
    // Ignore
  }
}

store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => {
    saveState(store.getState());
  }, 800)
);

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
        {/* <App /> */}
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}


function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <a href="/home.html">Go to the home page of the app</a>
      </p>
    </div>
  );
}