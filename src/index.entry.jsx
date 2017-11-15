import React from 'react'
import ReactDOM from 'react-dom';
import Async from 'react-code-splitting'
import 'bootstrap'
import 'bootstrap.css'


import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const About = ()=> <Async load={import('./about/index.jsx')} />
const Home = ()=> <Async load={import('./home/index.jsx')} />

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <Route exact path="/" component={Home}/>
      <Route exact path="/about" component={About}/>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'));


