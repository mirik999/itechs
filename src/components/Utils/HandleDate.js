import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

class HandleDate extends PureComponent {
	constructor(props) {
		super(props)

		this.covertDateToMonth = this.covertDateToMonth.bind(this)
	}

	covertDateToMonth = (data) => {
		const { lang } = this.props;
		let dataToString = `${data}`;
		let month = dataToString.substring(5, 7)

		if (month === '01') {
			if (lang === "en") return month = "January"
			if (lang === "ru") return month = "Январь"
			if (lang === "az") return month = "Yanvar"
		}
		else if (month === '02') {
			if (lang === "en") return month = "February"
			if (lang === "ru") return month = "Февраль"
			if (lang === "az") return month = "Fevral"
		}
		else if (month === '03') {
			if (lang === "en") return month = "March"
			if (lang === "ru") return month = "Март"
			if (lang === "az") return month = "Mart"
		}
		else if (month === '04') {
			if (lang === "en") return month = "April"
			if (lang === "ru") return month = "Апрель"
			if (lang === "az") return month = "Aprel"
		}
		else if (month === '05') {
			if (lang === "en") return month = "May"
			if (lang === "ru") return month = "Май"
			if (lang === "az") return month = "May"
		}
		else if (month === '06') {
			if (lang === "en") return month = "June"
			if (lang === "ru") return month = "Июнь"
			if (lang === "az") return month = "Iyun"
		}
		else if (month === '07') {
			if (lang === "en") return month = "July"
			if (lang === "ru") return month = "Июль"
			if (lang === "az") return month = "Iyul"
		}
		else if (month === '08') {
			if (lang === "en") return month = "August"
			if (lang === "ru") return month = "Август"
			if (lang === "az") return month = "Avqust"
		}
		else if (month === '09') {
			if (lang === "en") return month = "September"
			if (lang === "ru") return month = "Сентябрь"
			if (lang === "az") return month = "Sentyabr"
		}
		else if (month === '10') {
			if (lang === "en") return month = "October"
			if (lang === "ru") return month = "Октябрь"
			if (lang === "az") return month = "Oktyabr"
		}
		else if (month === '11') {
			if (lang === "en") return month = "November"
			if (lang === "ru") return month = "Ноябрь"
			if (lang === "az") return month = "Noyabr"
		}
		else if (month === '12') {
			if (lang === "en") return month = "December"
			if (lang === "ru") return month = "Декабрь"
			if (lang === "az") return month = "Dekabr"
		}

		return `${month}`;
	}

	render() {
		let dataToString = `${this.props.date}`;
		let year = dataToString.substring(0, 4)
		let month = this.covertDateToMonth(dataToString)
		let day = dataToString.substring(8, 10)
		return (
			<span>{ ` ${day} ${month} ${year} ` }</span>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(HandleDate);
