/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
// Supports weights 200-800
import "@fontsource-variable/plus-jakarta-sans";

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
        <Route path="/users/:userId" component={User} />
      </Router>
    </>
  ),
  root!
);
