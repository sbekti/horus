var React = require('react');

var SignUpForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var username = React.findDOMNode(this.refs.usernameInputField).value.trim();
    var re = new RegExp('^[-a-zA-Z0-9]+$');
    if ((!username) || (!re.test(username))) {
      this.showAlert('Username must contain only letters, numbers, and hyphens.');
      return;
    }

    this.props.onSubmit(username);
  },

  focusInput: function() {
    var usernameInputField = React.findDOMNode(this.refs.usernameInputField)

    // A bug in iOS 8 makes virtual keyboard appears and scrolls page after touch.
    // A simple solution would be to prevent autofocus at all.
    if (!/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      $(usernameInputField).focus();
      $(usernameInputField).select();
    };
  },

  showAlert: function(message) {
    var alertMessage = React.findDOMNode(this.refs.alertMessage);
    $(alertMessage).html(message);
    $(alertMessage).removeClass('hidden');
  },

  render: function() {
    return (
      <form className='signup-form' role='form' onSubmit={this.handleSubmit}>
        <div ref='alertMessage' className='alert alert-danger hidden' role='alert'></div>
        <div className='input-group'><span className='input-group-addon'>@</span>
          <input ref='usernameInputField' type='text' placeholder='Username' maxLength={20} className='form-control' defaultValue={this.props.initialUsername} />
          <span className='input-group-btn'>
            <input type='submit' className='btn btn-success' defaultValue='Start' />
          </span>
        </div>
      </form>
    );
  }
});

module.exports = SignUpForm;
