import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
//user components
import MenuList from './MenuList';
import Language from './Language';
//direct api requests
//import api from '../../api';
//selectors
import {profileSelector} from "../../reducer/profile";
//css
import './LeftNavBar.css';


class LeftNavBar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false
		}
	}

	// async componentDidMount() {
	// 	const profile = Object.keys(this.props.user).length !== 0 && await api.user.getProfile(this.props.user.email)
	// 	this.setState({ profile: this.props.profile })
	// }

	render() {
		const { profile, lang } = this.props;
		const { menuOpen } = this.state;

		return (
			<div className="row">
				<Menu styles={ styles } isOpen={menuOpen} customCrossIcon={false}>
					<div className="content">
						<div className="mt-2"></div>
						<div className="logo-name text-center" style={styles.logobm}>
							<img src={require('../../lib/images/logo-text.png')} alt="logo-text"/>
						</div>
						<MenuList profile={profile} lang={lang} />
						<Language />
					</div>
				</Menu>
			</div>
		);
	}
}

// react-burger-menu css setting
const styles = {
	bmBurgerButton: {
		position: 'fixed',
		width: '36px',
		height: '30px',
		left: '30px',
		top: '30px'
	},
	bmBurgerBars: {
		background: '#4F5A6E'
	},
	bmCrossButton: {
		position: 'fixed',
		left: '260px',
		top: '30px',
		height: '30px',
		width: '30px'
	},
	bmCross: {
		background: '#4F5A6E'
	},
	bmMenu: {
		background: '#4F5A6E',
		// padding: '2.5em 1.5em 0',
		fontSize: '1.15em',
	},
	bmMorphShape: {
		fill: '#4F5A6E'
	},
	bmItemList: {
		color: '#b8b7ad',
		padding: '10px'
	},
	bmOverlay: {
		background: 'rgba(0, 0, 0, 0.3)'
	},
	logobm: {
		background: '#bdc3c7'
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang,
		profile: profileSelector(state)
	};
}

export default connect(mapStateToProps)(LeftNavBar);
