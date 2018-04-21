import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { FormattedMessage } from 'react-intl';
import NProgress from 'nprogress';
import { Helmet } from "react-helmet";
import mediumZoom from 'medium-zoom';
//user components
import CommentsWrapper from './Comments/CommentsWrapper';
import Wrapper from '../Utils/Wrapper';
import UserName from '../Utils/UserName';
import HandleDate from '../Utils/HandleDate';
import LikeShareButtons from '../Utils/LikeShareButtons';
//direct api requests
import api from '../../api';
//css
import './style.css';



class ArticleContent extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			article: {},
			profile: {},
			html: '',
			liked: false,
			deleted: false
		}

		this.txt = {
			publishedOn: <FormattedMessage id="date.publish" />,
		}
	}

	async componentDidMount() {
		NProgress.start()
		const article = await api.article.getArticle(this.props.match.params.id);
		if (article === null || Object.keys(article).length === 0) window.location.href = '/404';
		const profile = Object.keys(this.props.user).length !== 0 && await api.user.getProfile(this.props.user.email)
		let html = article.content;
		const stringOpt = {
			"<img": "<img id='articleImages' style='cursor: pointer;' " +
			"className='img-fluid my-3 mx-auto d-block img-thumbnail' alt='content_image'"
		}
		html = await html.replace(/<img/gi, (matched) => stringOpt[matched])
		this.setState({
			article,
			profile,
			html
		})
		await mediumZoom('#articleImages', {
			margin: 24,
			background: 'rgba(0, 0, 0, 0.7)',
			scrollOffset: 0,
			metaClick: false,
		});
		NProgress.done();
	}

	render() {
		const { lang, user } = this.props;
		const { html, article, profile } = this.state;

		if (Object.keys(article).length === 0) return <div></div>;

		const url = window.location.href;
		const hash = window.location.hash;

		return (
			<Wrapper>
				<Helmet>
					<title>{`iTechs Article - ${article.title}`}</title>
					<meta name="description" content="1 person wants answer to this question. Be the first one to respond."
					      itemProp="description"
					/>
					<meta name="google-site-verification" content="5etYwSJdPvs73RVzF_Hb-YPow1mvMGynMVfCWgoLQuo" />
					<meta property="og:url" content={url} />
					<meta property="og:site_name" content="iTechs Information" />
					<meta property="og:image" content={article.thumbnail} itemProp="image" />
					<meta property="og:image:url" content={article.thumbnail} itemProp="image" />
					<meta property="og:image:width" content="700" />
					<meta property="og:image:height" content="400" />
					<meta property="og:title" content={`iTechs Article - ${article.title}`} itemProp="name" />
					<meta property="og:type" content="website" />
					<meta property="og:description" content="1 person wants answer to this question. Be the first one to respond." />
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
									<UserName me={profile} userprofile={article} className="text-secondary font-weight-bold cursor-pointer" />
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
	user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		user: state.user,
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(ArticleContent);

