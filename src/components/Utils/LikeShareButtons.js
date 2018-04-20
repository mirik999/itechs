import React, {PureComponent, Fragment} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Button, Fa } from 'mdbreact';
import NProgress from 'nprogress';
import { FacebookShareButton } from 'react-share';
import FacebookProvider, { Share } from 'react-facebook';
//direct api requests
import api from '../../api';

class LikeShareButtons extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			liked: false,
			followed: false
		}

		this.txt = {
			shareOnFb: <FormattedMessage id="button.share" />,
			like: <FormattedMessage id="button.like" />,
			comment: <FormattedMessage id="comment" />,
			read: <FormattedMessage id="read" />,
			dislike: <FormattedMessage id="button.dislike" />,
			follow: <FormattedMessage id="button.follow" />,
			unfollow: <FormattedMessage id="button.unfollow" />,
		}

		this.onVote = this.onVote.bind(this);
		this.onFollow = this.onFollow.bind(this);
	}

	async componentDidMount() {
		const { article, profile } = this.props;
		const check = Object.keys(profile).length !== 0;
		const follows = check && await profile.myFollows.map(myFollow => myFollow.user.username === article.author.username)
		const likes = await article.like.map(like => like.likedBy === profile.username);
		this.setState({
			liked: likes.includes(true),
			followed: check ? follows.includes(true) : false
		})
	}

	onVote = async () => {
		NProgress.start();
		if (_.isEmpty(this.props.profile)) {
			NProgress.done()
			return null;
		}
		const data = {
			id: this.props.article._id,
			name: this.props.profile.username
		}
		await this.setState({ liked: !this.state.liked })
		await	api.article.like(data)
		NProgress.done();
	}

	onFollow = async () => {
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
			followUserID: this.props.article.author._id,
			myID: this.props.profile._id,
		}
		await this.setState({ followed: !this.state.followed })
		await	api.user.follow(data)
		NProgress.done();
	}

	render() {
		const { liked, followed } = this.state;
		const { url, card, article } = this.props;

		if (Object.keys(article).length === 0) return <div></div>

		if (card) {
			const likeCount = article.like.length
			const commentCount = article.comments.length
			return (
				<span className="text-secondary">
					<Tooltip id="newspaper-o" title={this.txt.read}>
						<small className="pr-2">
							<Fa icon="newspaper-o" /> {Math.floor(article.pageview)}
						</small>
					</Tooltip>
					<Tooltip id="newspaper-o" title={this.txt.comment}>
						<small className="px-2">
							<Fa icon="commenting-o" /> {commentCount}
						</small>
					</Tooltip>
					<Tooltip id="newspaper-o" title={this.txt.like}>
						<small className="pl-2">
							{ liked ? <Fa icon="heart" /> : <Fa icon="heart-o" /> } {likeCount}
						</small>
					</Tooltip>
				</span>
			)
		}

		return (
			<Fragment>
				<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onVote}>
					<small>{liked ? <Fragment><Fa icon="heart" /> {this.txt.dislike}</Fragment> :
						<Fragment><Fa icon="heart-o" /> {this.txt.like}</Fragment>}
					</small>
				</span>
				<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onFollow}>
					<small>{followed ? <Fragment><Fa icon="user-times" /> {this.txt.unfollow}</Fragment> :
						<Fragment><Fa icon="user-plus" /> {this.txt.follow}</Fragment>}
					</small>
				</span>


				<div className="d-inline-flex">
					<FacebookProvider appId="128678167815456">
						<Share href={url}>
							<span className="cursor-pointer hoverme p-2 text-secondary" onClick={this.onFollow}>
								<small><Fa icon="share-alt" /> {this.txt.shareOnFb}</small>
							</span>
						</Share>
					</FacebookProvider>
					{/*<FacebookShareButton url={url}>*/}
						{/*<Tooltip id="tooltip-icon" title={this.txt.shareOnFb}>*/}
							{/*<Button tag="a" floating gradient="blue" size="sm"><Fa icon="share-alt" />*/}
							{/*</Button>*/}
						{/*</Tooltip>*/}
					{/*</FacebookShareButton>*/}
				</div>
			</Fragment>
		);
	}
}

LikeShareButtons.propTypes = {
	article: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
};

export default LikeShareButtons;
