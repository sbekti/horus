require('bootstrap-webpack');
require('./styles/style.less');

var React = require('react');
var Application = require('./components/Application.jsx');

React.render(
  <Application pollInterval='10000' />, document.getElementById('react-root')
);
