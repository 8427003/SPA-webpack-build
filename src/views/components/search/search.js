import React, { Component } from 'react';

export default class search extends Component {
    constructor(props){
        super(props);
    }
    render() {
        this.props.children.map(item => {
            item.props.condition = this.props.condition;
            return item;
        })

        return (
            <form className="form-inline search" onSubmit={this.props.onSubmit}>
                {this.props.children}
            </form>
        )
    }
}
