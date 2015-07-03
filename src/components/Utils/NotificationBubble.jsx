var React = require('react');

var NotificationBubble = React.createClass({
  getInitialState: function() {
    return {
      count: 0
    };
  },

  increment: function() {
    this.setState({count: this.state.count + 1});
  },

  reset: function() {
    this.setState({count: 0});
  },

  render: function() {
    return (
      this.state.count == 0 ? null : <div className='notification-bubble'>{this.state.count}</div>
    );
  }
});

module.exports = NotificationBubble;
