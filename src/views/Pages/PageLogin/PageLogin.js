import React, {Component} from 'react';
import  auth  from  '../../../components/Auth/Auth.js';
import {Redirect} from 'react-router-dom';

class PageLogin extends Component {
    state = {
        redirectToReferrer: false
    }

    login = () => {
        auth.signin(() => {
            this.setState({ redirectToReferrer: true })
        })
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        )
    }
}

export default PageLogin;
