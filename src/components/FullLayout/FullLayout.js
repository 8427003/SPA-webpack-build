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
            <Container fluid>
              <Switch>
                <PrivateRoute path="/surveyManage/list" name="问卷列表" component={SurveyList}/>
                <PrivateRoute path="/surveyManage/detail/:id" name="新增/修改问卷" component={SurveyDetail}/>
                <PrivateRoute path="/surveyManage/question/:detailId/:id" name="新增/修改题目" component={SurveyQuestion}/>
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
