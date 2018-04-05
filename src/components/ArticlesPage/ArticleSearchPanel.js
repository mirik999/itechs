import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
//user components
import UserInput from '../Utils/UserInput';


class ArticleSearchPanel extends Component {
	constructor(props) {
		super(props);

		this.txt = {
			shareYourStory: <FormattedMessage id="profile.article" />,
		}
	}

	handleSearchFilter = (e) => {
		this.props.search(e.target.value)
	}

	render() {
		const { searchTerm } = this.props;

		return (
			<div className="row justify-content-center mt-3">
				<div className="col-8">
					<UserInput label="searchLabel" icon="search" onChange={this.handleSearchFilter} value={searchTerm} />
				</div>
				<div className="col-1 d-none d-md-block">
					<Tooltip id="tooltip-icon" title={this.txt.shareYourStory}>
						<Link to="/article/create">
							<Button type="button" outline color="elegant" className="py-2"><Fa icon="pencil" /></Button>
						</Link>
					</Tooltip>
				</div>
			</div>
		);
	}
}

ArticleSearchPanel.propTypes = {
	searchTerm: PropTypes.string,
};

export default ArticleSearchPanel;
