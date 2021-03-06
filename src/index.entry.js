import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';

// Containers
import FullLayout from './components/FullLayout/FullLayout'

import Page404 from './views/Pages/Page404/Page404';
import Page500 from './views/Pages/Page500/Page500';
import PageLogin from './views/Pages/PageLogin/PageLogin';



ReactDOM.render((
  <HashRouter>
    <Switch>
        <Route exact path="/404" name="Page 404" component={Page404}/>
        <Route exact path="/500" name="Page 500" component={Page500}/>
        <Route exact path="/login" name="Page login" component={PageLogin}/>
        <Route path="/" name="Home" component={FullLayout}/>
    </Switch>
  </HashRouter>
), document.getElementById('root'));
