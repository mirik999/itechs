import React, {PureComponent} from 'react';
//async render
const AsyncMode = React.unstable_AsyncMode;

class Wrapper extends PureComponent {
	render() {
		return (
			<div className="row justify-content-center pb-5" id="page-wrap">
				<div className="col-12 col-sm-10 col-md-9 animated bounceInLeft">
					{ this.props.children }
				</div>
			</div>
		);
	}
}

export default Wrapper;
