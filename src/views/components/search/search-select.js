import React, { Component } from 'react';

export default class searchSelect extends Component {
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
            <div className="form-group" style={{marginRight: '15px'}}>
                <label className="pr-1 form-control-label">{this.props.label}</label>
                <select
                    name={this.props.condition[this.props.field]}
                    className="form-control"
                    style={{width: '100px'}}
                    onChange={this.onChangeHandler.bind(this)}
                >
                    {this.props.optionsData.map((item)=>{
                        if (item.value === this.state.value) {
                            return (
                                <option value={item.value} selected="selected">{item.text}</option>
                            )
                        }

                        return (
                            <option value={item.value}>{item.text}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}
