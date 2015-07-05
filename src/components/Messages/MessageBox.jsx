var React = require('react');
var MessageList = require('./MessageList');
var MessageForm = require('./MessageForm');

var MessageBox = React.createClass({
  getInitialState: function() {
    return { messages: [] };
  },

  componentDidMount: function() {
    var self = this;
    var modal = React.findDOMNode(this.refs.modal);

    $(modal).on('shown.bs.modal', function() {
      self.refs.messageList.scrollToBottom();
      self.refs.messageForm.focusInput();
      self.props.onShown();
    });

    $(modal).on('hidden.bs.modal', function() {
      self.props.onHidden();
    });
  },

  pushHistory: function(history) {
    var messages = this.state.messages;
    var appendedMessages = history.concat(messages);
    this.setState({messages: appendedMessages});
  },

  push: function(message) {
    var messages = this.state.messages;
    var appendedMessages = messages.concat([message]);
    this.setState({messages: appendedMessages});

    this.refs.messageList.scrollToBottom();
  },

  handleSubmitMessage: function(message) {
    this.refs.messageList.scrollToBottom();
    this.props.onSubmitMessage(message);
  },

  showModal: function() {
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).modal();
  },

  hideModal: function() {
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).modal('hide');
  },

  render: function() {
    return (
      <div ref='modal' tabIndex={-1} role='dialog' className='message-box modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal'>×</button>
              <h4 className='modal-title'>Chat Room</h4>
            </div>
            <div className='modal-body'>
              <MessageList ref='messageList' messages={this.state.messages} />
              <MessageForm ref='messageForm' onSubmit={this.handleSubmitMessage} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MessageBox;
