var React = require('react');
var User = require('./User');

var UserList = React.createClass({
  getInitialState: function() {
    return { filter: '' };
  },

  handleUserSelect: function(username) {
    this.props.onUserSelect(username);
  },

  setFilter: function(filter) {
    this.setState({ filter: filter });
  },

  render: function() {
    var self = this;
    var users = this.props.users;

    var userNodes = Object.keys(users).map(function(username) {
      if (username.toLowerCase().indexOf(self.state.filter.toLowerCase()) > -1) {
        return (
          <User username={username} key={username} onSelect={self.handleUserSelect} />
        );
      } else {
        return;
      }
    });

    return (
      <div className='user-list'>
        {userNodes}
      </div>
    );
  }
});

module.exports = UserList;
