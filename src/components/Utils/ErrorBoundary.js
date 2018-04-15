import React, {PureComponent} from 'react';


class ErrorBoundary extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { error: false, info: '' };
	}

	componentDidCatch(error, info) {
		this.setState({ error, info });
	}

	render() {
		if (this.state.error) {
			return (
				<div className="row justify-content-center pb-5" id="page-wrap">
					<div className="col-12 col-sm-10 col-md-9 mt-3">
						<h1>
							Error
						</h1>

						<label>error.info.componentStack</label>
						{this.state.info &&
						this.state.info.componentStack.split("\n").map(i => {
							return (
								<div style={{textAlign: "left", maxWidth: "400px", margin: "0 auto"}} key={i}>
									{i}
								</div>
							);
						})}
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
