import React, {Component} from 'react';
import {connect} from 'react-redux';
import { push as Menu } from 'react-burger-menu';
//user components
import MenuList from './MenuList';
import Language from './Language';
//css
import './LeftNavBar.css';


class LeftNavBar extends Component {
	constructor(props) {
		super(props);
		this.state = { menuOpen: false }

		this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
	}

	handleChangeLanguage = () => {
		this.setState({ menuOpen: true })
	}

	render() {
		const { menuOpen } = this.state;

		return (
			<div className="row" id="outer">
				<Menu styles={ styles } isOpen={menuOpen} customCrossIcon={false} outerContainerId={'outer'} pageWrapId={'page-wrap'}>
					<div className="content">
						<div className="mt-2"></div>
						<div className="logo-name text-center" style={styles.logobm}>
							<img src={require('../../lib/images/logo-text.png')} alt="logo-text"/>
						</div>
						<MenuList user={this.props.user} />
						<Language menuOpen={this.handleChangeLanguage} />
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
		fontSize: '1.15em'
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
		user: state.user
	};
}

export default connect(mapStateToProps)(LeftNavBar);
