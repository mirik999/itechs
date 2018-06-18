import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { Card, CardImage, CardBody, Button, Fa } from 'mdbreact';
import Tooltip from '@material-ui/core/Tooltip';
import { ToastContainer, toast } from 'react-toastify';
//user components
import UserInput from '../Utils/UserInput';
import Social from './Social';
import Wrapper from '../Utils/Wrapper';
//actions
import { enter } from '../../actions/user';


class Enter extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			data: {
				email: '',
				pass: ''
			},
			errors: {}
		}

		this.txt = {
			emailError: <FormattedMessage id="error.email" />,
			passError: <FormattedMessage id="error.password" />,
			globalEmailErr: <FormattedMessage id="errorglobal.email" />,
			globalEnterErr: <FormattedMessage id="errorglobal.enter" />,
			enter: <FormattedMessage id="button.enter" />,
			createAnAccaunt: <FormattedMessage id="button.createAcc" />,
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
				await this.props.enter(this.state.data)
				window.location.href = '/';
			} catch(err) {
				this.setState({ errors: err.response.data.errors })
			}
		}
	}

	onChange = (e) => {
		this.setState({
			...this.state,
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
		if (!data.pass) {
			toast.warn(this.txt.passError)
			errors.password = this.txt.passError;
		}
		return errors;
	}

	render() {
		const { data, errors } = this.state;
		errors.global && (errors.global && toast.warn(this.txt.globalEnterErr))
		
		return (
			<Wrapper>
			<div className="row justify-content-center">
				<div className="col-12 col-sm-10 col-md-8 col-xl-6 mt-5">
					<form onSubmit={this.onSubmit}>
						<Card cascade>
							<CardImage tag="div">
								<div className="view gradient-card-header peach-gradient">
									<h2 className="h2-responsive"><Fa icon="lock" />&nbsp; { this.txt.enter }:</h2>
								</div>
							</CardImage>
							<CardBody>

								<UserInput label="input.email" icon="envelope" type="text" name="email"
								           onChange={this.onChange} value={data.email} />

								<UserInput label="input.pass" icon="lock" type="password" name="pass"
								           onChange={this.onChange} value={data.pass} />

								<div className="">
									<Button type="submit"><Fa icon="sign-in" /> &nbsp; { this.txt.enter }</Button>
									<Tooltip id="tooltip-icon" title={ this.txt.createAnAccaunt }>
										<Link to="/user/register" className="btn-floating peach-gradient btn-sm waves-effect waves-light loginbtn">
											<Fa icon="plus-circle" />
										</Link>
									</Tooltip>
									<Social />
								</div>
							</CardBody>
						</Card>
					</form>
				</div>
				<ToastContainer />
			</div>
			</Wrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { enter })(Enter);
