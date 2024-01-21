import React,{Component} from 'react';
import cookie from 'react-cookies';

class RedeemQR extends Component {

  constructor(props) {
        super(props);
		
    let slugval = typeof this.props.match.params.slugval !== "undefined" ? this.props.match.params.slugval : "";
		
		if(slugval !== '') {
      localStorage.setItem('qrcodetxt', slugval);
			this.props.history.push('/redeemqrcode');
		} else {		
			this.props.history.push('/');
		}
    
  }		

  render() {
    return (<div></div>);
  }
}

export default RedeemQR;