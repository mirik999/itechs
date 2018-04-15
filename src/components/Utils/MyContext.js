import React, {PureComponent} from 'react';
import { conntect } from 'react-redux';
import api from '../../api';
//actions
import { getProfile } from '../actions/profile';

export const Context = React.createContext();

class MyContext extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			profile: {}
		}
	}

	componentDidMount() {
		api.user.getProfile(this.props.user.email)
			.then((profile) => this.setState({ profile }))
	}

	render() {
		return(
			<Context.Provider value={this.state}>
				{ this.props.children }
			</Context.Provider>
		)
	}
}

MyContext.propTypes = {};

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps, { getProfile })(MyContext);
