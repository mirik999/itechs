import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { Input } from 'mdbreact';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';


class UserInput extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange = (e) => {
		this.props.onChange(e);
	}

	render() {
		const { label, icon, type, name, value, errorLabel, className } = this.props;
		return (
			<FormattedMessage id={ label }>
				{
					txt => (
						<Fragment>
							<Input
								label={txt} icon={icon} type={type} name={name} value={value} onChange={this.onChange}
								autoComplete="off" className={className}
							/>
							<span className="text-danger small float-right" style={styles.error}>{ errorLabel ? errorLabel : " " }</span><br />
						</Fragment>
					)
				}
			</FormattedMessage>
		);
	}
}

const styles = {
	error: {
		position: "relative",
		bottom: "20px"
	}
}

UserInput.propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	className: PropTypes.string,
	errorLabel: PropTypes.object,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]).isRequired,
	onChange: PropTypes.func,
};

UserInput.defaultProps = {
	label: "text",
	icon: "user",
	type: "text",
	name: "input",
};

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	};
}

export default connect(mapStateToProps)(UserInput);
