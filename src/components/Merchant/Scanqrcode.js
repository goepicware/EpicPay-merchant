/* eslint-disable */
import React, { Component } from "react";
import QrReader from "react-qr-reader";

class Scanqrcode extends Component {
  constructor(props) {
    super(props);
    this.state = { pagedetail: "" };
  }
  handleScan = (data) => {
    if (data && data !== null) {
      if (data.substring(0, 4) == "http" || data.substring(0, 4) == "https") {
        window.location.href = data;
      }
      if (data != "") {
        this.props.history.push("/redeemqr/" + data);
      } else {
        $.magnificPopup.open({
          items: {
            src: "#dinein-url-popup",
          },
          type: "inline",
        });
        return false;
      }
    }
  };
  handleError = (err) => {
    // this.setState({dine_in_click: "No"});
    //$.magnificPopup.close();
  };
  render() {
    return (
      <div className="dinein-scantable">
        <div className="dinein-heading">
          <p>
            {" "}
            <a className="button" href="/">Back</a>
          </p>
          <h5>Scan QR code and Redeem Credits OR Voucher</h5>
        </div>
        <div id="qr_code" className="dinein-scantable-inner">
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: "100%" }}
          />
        </div>
        {/*Dine In Errorpopup for scan*/}
        <div
          id="dinein-url-popup"
          className="white-popup mfp-hide popup_sec warning_popup"
        >
          <div className="custom_alert">
            <div className="custom_alertin">
              <div className="alert_height">
                <div className="alert_header">Information</div>
                <div className="alert_body">
                  <p>You are trying to Scan wrong QR code</p>
                  <div className="alt_btns alt-btns">
                    <a
                      href="#"
                      className="button button-left popup-modal-dismiss disbl_href_action"
                    >
                      Ok
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Scanqrcode;
