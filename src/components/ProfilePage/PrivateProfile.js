import React, {PureComponent} from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
//user components
import UserImage from '../Utils/UserImage';
import StatisticPanel from './Sections/StatisticPanel';
import Inputs from './Sections/Inputs';
import MyArticles from './Sections/MyArticles';
import MyComments from './Sections/MyComments';
import MyFollows from './Sections/MyFollows';
import MyFollowers from './Sections/MyFollowers';
//actions
import { logout } from '../../actions/user'
//direct api requests
import api from '../../api';
//cdd
import './Sections/style.css';


class PrivateProfile extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			articles: [],
			profile: {
				about: '',
				contact: '',
				portfolio: '',
				github: '',
				bgImg: null,
			},
			edit: true,
			target: "edit",
			tableNumber: 1,
			errors: {}
		}
		
		this.txt = {
			edit: <FormattedMessage id="edit" />,
			delete: <FormattedMessage id="delete" />,
			exit: <FormattedMessage id="profile.logout" />,
			resolve: <FormattedMessage id="resolve" />,
			save: <FormattedMessage id="save" />,
			aboutError: <FormattedMessage id="error.about" />,
			contactError: <FormattedMessage id="error.contact" />,
			ptfError: <FormattedMessage id="error.ptf" />,
			githubError: <FormattedMessage id="error.github" />,
			articles: <FormattedMessage id="profile.articles" />,
			noArticles: <FormattedMessage id="article.empty" />,
			noComments: <FormattedMessage id="comment.empty" />,
			comments: <FormattedMessage id="button.comments" />,
			following: <FormattedMessage id="profile.following" />,
			followers: <FormattedMessage id="profile.followers" />,
			follow: <FormattedMessage id="button.follow" />,
			unFollow: <FormattedMessage id="button.unfollow" />,
			nofollowing: <FormattedMessage id="profile.nofollowing" />,
			nofollowers: <FormattedMessage id="profile.nofollowers" />,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeTable = this.onChangeTable.bind(this);
		this.onRemoveFromArticles = this.onRemoveFromArticles.bind(this);
		this.onRemoveFollows = this.onRemoveFollows.bind(this);
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
		const { profile, articles } = this.props;
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

		uploadRequest.end(async (err, res) => {
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
				const profile = await api.user.changeCover(data)
				this.setState({ profile }, () => NProgress.done())
			}
		})
	}

	handleLogout = () => {
		this.props.logout()
		window.location.href = '/';
	}

	onSave = async (e) => {
		const { email, about, contact, portfolio, github } = this.state.profile;
		this.setState((prevState) => {
			return { edit: !prevState.edit, target: "save" }
		})
		if (this.state.target === "save") {
			const errors = await this.validate(this.state.profile);
			this.setState({ errors });
			if (Object.keys(errors).length === 0) {
				const data = { email, about, contact, portfolio, github}
				try {
					await api.user.editProfile(data)
					await api.user.getProfile(data.email)
				} catch(err) {
					this.setState({ target: "edit", errors: {global: err.message}})
				}
			}
		}
	}

	validate = (profile) => {
		const errors = {};
		if (profile.about && !validator.isLength(JSON.stringify(profile.about), {min:0, max: 35})) {
			toast.warn(this.txt.aboutError)
			errors.about = this.txt.aboutError;
		}
		if (profile.contact && !validator.isLength(JSON.stringify(profile.contact), {min:0, max: 35})) {
			toast.warn(this.txt.contactError)
			errors.contact = this.txt.contactError;
		}
		if (profile.portfolio && (!validator.isURL(profile.portfolio))) {
			toast.warn(this.txt.ptfError)
			errors.portfolio = this.txt.ptfError;
		}
		if (profile.github && (!validator.isURL(profile.github))) {
			toast.warn(this.txt.githubError)
			errors.github = this.txt.githubError;
		}
		if (profile.github && (!validator.contains(profile.github, "github.com"))) {
			toast.warn(this.txt.githubError)
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

	onChangeTable = (num) => {
		if ( this.state.tableNumber === num ) num = 1;
		this.setState({ ...this.state, tableNumber: num })
	}

	onRemoveFromArticles = async (deletedArticle) => {
		const articles = await this.state.articles.filter(art => art._id !== deletedArticle._id)
		this.setState({ articles })
	}

	onRemoveFollows = async (deletedFollower) => {
		const myFollows = await this.state.profile.myFollows.filter(user => user.user._id !== deletedFollower._id)
		this.setState({ ...this.state, profile: { ...this.state.profile, myFollows } })
	}

	render() {
		const { edit, articles, profile, tableNumber, errors } = this.state;
		const { lang } = this.props;

		if (Object.keys(profile).length === 0 && Object.keys(articles).length === 0) return <div></div>

		const editable = edit && (Object.keys(errors).length === 0);

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
							<section className="float-left " style={styles.profileImageWrapper}>
								<UserImage image={profile.useravatar}
								           load2image=" "
								           alt="user profile"
								           className="img-thumbnail"
								           style={styles.profileImage}
								/>
							</section>
							<section className="float-left" style={styles.contact}>
								<span className="text-secondary"><Fa icon="at"/>{profile.username}</span><br/>
								<small className="text-secondary font-weight-bold">{profile.email}</small>
							</section>
							<section className="float-right d-none d-sm-block" style={styles.edit}>
								{
									!editable ? (
										<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onSave}>
											<small><Fa icon="save" /> {this.txt.save}</small>
										</span>
									) : (
										<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onSave}>
											<small><Fa icon="pencil" /> {this.txt.edit}</small>
										</span>
									)
								}
								<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.handleLogout}>
									<small><Fa icon="sign-out" /> {this.txt.exit}</small>
								</span>
							</section>

							{/* mobile */}

							<section className="float-right d-block d-sm-none" style={styles.edit}>
								{
									!editable ? (
										<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onSave}>
											<small><Fa icon="save" /></small>
										</span>
									) : (
										<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onSave}>
											<small><Fa icon="pencil" /></small>
										</span>
									)
								}
								<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.handleLogout}>
									<small><Fa icon="sign-out" /></small>
								</span>
							</section>

							{/* mobile end */}

							<StatisticPanel articles={articles} profile={profile} style={styles.counts}
							                txt={this.txt} getNumberOfTables={this.onChangeTable} lang={lang}
							/>

							{
								tableNumber === 1 &&
								<Inputs profile={profile} editable={editable} getValue={this.onChange}
								        style={styles.counts} lang={lang} />
							}

							{
								tableNumber === 2 &&
								<MyArticles articles={articles} profile={profile} txt={this.txt}
							            lang={lang} deletedArticle={this.onRemoveFromArticles} />
							}

							{
								tableNumber === 3 &&
								<MyComments articles={articles} profile={profile} txt={this.txt} lang={lang} />
							}

							{
								tableNumber === 4 &&
								<MyFollows profile={profile} txt={this.txt} lang={lang} deleteFollower={this.onRemoveFollows} />
							}

							{
								tableNumber === 5 &&
								<MyFollowers profile={profile} txt={this.txt} lang={lang} />
							}

						</CardBody>
					</Card>
				</div>
				<ToastContainer />
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
		bottom: "15px"
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
	profile: PropTypes.object.isRequired,
	articles: PropTypes.array.isRequired,
};

export default connect(null, { logout })(PrivateProfile);
