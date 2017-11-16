import  "./_layout.scss";
import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/Header.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.js';
import Footer from '../../components/Footer/Footer.js';

import Async from 'react-code-splitting';

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
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/test/test1" name="Test" component={Test1}/>
                <Route path="/test/test2" name="Test" component={Test2}/>
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
