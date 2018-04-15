import React, {PureComponent} from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { Card, CardImage, CardBody, Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
//user components
import UserInput from '../Utils/UserInput';
import Social from './Social';


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

	onSubmit = (e) => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.submit(this.state.data)
				.catch(err => this.setState({ errors: err.response.data.errors }))
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
		if (!validator.isEmail(data.email)) errors.email = this.txt.emailError;
		if (!data.pass) errors.password = this.txt.passError;
		return errors;
	}

	render() {
		const { data, errors } = this.state;
		const handleEnterErr = errors.global && (errors.global && this.txt.globalEnterErr)
		
		return (
			<div className={this.props.toggle ? "row justify-content-center" : "d-none"}>
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
								           onChange={this.onChange} value={data.email} errorLabel={errors.email || handleEnterErr} />

								<UserInput label="input.pass" icon="lock" type="password" name="pass"
								           onChange={this.onChange} value={data.pass} errorLabel={errors.password || handleEnterErr} />

								<div className="">
									<Button type="submit"><Fa icon="sign-in" /> &nbsp; { this.txt.enter }</Button>
									<Tooltip id="tooltip-icon" title={ this.txt.createAnAccaunt }>
										<Button tag="a" floating gradient="peach" size="sm" onClick={ () => this.props.set() }>
											<Fa icon="plus-circle" />
										</Button>
									</Tooltip>
									<Social />
								</div>
							</CardBody>
						</Card>
					</form>
				</div>
			</div>
		);
	}
}

export default Enter;
