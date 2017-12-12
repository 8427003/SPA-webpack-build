import React, { Component } from 'react';
import { Button } from 'antd';

export default class searchSubmit extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="form-group">
                <Button type="primary" htmlType="submit" onClick={this.props.onClick}>查询</Button>
            </div>
        )
    }
}
