import React, { Component } from 'react';

export default class searchText extends Component {
    constructor(props){
        super(props);

        this.state = {
            value: this.props.condition[this.props.field]
        }
    }
    onChangeHandler(e){
        this.props.condition[this.props.field] =  this.state.value = e.target.value;
        this.setState(this.state);
    }
    render() {
        return (
            <div class="form-group" style={{marginRight: '15px'}}>
                <label className="pr-1 form-control-label">{this.props.label}</label>
                <input
                    value={this.state.value}
                    type="text"
                    className="form-control"
                    onChange={this.onChangeHandler.bind(this)}
                />
            </div>
        )
    }
}
