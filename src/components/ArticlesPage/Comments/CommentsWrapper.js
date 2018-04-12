import React, {Component} from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
//user components
import CommentForm from './CommentForm';
import EachComment from './EachComment';
//css
import './style.css';

class CommentsWrapper extends Component {
	constructor(props) {
		super(props)

		this.txt = {
			disableCom: <FormattedMessage id="comment.disable" />,
		}
	}

	render() {
		const { id, article, profile, lang } = this.props;

		if (article.disableComment) {
			return <div className="col-12 text-center pt-3">
					<span className="text-secondary font-weight-bold">{this.txt.disableCom}</span>
				</div>
		}

		return (
			<div className="row justify-content-center">
				<div className="col-12">
					<div>
						<EachComment comments={article.comments}
						             profile={profile}
						             id={id}
						             lang={lang}
						/>
						<CommentForm profile={profile}
						             comments={article.comments}
						             id={id}
						             lang={lang}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(CommentsWrapper);
