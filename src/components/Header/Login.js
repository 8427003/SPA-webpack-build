import React, { Component } from 'react';
import {Button} from 'reactstrap';
import  auth  from  '../Auth/Auth.js';
import {
  Redirect
} from 'react-router-dom'

class Login extends Component {
    state = {
        redirectToReferrer: false
    }

    logout = () => {
        auth.signout(() => {
            this.setState({ redirectToReferrer: true })
        })
    }

    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            return (
                <Redirect to='/login'/>
            )
        }

        let Login;
        const authInfo = auth.getInfo()
        if (authInfo && authInfo.info) {
            return (
                <div style={{marginRight: '20px'}}>
                    <span style={{marginRight: '15px'}}>{authInfo.info.user_id}</span>
                    <Button color="primary" size="sm" onClick={this.logout}>退出</Button>
                </div>
            )
        }

        return (
            <div style={{marginRight: '20px'}}>
                <Button color="primary" size="sm" onClick={auth.login}>登陆</Button>
            </div>
        )

    }
}

export default Login;
