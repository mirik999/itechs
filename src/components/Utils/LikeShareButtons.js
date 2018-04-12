import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Button, Fa } from 'mdbreact';
import NProgress from 'nprogress';
import { FacebookShareButton } from 'react-share';
//actions
import { like, getArticle } from '../../actions/article';
import { follow } from '../../actions/profile';

class LikeShareButtons extends Component {
	constructor(props) {
		super(props);

		this.state = {
			liked: false,
			followed: false
		}

		this.txt = {
			shareOnFb: <FormattedMessage id="button.share" />,
			like: <FormattedMessage id="button.like" />,
			dislike: <FormattedMessage id="button.dislike" />,
			follow: <FormattedMessage id="button.follow" />,
			unfollow: <FormattedMessage id="button.unfollow" />,
		}

		this.onVote = this.onVote.bind(this);
		this.onFollow = this.onFollow.bind(this);
	}

	componentDidMount() {
		const { article, profile } = this.props;
		const check = Object.keys(profile).length !== 0;
		const follows = check && profile.myFollows.map(user => user.followedUserName === article.author.username)
		const likes = article.like.map(like => like.likedBy === profile.username);
		this.setState({
			liked: likes.includes(true),
			followed: check ? follows.includes(true) : false
		})
	}

	onVote = () => {
		NProgress.start();
		if (_.isEmpty(this.props.profile)) {
			NProgress.done()
			return null;
		}

		const data = {
			id: this.props.article._id,
			name: this.props.profile.username
		}
		this.setState({ liked: !this.state.liked }, () => {
			this.props.like(data)
				.then(() => NProgress.done())
		})
	}

	onFollow = () => {
		NProgress.start();
		if (_.isEmpty(this.props.profile)) {
			NProgress.done()
			return null;
		}

		if (this.props.article.author.username === this.props.profile.username) {
			NProgress.done()
			return null;
		}

		const data = {
			followUserName: this.props.article.author.username,
			followUserEmail: this.props.article.author.email,
			myUserName: this.props.profile.username,
			myEmail: this.props.profile.email
		}
		this.setState({ followed: !this.state.followed }, () => {
			this.props.follow(data)
				.then(() => NProgress.done())
		})
	}

	render() {
		const { liked, followed } = this.state;
		const { url, card, article } =this.props;

		if (Object.keys(article).length === 0) return <div></div>

		if (card) {
			const likeCount = article.like.length
			const commentCount = article.comments.length
			return (
				<span className="text-secondary">
					<small className="pr-2" style={styles.view}>{Math.floor(article.pageview)} read</small>
					<small className="px-2" style={styles.view}>{commentCount} comment</small>
					<small className="pl-2">{likeCount} liked</small>
				</span>
			)
		}

		return (
			<Fragment>
				<Tooltip id="tooltip-icon" title={liked ? this.txt.dislike : this.txt.like}>
					<Button tag="a" floating gradient="purple" size="sm" onClick={this.onVote}>
						{ liked ? <Fa icon="heart" /> : <Fa icon="heart-o" /> }
					</Button>
				</Tooltip>
				<Tooltip id="tooltip-icon" title={followed ? this.txt.unfollow : this.txt.follow}>
					<Button tag="a" floating gradient="peach" size="sm" onClick={this.onFollow}>
						{ followed ? <Fa icon="user-times" /> : <Fa icon="user-plus" /> }
					</Button>
				</Tooltip>
				<div className="d-inline-flex">
					<FacebookShareButton url={url}>
						<Tooltip id="tooltip-icon" title={this.txt.shareOnFb}>
							<Button tag="a" floating gradient="blue" size="sm"><Fa icon="share-alt" />
							</Button>
						</Tooltip>
					</FacebookShareButton>
				</div>
			</Fragment>
		);
	}
}

LikeShareButtons.propTypes = {
	article: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
	like: PropTypes.func.isRequired,
	getArticle: PropTypes.func.isRequired
};

const styles = {
	view: {
		borderRight: "1px solid silver"
	}
}

export default connect(null, { like, getArticle, follow })(LikeShareButtons);
