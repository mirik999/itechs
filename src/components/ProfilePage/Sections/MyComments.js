import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
import renderHTML from 'react-render-html';
import Tooltip from 'material-ui/Tooltip';
//user components
import HandleDate from '../../Utils/HandleDate';
//direct api requests
import api from '../../../api';
//css
import './style.css';

class NyComments extends PureComponent {
	constructor(props) {
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.myComments = this.myComments.bind(this);
	}

	onDelete = async (id) => {
		const deletedArticle = await api.article.deleteArticle(id);
		this.props.deletedArticle(deletedArticle)
	}

	myComments = (articles, profile) => {
		const comments = articles.filter(art => art.comments).reduce((acc, art) => acc.concat(art.comments), [])
			.filter(com => com.author.username === profile.username).sort((a, b) => {
				return new Date(b.date) - new Date(a.date)
			});
		return comments;
	}

	render() {
		const { profile, articles, txt } = this.props;

		if (Object.keys(this.myComments(articles, profile)).length === 0) {
			return <h4 className="text-center">{ txt.noComments }</h4>
		}

		return (
			<section>
				<h4 className="text-center">{txt.comments}</h4>
				{
					this.myComments(articles, profile).map((com, idx) =>
						<div className="row border-list-article" key={idx}>
							<div className="col-8 col-md-9 d-flex align-items-start flex-column">
								<div className="mb-auto word-wrap"><span>{renderHTML(com.text)}</span></div>
								<div><small><HandleDate date={com.date} /></small></div>
							</div>
							<div className="col-4 col-md-3 d-flex align-items-end flex-column justify-content-end">
								<span className="py-1 px-3 profile-article-btns">
									<Link to={`/article/read/${com.articleID}`} className="text-secondary">
										<small><Fa icon="edit"/> {txt.edit}</small>
									</Link>
								</span>
							</div>
						</div>
					)
				}
			</section>
		);
	}
}

const styles = {
}

NyComments.propTypes = {
	articles: PropTypes.array.isRequired,
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};

export default NyComments;
