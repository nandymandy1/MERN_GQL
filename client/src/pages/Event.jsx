import "./Event.css";
import React, { Component } from "react";
import { postData } from "../services/api";
import Modal from "../components/Modal/Modal";
import Loader from "../components/Loader/Loader";
import AuthContext from "../context/auth-context";
import { Backdrop } from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";

class EventPage extends Component {
  state = {
    events: [],
    creating: false,
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query GetEvents{
            events{
              _id title description date price
              host{
                _id email
              }
            }
          }
        `
    };
    try {
      let { data } = await postData(requestBody);
      if (this.isActive) {
        this.setState({
          events: [...data.events],
          isLoading: false
        });
      }
    } catch (err) {
      if (this.isActive) {
        this.setState({
          isLoading: false
        });
      }
    }
  };

  startCreateHandler = () => {
    this.setState({ creating: true });
  };

  modelConfirmHandler = async () => {
    const title = this.titleElRef.current.value;
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
    this.setState({ creating: false });
    let requestBody = {
      query: `
          mutation AddEvent($title:String!, $price:Float!, $desc:String!, $date:String!){
            addEvent(eventInput:{title: $title, price: $price, date:$date, description:$desc}){
              _id title description date price
            }
          }
        `
    };

    requestBody["variables"] = { title, price, desc: description, date };
    const token = this.context.token;
    const headers = { Authorization: `Bearer ${token}` };
    let { data } = await postData(requestBody, headers);
    this.setState(prevState => {
      const updatedEvents = [...prevState.events];
      updatedEvents.push({
        ...data.addEvent,
        host: {
          _id: this.context.userId
        }
      });
      return { events: updatedEvents };
    });
  };

  modelCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  showDetail = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = async () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    let requestBody = {
      query: `
          mutation BookEvent($id:ID!){
            bookEvent(eventId: $id){
              _id createdAt updatedAt
            }
          }
        `
    };
    requestBody["variables"] = { id: this.state.selectedEvent._id };
    const { token } = this.context;
    const headers = { Authorization: `Bearer ${token}` };
    await postData(requestBody, headers);
    this.setState({ selectedEvent: null });
  };

  componentWillUnmount = () => {
    this.isActive = false;
  };

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}

        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.modelConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  ref={this.descriptionElRef}
                  id="description"
                  rows="4"
                ></textarea>
              </div>
            </form>
          </Modal>
        )}

        {this.context.token && (
          <div className="events-control">
            <p>Share your own events...</p>
            <button className="btn" onClick={this.startCreateHandler}>
              Create Event
            </button>
          </div>
        )}

        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString(
                "de-DE"
              )}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <EventList
            events={this.state.events}
            authUser={this.context.userId}
            onViewDetail={this.showDetail}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventPage;
