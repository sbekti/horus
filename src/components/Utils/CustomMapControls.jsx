var CustomMapControls = React.createClass({
  componentWillMount: function() {
    this.timer = null;
  },

  componentDidMount: function() {
    $('#btn-chat').popover({
      placement: 'top',
      trigger: 'manual'
    });
  },

  incrementBubble: function() {
    this.refs.bubble.increment();
  },

  resetBubble: function() {
    this.refs.bubble.reset();
  },

  showPopover: function(title, content) {
    var popover = $('#btn-chat').data('bs.popover');
    popover.options.title = title;
    popover.options.content = content;
    $('#btn-chat').popover('show');

    $('#btn-chat').on('shown.bs.popover', function() {
      clearTimeout(this.timer);

      this.timer = setTimeout(function() {
        $('#btn-chat').popover('hide');
      }, 3000);
    })
  },

  render: function() {
    return (
      <div id='controls'>
        <NotificationBubble ref='bubble' />
        <button id='btn-chat' type='button' aria-label='Chat' className='btn btn-default btn-custom-controls' onClick={this.props.onChatButtonClick}><span aria-hidden='true' className='glyphicon glyphicon-comment' data-toggle='popover' data-trigger='focus' /></button>
        <button type='button' aria-label='Active Users' className='btn btn-default btn-custom-controls' onClick={this.props.onUsersButtonClick}><span aria-hidden='true' className='glyphicon glyphicon-user' /></button>
        <button type='button' aria-label='My Location' className='btn btn-default btn-custom-controls' onClick={this.props.onLocationButtonClick}><span aria-hidden='true' className='glyphicon glyphicon-screenshot' /></button>
      </div>
    );
  }
});
