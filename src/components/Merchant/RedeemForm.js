/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import cookie from "react-cookies";
import { GET_STATICBLOCKS_LIST } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";

import "../../common/css/owl.carousel.css";

var Parser = require("html-react-parser");

class RedeemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Redeem Credits",
      user_credits: "",
      user_credits_error: "",
      staticblocksList: [],
      termsandcondInfo: "",
    };

    if (
      cookie.load("LoginUserId") === undefined ||
      cookie.load("LoginUserId") === ""
    ) {
      props.history.push("/");
    }

    this.props.getStaticblocksList("&slug=terms-conditions");
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.staticblocksList !== PropsDt.staticblocks) {
      this.setState({ staticblocksList: PropsDt.staticblocks }, function () {
        //this.setMemberInfo();
      });
    }
  }

  handleFldChange(event) {
    const re = /^[0-9 \b]+$/;
    //if(event.target.value === "") {
    var mblnumber = this.space(event.target.value);
    var mblnumberLenght = mblnumber.length;
    this.setState({ user_credits: mblnumber });
    //}
    this.setState({ user_credits_error: "" });
  }

  handleFldChange_old(event) {
    const re = /^[0-9 \b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      var mblnumber = this.space(event.target.value);
      var mblnumberLenght = mblnumber.length;
      if (mblnumberLenght <= 9) {
        this.setState({ user_credits: mblnumber });
      }
    }
    this.setState({ user_credits_error: "" });
  }

  space(el) {
    var numbes = el.replace(/ /g, "");
    return numbes.replace(/(\d{4})/g, "$1 ").replace(/(^\s+|\s+$)/, "");
  }

  gotoRedeemFun(event) {
    event.preventDefault();
    let userCredits = this.state.user_credits;
    if (parseFloat(userCredits) > 0) {
      localStorage.setItem("usercredits", userCredits);
      this.props.history.push("/scanqrcode");
    } else {
      this.setState({ user_credits_error: "please enter credits" });
    }
  }

  render() {
    let termsandcondInfo = this.state.termsandcondInfo;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container textcenter">
            <div className="callout">
              <p>
                Please enter credit amount
                <br /> to redeem here
              </p>
              <input
                type="input"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="Enter credit amount here"
                value={this.state.user_credits}
                onChange={this.handleFldChange.bind(this)}
              />
              {this.state.user_credits_error != "" && (
                <p className="error_info">{this.state.user_credits_error}</p>
              )}
              <a
                href="#"
                className="button"
                onClick={this.gotoRedeemFun.bind(this)}
              >
                Continue to scan QR
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var staticblocksArr = Array();
  if (Object.keys(state.staticblocks).length > 0) {
    if (state.staticblocks[0].status === "ok") {
      staticblocksArr = state.staticblocks[0].result_set;
    }
  }
  return {
    staticblocks: staticblocksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStaticblocksList: (params) => {
      dispatch({ type: GET_STATICBLOCKS_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(RedeemForm));
