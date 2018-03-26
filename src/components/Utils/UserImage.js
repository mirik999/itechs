import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ImageZoom from 'react-medium-image-zoom';
import ProgressiveImage from 'react-progressive-image';


class UserImage extends Component {
	render() {
		const { image, alt, className, style, zoom, load2image  } = this.props;

		if (zoom) {
			return (
				<ProgressiveImage src={image} placeholder={load2image}>
					{ (src) => (
						<ImageZoom
							image={{
								src: src,
								alt: alt,
								className: className,
								style: { style }
							}}
						/>
					) }
				</ProgressiveImage>
			);
		}

		return (
			<ProgressiveImage src={image} placeholder={load2image}>
				{ (src) => <img src={src} alt={alt} className={ className } style={style} /> }
			</ProgressiveImage>
		);
	}
}

UserImage.defaultProps = {
	zoom: false,
	load2image: " "
}

UserImage.propTypes = {
	image: PropTypes.string,
	load2image: PropTypes.string,
	alt: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	zoom: PropTypes.bool,
};

export default UserImage;
