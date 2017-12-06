import  "./FullLayout.less";

import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Async from 'react-code-splitting';

import PrivateRoute from '../PrivateRoute/PrivateRoute';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Footer from '../Footer/Footer';

const SurveyList = ()=> <Async load={import('../../views/SurveyManage/List')} />
const SurveyAdd = ()=> <Async load={import('../../views/SurveyManage/Add')} />

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
                <PrivateRoute path="/surveyManage/list" name="问卷列表" component={SurveyList}/>
                <PrivateRoute path="/surveyManage/add" name="新增问卷" component={SurveyAdd}/>
                <Redirect from="/" to="/surveyManage/list"/>
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
