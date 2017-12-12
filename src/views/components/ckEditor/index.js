import React, { Component } from 'react';
import ReactDOM from "react-dom";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class ckEditor extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.content !== nextProps.content) {
            return true;
        }
        false;
    }
    componentDidUpdate(){
        if(!this.editor) return;
        this.editor.setData(this.props.content || '')
    }
    componentDidMount(){
        ClassicEditor
            .create(ReactDOM.findDOMNode(this), this.props.config || {})
            .then(editor => {
                this.editor = editor;
                this.editor.setData(this.props.content || '');
            })
    }
    getData(){
        return this.editor && this.editor.getData();
    }
    render() {
        return <div></div>
    }
}
