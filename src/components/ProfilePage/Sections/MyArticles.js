import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
import mediumZoom from 'medium-zoom';
//user components
import UserImage from '../../Utils/UserImage';
import HandleDate from '../../Utils/HandleDate';
//direct api requests
import api from '../../../api';
//css
import './style.css';

class MyArticles extends PureComponent {
	constructor(props) {
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.myArticles = this.myArticles.bind(this);
	}

	componentDidMount() {
		mediumZoom('#articleImages', {
			margin: 24,
			background: 'rgba(0, 0, 0, 0.7)',
			scrollOffset: 0,
			metaClick: false,
		});
	}

	onDelete = async (id) => {
		const deletedArticle = await api.article.deleteArticle(id);
		this.props.deletedArticle(deletedArticle)
	}

	myArticles = (articles, profile) => {
		const article = articles.filter(art => art.author.username === profile.username)
														 .sort((a, b) => new Date(b.added) - new Date(a.added));
		return article;
	}

	render() {
		const { profile, articles, txt } = this.props;

		if (Object.keys(this.myArticles(articles, profile)).length === 0) return <h4 className="text-center">{ txt.noArticles }</h4>

		return (
			<section>
				<h4 className="text-center">{ txt.articles }</h4>
					{
						this.myArticles(articles, profile).map((art, idx) =>
							<div className="row border-list-article" key={idx}>
								<div className="d-none d-md-block col-md-3" style={styles.imgWrapper}>
									<UserImage image={art.thumbnail} load2image={art.thumbnailSmall} style={styles.img}
									           className="img-fluid img-thumbnail cursor-pointer"
									/>
								</div>
								<div className="col-8 col-md-6 d-flex align-items-start flex-column">
									<div className="mb-auto word-wrap"><span>{art.title}</span></div>
									<div><small><HandleDate date={art.added} /></small></div>
								</div>
								<div className="col-4 col-md-3 d-flex align-items-end flex-column justify-content-end">
									<span className="py-1 px-3 profile-article-btns">
										<small>
											<Link to={`/article/edit/${art._id}`} className="text-secondary"><Fa icon="edit"/> {txt.edit}</Link>
										</small>
									</span>
									<span className="py-1 px-3 text-secondary profile-article-btns" onClick={ () => this.onDelete(art._id) }>
										<small><Fa icon="trash-o" /> {txt.delete}</small>
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
	imgWrapper: {
		width: "200px",
		height: "100px",
		overflow: "hidden"
	},
	img: {
		height: "100px",
		width: "150px"
	}
}

MyArticles.propTypes = {
	articles: PropTypes.array.isRequired,
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};

export default MyArticles;
