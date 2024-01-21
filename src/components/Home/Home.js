/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { apiUrl, unquieID, baseUrl } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import update from "immutability-helper";
import "../../common/css/owl.carousel.css";
import logo from "../../common/images/logo.png";
import nav from "../../common/images/navigation.svg";

var qs = require("qs");

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_user_name: '',
      login_user_password: '',
      userlogin_error: ''
    };

    if(cookie.load("LoginUserId") !== undefined && cookie.load("LoginUserId") !== '') {
        props.history.push("/menu");
    }

  }
  
  componentDidMount() {

  }
  
  componentWillReceiveProps(PropsDt) {
    
  }
  
  handleFldChange(event) {
    if(event.target.name === "user_name") {
      this.setState({ login_user_name: event.target.value });
    } else if(event.target.name === "user_password") {
      this.setState({ login_user_password: event.target.value });
    }
    this.setState({ userlogin_error: '' });
  }

  userLogin(event) {
    event.preventDefault();
    var errorMgs = '';
        if(this.state.login_user_name == '') {
          errorMgs = 'User Name required';
        } else if(this.state.login_user_password == '') {  
          errorMgs = 'Password required';
        }

  if(errorMgs == '') {
      var postObject = {
        app_id: unquieID,
        username: this.state.login_user_name,
        password: this.state.login_user_password
      };
      showLoaderLst('login-divcls','class');
      axios.post(apiUrl + "clientpanel/clients/login", qs.stringify(postObject))
      .then((res) => {
        hideLoaderLst('login-divcls','class');
        if(res.data.status === "ok") {
          //this.setState({ bottompopup: 'regpersonal', runingNum: 0 });

          let custArr = res.data.result;

          localStorage.setItem('company_id', custArr.company_id);
          localStorage.setItem('company_app_id', custArr.company_unquie_id);

          cookie.save("LoginUserId", custArr.company_admin_id);
          cookie.save("LoginUserEmail", custArr.company_user_email_address);
          cookie.save("LoginUserFname", custArr.company_firstlast_name !== "" ? custArr.company_firstlast_name : "");
          cookie.save("LoginUserOutlet", custArr.user_permission_outlet);

          let $_this = this;
          setTimeout(function () {
              //$_this.props.history.push("/menu");
              window.location.href = baseUrl+"menu";
          }, 0);
        } else {
          this.setState({ userlogin_error: res.data.message });
        }
      });

    } else {
      this.setState({ userlogin_error: errorMgs });
    }
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
                  <a href="javascript:void(0)">
                    <img src={nav} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rel">
          <div className="container textcenter mrcht-login-innner">
            <div className="callout mrcht-login-callout">
              <h4>Login</h4>
              <input type="text" placeholder="User Name" name="user_name" value={this.state.login_user_name} onChange={this.handleFldChange.bind(this)}/>
              <input type="password" placeholder="Password" name="user_password" value={this.state.login_user_password} onChange={this.handleFldChange.bind(this)}/>
              <a href="#" className="button login-divcls" onClick={this.userLogin.bind(this)}>
                  Login
              </a>
              {(this.state.userlogin_error != '') && <p className="error_info">{this.state.userlogin_error}</p>}
            </div>
          </div>
        </div>


      </div>
    );
  }
}

export default (Home);
