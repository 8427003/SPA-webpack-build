import React from 'react'
import ReactDOM from 'react-dom';
import '../about/a.js';
$.getJSON('/hehe')
    .done(function(data){
    })
    .fail(function(){
    })
const Home= () => (
  <div>
    <h2>Home.......</h2>
  </div>
)

export  default  Home;

