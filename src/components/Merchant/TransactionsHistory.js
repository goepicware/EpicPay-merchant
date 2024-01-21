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
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import filteri from "../../common/images/filter.svg";

import "../../common/css/owl.carousel.css";

var Parser = require("html-react-parser");
var qs = require("qs");
class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Transactions",
      transactionList: [],
      staticblocksList: [],
      termsandcondInfo: "",
      trans_type: "",
      trans_orderby: "",
      search_text: ""
    };

    if (cookie.load("LoginUserId") === undefined) {
      props.history.push("/");
    }

    //this.props.getStaticblocksList("&slug=terms-conditions");
    this.getTransData();
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
    /*setTimeout(
      function () {
        $.magnificPopup.open({
          items: {
            src: ".canceltrans-popup",
          },
          type: "inline",
          midClick: false,
          closeOnBgClick: false,
        });
      }.bind(this),
      300
    );*/
  }

  getTransData() {
    var postObject = {
      app_id: unquieID,
      user_id: cookie.load("LoginUserId"),
      outlet_id: cookie.load("LoginUserOutlet"),
      trans_type: this.state.trans_type,
      trans_orderby: this.state.trans_orderby,
      search_text: this.state.search_text
    };
    showLoaderLst('trans-page-inner','class');
    axios.post(apiUrl + "customer/transactionlist", qs.stringify(postObject))
    .then((res) => {
      hideLoaderLst('trans-page-inner','class');
      if(res.data.status === "ok") {
        this.setState({ transactionList: res.data.result });
      } else {
        this.setState({ transactionList: Array() });
      }
     });
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

  transactionListFun() {
    let transactionList = this.state.transactionList;
    if(Object.keys(transactionList).length > 0) {
      const transactionRowHtml = transactionList.map((transactionRow, rwInt) => {
        
        return (<li>
          <ul>
            <li>{(transactionRow.transaction_qr_type == 'points') ? 'credits' : transactionRow.transaction_qr_type}</li>
            <li>{transactionRow.transaction_product_name}</li>
            <li>
              <span>{transactionRow.customer_first_name}</span>
              <em>{transactionRow.customer_phone}</em>
            </li>
            <li>
              <strong>${transactionRow.transaction_qr_usered_amount}</strong>
              {(transactionRow.transaction_cancel == 'Yes') ? <a href="javascript:void(0)" className="canceled-lnk" >Canceled</a> : (transactionRow.transaction_qr_type == 'points') ? <a href="#" onClick={this.actCancelFun.bind(this,transactionRow)} >Cancel</a> : ''}
            </li>
          </ul>
        </li>
          );
      });
  
      return <ul>{transactionRowHtml}</ul>;
    } else {
      return (<ul>
        <li>
            <p> &nbsp;&nbsp;No Transactions</p>
        </li>
      </ul>);
    }
  }

  actCancelFunOld(selectedTrans,event) {
    event.preventDefault();
    if(Object.keys(selectedTrans).length > 0) {
      this.setState({ selected_trans: selectedTrans},
        function () {
          $.magnificPopup.open({
            items: {
              src: ".canceltrans-popup",
            },
            type: "inline",
            closeOnBgClick: false,
          });
        });
    } else {
      let tempArr = Array();
      this.setState({ selected_trans: tempArr});
    }
  }

  actCancelFun(selectedTrans,event) {
    event.preventDefault();
    if(Object.keys(selectedTrans).length > 0) {

      Swal.fire({
        title: "Are you sure?",
        text: "You want remove this row!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-primary me-3 waves-effect waves-light",
          cancelButton: "btn btn-label-secondary waves-effect",
        },
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var postObject = {
            app_id: unquieID,
            user_id: cookie.load("LoginUserId"),
            outlet_id: cookie.load("LoginUserOutlet"),
            customer_id: selectedTrans.transaction_customer_id,
            transaction_id: selectedTrans.transaction_id
          };

          return axios.post(apiUrl + "customer/canceltransaction", qs.stringify(postObject)).then((res) => {
            return res.data;
          });

        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        console.log(result, "resultresult");
        if (result.value !== "" && result.value !== undefined) {
          if (result.value.status == "ok") {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: result.value.message,
              customClass: {
                confirmButton: "btn btn-success waves-effect",
              },
            }).then((dataarr) => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: "Alert",
              text: result.value.message,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger waves-effect",
              },
            });
          }
        }
      });
    }
  }
  
  comfirmCancelFun(event) {
    event.preventDefault();
    alert('okok');
    /*let selectedTrans = this.state.selected_trans;
    if(Object.keys(selectedTrans).length > 0) {
      var postObject = {
        app_id: unquieID,
        user_id: cookie.load("LoginUserId"),
        outlet_id: cookie.load("LoginUserOutlet"),
        customer_id: selectedTrans.transaction_customer_id,
        transaction_id: selectedTrans.transaction_id
      };
      showLoaderLst('cancel-btn-cls','class');
      axios.post(apiUrl + "customer/canceltransaction", qs.stringify(postObject))
      .then((res) => {
        hideLoaderLst('cancel-btn-cls','class');
        if(res.data.status === "ok") {
          this.getTransData();
          $.magnificPopup.close();
        }
       });
    }*/
  }

  searchandFilter(event) {
    let trans_type = this.state.trans_type;
    let trans_orderby = this.state.trans_orderby;
    let search_text = this.state.search_text;
    if(event.target.name === 'trnstype') {
        trans_type = event.target.value;
    } else if(event.target.name === 'filter') {
      trans_orderby = event.target.value;
    } else if(event.target.name === 'search_text') {
      search_text = event.target.value;  
    }
    this.setState({ trans_type: trans_type, trans_orderby: trans_orderby, search_text: search_text },
      function () {
        this.getTransData();
    });
  }

  render() {
    let termsandcondInfo = this.state.termsandcondInfo;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel trans-page-inner">
          <div className="container">
            <div className="history-search">
              <div className="history-search-form">
                <input type="text" name="search_text" placeholder="Search Customer" value={this.state.search_text} onChange={this.searchandFilter.bind(this)}/>
              </div>
            </div>
            <div className="history-filter">
              <img src={filteri} className="hf-icon" />
              <div className="hf-lhs">
                <label>Filter by :</label>
                <select name="filter" value={this.state.trans_orderby} onChange={this.searchandFilter.bind(this)}>
                  <option value="">select</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
              </div>
              <div className="hf-rhs">
                <select name="trnstype" value={this.state.trans_type} onChange={this.searchandFilter.bind(this)}>
                  <option value="">Type</option>
                  <option value="points">Credits</option>
                  <option value="products">Products</option>
                </select>
              </div>
            </div>
            <div className="history-table">
              <div className="history-table-header">
                <ul>
                  <li>Type</li>
                  <li>Campaign</li>
                  <li>Customer</li>
                  <li>Redeemed</li>
                </ul>
              </div>
              <div className="history-table-body">
                {this.transactionListFun()}
              </div>
            </div>
          </div>
        </div>

                <div id="canceltrans-popup" className="white-popup mfp-hide popup_sec canceltrans-popup">
                  <div className="pouup_in">
                    <h3 className="title1 text-center">Transactions</h3>
                    <div className="process_inner">
                      <div className="process_col">
                        <div className="process_right">
                          <h5>Are you sure you want to cancel this transaction?...</h5>
                          <div className="button cancel-btn-cls" onClick={this.comfirmCancelFun.bind(this)} >
                            Yes Confirm
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
)(withRouter(Transactions));
