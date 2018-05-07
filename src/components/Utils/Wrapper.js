import React, {PureComponent, Fragment} from 'react';
import Helmet from 'react-helmet';
//async render
const AsyncMode = React.unstable_AsyncMode;

class Wrapper extends PureComponent {
	render() {
		return (
			<Fragment>
				<Helmet>
					<meta name="google-site-verification" content="5etYwSJdPvs73RVzF_Hb-YPow1mvMGynMVfCWgoLQuo" />
				</Helmet>
				<div className="row justify-content-center pb-5" id="page-wrap">
					<div className="col-12 col-sm-10 col-md-9">
						{ this.props.children }
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Wrapper;
