/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import { apiUrl, unquieID, baseUrl } from "../Settings/Config";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { IonContent, IonButtons, IonButton,  IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import "@ionic/react/css/core.css";
import reloadQr from "../../common/images/reload_qr.png";

var qs = require('qs');
var downloadTimer = '';

class CompanyQRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 'CompanyQRCode',
      qrcodeData: [],
      qrcode_str: '',
      runingNum: 0,
    };

    if (cookie.load("LoginUserId") === undefined) {
      props.history.push("/");
    }

    if(unquieID !== undefined && unquieID !== '') {
      this.generateCmpQrcode();
    } else {
      this.props.history.push("/");
    }

  }
  componentDidMount() {
     $("body").addClass("hide-overlay");
  }
  componentWillReceiveProps(PropsDt) {
    
  }
  
  setRuningNum() {
    var rct_this = this;
    var runingNum = this.state.runingNum;
    downloadTimer = setInterval(function(){
      if(runingNum <= 0){
        clearInterval(downloadTimer);
      }
      runingNum = runingNum - 1;
      rct_this.setState({ runingNum: runingNum }, function () {
        if(runingNum <= 0) {
            //rct_this.props.history.push("/vouchers");
        }
      });
    }, 1000);
  }

  generateCmpQrcode() {
    var postObject = {};
        postObject = {
          'app_id': unquieID,
          'site_url': baseUrl
        };
    axios.post(apiUrl + "customer/generateCmpnyQrcode", qs.stringify(postObject)).then(res => {
      if (res.data.status === "ok") {
        let qrData = res.data.common.image_source+'/'+res.data.result_set.cust_qr_image;
        this.setState({ qrcodeData: res.data.result_set, qrcode_str: qrData, runingNum: 12 },
          function () {
            /*this.setRuningNum();*/
          }.bind(this)
          );
      }
    });
  }

  goBackFun(event) {
    event.preventDefault();
    clearInterval(downloadTimer);
    this.props.history.push("/menu");
  }

  reloadQrFun(event) {
    event.preventDefault();
    this.generateCmpQrcode();
  }

  render() {
    let qrcode_str = this.state.qrcode_str;
    var runingNum = this.state.runingNum;
    if(qrcode_str != '') {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="mbtm-need-less rel">
          <div className="container">
            <div className="voucher-redeem-detail textcenter">
              <div className="vod-header">
                <h2>Scan QR Now</h2>
                <p>Please show this QR code to our customer</p>
              </div>
              <div className="vod-body">
                <img src={qrcode_str} />
              </div>
              <br></br>
            </div>
          </div>
        </div>

        <IonFooter collapse="fade">
          <div className="container">
          <div className="sticky-single-btn">
             <a href="#" className="button btn-dark" onClick={this.goBackFun.bind(this)}>
              Cancel
            </a>
          </div>
          </div>
        </IonFooter>
      </div>
    );
   }
  }
}

export default (CompanyQRCode);
