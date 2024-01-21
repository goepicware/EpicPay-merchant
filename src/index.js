import React from "react";
/* import { render } from "react-dom"; */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./common/css/font-awesome.min.css";
import "./common/css/bootstrap.min.css";
import "./common/css/style.css";
import "./common/css/responsive.css";
import "./common/css/slick.css";
import Home from "./components/Home/Home";
import Menulist from "./components/Home/Menulist";
import Scanqrcode from "./components/Merchant/Scanqrcode";
import RedeemQR from "./components/Merchant/RedeemQR";
import RedeemQRCode from "./components/Merchant/RedeemQRCode";
import RedeemForm from "./components/Merchant/RedeemForm";
import RedeemProfile from "./components/Merchant/RedeemProfile";
import TransactionsHistory from "./components/Merchant/TransactionsHistory";
import CompanyQRCode from "./components/Merchant/CompanyQRCode";
import Logout from "./components/Layout/Logout";

import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        {/*  Master Admin Start*/}
        <Route exact path="/" component={Home} />

        <Route path="/menu" component={Menulist} />
        <Route path="/scanqrcode" component={Scanqrcode} />
        <Route path="/redeemqr/:slugval" component={RedeemQR} />
        <Route path="/redeemqrcode" component={RedeemQRCode} />
        <Route path="/redeem" component={RedeemForm} />
        <Route path="/redeeminfo" component={RedeemProfile} />
        <Route path="/transactions" component={TransactionsHistory} />
        <Route path="/companyqr" component={CompanyQRCode} />

        <Route exact path="/logout" component={Logout} />

        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
