var React = require('react');

var User = React.createClass({
  handleSelect: function() {
    this.props.onSelect(this.props.username);
  },

  render: function() {
    return (
      <button type='button' className='user btn btn-default' onClick={this.handleSelect}>{this.props.username}</button>
    )
  }
});

module.exports = User;
