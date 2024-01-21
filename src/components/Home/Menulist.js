/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import "../../common/css/owl.carousel.css";
import logo from "../../common/images/logo.png";
import nav from "../../common/images/navigation.svg";
import invoice from "../../common/images/invoice-icon.svg";
import vouc from "../../common/images/voucher-icon.svg";
import wallet from "../../common/images/wallet.svg";
import qrCodeDfl from "../../common/images/qr-codeDfl.png";

class Menulist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      runingNum: 0,
      bottompopup: "regphone"
    };

    if(cookie.load("LoginUserId") === undefined || cookie.load("LoginUserId") === '') {
        props.history.push("/");
    }
    
  }
  
  componentDidMount() {

  }
  
  componentWillReceiveProps(PropsDt) {
    
  }

  goToQrcdPage(event) {
    event.preventDefault();
    this.props.history.push("/companyqr");
  }
  
  render() {
    return (
      <div className="main-div">
        <div className="header-action header-action-mrcht">
          <div className="container">
            <div className="ha-lhs">
              <a href="javascript:void(0)">
                <img src={logo} />
              </a>
            </div>
            <div className="ha-rhs">
              <ul>
              <li className="navsbar">
                <a href="#" onClick={this.goToQrcdPage.bind(this)}>
                  <img src={qrCodeDfl} />
                </a>
              </li> 
                <li className="navsbar">
                  <a href="javascript:void(0)">
                    <img src={nav} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rel">
          <div className="container textcenter mrcht-menu-innner">
            <div className="callout mrcht-menu-callout">
              <div className="three-nav">
                  <Link to={"/scanqrcode"} className="button rv-btn" title="Vouchers" >
                    {" "}
                    <img src={vouc} /> Redeem Voucher{" "}
                  </Link>
                  <Link to={"/redeem"} title="Redeem Credits" className="button rc-btn">
                    {" "}
                    <img src={wallet} /> Redeem Credits{" "}
                  </Link>
                  <Link to={"/transactions"} title="View Daily Transactions" className="button vdt-btn">
                    {" "}
                    <img src={invoice} /> View Daily Transactions{" "}
                  </Link>
                  <Link to={"/logout"} title="Logout" className="button vdt-btn">
                    {" "} Logout{" "}
                  </Link>
                </div>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

export default (Menulist);
