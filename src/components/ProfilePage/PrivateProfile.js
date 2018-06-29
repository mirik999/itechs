import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import { Fa } from 'mdbreact';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import NProgress from 'nprogress';
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
//user componenets
import UserImage from '../Utils/UserImage';
import Information from './Sections/Information';
import Articles from './Sections/Articles';
import Following from './Sections/Following';
import Followers from './Sections/Followers';
//actions
import { logout } from '../../actions/user';
//direct api requests
import api from '../../api';


class ProfileTestPage extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			articles: props.articles,
			profile: props.profile,
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
			imageError: <FormattedMessage id="error.imageSize" />,
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
			publishedOn: <FormattedMessage id="date.publish" />,
		}

		this.uploadFile = this.uploadFile.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.onChangeTable = this.onChangeTable.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onRemoveFollows = this.onRemoveFollows.bind(this);
	}

	onChangeTable = (num) => {
		if ( this.state.tableNumber === num ) num = 1;
		this.setState({ ...this.state, tableNumber: num })
	}

	onDelete = async (article) => {
		const articles = await this.state.articles.filter(art => art._id !== article._id)
		this.setState({ articles })
		NProgress.done();
	}

	onRemoveFollows = async (deletedFollower) => {
		const myFollows = await this.state.profile.myFollows.filter(user => user.user._id !== deletedFollower._id)
		this.setState({ ...this.state, profile: { ...this.state.profile, myFollows } })
	}

	onLogout = () => {
		this.props.logout()
		window.location.href = '/';
		this.props.socket.emit('userOffline', {
			myID: this.state.profile._id
		})
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
				toast.warn(this.txt.imageError)
				return this.setState({ errors: { image: "error" } })
			}
			const avatar = res.body.secure_url;
			const sAvatar = res.body.secure_url.replace("/image/upload/", "/image/upload/w_10,h_10/")
			const data = {
				avatar,
				sAvatar,
				email: this.props.profile.email
			}

			if (Object.keys(this.state.errors).length === 0) {
				const profile = await api.user.changeAvatar(data)
				this.setState({ profile }, () => NProgress.done())
			}
		})
	}

	render() {
		const { lang, socket } = this.props;
		const { articles, profile, tableNumber } = this.state;

		return (
			<div className="row justify-content-center mt-3">
				<div className="profile-wrapper col-12 col-lg-10 col-xl-8">
					<div className="profile-header row justify-content-center mb-4 py-4">
						<div className="col-5 col-md-4 d-flex">
							<UserImage className="profile-picture img-thumbnail mr-3"
							           image={profile.useravatar}
							/>
							<div className="d-flex flex-column justify-content-between">
								<div className="user-info">
									<span><h3 className="m-0">{ profile.username }</h3></span>
									<span>{ profile.email }</span>
								</div>
								<div className="change-picture mb-2">
									<Dropzone
										className="dzone"
										onDrop={this.uploadFile}
										maxSize={1240000}
										multiple={false}
									>
										<span className="text-secondary hoverme cursor-pointer change-avatar">
											<Fa icon="camera" /> <small>Picture</small>
										</span>
									</Dropzone>
								</div>
							</div>
						</div>
						<div className="col-7 col-md-6 d-flex flex-column justify-content-end align-items-end">
							<span className="text-secondary hoverme cursor-pointer p-2" onClick={this.onLogout}>
								<Fa icon="power-off" /> <small>{ this.txt.exit }</small>
							</span>
						</div>
					</div>

					<div className="profile-sections row justify-content-center mb-5">
						<div className="col-12 col-md-8 d-flex justify-content-center">
							<span className="text-secondary hoverme cursor-pointer p-2" onClick={() => this.onChangeTable(2)}>
								<Fa icon="newspaper-o" /> <small>{this.txt.articles}</small>
							</span>
							<span className="text-secondary hoverme cursor-pointer p-2 mx-1" onClick={() => this.onChangeTable(3)}>
								<Fa icon="user-plus" /> <small>{this.txt.following}</small>
							</span>
							<span className="text-secondary hoverme cursor-pointer p-2 mx-1" onClick={() => this.onChangeTable(4)}>
								<Fa icon="users" /> <small>{this.txt.followers}</small>
							</span>
						</div>
					</div>

					<div className="profile-body row justify-content-center mb-5">
						<div className="col-12 col-md-10">

							{ tableNumber === 1 && <Information txt={this.txt} profile={profile} lang={lang} /> }
							{ tableNumber === 2 && <Articles txt={this.txt} profile={profile} articles={articles}
							                                 deletedArticle={this.onDelete} lang={lang}
								/>
							}
							{ tableNumber === 3 && <Following txt={this.txt} profile={profile} articles={articles} lang={lang}
							                                  deleteFollower={this.onRemoveFollows} socket={socket}
								/>
							}
							{ tableNumber === 4 && <Followers txt={this.txt} profile={profile} articles={articles} lang={lang}
							                                  socket={socket}
								/>
							}

						</div>
					</div>

				</div>
			</div>
		);
	}
}

ProfileTestPage.propTypes = {};

export default connect(null, { logout })(ProfileTestPage);
