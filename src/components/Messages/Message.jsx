var React = require('react');
var xssFilters = require('xss-filters');
var Autolinker = require('autolinker');

var autolinker = new Autolinker({
  twitter: false
});

var Message = React.createClass({
  render: function() {
    var rawMarkup = xssFilters.inHTMLData(this.props.children.toString());
    rawMarkup = autolinker.link(rawMarkup);

    return (
      <div className='message'>
        <span className='message-sender' title={this.props.timestamp}>{this.props.sender}</span>: <span dangerouslySetInnerHTML={{__html: rawMarkup}}></span>
      </div>
    );
  }
});

module.exports = Message;
