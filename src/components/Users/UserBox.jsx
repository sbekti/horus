var React = require('react');
var UserSearchForm = require('./UserSearchForm');
var UserList = require('./UserList');

var UserBox = React.createClass({
  componentDidMount: function() {
    var self = this;
    var modal = React.findDOMNode(this.refs.modal);
    $(modal).on('shown.bs.modal', function() {
      self.refs.userSearchForm.focusInput();
    });
  },

  handleUserSelect: function(username) {
    this.hideModal();
    this.props.onUserSelect(username);
  },

  handleFilterChange: function(filter) {
    this.refs.userList.setFilter(filter);
  },

  handleFilterSubmit: function(filter) {
    this.refs.userList.setFilter(filter);
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
      <div ref='modal' tabIndex={-1} role='dialog' className='user-box modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal'>×</button>
              <h4 className='modal-title'>Active Users</h4>
            </div>
            <div className='modal-body'>
              <UserSearchForm ref='userSearchForm' onFilterChange={this.handleFilterChange} onFilterSubmit={this.handleFilterSubmit} />
              <UserList ref='userList' users={this.props.users} onUserSelect={this.handleUserSelect} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UserBox;
