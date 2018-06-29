import React, {PureComponent, Fragment} from 'react';
import NProgress from 'nprogress';
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import { Fa } from 'mdbreact';
//user components
import UserInput from '../../Utils/UserInput';
//direct api requests
import api from '../../../api';

class Information extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				about: props.profile.about,
				contact: props.profile.contact,
				portfolio: props.profile.portfolio,
				github: props.profile.github,
			},
			errors: {}
		}

		this.onChange = this.onChange.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onChange = (e) => {
		this.setState({
			...this.state,
			data: { ...this.state.data, [e.target.name]: e.target.value },
			errors: { ...this.state.errors, [e.target.name]: '' }
		})
	}

	onSave = async () => {
		NProgress.start();
		const errors = await this.validate(this.state.data);
		this.setState({errors});
		if (Object.keys(errors).length === 0) {
			const data = {
				email: this.props.profile.email,
				about: this.state.data.about,
				contact: this.state.data.contact,
				portfolio: this.state.data.portfolio,
				github: this.state.data.github
			}
			try {
				await api.user.editProfile(data)
				await api.user.getProfile(this.props.profile.email)
				NProgress.done();
			} catch (err) {
				this.setState({errors: {global: err.message}})
				NProgress.done();
			}
		}
	}

	validate = (data) => {
		const errors = {};
		if (data.about && !validator.isLength(JSON.stringify(data.about), {min:0, max: 35})) {
			toast.warn(this.props.txt.aboutError)
			errors.about = this.props.txt.aboutError;
			NProgress.done();
		}
		if (data.contact && !validator.isLength(JSON.stringify(data.contact), {min:0, max: 35})) {
			toast.warn(this.props.txt.contactError)
			errors.contact = this.props.txt.contactError;
			NProgress.done();
		}
		if (data.portfolio && (!validator.isURL(data.portfolio))) {
			toast.warn(this.props.txt.ptfError)
			errors.portfolio = this.props.txt.ptfError;
			NProgress.done();
		}
		if (data.github && (!validator.isURL(data.github))) {
			toast.warn(this.props.txt.githubError)
			errors.github = this.props.txt.githubError;
			NProgress.done();
		}
		if (data.github && (!validator.contains(data.github, "github.com"))) {
			toast.warn(this.props.txt.githubError)
			errors.github = this.props.txt.githubError;
			NProgress.done();
		}
		return errors;
	}

	render() {
		const { txt } = this.props;
		const { data } = this.state;

		return (
			<Fragment>
				<UserInput label="profile.about" icon="address-card-o" name="about"
				           value={data.about} defaultValue={data.about} onChange={this.onChange}
				/>
				<UserInput label="profile.contact" icon="envelope-o" name="contact"
				           value={data.contact} defaultValue={data.contact} onChange={this.onChange}
				/>
				<UserInput label="profile.ptf" icon="file-code-o" name="portfolio"
				           value={data.portfolio} defaultValue={data.portfolio} onChange={this.onChange}
				/>
				<UserInput label="profile.git" icon="code-fork" name="github"
				           value={data.github} defaultValue={data.github} onChange={this.onChange}
				/>
				<div className="profile-save-button text-center">
					<span className="text-secondary hoverme cursor-pointer p-2" onClick={this.onSave}>
						<Fa icon="save" /> <small>{ txt.save }</small>
					</span>
				</div>
				{/*notifications*/}
				<ToastContainer />
			</Fragment>
		);
	}
}

Information.propTypes = {};

export default Information;
