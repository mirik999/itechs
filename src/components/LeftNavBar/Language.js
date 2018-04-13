import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { Fa } from 'mdbreact';
// actions
import { setlocale } from '../../actions/locale';


class Language extends Component {
	render() {
		const { lang } = this.props;

		return (
			<div className="mt-4 text-center">
				<Divider />
				<section className="mt-2">

					<Fa icon="language" className="ml-2" />

					<span className={ `mx-3 ${lang === "az" && "border-bottom"}` }
					      style={styles.lang}
					      onClick={ () => { this.props.setlocale("az") } }
					>
						AZE
					</span>

					<span className={ `mx-3 ${lang === "en" && "border-bottom"}` }
					      style={styles.lang}
					      onClick={ () => { this.props.setlocale("en") } }
					>
						ENG
					</span>

					<span className={ `mx-3 ${lang === "ru" && "border-bottom"}` }
					      style={styles.lang}
					      onClick={ () => { this.props.setlocale("ru") } }
					>
						RUS
					</span>

				</section>
			</div>
		);
	}
}

const styles = {
	lang: {
		cursor: "pointer",
		fontWeight: "400"
	}
}

Language.propTypes = {
	user: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { setlocale })(Language);
