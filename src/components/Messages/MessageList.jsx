var React = require('react');
var Message = require('./Message');

var MessageList = React.createClass({
  scrollToBottom: function() {
    var self = this;
    var messageList = React.findDOMNode(self.refs.messageList);
    messageList.scrollTop = messageList.scrollHeight;

    // HACK HACK
    setTimeout(function() {
      messageList.scrollTop = messageList.scrollHeight;
    }, 1);
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
      <div ref='messageList' className='message-list well well-sm'>
        {messageNodes}
      </div>
    );
  }
});

module.exports = MessageList;
