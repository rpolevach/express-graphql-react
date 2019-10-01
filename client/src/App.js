import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Auth from "./components/Auth";
import Booking from "./components/Booking";
import Event from "./components/Event";
import MainNavigation from "./components/Navigation/MainNavigation";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation></MainNavigation>
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={Auth} />
          <Route path="/events" component={Event} />
          <Route path="/bookings" component={Booking} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
