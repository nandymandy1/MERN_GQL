import "./Auth.css";
import React, { Component } from "react";
import { postData } from "../services/api";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  submitHandler = async e => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: this.state.isLogin
        ? `
        query LoginUser($email:String!, $password:String!){
          loginUser(email: $email, password: $password){
            userId token tokenExpiration
          }
        }
      `
        : `
        mutation CreateUser($email:String!, $password:String!){
          registerUser(userInput: {email: $email, password: $password}){
            _id email
          }
        }
      `
    };
    requestBody["variables"] = {
      email,
      password
    };
    let response = await postData(requestBody);
    if (response.data.loginUser.token) {
      let { token, userId, tokenExpiration } = response.data.loginUser;
      this.context.login(token, userId, tokenExpiration);
    }
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            ref={this.emailEl}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            ref={this.passwordEl}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch To {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
