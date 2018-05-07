import React, { PureComponent, Fragment } from 'react';
import Trumbowyg from 'react-trumbowyg'
import { FormattedMessage } from 'react-intl';
//css
import 'react-trumbowyg/dist/trumbowyg.min.css';
import 'prismjs/themes/prism.css';
import 'trumbowyg/dist/plugins/highlight/ui/trumbowyg.highlight.css';
//plugins
import 'trumbowyg/dist/plugins/table/trumbowyg.table.js';
import 'prismjs/prism.js';
import 'trumbowyg/dist/plugins/highlight/trumbowyg.highlight.min.js';

class NewEditor extends PureComponent {
	constructor(props){
		super(props)
			this.state = {
				editorState: null,
				articleImages: []
			};

		this.txt = {
			placeholder: <FormattedMessage id="profile.article"/>
		}

		this.onChange = this.onChange.bind(this)
		this.uploadImageCallBack = this.uploadImageCallBack.bind(this)
	}

	uploadImageCallBack = (file) => {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'https://api.imgur.com/3/image');
				xhr.setRequestHeader('Authorization', 'Client-ID 4ce544cd34aeea7');
				const data = new FormData();
				data.append('image', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					this.setState({ articleImages: this.state.articleImages.concat(response.data.link) })
					resolve(response);
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}


	onChange = async (editorState) => {
		this.setState({ editorState })
		const content = await {
			editorState: this.state.editorState,
			articleImages: this.state.articleImages
		}
		await this.props.getContent(content)
	}

	render() {

		return (
			<Trumbowyg
				id='react-trumbowyg'
        ref="trumbowyg"
				data=''
				semantic
				autogrow
        buttons={
	        [
	          ['viewHTML'],
	          ['formatting'],
	          'btnGrp-semantic',
	          ['link'],
		        ['insertImage'],
	          ['highlight'],
	          'btnGrp-justify',
	          'btnGrp-lists',
	          ['fullscreen']
	        ]
	      }
			/>
		);
	}
}

export default NewEditor;