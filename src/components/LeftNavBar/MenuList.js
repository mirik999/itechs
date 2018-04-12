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
			shareYourStory: <FormattedMessage id="profile.article" />,
			documentCreate: <FormattedMessage id="profile.documentCreate" />,
		}
	}


	render() {
		const { profile } = this.props;
		const isAuth = Object.keys(profile).length !== 0;
		return (
			<div className="menu-list mt-4">
				<ul style={styles.ul}>
					<li style={styles.li}>
						<Fa icon="code" className="ml-2 mr-3"/>
						<NavLink to="/" exact><span className="text-light" style={styles.link}>{ this.txt.articles }</span></NavLink>
					</li>
					{
						isAuth &&
						<li style={styles.submenu}>
							<Fa icon="pencil" className="ml-1 mr-2"/>
							<NavLink to="/article/create" exact>
								<span className="text-light" style={styles.link}>{ this.txt.shareYourStory }</span>
							</NavLink>
						</li>
					}
					{/*<li style={styles.li}>*/}
						{/*<Fa icon="book" className="ml-2 mr-3"/>*/}
						{/*<NavLink to="/documentation"><span className="text-light" style={styles.link}>{ this.txt.documentation }</span></NavLink>*/}
					{/*</li>*/}
					{/*{*/}
						{/*isAuth &&*/}
						{/*<li style={styles.submenu}>*/}
							{/*<Fa icon="pencil" className="ml-1 mr-1"/>*/}
							{/*<NavLink to="/documentation/create" exact>*/}
								{/*<small className="text-light" style={styles.link}>{ this.txt.documentCreate }</small>*/}
							{/*</NavLink>*/}
						{/*</li>*/}
					{/*}*/}
					<li style={styles.li}>
						<Fa icon="question-circle" className="ml-2 mr-3"/>
						<NavLink to="/ask-question"><span className="text-light" style={styles.link}>{ this.txt.question }</span></NavLink>
					</li>
					<li style={styles.li}>
						<Fa icon="life-ring" className="ml-2 mr-3"/>
						<NavLink to="/support"><span className="text-light" style={styles.link}>{ this.txt.feedback }</span></NavLink>
					</li>

					{
						isAuth ? (<li style={styles.li}>
						<Fa icon="user-circle" className="ml-2 mr-3"/>
						<NavLink to={`/profile/@${profile.username}`}><span className="text-light" style={styles.link}>{ this.txt.profile }</span></NavLink>
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
	},
	submenu: {
		color: "#bdc3c7",
		position: "relative",
		left: "30px",
		marginTop: "0px"
	}
}

MenuList.propTypes = {
	profile: PropTypes.object,
};

export default MenuList;