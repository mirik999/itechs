import React, {Component} from 'react';
import {connect} from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
// actions
import { facebookLogin, googleLogin } from '../../actions/user';
//css
import './Social.css';

class Social extends Component {
	constructor(props) {
		super(props);

		this.responseFacebook = this.responseFacebook.bind(this);
		this.rejectFacebook = this.rejectFacebook.bind(this);
		this.responseGoogle = this.responseGoogle.bind(this);
	}

	responseFacebook = (res) => {
		const data = res;
		this.props.facebookLogin(data)
			.then(() => {
				window.location.href = "/";
			});
	};

	rejectFacebook = (rej) => {
		console.log(rej)
	}

	responseGoogle = (res) => {
		const { profileObj, tokenObj } = res;
		const data = Object.assign({}, profileObj, tokenObj);
		this.props.googleLogin(data)
			.then(() => {
				window.location.href = "/";
			});
	};

	render() {
		return (
			<div className="pb-2 d-inline-flex float-right wp">
				<div className="d-inline-flex">
					<FacebookLogin
						appId="128678167815456"
						fields="name,email,picture.width(100).height(100)"
						callback={this.responseFacebook}
						onFailure={this.rejectFacebook}
						cssClass="btn-floating peach-gradient btn-sm waves-effect waves-light loginbtn"
						textButton=" "
						icon="fa fa-facebook left"
					/>
				</div>
				<div className="d-inline-flex">
					<GoogleLogin
						clientId="383895273891-2anvbeo2f2e0188hlnv8sinuksg2ru82.apps.googleusercontent.com"
						onSuccess={this.responseGoogle}
						className="btn-floating peach-gradient btn-sm waves-effect waves-light loginbtn"
						buttonText=" "
					>
						<i className="fa fa-google left"></i>
					</GoogleLogin>
				</div>
			</div>
		);
	}
}

export default connect(null, { facebookLogin, googleLogin })(Social);
