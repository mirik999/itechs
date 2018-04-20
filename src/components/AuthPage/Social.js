import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import FacebookProvider, { Login } from 'react-facebook';
import GoogleLogin from 'react-google-login';
import { Button, Fa } from 'mdbreact';
// actions
import { facebookLogin, googleLogin } from '../../actions/user';
//css
import './Social.css';

class Social extends PureComponent {
	constructor(props) {
		super(props);

		this.responseFacebook = this.responseFacebook.bind(this);
		this.responseGoogle = this.responseGoogle.bind(this);
	}

	responseFacebook = async (res) => {
		const data = res;
		await this.props.facebookLogin(data)
		window.location.href = "/";
	};

	responseGoogle = async (res) => {
		const { profileObj, tokenObj } = res;
		const data = Object.assign({}, profileObj, tokenObj);
		await this.props.googleLogin(data)
		window.location.href = "/";
	};

	render() {
		return (
			<div className="pb-2 d-inline-flex float-right wp">
				<div className="d-inline-flex">
					<FacebookProvider appId="128678167815456">
						<Login
							scope="email"
							onResponse={this.responseFacebook}
						>
							<Button tag="a" size="sm" floating gradient="aqua"><Fa icon="facebook" /></Button>
						</Login>
					</FacebookProvider>
					<FacebookLogin
						appId="128678167815456"
						fields="name,email,picture.width(100).height(100)"
						callback={this.responseFacebook}
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
