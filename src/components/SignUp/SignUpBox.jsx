var React = require('react');
var SignUpForm = require('./SignUpForm');

var SignUpBox = React.createClass({
  componentDidMount: function() {
    var self = this;
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).on('shown.bs.modal', function() {
      self.refs.signUpForm.focusInput();
    });
  },

  handleSignUpFormSubmit: function(username) {
    this.props.onUserSignUp(username);
  },

  showModal: function() {
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).modal({
      backdrop: 'static',
      keyboard: false
    });
  },

  hideModal: function() {
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).modal('hide');
  },

  showAlert: function(message) {
    this.refs.signUpForm.showAlert(message);
  },

  render: function() {
    return (
      <div ref='modal' tabIndex={-1} role='dialog' className='sign-up-box modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title'><img src='/img/wadjet.svg' width={33} />&nbsp;&nbsp;Bekti Geolocation Services</h4>
            </div>
            <div className='modal-body'>
              <p>You will need to enable geolocation feature in your browser to be able to share your location with other users.</p>
              <p>To help the others identify you on the map, please provide a unique name.</p>
              <SignUpForm ref='signUpForm' initialUsername={this.props.initialUsername} onSubmit={this.handleSignUpFormSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SignUpBox;
