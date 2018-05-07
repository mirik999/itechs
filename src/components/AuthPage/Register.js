import React, {PureComponent} from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Card, CardImage, CardBody, Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
import { ToastContainer, toast } from 'react-toastify';
//user components
import UserInput from '../Utils/UserInput';


class Register extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				email: '',
				pass: '',
				uname: ''
			},
			errors: {}
		}

		this.txt = {
			emailError: <FormattedMessage id="error.email" />,
			unameError: <FormattedMessage id="error.username" />,
			passError: <FormattedMessage id="error.password" />,
			globalEmailErr: <FormattedMessage id="errorglobal.email" />,
			globalUnameErr: <FormattedMessage id="errorglobal.username" />,
			register: <FormattedMessage id="button.register" />,
			haveAnAccaunt: <FormattedMessage id="button.haveAcc" />,
		}


		this.validate = this.validate.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = async (e) => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			try {
				await this.props.submit(this.state.data)
			} catch(err) {
				this.setState({ errors: err.response.data.errors })
			}
		}
	}

	onChange = (e) => {
		this.setState({ ...this.state,
			data: { ...this.state.data, [e.target.name]: e.target.value },
			errors: {}
		})
	}

	validate = (data) => {
		const errors = {};
		if (!validator.isEmail(data.email)) {
			toast.warn(this.txt.emailError)
			errors.email = this.txt.emailError;
		}
		if (!validator.isLength(data.uname, { min:3, max: 12 })) {
			toast.warn(this.txt.unameError)
			errors.uname = this.txt.unameError;
		}
		if (!data.pass) {
			toast.warn(this.txt.passError)
			errors.password = this.txt.passError;
		}
		return errors;
	}

	render() {
		const { data, errors } = this.state;
		errors.global && (errors.global.email && toast.warn(this.txt.globalEmailErr))
		errors.global && (errors.global.username && toast.warn(this.txt.globalUnameErr))

		return (
			<div className={!this.props.toggle ? "row justify-content-center" : "d-none"}>
				<div className="col-12 col-sm-10 col-md-8 col-xl-6 mt-5">
					<form onSubmit={this.onSubmit}>
						<Card cascade>
							<CardImage tag="div">
								<div className="view gradient-card-header purple-gradient">
									<h2 className="h2-responsive"><Fa icon="lock" />&nbsp;{ this.txt.register }:</h2>
								</div>
							</CardImage>
							<CardBody>

								<UserInput label="input.uname" icon="vcard" type="text" name="uname"
								           onChange={this.onChange} value={data.uname} />

								<UserInput label="input.email" icon="envelope" type="email" name="email"
								           onChange={this.onChange} value={data.email} />

								<UserInput label="input.pass" icon="lock" type="password" name="pass"
								           onChange={this.onChange} value={data.pass} />

								<div className="">
									<Button type="submit"><Fa icon="sign-in" />&nbsp; { this.txt.register }</Button>
									<Tooltip id="tooltip-icon" title={ this.txt.haveAnAccaunt }>
										<Button tag="a" floating gradient="purple" size="sm" onClick={ () => this.props.set() }>
											<Fa icon="check-circle" />
										</Button>
									</Tooltip>
								</div>
							</CardBody>
						</Card>
					</form>
				</div>
				<ToastContainer />
			</div>
		);
	}
}

Register.propTypes = {
	submit: PropTypes.func,
	toggle: PropTypes.bool,
	set: PropTypes.func,
	lang: PropTypes.string,
};

export default Register;
