import React, { Component } from "react";

import "./Event.css";
import Modal from "./Modal/Modal";
import Backdrop from "./Backdrop/Backdrop";
import AuthContext from "./context/authContext";

class Event extends Component {
  state = {
    creating: false,
    events: []
  };

  constructor(props) {
    super(props);
    this.titleElRed = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.onFetchEvents();
  }

  onCreate = () => {
    this.setState({ creating: true });
  };

  onConfirm = () => {
    this.setState({ creating: false });
    const title = this.titleElRed.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = {
      title,
      price,
      date,
      description
    };

    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"} ) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.onFetchEvents();
      })
      .catch(err => {
        console.error(err);
      });
  };

  onCancel = () => {
    this.setState({ creating: false });
  };

  onFetchEvents = () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price

          }
        }
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      );
    });

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
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRed}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="title">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                ></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  id="description"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Lul!</p>
            <button className="btn" onClick={this.onCreate}>
              Create Event
            </button>
          </div>
        )}
        <section>
          <ul className="events__list">{eventList}</ul>
        </section>
      </React.Fragment>
    );
  }
}

export default Event;
