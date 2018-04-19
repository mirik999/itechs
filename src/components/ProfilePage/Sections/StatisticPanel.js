import React, {PureComponent} from 'react';
import { Fa } from 'mdbreact';
import PropTypes from 'prop-types';
import classNames from 'classnames';


class StatisticPanel extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			tabNumber: 0
		}

		this.renderNumbers = this.renderNumbers.bind(this)
		this.onClick = this.onClick.bind(this)
	}

	onClick = (num) => {
		if (this.state.tabNumber === num) num = 1;
		this.setState({ tabNumber: num })
		this.props.getNumberOfTables(num)
	}

	renderNumbers = (category) => {
		const { articles, profile } = this.props;

		if (articles && Object.keys(articles).length !== 0) {
			if (category === "articleNums") return articles.filter(article => article.author.username === profile.username).length
			if (category === "commentNums") return articles.filter(art => art.comments).reduce((acc, art) => acc.concat(art.comments), [])
				.filter(cmt => cmt.author.username === profile.username).length
			if (category === "followers") return profile.followedUsers.length
			if (category === "following") return profile.myFollows.length
		}
	}

	render() {
		const { tabNumber } = this.state;
		const { style, txt } = this.props;

		return (
			<section className="row no-gutters w-100" style={style}>
				<div className={classNames({ "col-6 col-lg-3 text-center text-secondary px-3 pb-4 hoverStatic" : true,
					"bg": tabNumber === 2
				})}
				     onClick={() => this.onClick(2)}>
					<small className="font-weight-bold"><Fa icon="newspaper-o"/> {txt.articles}</small>
					<p>{this.renderNumbers("articleNums")}</p>
				</div>
				<div className={classNames({ "col-6 col-lg-3 text-center text-secondary px-3 pb-4 hoverStatic" : true,
					"bg": tabNumber === 3
				})}
				     onClick={() => this.onClick(3)}>
					<small className="font-weight-bold"><Fa icon="comment"/> {txt.comments}</small>
					<p>{this.renderNumbers("commentNums")}</p>
				</div>
				<div className={classNames({ "col-6 col-lg-3 text-center text-secondary px-3 pb-4 hoverStatic" : true,
					"bg": tabNumber === 4
				})}
				     onClick={() => this.onClick(4)}>
					<small className="font-weight-bold"><Fa icon="user-plus"/> {txt.following}</small>
					<p>{this.renderNumbers("following")}</p>
				</div>
				<div className={classNames({ "col-6 col-lg-3 text-center text-secondary px-3 pb-4 hoverStatic" : true,
					"bg": tabNumber === 5
				})}
				     onClick={() => this.onClick(5)}>
					<small className="font-weight-bold"><Fa icon="users"/> {txt.followers}</small>
					<p>{this.renderNumbers("followers")}</p>
				</div>
			</section>
		);
	}
}

StatisticPanel.propTypes = {
	getNumberOfTables: PropTypes.func.isRequired,
	articles: PropTypes.array.isRequired,
	profile: PropTypes.object.isRequired,
};

export default StatisticPanel;
