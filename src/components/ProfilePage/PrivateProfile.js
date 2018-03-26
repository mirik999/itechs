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
//user components
import UserImage from '../Utils/UserImage';
//actions
import { logout } from '../../actions/user';
import { changeCover, getProfile } from '../../actions/profile';
//selector
import { profileSelector } from '../../reducer/profile';


class PrivateProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingBgImg: false,
			errors: {}
		}
		
		this.txt = {
			edit: <FormattedMessage id="edit" />,
			exit: <FormattedMessage id="profile.logout" />,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
	}

	componentWillMount() {
		NProgress.start();
		const { user } = this.props;

		this.props.getProfile(user.email)
			.then(() => {
				this.setState({
					loadingBgImg: false,
					errors: {}
				}, () => NProgress.done())
			})
			.catch(err => this.setState({ errors: { getProfileErr: err.message } }))
	}

	// componentDidMount() {
	// 	const { user } = this.props;
	//
	// 	this.props.getProfile(user.email)
	// 		.then(() => {
	// 			this.setState({
	// 				loadingBgImg: false,
	// 				errors: {}
	// 			}, () => NProgress.done())
	// 		})
	// 		.catch(err => this.setState({ errors: { getProfileErr: err.message } }))
	// }



	uploadFile = (files) => {
		this.setState({ loadingBgImg: true }, () => NProgress.start())
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
			'signature' : signature
		}

		let uploadRequest = superagent.post(url)
		uploadRequest.attach('file', image)

		Object.keys(params).forEach((key) => {
			uploadRequest.field(key, params[key])
		})

		uploadRequest.end((err, res) => {
			if (err) return this.setState({ errors: { image: "error" } })
			const bgImg = res.body.url.replace("http", "https")
			const smallImage = res.body.url.replace("http", "https").replace("/image/upload/", "/image/upload/w_200,h_100/")
			const data = {
				bgImg,
				smallImage,
				email: this.props.user.email
			}
			if (Object.keys(this.state.errors).length === 0) {
				this.props.changeCover(data)
					.then(() => {
						this.setState({ loadingBgImg: false }, () => NProgress.done())
						this.props.getProfile(data.email)
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

	render() {
		const { user, profile } = this.props;
		
		console.log(profile)

		return (
			<div className="row justify-content-center">
				<div className="col-12 col-lg-10 col-xl-8">

					<Card reverse className="mt-3">
						<section className="cover-image">
							<UserImage className="img-fluid w-100"
							           image={profile.bgImg}
							           load2image={profile.smallImage}
							           style={styles.img}
							/>

							<Dropzone
								className="dzone"
								onDrop={this.uploadFile}
								maxSize={1240000}
								multiple={false}
							>
								<Fa className="position-absolute" icon="camera" style={styles.camera} />
							</Dropzone>
						</section>

						<CardBody>
							<section className="float-left" style={styles.profileImageWrapper}>
								<UserImage image={user.useravatar}
								           load2image=" "
								           alt="user profile"
								           className="img-thumbnail"
								           style={styles.profileImage}
								/>
							</section>

							<section className="float-left" style={styles.contact}>
								<span className="text-secondary">{user.username}</span><br/>
								<small className="text-secondary font-weight-bold">{user.email}</small>
							</section>

							<section className="float-right d-none d-sm-block" style={styles.edit}>
								<Tooltip id="tooltip-icon" title={this.txt.edit}>
									<Button tag="a" size="sm" floating gradient="aqua">
										<Fa icon="pencil" />
									</Button>
								</Tooltip>

								<Tooltip id="tooltip-icon" title={this.txt.exit}>
									<Button tag="a" size="sm" floating gradient="purple" onClick={this.handleLogout}>
										<Fa icon="sign-out" />
									</Button>
								</Tooltip>
							</section>
						</CardBody>
					</Card>

				</div>
			</div>
		);
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
	coverImg: {
		width: "930px",
		height: "344px"
	}
}

PrivateProfile.propTypes = {
	logout: PropTypes.func,
	changeCover: PropTypes.func,
	getProfile: PropTypes.func,
};

function mapStateToProps(state) {
	return {
		profile: profileSelector(state)
	}
}

export default connect(mapStateToProps, { logout, changeCover, getProfile })(PrivateProfile);
