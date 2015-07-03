var React = require('react');
var SanitizeHtml = require('sanitize-html');
var Autolinker = require('autolinker');

var autolinker = new Autolinker({
  twitter: false
});

var Message = React.createClass({
  render: function() {
    var rawMarkup = SanitizeHtml(this.props.children.toString(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    rawMarkup = autolinker.link(rawMarkup);

    return (
      <div className='message'>
        <span className='message-sender' title={this.props.timestamp}>{this.props.sender}</span>: <span dangerouslySetInnerHTML={{__html: rawMarkup}}></span>
      </div>
    );
  }
});

module.exports = Message;
