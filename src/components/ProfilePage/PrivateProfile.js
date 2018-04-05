import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, CardImage, CardBody, CardTitle, CardText, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import NProgress from 'nprogress';
import validator from 'validator';
//user components
import UserImage from '../Utils/UserImage';
import UserInput from '../Utils/UserInput';
//actions
import { logout } from '../../actions/user';
import { changeCover, getProfile, editProfile } from '../../actions/profile';


class PrivateProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			articles: [],
			profile: {
				about: '',
				contact: '',
				portfolio: '',
				github: '',
			},
			edit: true,
			errors: {}
		}
		
		this.txt = {
			edit: <FormattedMessage id="edit" />,
			exit: <FormattedMessage id="profile.logout" />,
			resolve: <FormattedMessage id="resolve" />,
			aboutError: <FormattedMessage id="error.about" />,
			contactError: <FormattedMessage id="error.contact" />,
			ptfError: <FormattedMessage id="error.ptf" />,
			githubError: <FormattedMessage id="error.github" />,
			articles: <FormattedMessage id="profile.articles" />,
			comments: <FormattedMessage id="button.comments" />,
			following: <FormattedMessage id="profile.following" />,
			followers: <FormattedMessage id="profile.followers" />,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onChange = this.onChange.bind(this);
		this.renderNumbers = this.renderNumbers.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.profile !== prevState.profile || nextProps.articles !== prevState.articles) {
			return {
				...prevState,
				profile: { ...nextProps.profile },
				articles: nextProps.articles
			}
		}
		return null;
	}

	componentDidMount() {
		const {profile, articles} = this.props;
		this.setState({ profile, articles })
	}

	uploadFile = (files) => {
		NProgress.start();
		const image = files[0];
		const cloudName = 'developers'; // cloudinary verir
		const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload';
		const timestamp = Date.now()/1000;
		const uploadPreset = 'ydhuh67g';
		const paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+'quqI74zNlOf78XOG8PaIH9PsFK0';
		const signature = sha1(paramsStr)
		const params = {
			'api_key': '153378483126725',
			'timestamp' : timestamp,
			'upload_preset' : uploadPreset,
			'signature' : signature,
			'secure': true
		}

		let uploadRequest = superagent.post(url)
		uploadRequest.attach('file', image)

		Object.keys(params).forEach((key) => {
			uploadRequest.field(key, params[key])
		})

		uploadRequest.end((err, res) => {
			if (err) {
				NProgress.done();
				return this.setState({ errors: { image: "error" } })
			}
			const bgImg = res.body.secure_url;
			const smallImage = res.body.secure_url.replace("/image/upload/", "/image/upload/w_200,h_100/")
			const data = {
				bgImg,
				smallImage,
				email: this.state.profile.email
			}
			
			if (Object.keys(this.state.errors).length === 0) {
				this.props.changeCover(data)
					.then(() => {
						NProgress.done();
						this.props.getProfile(data.email);
					})
			}
		})
	}

	handleLogout = () => {
		Promise.resolve()
			.then(() => this.props.logout())
			.then(() => {
				window.location.href = '/';
			})
	}

	onSave = (e) => {
		const { email, about, contact, portfolio, github } = this.state.profile;
		this.setState((prevState) => {
			return { edit: !prevState.edit }
		})
		if (e.target.name === "save") {
			const errors = this.validate(this.state.profile);
			this.setState({ errors });
			if (Object.keys(errors).length === 0) {
				const data = { email, about, contact, portfolio, github}
				this.props.editProfile(data)
					.then(() => this.props.getProfile(data.email))
					.catch(err => this.setState({errors: {global: err.message}}))
			}
		}
	}

	validate = (profile) => {
		const errors = {};
		if (profile.about && !validator.isLength(JSON.stringify(profile.about), {min:0, max: 35})) {
			errors.about = this.txt.aboutError;
		}
		if (profile.contact && !validator.isLength(JSON.stringify(profile.contact), {min:0, max: 35})) {
			errors.contact = this.txt.contactError;
		}
		if (profile.portfolio && (!validator.isURL(profile.portfolio))) {
			errors.portfolio = this.txt.ptfError;
		}
		if (profile.github && (!validator.isURL(profile.github))) {
			errors.github = this.txt.githubError;
		}
		if (profile.github && (!validator.contains(profile.github, "github.com"))) {
			errors.github = this.txt.githubError;
		}
		return errors;
	}

	onChange = (e) => {
		this.setState({
			...this.state,
			profile: { ...this.state.profile, [e.target.name]: e.target.value },
			errors: { ...this.state.errors, [e.target.name]: '' }
		})
	}

	renderNumbers = (category) => {
		const { articles, profile } = this.state;
		if (articles && Object.keys(articles).length !== 0) {
			if (category === "articleNums") return articles.filter(article => article.author.username === profile.username).length
			if (category === "commentNums") return articles.filter(art => art.comments).reduce((acc, art) => acc.concat(art.comments), [])
				.filter(cmt => cmt.author.name === profile.username).length
			if (category === "followers") return profile.followedUsers.length
			if (category === "following") return profile.myFollows.length
		}
	}

	render() {
		const { edit, profile, errors } = this.state;
		const editable = edit && (Object.keys(errors).length === 0);
		
		if (Object.keys(profile).length === 0) return <div></div>

		return (
			<div className="row justify-content-center">
				<div className="col-12 col-lg-10 col-xl-8">
					<Card reverse className="mt-3">
						<section>
							<UserImage className="img-fluid w-100"
							           image={profile.bgImg}
							           load2image={profile.smallImage}
							           style={styles.img}
							/>
						</section>
						<Dropzone
							className="dzone"
							onDrop={this.uploadFile}
							maxSize={1240000}
							multiple={false}
						>
							<Fa className="position-absolute" icon="camera" style={styles.camera}/>
						</Dropzone>
						<CardBody>
							<section className="float-left" style={styles.profileImageWrapper}>
								<UserImage image={profile.useravatar}
								           load2image=" "
								           alt="user profile"
								           className="img-thumbnail"
								           style={styles.profileImage}
								/>
							</section>
							<section className="float-left" style={styles.contact}>
								<span className="text-secondary"><Fa icon="user-secret"/> {profile.username}</span><br/>
								<small className="text-secondary font-weight-bold"><Fa icon="at"/> {profile.email}</small>
							</section>
							<section className="float-right d-none d-sm-block" style={styles.edit}>
								{
									!editable ? (
										<Tooltip id="tooltip-icon" title={this.txt.resolve}>
											<Button tag="a" size="sm" name="save" floating gradient="peach" onClick={this.onSave}>
												<Fa icon="save"/>
											</Button>
										</Tooltip>
									) : (
										<Tooltip id="tooltip-icon" title={this.txt.edit}>
											<Button tag="a" size="sm" name="edit" floating gradient="aqua" onClick={this.onSave}>
												<Fa icon="pencil"/>
											</Button>
										</Tooltip>
									)
								}
								<Tooltip id="tooltip-icon" title={this.txt.exit}>
									<Button tag="a" size="sm" floating gradient="purple" onClick={this.handleLogout}>
										<Fa icon="sign-out"/>
									</Button>
								</Tooltip>
							</section>
							<section className="row no-gutters w-100" style={styles.counts}>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="newspaper-o"/> {this.txt.articles}</small>
									<p>{this.renderNumbers("articleNums")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="comment"/> {this.txt.comments}</small>
									<p>{this.renderNumbers("commentNums")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="user-plus"/> {this.txt.following}</small>
									<p>{this.renderNumbers("following")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="users"/> {this.txt.followers}</small>
									<p>{this.renderNumbers("followers")}</p>
								</div>
							</section>
							{
								<section className="mt-2" style={styles.counts}>
									<div className="row justify-content-center">
										<div className="col-12 col-md-6">
											<UserInput label="profile.about" icon="user-secret" name="about" onChange={this.onChange}
											           value={profile.about} defaultValue={profile.about} disabled={editable}
											           errorLabel={errors.about}
											/>
										</div>
										<div className="col-12 col-md-6">
											<UserInput label="profile.contact" icon="address-card-o" name="contact" onChange={this.onChange}
											           value={profile.contact} defaultValue={profile.contact} disabled={editable}
											           errorLabel={errors.contact}
											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-12 col-md-6">
											<UserInput label="profile.ptf" icon="file-code-o" name="portfolio" onChange={this.onChange}
											           value={profile.portfolio} defaultValue={profile.portfolio} disabled={editable}
											           errorLabel={errors.portfolio}
											/>
										</div>
										<div className="col-12 col-md-6">
											<UserInput label="profile.git" icon="code-fork" name="github" onChange={this.onChange}
											           value={profile.github} defaultValue={profile.github} disabled={editable}
											           errorLabel={errors.github}
											/>
										</div>
									</div>
								</section>
							}
						</CardBody>
					</Card>
				</div>
			</div>
		)
	}
}

const styles = {
	profileImageWrapper: {
		position: "relative",
		bottom: "80px",
		left: "20px"
	},
	profileImage: {
		width: "110px",
		height: "110px"
	},
	contact: {
		position: "relative",
		bottom: "25px",
		left: "30px",
	},
	edit: {
		position: "relative",
		bottom: "25px"
	},
	img: {
		maxWidth: "930px",
		maxHeight: "344px"
	},
	uploadCover: {
		position: "relative",
		bottom: "330px",
		left: "880px",
		fontSize: "24px",
		color: "silver",
		cursor: "pointer"
	},
	camera: {
		top: "10px",
		right: "10px",
		cursor: "pointer",
		color: "silver"
	},
	counts: {
		position: "relative",
		bottom: "40px"
	}
}

PrivateProfile.propTypes = {
	logout: PropTypes.func,
	changeCover: PropTypes.func,
	getProfile: PropTypes.func,
};

export default connect(null, { logout, changeCover, getProfile, editProfile })(PrivateProfile);
