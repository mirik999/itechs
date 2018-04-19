import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//user components
import Wrapper from '../Utils/Wrapper';
import Register from './Register';
import Enter from './Enter';
//actions
import { register } from '../../actions/user';
import { enter } from '../../actions/user';


class AuthPage extends PureComponent {
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

	onSubmit = async (data) => {
		if (Object.keys(data).length === 3) {
			await this.props.register(data)
			window.location.href = '/';
		}
		else if (Object.keys(data).length === 2) {
			await this.props.enter(data)
			window.location.href = '/';
		}
	}

	render() {
		const { toggle } = this.state;
		const { lang } = this.props;

		return (
			<Wrapper>
				<div className="py-3"></div>
				<Register submit={this.onSubmit} toggle={toggle} set={this.setDsiplay} lang={lang} />
				<Enter submit={this.onSubmit} toggle={toggle} set={this.setDsiplay} lang={lang} />
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
