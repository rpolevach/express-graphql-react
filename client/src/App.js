import React from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Auth from "./components/Auth";
import Booking from "./components/Booking";
import Event from "./components/Event";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={Auth} />
        <Route path="/events" component={Event} />
        <Route path="/bookings" component={Booking} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
