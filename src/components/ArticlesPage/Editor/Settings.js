import React, {PureComponent, Fragment} from 'react';
import { Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import sha1 from 'sha1';
import superagent from 'superagent';
import Dropzone from 'react-dropzone';
import NProgress from 'nprogress';
import mediumZoom from 'medium-zoom';
//user components
import UserInput from '../../Utils/UserInput';
import UserImage from '../../Utils/UserImage';


class Settings extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			disableComment: false,
			thumbnail: '',
			thumbnailSmall: '',
			errors: {}
		}

		this.txt = {
			share: <FormattedMessage id="profile.article" />,
			disableComment: <FormattedMessage id="comment.toggle" />,
			enableComment: <FormattedMessage id="comment.toggle-enable" />,
			selectThumb: <FormattedMessage id="select.thumb" />,
		}

		this.onSave = this.onSave.bind(this)
		this.onToggle = this.onToggle.bind(this)
		this.onChange = this.onChange.bind(this)
		this.uploadFile = this.uploadFile.bind(this)
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
			this.setState({
				thumbnail: res.body.secure_url,
				thumbnailSmall: res.body.secure_url.replace("/image/upload/", "/image/upload/w_50,h_50/")
			}, () => NProgress.done())
		})
	}

	onToggle = () => {
		this.setState({ disableComment: !this.state.disableComment });
	};

	onSave = () => {
		this.props.getSettings(this.state)
	}
	
	onChange = (e) => {
		this.setState({ ...this.state, [e.target.name]: e.target.value, errors: {} })
	}

	render() {
		const { disableComment, title, thumbnail, thumbnailSmall } = this.state;

		return (
			<div className="row justify-content-center">
				<div className="col-12 col-sm-6" style={{ height: "60px"}}>
					<UserInput label="article.title"
					           name="title" value={title}
					           onChange={this.onChange} icon="header"
					           className="mb-0"
					/>
				</div>
				<div className="col-12 col-sm-6 d-flex justify-content-end">
					<div style={styles.thumbnailView}>
						{
							thumbnail && thumbnailSmall &&
							<UserImage load2image={thumbnailSmall}
							           image={thumbnail} alt="thumbnail"
							           zoom={true}
							           className="img-fluid img-thumbnail w-100 h-100 settingImage"
							/>
						}
					</div>
					<Tooltip id="tooltip-icon" title={disableComment ? this.txt.enableComment : this.txt.disableComment}>
						<Button tag="a" size="sm" name="save" floating gradient="peach" onClick={this.onToggle}>
							{disableComment ? <Fa icon="lock"/> : <Fa icon="unlock"/>}
						</Button>
					</Tooltip>
					<Tooltip id="tooltip-icon" title={this.txt.selectThumb}>
						<Dropzone
							style={styles.dropzone}
							onDrop={this.uploadFile}
							maxSize={1240000}
							multiple={false}
						>
							<Button tag="a" size="sm" name="thumb" floating gradient="aqua">
								<Fa icon="image" />
							</Button>
						</Dropzone>
					</Tooltip>
					<Tooltip id="tooltip-icon" title={this.txt.share}>
						<Button tag="a" size="sm" name="save" floating gradient="purple" onClick={this.onSave}>
							<Fa icon="send"/>
						</Button>
					</Tooltip>
				</div>
			</div>
		);
	}
}

const styles = {
	dropzone: {
		width: "45px",
		height: "45px"
	},
	thumbnailView: {
		maxWidth: "120px",
		maxHeight: "60px",
		marginRight: "10px"
	}
}

Settings.propTypes = {
	getSettings: PropTypes.func.isRequired,
};

export default Settings;
