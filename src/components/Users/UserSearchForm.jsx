var React = require('react');

var UserSearchForm = React.createClass({
  handleChange: function(e) {
    var filter = e.target.value;
    this.props.onFilterChange(filter);
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var filter = React.findDOMNode(this.refs.filterInputField).value;
    this.props.onFilterSubmit(filter);
  },

  focusInput: function() {
    var filterInputField = React.findDOMNode(this.refs.filterInputField)

    // A bug in iOS 8 makes virtual keyboard appears and scrolls page after touch.
    // A simple solution would be to prevent autofocus at all.
    if (!/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      $(filterInputField).focus();
      $(filterInputField).select();
    };
  },

  render: function() {
    return (
      <form className='user-search-form' onSubmit={this.handleSubmit}>
        <div className='input-group'>
          <span className='input-group-addon'>@</span>
          <input ref='filterInputField' type='text' className='form-control' placeholder='Search for...' onChange={this.handleChange} />
        </div>
      </form>
    );
  }
});

module.exports = UserSearchForm;
