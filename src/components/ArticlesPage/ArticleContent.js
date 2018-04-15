import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { FormattedMessage } from 'react-intl';
import NProgress from 'nprogress';
import { Helmet } from "react-helmet";
//user components
import CommentsWrapper from './Comments/CommentsWrapper';
import Wrapper from '../Utils/Wrapper';
import HandleDate from '../Utils/HandleDate';
import LikeShareButtons from '../Utils/LikeShareButtons';
//actions
import { getArticle } from '../../actions/article';
import { getProfile } from '../../actions/profile';
//selectors
import { eachArticleSelector } from "../../reducer/article";
import {profileSelector} from "../../reducer/profile";
//css
import './style.css';


class ArticleContent extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			article: {},
			profile: {},
			html: '',
			liked: false
		}

		this.txt = {
			publishedOn: <FormattedMessage id="date.publish" />,
		}

		this.update = this.update.bind(this)
	}

	update = () => {
		NProgress.start();
		this.props.getArticle(this.props.match.params.id)
			.then(() => this.props.getProfile(this.props.user.email)
				.then(() => {
					let html = `${this.props.article.content}`;
					const stringOpt = { "<img": "<img className='img-fluid mx-auto d-block' alt='content_image'" }
					html = html.replace(/<img/gi, (matched) => stringOpt[matched])
					this.setState({ article: this.props.article, profile: this.props.profile, html }, () => NProgress.done())
				})
			)
	}

	componentDidMount() {
		NProgress.start()
		this.props.getArticle(this.props.match.params.id)
			.then(() => this.props.getProfile(this.props.user.email)
				.then(() => {
					let html = `${this.props.article.content}`;
					const stringOpt = { "<img": "<img className='img-fluid mx-auto d-block img-thumbnail' alt='content_image'" }
					html = html.replace(/<img/gi, (matched) => stringOpt[matched])
					this.setState({ article: this.props.article, profile: this.props.profile, html }, () => NProgress.done())
				})
			)
	}

	render() {
		const { lang, user } = this.props;
		const { html, article, profile } = this.state;

		if (Object.keys(article).length === 0 && Object.keys(profile).length === 0) return <div></div>;

		const url = window.location.href;
		const hash = window.location.hash;

		return (
			<Wrapper>
				<Helmet>
					<title>{`iTechs Article - ${article.title}`}</title>
					<meta property="og:url" content={url} />
					<meta property="og:site_name" content="iTechs Information" />
					<meta property="og:image" content={article.thumbnail} />
					<meta property="og:image:url" content={article.thumbnail} />
					<meta property="og:image:secure_url" content={article.thumbnail} />
					<meta property="og:title" content={`iTechs Article - ${article.title}`} />
					<meta property="og:type" content="website" />
					<meta property="fb:app_id" content="128678167815456" />
				</Helmet>
				<div className="row justify-content-center" id='page-wrap'>
					<div className="col-12 col-md-10 col-xl-8 mt-3">
						<section className="header px-3 py-2" style={styles.bg}>
							<table className="d-inline-flex"><tbody><tr>
								<td>
									<img src={article.author.useravatar} alt="User-logo" style={styles.userAvatar} />
								</td>
								<td className="pl-2" style={styles.verticalAlign}>
									<span className="text-secondary font-weight-bold">{article.author.username}</span><br/>
									<small className="text-secondary font-weight-bold" style={styles.authorAbout}>{article.author.about}</small>
								</td>
							</tr></tbody></table>
							<table className="d-inline-flex float-right"><tbody><tr>
								<td className="text-center pt-1" style={styles.verticalAlign}>
									<small className="text-secondary font-weight-bold">{this.txt.publishedOn}</small><br />
									<small className="text-secondary font-weight-bold" style={styles.authorAbout}>
										{ <HandleDate date={article.added} /> }
									</small>
								</td>
							</tr></tbody></table>
							<hr />
						</section>
						<section className="body px-3 pb-3" style={styles.bg}>
							<h3 className="text-center pb-2">{ article.title }</h3>
							{ renderHTML(html) }
							<LikeShareButtons article={article} profile={profile} lang={lang} url={url} />
						</section>
						<hr />
						<section className="footer px-3 pb-3 mb-3" style={styles.bg}>
							<CommentsWrapper article={article} user={user} profile={profile} id={article._id} hash={hash} />
						</section>
					</div>
				</div>
			</Wrapper>
		);
	}
}

const styles = {
	bg: {
		backgroundColor: "#fff",
		wordWrap: "break-word"
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
	},
	centerTable: {
		position: "relative",
		left: "250px",
		bottom: "10px"
	}
}

ArticleContent.propTypes = {
	article: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
	profile: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	getArticle: PropTypes.func.isRequired,
	getProfile: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	return {
		article: eachArticleSelector(state),
		profile: profileSelector(state),
		user: state.user,
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { getArticle, getProfile })(ArticleContent);

