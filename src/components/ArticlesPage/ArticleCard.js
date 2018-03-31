import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
//user components
import HandleDate from '../Utils/HandleDate';
//actions
import { like } from '../../actions/article';
//selectors
import { articlesSelector } from "../../reducer/article";


class ArticleCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			liked: false
		}

		this.txt = {
			publishedOn: <FormattedMessage id="date.publish" />,
			shareOnFb: <FormattedMessage id="button.share" />,
			like: <FormattedMessage id="button.like" />,
			dislike: <FormattedMessage id="button.dislike" />,
			comments: <FormattedMessage id="button.comments" />,
		}

		this.onVote = this.onVote.bind(this);
	}

	componentDidMount() {
		const articles = this.props.articles.filter(article => article._id === this.props.id)[0];
		const likes = articles.like.map(like => like.likedBy === this.props.user.username);
		this.setState({ liked: likes.includes(true) })
	}


	onVote = () => {
		if (_.isEmpty(this.props.user)) {
			return null;
		}

		const data = {
			id: this.props.id,
			name: this.props.user.username
		}
		this.setState({ liked: !this.state.liked }, () => {
			this.props.like(data)
				.then(() => this.props.update())
		})
	}

	render() {
		const { avatar, author, tags, added, title, content } = this.props;
		const { liked } = this.state;
		
		console.log(!_.isEmpty(this.props.user))
		
		return (
			<div className="col-12 col-md-10 col-lg-8 col-xl-6 my-2">
				<section className="artile-card" style={styles.card}>

					<section style={styles.cardHeader}>
						<table className="d-inline-flex"><tbody><tr>
							<td>
								<img src={avatar} alt="User-logo" style={styles.userAvatar} />
							</td>
							<td className="pl-2" style={styles.verticalAlign}>
								<span className="text-secondary font-weight-bold">{author}</span><br/>
								<small className="text-secondary font-weight-bold" style={styles.authorAbout}>{tags}</small>
							</td>
						</tr></tbody></table>
						<table className="d-inline-flex float-right"><tbody><tr>
							<td className="text-center pt-1" style={styles.verticalAlign}>
								<small className="text-secondary font-weight-bold">{this.txt.publishedOn}</small><br />
								<small className="text-secondary font-weight-bold" style={styles.authorAbout}>
									{ <HandleDate date={added} /> }
								</small>
							</td>
						</tr></tbody></table>
					</section>

					<section style={styles.cardBody}>
						<h3>{title}</h3>
						<small>
							<i>{_.truncate(content, { 'length': 250 }).replace(/<\/?[^>]+>/g,'').replace('&nbsp;', ' ')}</i>
						</small>
					</section>

					<section style={styles.cardFooter}>
						<Tooltip id="tooltip-icon" title={liked ? this.txt.dislike : this.txt.like}>
							<Button tag="a" floating gradient="purple" size="sm" onClick={this.onVote}>
								{ liked ? <Fa icon="heart" /> : <Fa icon="heart-o" /> }
							</Button>
						</Tooltip>
						<Tooltip id="tooltip-icon" title={this.txt.comments}>
							<Button tag="a" floating gradient="peach" size="sm"><Fa icon="commenting-o" /></Button>
						</Tooltip>
						<Tooltip id="tooltip-icon" title={this.txt.shareOnFb}>
							<Button tag="a" floating gradient="blue" size="sm"><Fa icon="share-alt" /></Button>
						</Tooltip>
					</section>

				</section>
			</div>
		)
	}
}

const styles = {
	card: {
		backgroundColor: "#fff",
		padding: "10px",
	},
	cardHeader: {
		padding: "5px",
	},
	cardBody: {
		padding: "5px",
	},
	cardFooter: {
		padding: "5px",
	},
	userAvatar: {
		width: "50px",
		height: "50px",
		borderRadius: "50%"
	},
	verticalAlign: {
		verticalAlign: "middle"
	},
	authorAbout: {
		position: "relative",
		bottom: "5px"
	}
}

function mapStateToProps(state) {
	return{
		articles: articlesSelector(state),
	}
}

export default connect(mapStateToProps, { like })(ArticleCard);
