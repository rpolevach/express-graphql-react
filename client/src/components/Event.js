import React, { Component } from "react";

import "./Event.css";
import Modal from "./Modal/Modal";
import Backdrop from "./Backdrop/Backdrop";

class Event extends Component {
  state = {
    creating: false
  };

  onCreate = () => {
    this.setState({ creating: true });
  };

  onConfirm = () => {};

  onCancel = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
          >
            <p>Modal Content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Lul!</p>
          <button className="btn" onClick={this.onCreate}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Event;
