var React = require('react');
var Message = require('./Message');

var MessageList = React.createClass({
  scrollToBottom: function() {
    var messageList = React.findDOMNode(this.refs.messageList);
    messageList.scrollTop = messageList.scrollHeight;
  },

  render: function() {
    var messageNodes = this.props.messages.map(function(message) {
      return (
        <Message sender={message.sender} key={message.sender + message.timestamp} timestamp={message.timestamp}>
          {message.text}
        </Message>
      );
    });
    return (
      <div ref='messageList' className='message-list well'>
        {messageNodes}
      </div>
    );
  }
});

module.exports = MessageList;
