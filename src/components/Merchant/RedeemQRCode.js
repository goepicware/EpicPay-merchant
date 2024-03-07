/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { format } from "date-fns";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import cookie from "react-cookies";
import { GET_STATICBLOCKS_LIST } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";

import "../../common/css/owl.carousel.css";

var Parser = require("html-react-parser");
var qs = require("qs");

class RedeemQRCode extends Component {
  constructor(props) {
    super(props);
    var usercredits =
      localStorage.getItem("usercredits") === null
        ? 0
        : localStorage.getItem("usercredits");
    this.state = {
      current_page: "Redeem Voucher",
      qr_details: [],
      qr_detail_error: "",
      user_credits: usercredits,
      redeemqr_error: "",
      staticblocksList: [],
      termsandcondInfo: "",
    };

    if (parseFloat(usercredits) > 0) {
      localStorage.removeItem("usercredits");
    }

    /*var qrcodetxt = (localStorage.getItem('qrcodetxt') === null) ? '' : localStorage.getItem('qrcodetxt');
    if(qrcodetxt !== '') {
      localStorage.removeItem("qrcodetxt");
      this.getVoucherData(qrcodetxt);
    } else {
      props.history.push("/");
    }*/

    //this.props.getStaticblocksList("&slug=terms-conditions");
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");

    var qrcodetxt =
      localStorage.getItem("qrcodetxt") === null
        ? ""
        : localStorage.getItem("qrcodetxt");
    if (qrcodetxt !== "") {
      localStorage.removeItem("qrcodetxt");
      this.getVoucherData(qrcodetxt);
    } else {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.staticblocksList !== PropsDt.staticblocks) {
      this.setState({ staticblocksList: PropsDt.staticblocks }, function () {
        //this.setMemberInfo();
      });
    }
  }

  getVoucherData(qrCodeVal) {
    var postObject = {
      app_id: unquieID,
      cust_qr_str: qrCodeVal,
    };
    showLoaderLst("redeem-page-main", "class");
    axios
      .post(apiUrl + "customer/readQrcode", qs.stringify(postObject))
      .then((res) => {
        hideLoaderLst("redeem-page-main", "class");
        if (res.data.status === "ok") {
          this.setState({ qr_details: res.data.result_set });
        } else {
          this.setState({ qr_details: Array(), qr_detail_error: "yes" });
        }
      });
  }

  goBackTo(event) {
    event.preventDefault();
    this.props.history.push("/menu");
  }

  comfirmRedeemFun(event) {
    event.preventDefault();
    let qrDetails = this.state.qr_details;
    let userCredits = this.state.user_credits;
    if (
      Object.keys(qrDetails).length > 0 &&
      ((qrDetails[0].cust_qr_type == "products" &&
        Object.keys(qrDetails[0].product_detail).length > 0) ||
        (qrDetails[0].cust_qr_type == "points" && parseFloat(userCredits) > 0))
    ) {
      var postObject = {
        app_id: unquieID,
        cust_qr_str: qrDetails[0].cust_qr_str,
        cust_qr_id: qrDetails[0].cust_qr_primary_id,
        user_outlet_id: cookie.load("LoginUserOutlet"),
        user_id: cookie.load("LoginUserId"),
        user_credits: userCredits,
      };

      showLoaderLst("redeem-btn-cls", "class");
      axios
        .post(apiUrl + "customer/redeemQrcode", qs.stringify(postObject))
        .then((res) => {
          hideLoaderLst("redeem-btn-cls", "class");
          if (res.data.status === "ok") {
            Swal.fire({
              icon: "success",
              title: "Redeemed!",
              text: "Credits (OR) Voucher has been redeemed succuessfully.",
              customClass: {
                confirmButton: "btn btn-success waves-effect",
              },
            }).then((dataarr) => {
              this.props.history.push("/transactions");
            });
            //this.setState({ qr_details: res.data.result_set });
          } else {
            this.setState({ redeemqr_error: res.data.message });
          }
        });
    } else {
      this.setState({ redeemqr_error: "Invalide QR" });
    }
  }

  render() {
    let qrDetails = this.state.qr_details;
    console.log("qrDetails", qrDetails);
    return (
      <div className="main-div redeem-page-main">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel redeem-page-inner">
          <div className="container">
            {Object.keys(qrDetails).length > 0 ? (
              <div className="redeem-profie">
                <div className="redeem-profie-box">
                  <figure></figure>
                  <figcaption>
                    <h2>{qrDetails[0].customer_first_name}</h2>
                    <span>{qrDetails[0].customer_phone}</span>
                  </figcaption>
                </div>
                {qrDetails[0].cust_qr_type == "products" ? (
                  <>
                    <div className="redeem-profie-points textcenter">
                      <p>Product to Redeem</p>
                      <strong className="textcls">
                        1 X {qrDetails[0].product_detail.product_alias}
                      </strong>
                      <p>Product to Redeem</p>
                    </div>
                    <div className="voucher-detail-body">
                      Valid Till :
                      {qrDetails[0].product_detail
                        .product_voucher_expiry_date !== "" &&
                      qrDetails[0].product_detail
                        .product_voucher_expiry_date !== null &&
                      qrDetails[0].product_detail
                        .product_voucher_expiry_date !== "0000-00-00"
                        ? format(
                            new Date(
                              qrDetails[0].product_detail.product_voucher_expiry_date
                            ),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                    </div>
                    <div className="voucher-detail-body">
                      {qrDetails[0].product_detail.product_long_description !==
                        "" &&
                      qrDetails[0].product_detail.product_long_description !==
                        null
                        ? Parser(
                            qrDetails[0].product_detail.product_long_description
                          )
                        : ""}
                    </div>
                  </>
                ) : (
                  <div className="redeem-profie-points textcenter">
                    <p>Credits to Redeem</p>
                    <strong>{this.state.user_credits}</strong>
                  </div>
                )}
                {this.state.redeemqr_error != "" && (
                  <p className="error_info">{this.state.redeemqr_error}</p>
                )}
                <div className="redeem-profie-btn textcenter">
                  <a
                    href={void 0}
                    className="button ghost-btn"
                    onClick={this.goBackTo.bind(this)}
                  >
                    Cancel
                  </a>
                  <a
                    href={void 0}
                    className="button redeem-btn-cls"
                    onClick={this.comfirmRedeemFun.bind(this)}
                  >
                    Confirm
                  </a>
                </div>
              </div>
            ) : (
              <div className="redeem-profie invalide-qr-div">
                {this.state.qr_detail_error == "yes" && (
                  <>
                    <div className="redeem-profie-box">
                      <div className="invalide-qr-cls">
                        <h2>Invalide QR Code</h2>
                        <span>
                          Sorry This voucher can not be reddemm at this outlet
                        </span>
                      </div>
                    </div>
                    <div className="redeem-profie-btn textcenter">
                      <a
                        href={void 0}
                        className="button ghost-btn"
                        onClick={this.goBackTo.bind(this)}
                      >
                        Try Agin
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
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
)(withRouter(RedeemQRCode));
