var React = require('react');
var NotificationBubble = require('./NotificationBubble');

var NavButtonCollection = React.createClass({
  componentDidMount: function() {
    var messageButton = React.findDOMNode(this.refs.messageButton);
    $(messageButton).popover({
      placement: 'top',
      trigger: 'manual'
    });
  },

  handleLocateButtonClick: function(e) {
    e.preventDefault();
    this.props.onLocateButtonClick();
  },

  handleUserListButtonClick: function(e) {
    e.preventDefault();
    this.props.onUserListButtonClick();
  },

  handleMessageButtonClick: function(e) {
    e.preventDefault();
    this.props.onMessageButtonClick();
  },

  showPopover: function(title, content) {
    var messageButton = React.findDOMNode(this.refs.messageButton);
    var popover = $(messageButton).data('bs.popover');
    popover.options.title = title;
    popover.options.content = content;
    $(messageButton).popover('show');

    $(messageButton).on('shown.bs.popover', function() {
      clearTimeout(this.popupTimer);

      this.popupTimer = setTimeout(function() {
        $(messageButton).popover('hide');
      }, 3000);
    })
  },

  incrementBubble: function() {
    this.refs.notificationBubble.increment();
  },

  resetBubble: function() {
    this.refs.notificationBubble.reset();
  },

  render: function() {
    return (
      <div className='horus-nav'>
        <NotificationBubble ref='notificationBubble' />
        <div ref='locateButton' onClick={this.handleLocateButtonClick} className='leaflet-bar leaflet-control horus-nav-button' aria-haspopup='true'>
          <a href='#'><span className='glyphicon glyphicon-screenshot'></span></a>
        </div>
        <div ref='userListButton' onClick={this.handleUserListButtonClick} className='leaflet-bar leaflet-control horus-nav-button' aria-haspopup='true'>
          <a href='#'><span className='glyphicon glyphicon-user'></span></a>
        </div>
        <div ref='messageButton' onClick={this.handleMessageButtonClick} className='leaflet-bar leaflet-control horus-nav-button' aria-haspopup='true'>
          <a href='#'><span className='glyphicon glyphicon-comment'></span></a>
        </div>
      </div>
    );
  }
});

module.exports = NavButtonCollection;
