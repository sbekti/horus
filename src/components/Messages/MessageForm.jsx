var React = require('react');

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var message = React.findDOMNode(this.refs.messageInputField).value.trim();
    if (!message) { return; }

    React.findDOMNode(this.refs.messageInputField).value = '';
    this.props.onSubmit(message);
  },

  focusInput: function() {
    var messageInputField = React.findDOMNode(this.refs.messageInputField)

    // A bug in iOS 8 makes virtual keyboard appears and scrolls page after touch.
    // A simple solution would be to prevent autofocus at all.
    if (!/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      $(messageInputField).focus();
      $(messageInputField).select();
    };
  },

  render: function() {
    return (
      <form className='message-form' onSubmit={this.handleSubmit}>
        <div className='input-group'>
          <input ref='messageInputField' type='text' placeholder='Say something...' maxLength={256} className='form-control' />
          <span className='input-group-btn'>
            <input type='submit' className='btn btn-success' defaultValue='Send' />
          </span>
        </div>
      </form>
    );
  }
});

module.exports = MessageForm;
