import React, { Component } from "react";
import cookie from "react-cookies";

class Logout extends Component {
  componentWillMount() {
    cookie.remove("LoginUserId");
    cookie.remove("LoginUserEmail");
    cookie.remove("LoginUserFname");
    cookie.remove("LoginUserOutlet");

    localStorage.removeItem("company_id");
    localStorage.removeItem("company_app_id");

    this.props.history.push("/");
  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
