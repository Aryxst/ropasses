/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { La } from "solid-js";

import "./styles/globals.scss";
import User from "./pages/User";
import Navbar from "./components/navbar";
const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <>
      <Navbar />
      <Router>
        <Route path="/users/:id" component={User} />
      </Router>
    </>
  ),
  root!
);
