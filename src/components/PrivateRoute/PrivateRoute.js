import React, {Component} from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom'
import auth from '../Auth/Auth.js';


function checkPagePermissions(url){
    const menusMap = auth.getMenuMap();
    if(menusMap.has(url)) {
        return true;
    }
    return false;
}

function PrivateRoute({component: Component, path: path, ...rest}) {

    return (
        <Route path={path} {...rest} render={props => {

            return (
                <Component {...props}/>
            );
            const authInfo = auth.getInfo() || {};

            //如果获取到用户信息，说明登陆成功
            if (authInfo && authInfo.info) {

                // 登陆成功后，检查用户页面访问权限
                if(!checkPagePermissions(path)){
                    return (
                        <Redirect to={{
                            pathname: '/500',
                                state: { from: props.location }
                        }}/>
                    )
                }
            }

            return (
                <Redirect to={{
                    pathname: '/login',
                        state: { from: props.location }
                }}/>
            )
        }}/>
    )
}

export default  PrivateRoute;
