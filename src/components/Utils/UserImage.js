import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ImageZoom from 'react-medium-image-zoom';
import ProgressiveImage from 'react-progressive-image';


class UserImage extends PureComponent {
	render() {
		const { image, alt, className, style, zoom, load2image, id  } = this.props;

		if (zoom === true) {
			return (
				<ProgressiveImage src={image} placeholder={load2image}>
					{ (src, loading) => (
						<ImageZoom
							image={{
								src: src,
								alt: alt,
								className: className,
								style: {style}
							}}
						/>
					) }
				</ProgressiveImage>
			);
		}
		return (
			<ProgressiveImage src={image} placeholder={load2image}>
				{ (src, loading, placeholder) => <img src={src} alt={alt} className={ className } style={style} id={id} /> }
			</ProgressiveImage>
		);
	}
}

UserImage.defaultProps = {
	zoom: false,
	load2image: " ",
	style: {
		cursor: "pointer",
	},
	id: "articleImages"
}

UserImage.propTypes = {
	image: PropTypes.string,
	load2image: PropTypes.string,
	alt: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	zoom: PropTypes.bool,
	id: PropTypes.string,
};

export default UserImage;
