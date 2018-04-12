import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { FormattedMessage } from 'react-intl';
//css
import './react-draft-wysiwyg.css';

class MyEditor extends Component {
	constructor(props){
		super(props)
		const html = '';
		const contentBlock = htmlToDraft(html);
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.state = {
				editorState,
				thumbnail: []
			};
		}

		this.txt = {
			placeholder: <FormattedMessage id="profile.article"/>
		}

		this.onEditorStateChange = this.onEditorStateChange.bind(this)
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
					this.setState({ thumbnail: this.state.thumbnail.concat(response.data.link) })
					resolve(response);
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}


	onEditorStateChange = (editorState) => {
		this.setState({ editorState }, () => {
			const content = {
				editorState: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
				thumbnail: this.state.thumbnail
			}
			this.props.getContent(content)
		})
	}

	render() {
		const { editorState } = this.state;

		return (
			<Editor
				editorState={editorState}
				handlePastedText={() => false}
				toolbar={{
					options: ['inline', 'image', 'colorPicker','blockType', 'list', 'textAlign', 'link' ],
					inline: { inDropdown: false, options:  ['bold', 'italic', 'monospace'] },
					blockType: { inDropdown: true },
					list: { inDropdown: true },
					textAlign: { inDropdown: true },
					link: { inDropdown: true },
					image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: false }, previewImage: true},
				}}
				onEditorStateChange={this.onEditorStateChange}
				placeholder={this.txt.placeholder}
			/>
		);
	}
}

export default MyEditor;