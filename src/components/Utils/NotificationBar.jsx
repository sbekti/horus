var React = require('react');

var NotificationBar = React.createClass({
  componentDidMount: function() {
    this.notificationBar = React.findDOMNode(this.refs.notificationBar);
    this.dismissalTimer = null;
  },

  show: function(message) {
    $(this.notificationBar).html(message);
    $(this.notificationBar).slideDown();

    clearTimeout(this.dismissalTimer);
    this.dismissalTimer = setTimeout(this.dismiss, this.props.timeout);
  },

  dismiss: function() {
    $(this.notificationBar).slideUp();
  },

  render: function() {
    return (
      <div ref='notificationBar' role='alert' className='notification-bar alert alert-warning'>
      </div>
    );
  }
});

module.exports = NotificationBar;
