import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Fa } from 'mdbreact';
//user components
import UserInput from '../Utils/UserInput';


class ArticleSearchPanel extends PureComponent {
	constructor(props) {
		super(props);

		this.txt = {
			shareYourStory: <FormattedMessage id="profile.article" />,
		}

		this.handleSearchFilter = this.handleSearchFilter.bind(this);
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
			</div>
		);
	}
}

ArticleSearchPanel.propTypes = {
	searchTerm: PropTypes.string,
};

export default ArticleSearchPanel;
