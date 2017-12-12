import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

export default class Detail extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        if (!this.props.routes) {
            return <Breadcrumb></Breadcrumb>;
        }

        let len = this.props.routes.length;

        return (
            <Breadcrumb>
                {this.props.routes.map((route, index)=>{
                    if (len - 1 === index) {
                        return (
                            <BreadcrumbItem>
                                {route.name}
                            </BreadcrumbItem>
                        )
                    }
                    return (
                        <BreadcrumbItem>
                            <Link to={route.path}>
                                {route.name}
                            </Link>
                        </BreadcrumbItem>
                    )
                })}
            </Breadcrumb>
        )
    }
}
