import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardImage, CardBody, CardTitle, CardText, Fa } from 'mdbreact';
import { FormattedMessage } from 'react-intl';
//user components
import UserImage from '../Utils/UserImage';
import UserInput from '../Utils/UserInput';


class PublicProfile extends PureComponent {
	constructor(props) {
		super(props);

		this.txt = {
			edit: <FormattedMessage id="edit" />,
			exit: <FormattedMessage id="profile.logout" />,
			resolve: <FormattedMessage id="resolve" />,
			aboutError: <FormattedMessage id="error.about" />,
			contactError: <FormattedMessage id="error.contact" />,
			ptfError: <FormattedMessage id="error.ptf" />,
			githubError: <FormattedMessage id="error.github" />,
			articles: <FormattedMessage id="profile.articles" />,
			comments: <FormattedMessage id="button.comments" />,
			following: <FormattedMessage id="profile.following" />,
			followers: <FormattedMessage id="profile.followers" />,
		}

		this.renderNumbers = this.renderNumbers.bind(this);
	}

	renderNumbers = (category) => {
		const { articles, profile } = this.props;
		if (articles && Object.keys(articles).length !== 0) {
			if (category === "articleNums") return articles.filter(article => article.author.username === profile.username).length
			if (category === "commentNums") return articles.filter(art => art.comments).reduce((acc, art) => acc.concat(art.comments), [])
				.filter(cmt => cmt.author.username === profile.username).length
			if (category === "followers") return profile.followedUsers.length
			if (category === "following") return profile.myFollows.length
		}
	}

	render() {
		const { profile } = this.props;

		if (Object.keys(profile).length === 0) return <div></div>

		return (
			<div className="row justify-content-center">
				<div className="col-12 col-lg-10 col-xl-8">
					<Card reverse className="mt-3">
						<section>
							<UserImage className="img-fluid w-100"
							           image={profile.bgImg}
							           load2image={profile.smallImage}
							           style={styles.img}
							/>
						</section>
						<CardBody>
							<section className="float-left" style={styles.profileImageWrapper}>
								<UserImage image={profile.useravatar}
								           load2image=" "
								           alt="user profile"
								           className="img-thumbnail"
								           style={styles.profileImage}
								/>
							</section>
							<section className="float-left" style={styles.contact}>
								<span className="text-secondary"><Fa icon="at"/> {profile.username}</span><br/>
								<small className="text-secondary font-weight-bold"> {profile.email}</small>
							</section>
							<section className="row no-gutters w-100" style={styles.counts}>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="newspaper-o"/> {this.txt.articles}</small>
									<p>{this.renderNumbers("articleNums")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="comment"/> {this.txt.comments}</small>
									<p>{this.renderNumbers("commentNums")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="user-plus"/> {this.txt.following}</small>
									<p>{this.renderNumbers("following")}</p>
								</div>
								<div className="col-6 col-lg-3 text-center text-secondary px-3 pb-4">
									<small className="font-weight-bold"><Fa icon="users"/> {this.txt.followers}</small>
									<p>{this.renderNumbers("followers")}</p>
								</div>
							</section>
								<section className="mt-2" style={styles.counts}>
									<div className="row justify-content-center">
										<div className="col-12 col-md-6">
											<UserInput label="profile.about" icon="address-card-o" name="about"
											           defaultValue={profile.about} disabled={true}
											/>
										</div>
										<div className="col-12 col-md-6">
											<UserInput label="profile.contact" icon="envelope-o" name="contact"
											           defaultValue={profile.contact} disabled={true}
											/>
										</div>
									</div>
									<div className="row justify-content-center">
										<div className="col-12 col-md-6">
											<UserInput label="profile.ptf" icon="file-code-o" name="portfolio"
											           defaultValue={profile.portfolio} disabled={true}
											/>
										</div>
										<div className="col-12 col-md-6">
											<UserInput label="profile.git" icon="code-fork" name="github"
											           defaultValue={profile.github} disabled={true}
											/>
										</div>
									</div>
								</section>
						</CardBody>
					</Card>
				</div>
			</div>
		)
	}
}

const styles = {
	profileImageWrapper: {
		position: "relative",
		bottom: "80px",
		left: "20px"
	},
	profileImage: {
		width: "110px",
		height: "110px"
	},
	contact: {
		position: "relative",
		bottom: "25px",
		left: "30px",
	},
	edit: {
		position: "relative",
		bottom: "25px"
	},
	img: {
		maxWidth: "930px",
		maxHeight: "344px"
	},
	uploadCover: {
		position: "relative",
		bottom: "330px",
		left: "880px",
		fontSize: "24px",
		color: "silver",
		cursor: "pointer"
	},
	camera: {
		top: "10px",
		right: "10px",
		cursor: "pointer",
		color: "silver"
	},
	counts: {
		position: "relative",
		bottom: "40px"
	}
}

PublicProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	articles: PropTypes.array.isRequired,
};

export default PublicProfile;
