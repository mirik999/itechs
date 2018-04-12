import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../Utils/Wrapper';
//css
import './style.css';

class NotFound extends Component {
	render() {
		return (
			<Wrapper>
				<div className="row justify-content-center" style={styles.parent}>
					<div id="main" style={styles.child}>
						<div className="fof">
							<h1>Error 404</h1>
						</div>
					</div>
				</div>
			</Wrapper>
		);
	}
}

const styles = {
	parent: {
		position: "relative",
		height: "500px"
	},
	child: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)"
	}
}

export default NotFound;
