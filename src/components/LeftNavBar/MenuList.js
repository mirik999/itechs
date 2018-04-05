import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Fa } from 'mdbreact';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
//css
import './LeftNavBar.css';


class MenuList extends Component {
	constructor(props) {
		super(props);

		this.txt = {
			articles: <FormattedMessage id="profile.articles" />,
			documentation: <FormattedMessage id="profile.documentation" />,
			question: <FormattedMessage id="profile.questions" />,
			feedback: <FormattedMessage id="profile.feedback" />,
			profile: <FormattedMessage id="profile.profile" />,
			auth: <FormattedMessage id="button.auth" />,
			create: <FormattedMessage id="profile.article" />,
		}
	}


	render() {
		const { user } = this.props;
		const notAuth = Object.keys(user).length !== 0;
		return (
			<div className="menu-list mt-4">
				<ul style={styles.ul}>
					<li style={styles.li}>
						<Fa icon="code" className="ml-2 mr-3"/>
						<NavLink to="/" exact><span className="text-light" style={styles.link}>{ this.txt.articles }</span></NavLink>
					</li>
					<li style={styles.li}>
						<Fa icon="book" className="ml-2 mr-3"/>
						<NavLink to="/documentation"><span className="text-light" style={styles.link}>{ this.txt.documentation }</span></NavLink>
					</li>
					<li style={styles.li}>
						<Fa icon="question-circle" className="ml-2 mr-3"/>
						<NavLink to="/ask-question"><span className="text-light" style={styles.link}>{ this.txt.question }</span></NavLink>
					</li>
					<li style={styles.li}>
						<Fa icon="life-ring" className="ml-2 mr-3"/>
						<NavLink to="/support"><span className="text-light" style={styles.link}>{ this.txt.feedback }</span></NavLink>
					</li>

					{
						notAuth ? (<li style={styles.li}>
						<Fa icon="user-circle" className="ml-2 mr-3"/>
						<NavLink to="/profile"><span className="text-light" style={styles.link}>{ this.txt.profile }</span></NavLink>
						</li>) :
							(<li style={styles.li}>
							<Fa icon="sign-in" className="ml-2 mr-3"/>
							<NavLink to="/authorization"><span className="text-light" style={styles.link}>{ this.txt.auth }</span></NavLink>
							</li>)
					}
				</ul>
			</div>
		);
	}
}

const styles = {
	ul: {
		paddingLeft: "20px"
	},
	li: {
		color: "#bdc3c7"
	},
	link: {
		width: "150px"
	}
}

MenuList.propTypes = {
	user: PropTypes.object,
};

export default MenuList;
