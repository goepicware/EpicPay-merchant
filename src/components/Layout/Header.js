/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import logo from "../../common/images/logo.png";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";
import cookie from "react-cookies";
import invoice from "../../common/images/invoice-icon.svg";
import vouc from "../../common/images/voucher-icon.svg";
import wallet from "../../common/images/wallet.svg";
import back from "../../common/images/back-arrow.svg";
import qrCodeDfl from "../../common/images/qr-codeDfl.png";

var Parser = require('html-react-parser');
class Header extends Component {
	
	 constructor(props) {
		super(props);
		this.state = { toppageData: [], menuActive: 'hide', headerBlocks: "", headerlink:'' };
	 }
	 
	 componentDidMount() {
   }
	  
   componentWillReceiveProps(PropsData) {
      if(this.state.toppageData !== PropsData.mainpagestate) {
          this.setState({ toppageData: PropsData.mainpagestate});
      }
	 }

   openMenuFun(event) {
      event.preventDefault();
      /*this.setState({ menuActive: 'open' });
      $('.side-bar-maincls').addClass('open');*/
      this.props.prntPagePrps.history.push("/menu");
   }

   goToNavPage(activepage, event) {
      event.preventDefault();
      let pageTxt = '';
      /*if(activepage == 'Top Up') {
        pageTxt = 'myaccount';
      } else if(activepage == 'History' || activepage == 'Tier Benefits' || activepage == 'T & C' || activepage == 'Vouchers') {
        pageTxt = 'rewards';
      } else if(activepage == 'VouchersDetail' || activepage == 'VouchersRedeem') {
        pageTxt = 'vouchers';
      } else if(activepage == 'Checkout') {
        pageTxt = 'topup';  
      }*/
      this.props.prntPagePrps.history.push("/"+pageTxt);
    }

    showVoucher(tabTxt, event) {
      event.preventDefault();
      cookie.save("vouchers_show", tabTxt, { path: "/" });
      this.props.prntPagePrps.history.push("/vouchers");
    }

    goToQrcdPage(event) {
      event.preventDefault();
      this.props.prntPagePrps.history.push("/companyqr");
    }

	 render() {
    let activepage = (Object.keys(this.props.mainpagestate).length > 0) ? this.props.mainpagestate.current_page : '';
		return (<>
				<header className="header-main">
						<div className="header-action header-center-txt">
              <div className="container">

                {(activepage === 'My Account')?<><div className="ha-lhs">
                  <a href="#">
                    <img src={logo} />
                  </a>
                </div></>:<><div className="ha-lhs-arrow">
                    <a href="#" onClick={this.goToNavPage.bind(this,activepage)}>
                      <img src={back} />
                    </a>
                </div>
                <div className="ha-middle">{(activepage != 'VouchersDetail' && activepage != 'VouchersRedeem')?activepage:''}</div></>}
                <div className="ha-rhs">
                  <ul>
                  {(activepage != 'CompanyQRCode')&&<li className="navsbar">
                      <a href="#" onClick={this.goToQrcdPage.bind(this)}>
                        <img src={qrCodeDfl} />
                      </a>
                    </li>}
                    <li className="navsbar">
                      <a href="#" onClick={this.openMenuFun.bind(this)}>
                        <img src={nav} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
          </div>

				</header>

        <div className={"side-bar full-height side-bar-maincls"}>
            <div className="container">
              <div className="three-nav">
                <Link to={"/refpage/vouchers"} className="button rv-btn" title="Vouchers" >
                  {" "}
                  <img src={vouc} /> Vouchers{" "}
                </Link>
                <Link to={"/refpage/topup"} title="Redeem Credits" className="button rc-btn">
                  {" "}
                  <img src={wallet} /> Topup Credits{" "}
                </Link>
                <Link to={"/refpage/history"} title="View Daily Transactions" className="button vdt-btn">
                  {" "}
                  <img src={invoice} /> View History{" "}
                </Link>
                <Link to={"/logout"} title="Logout" className="button vdt-btn">
                  {" "}
                  <img src={invoice} /> Logout{" "}
                </Link>
              </div>
            </div>
        </div>

			    </>);
	}
}

export default (Header);
