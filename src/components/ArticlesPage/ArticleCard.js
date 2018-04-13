import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Fa } from 'mdbreact';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
//user components
import HandleDate from '../Utils/HandleDate';
import LikeShareButtons from '../Utils/LikeShareButtons';
//actions
import { like } from '../../actions/article';

class ArticleCard extends Component {
	constructor(props) {
		super(props);

		this.txt = {
			publishedOn: <FormattedMessage id="date.publish" />,
		}
	}

	render() {
		const { article, id, lang, profile } = this.props;

		return (
			<div className="col-12 col-md-10 col-lg-8 col-xl-6 my-2">
				<section className="artile-card" style={styles.card}>

					<section style={styles.cardHeader}>
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
					</section>

					<section style={styles.cardBody}>
						<Link to={`/article/read/${id}`}>
							<h3 className="text-secondary">{article.title}</h3>
						</Link>
						<small className="text-secondary" style={styles.wordWrap}>
							<i>{_.truncate(article.content, { 'length': 250 }).replace(/<\/?[^>]+>/g,'').replace('&nbsp;', ' ')}</i>
						</small>
					</section>

					<section style={styles.cardFooter}>
						<LikeShareButtons article={article} lang={lang} profile={profile} card={true} />
					</section>

				</section>
			</div>
		)
	}
}

const styles = {
	card: {
		backgroundColor: "#fff",
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
		wordWrap: "break-word"
	}
}

export default connect(null, { like })(ArticleCard);
