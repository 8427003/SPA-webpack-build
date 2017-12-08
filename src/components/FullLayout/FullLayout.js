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

const SurveyList = (props)=> <Async componentProps={props} load={import('../../views/SurveyManage/List')} />
const SurveyDetail = (props)=> <Async componentProps={props} load={import('../../views/SurveyManage/Detail')} />
const SurveyQuestion = (props)=> <Async componentProps={props} load={import('../../views/SurveyManage/Question')} />

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
                <PrivateRoute path="/surveyManage/detail/question/:method/id" name="修改题目" component={SurveyQuestion}/>
                <PrivateRoute path="/surveyManage/detail/question/:method" name="新增题目" component={SurveyQuestion}/>
                <PrivateRoute path="/surveyManage/detail/:method/:id" name="修改问卷" component={SurveyDetail}/>
                <PrivateRoute path="/surveyManage/detail/:method" name="新增问卷" component={SurveyDetail}/>
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
