import React, { Component } from 'react';

export default class searchSubmit extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="form-group">
                <button type="submit" className="btn btn-primary" onClick={this.props.onClick}>查询</button>
            </div>
        )
    }
}
