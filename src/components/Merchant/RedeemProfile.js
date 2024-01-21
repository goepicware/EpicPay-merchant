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

class RedeemProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Redeem Credits",
      staticblocksList: [],
      termsandcondInfo: "",
    };

    /*if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }*/

    this.props.getStaticblocksList("&slug=terms-conditions");
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.staticblocksList !== PropsDt.staticblocks) {
      this.setState({ staticblocksList: PropsDt.staticblocks }, function () {
        this.setMemberInfo();
      });
    }
  }

  setMemberInfo() {
    let staticblocksList = this.state.staticblocksList;
    let termsandcondInfo = "";
    if (Object.keys(staticblocksList).length > 0) {
      const staticblockHtml = staticblocksList.map((staticblock, rwInt) => {
        if (staticblock.staticblocks_slug == "terms-conditions") {
          termsandcondInfo = staticblock.staticblocks_description;
        }
        return staticblock;
      });
    }
    let termsandcondInfoHtml =
      termsandcondInfo != "" ? Parser(termsandcondInfo) : "";
    this.setState({ termsandcondInfo: termsandcondInfoHtml });
  }

  render() {
    let termsandcondInfo = this.state.termsandcondInfo;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="redeem-profie">
              <div className="redeem-profie-box">
                <figure></figure>
                <figcaption>
                  <h2>John Tan</h2>
                  <span>9343 1234</span>
                </figcaption>
              </div>
              <div className="redeem-profie-points textcenter">
                <p>Points to Redeem</p>
                <strong>20</strong>
              </div>
              <div className="redeem-profie-btn textcenter">
                <a href="#" className="button ghost-btn">
                  Cancel
                </a>
                <a href="#" className="button">
                  Confirm
                </a>
              </div>
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
)(withRouter(RedeemProfile));
