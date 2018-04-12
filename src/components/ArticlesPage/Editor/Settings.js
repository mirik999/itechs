import React, {Component, Fragment} from 'react';
import { Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
//user components
import UserInput from '../../Utils/UserInput';


class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			disableComment: false,
			errors: {}
		}

		this.txt = {
			share: <FormattedMessage id="profile.article" />,
			disableComment: <FormattedMessage id="toggle.comment" />
		}

		this.onSave = this.onSave.bind(this)
		this.onToggle = this.onToggle.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onToggle = () => {
		this.setState({ disableComment: !this.state.disableComment });
	};

	onSave = () => {
		this.props.getSettings(this.state)
	}
	
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value, errors: {} })
	}

	render() {
		const { disableComment, title } = this.state;

		return (
			<Fragment>
				<div className="float-left" style={{ height: "60px"}}>
					<UserInput label="article.title"
					           name="title" value={title}
					           onChange={this.onChange} icon="header"
					           className="mb-0"
					/>
				</div>
				<div className="float-right">
					<Tooltip id="tooltip-icon" title={this.txt.disableComment}>
						<div className="switch d-inline-flex">
							<label>
								<input type="checkbox" checked={disableComment} onChange={this.onToggle} />
								<span className="lever"></span>
							</label>
						</div>
					</Tooltip>
					<Tooltip id="tooltip-icon" title={this.txt.share}>
						<Button tag="a" size="sm" name="save" floating gradient="purple" onClick={this.onSave}>
							<Fa icon="send"/>
						</Button>
					</Tooltip>
				</div>
			</Fragment>
		);
	}
}

Settings.propTypes = {
	getSettings: PropTypes.func.isRequired,
};

export default Settings;
