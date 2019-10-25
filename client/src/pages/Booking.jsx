import React, { Component } from "react";
import { postData } from "../services/api";
import Loader from "../components/Loader/Loader";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingControls/BookingControls";

class BookingPage extends Component {
  state = {
    bookings: [],
    isLoading: false,
    outputType: "list"
  };

  static contextType = AuthContext;

  componentDidMount = () => {
    this.getBookings();
  };

  getBookings = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query GetBookings{
            bookings{
              _id createdAt event {
                _id title date price
              }
            }
          }
        `
    };
    const headers = { Authorization: `Bearer ${this.context.token}` };
    let { data } = await postData(requestBody, headers);
    this.setState({ bookings: [...data.bookings], isLoading: false });
  };

  cancelBooking = async bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id){
              _id title
            }
          }
        `,
      variables: {
        id: bookingId
      }
    };
    const headers = { Authorization: `Bearer ${this.context.token}` };
    await postData(requestBody, headers);
    this.setState(prevState => {
      const updatedBookings = prevState.bookings.filter(
        booking => booking._id !== bookingId
      );
      return { bookings: updatedBookings, isLoading: false };
    });
  };

  changeOutputTypehandler = outputType => {
    outputType === "list"
      ? this.setState({ outputType: "list" })
      : this.setState({ outputType: "chart" });
  };

  render() {
    let content = this.state.isLoading ? (
      <Loader />
    ) : (
      <React.Fragment>
        <BookingControls
          activeOutputType={this.state.outputType}
          onChange={this.changeOutputTypehandler}
        />
        <div>
          {this.state.outputType === "list" ? (
            <BookingList
              bookings={this.state.bookings}
              onDelete={this.cancelBooking}
            />
          ) : (
            <BookingChart bookings={this.state.bookings} />
          )}
        </div>
      </React.Fragment>
    );
    return (
      <div>
        <h1>Booking Page</h1>
        <React.Fragment>{content}</React.Fragment>
      </div>
    );
  }
}

export default BookingPage;
