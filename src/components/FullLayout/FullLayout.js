import  "./FullLayout.less";

import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Async from 'react-code-splitting';

import PrivateRoute from '../PrivateRoute/PrivateRoute.js';

import Header from '../Header/Header.js';
import Sidebar from '../Sidebar/Sidebar.js';
import Breadcrumb from '../Breadcrumb/Breadcrumb.js';
import Footer from '../Footer/Footer.js';

const Dashboard = ()=> <Async load={import('../../views/Dashboard/Dashboard.js')} />
const Test1 = ()=> <Async load={import('../../views/Test/Test2.js')} />
const Test2 = ()=> <Async load={import('../../views/Test/Test1.js')} />

class FullLayout extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <PrivateRoute path="/dashboard" name="Dashboard" component={Dashboard}/>
                <PrivateRoute path="/test/test1" name="Test" component={Test1}/>
                <PrivateRoute path="/test/test2" name="Test" component={Test2}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default FullLayout;
