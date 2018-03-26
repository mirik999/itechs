import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//user components
import Wrapper from '../Utils/Wrapper';
import Register from './Register';
import Enter from './Enter';
//actions
import { register } from '../../actions/user';
import { enter } from '../../actions/user';


class AuthPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			toggle: true
		}

		this.onSubmit = this.onSubmit.bind(this);
		this.setDsiplay = this.setDsiplay.bind(this);
	}

	setDsiplay = () => {
		this.setState({ toggle: !this.state.toggle })
	}

	onSubmit = (data) => {
		if (Object.keys(data).length === 3) {
			return this.props.register(data)
				.then(() => this.props.history.push("/"))
		}
		else if (Object.keys(data).length === 2) {
			return this.props.enter(data)
				.then(() => this.props.history.push("/"))
		}
	}

	render() {
		const { toggle } = this.state;

		return (
			<Wrapper>
				<div className="py-3"></div>
				<Register submit={this.onSubmit} toggle={toggle} set={this.setDsiplay} />
				<Enter submit={this.onSubmit} toggle={toggle} set={this.setDsiplay} />
			</Wrapper>
		);
	}
}

AuthPage.propTypes = {
	register: PropTypes.func,
	enter: PropTypes.func,
};

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { register, enter })(AuthPage);
