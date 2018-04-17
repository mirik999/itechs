import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
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

		this.responsive = {
			0:{
				items:1,
				nav:true
			},
			600:{
				items:2,
				nav:false
			},
			1000:{
				items:3,
				nav:true,
				loop:false
			}
		}

		this.onDelete = this.onDelete.bind(this);
	}

	onDelete = async (id) => {
		const deletedArticle = await api.article.deleteArticle(id);
		this.props.deletedArticle(deletedArticle)
	}

	render() {
		const { profile, articles, txt } = this.props;
		const article = articles.filter(art => art.author.username === profile.username);

		if (Object.keys(article).length === 0) return <div>No Articles</div>

		return (
			<section>
				<h4 className="text-center">My Articles</h4>
					{
						article.map((art, idx) =>
							<div className="row border-list-article" key={idx}>
								<div className="d-none d-md-block col-md-3" style={styles.imgWrapper}>
									<UserImage image={art.thumbnail} load2image={art.thumbnailSmall} style={styles.img} className="img-fluid" />
								</div>
								<div className="col-8 col-md-6 d-flex align-items-start flex-column">
									<div className="mb-auto"><span>{art.title}</span></div>
									<div><small><HandleDate date={art.added} /></small></div>
								</div>
								<div className="col-4 col-md-3 d-flex align-items-end flex-column justify-content-end">
									<span className="py-1 px-3 profile-article-btns">
										<Link to={`/article/edit/${art._id}`} className="text-secondary"><Fa icon="edit"/> {txt.edit}</Link>
									</span>
									<span className="py-1 px-3 text-secondary profile-article-btns" onClick={ () => this.onDelete(art._id) }>
										<Fa icon="trash-o" /> {txt.delete}
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
