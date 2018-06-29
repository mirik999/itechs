import React, {PureComponent, Fragment} from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Fa } from 'mdbreact';
import NProgress from 'nprogress';
//user components
import HandleDate from '../../Utils/HandleDate';
import LikeShareButtons from '../../Utils/LikeShareButtons';
//direct api requests
import api from '../../../api';


class Articles extends PureComponent {
	constructor(props) {
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.articlesList = this.articlesList.bind(this);
	}

	onDelete = async (id) => {
		NProgress.start();
		const article = await api.article.deleteArticle(id);
		this.props.deletedArticle(article)
	}

	articlesList = (articles, profile) => {
		const article = articles.filter(art => art.author.username === profile.username)
			.sort((a, b) => new Date(b.added) - new Date(a.added));
		return article;
	}

	render() {
		const { profile, articles, txt } = this.props;

		if (Object.keys(this.articlesList(articles, profile)).length === 0) {
			return <h4 className="text-center">{ txt.noArticles }</h4>
		}

		return (
			<div className="row justify-content-center">
				{
					this.articlesList(articles, profile).map((article, idx) =>
						<div className="col-12 col-xl-6 mt-1 mb-2" key={idx}>
							<section className="artile-card fixed-height d-flex flex-column justify-content-between" style={styles.card}>
								<div className="card-content-wrap">
									<div style={styles.cardHeader}>
										<table className="d-inline-flex"><tbody><tr>
											<td>
												<img src={article.author.useravatar} alt="User-logo" style={styles.userAvatar} />
											</td>
											<td className="pl-2" style={styles.verticalAlign}>
												<span className="text-secondary font-weight-bold">{article.author.username}</span>
												<br/>
												<small><em className="text-secondary">{article.author.about}</em></small>
											</td>
										</tr></tbody></table>
										<table className="d-inline-flex float-right"><tbody><tr>
											<td className="text-center pt-1" style={styles.verticalAlign}>
												<small className="text-secondary font-weight-bold">{txt.publishedOn}</small><br />
												<small className="text-secondary font-weight-bold" style={styles.authorAbout}>
													{ <HandleDate date={article.added} /> }
												</small>
											</td>
										</tr></tbody></table>
									</div>

									<div style={styles.cardBody}>
										<Link to={`/article/read/${article._id}`}>
											<h4 className="text-secondary word-wrap">{article.title}</h4>
										</Link>
										<small className="text-secondary" style={styles.wordWrap}>
											<i>{_.truncate(article.content, { 'length': 250 }).replace(/<\/?[^>]+>/g,'').replace('&nbsp;', ' ')}</i>
										</small>
									</div>
								</div>

								<div style={styles.cardFooter} className="d-flex justify-content-between">
									<div>
										<LikeShareButtons article={article} profile={profile} card={true} />
									</div>
									<div>
										<span className="p-2 profile-article-btns hoverme">
											<small>
												<Link to={`/article/edit/${article._id}`} className="text-secondary">
													<Fa icon="edit"/> {txt.edit}
												</Link>
											</small>
										</span>
										<span className="p-2 text-secondary profile-article-btns cursor-pointer hoverme"
										      onClick={ () => this.onDelete(article._id) }
										>
											<small><Fa icon="trash-o" /> {txt.delete}</small>
										</span>
									</div>
								</div>

							</section>
						</div>
					)
				}
			</div>
		);
	}
}

Articles.propTypes = {};

const styles = {
	card: {
		backgroundColor: "#f5f5f5",
		padding: "10px"
	},
	cardHeader: {
		padding: "5px",
	},
	cardBody: {
		padding: "5px",
		minHeight: "123px"
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
	},
	wordWrap: {
		wordWrap: "break-word",
		wordBreak: "break-all"
	}
}

export default Articles;
