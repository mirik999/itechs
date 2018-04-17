import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
//user components
import UserInput from '../../Utils/UserInput';

class Inputs extends PureComponent {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		this.props.getValue(e)
	}

	render() {
		const { profile, editable, style } = this.props;
		return (
			<section className="mt-5" style={style}>
				<div className="row justify-content-center">
					<div className="col-12 col-md-6">
						<UserInput label="profile.about" icon="address-card-o" name="about" onChange={this.onChange}
						           value={profile.about} defaultValue={profile.about} disabled={editable}
						/>
					</div>
					<div className="col-12 col-md-6">
						<UserInput label="profile.contact" icon="envelope-o" name="contact" onChange={this.onChange}
						           value={profile.contact} defaultValue={profile.contact} disabled={editable}
						/>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-12 col-md-6">
						<UserInput label="profile.ptf" icon="file-code-o" name="portfolio" onChange={this.onChange}
						           value={profile.portfolio} defaultValue={profile.portfolio} disabled={editable}
						/>
					</div>
					<div className="col-12 col-md-6">
						<UserInput label="profile.git" icon="code-fork" name="github" onChange={this.onChange}
						           value={profile.github} defaultValue={profile.github} disabled={editable}
						/>
					</div>
				</div>
			</section>
		);
	}
}

Inputs.propTypes = {
	getValue: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	editable: PropTypes.bool.isRequired,
};

export default Inputs;
