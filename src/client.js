require('bootstrap-webpack');
require('./styles/style.less');

var React = require('react');
var Notify = require('notifyjs');
var Howler = require('howler');
var sanitizeHtml = require('sanitize-html');
var Autolinker = require('autolinker');
var Polyname = require('./lib/polyname');

var autolinker = new Autolinker({
  twitter: false
});

var Application = React.createClass({
  getInitialState: function() {
    return {
      username: null,
      users: {},
      isChatModalOpen: false
    };
  },

  componentWillMount: function() {
    this.socket = io();
    this.socket.on('user:list', this.handleInitialUserList);
    this.socket.on('user:location', this.handleLocationUpdate);
    this.socket.on('user:disconnect', this.handleUserDisconnect);
    this.socket.on('chat:message', this.handleReceiveMessage);
    this.socket.on('chat:history', this.handleReceiveChatHistory);

    this.socket.emit('user:list');
    this.socket.emit('chat:history');

    this.sound = new Howl({
      urls: ['/img/sound_a.mp3']
    });

    if (Notify.needsPermission) {
      Notify.requestPermission();
    }

    this.randomName = Polyname.generate();
  },

  componentDidMount: function() {
    $('#signup-modal').modal({
      backdrop: 'static',
      keyboard: false
    });
  },

  handleSignUp: function(username) {
    this.setState({username: username});
    this.refs.map.locate();
    $('#signup-modal').modal('hide');
    this.refs.notifications.show('Signed in as ' + username + '. Locating...');
  },

  handleUserDisconnect: function(username) {
    var users = this.state.users;
    var user = users[username];

    this.refs.map.removeMarker(user);

    delete users[username];
    this.setState({users: users});

    this.refs.notifications.show(username + ' has left.');
  },

  handleSendMessage: function(text) {
    var data = {
      sender: this.state.username,
      text: text,
      timestamp: new Date().getTime()
    }

    this.socket.emit('chat:message', data);

    // Optimistic update
    this.refs.chat.push(data);
  },

  handleReceiveMessage: function(data) {
    if (data.sender != this.state.username) {
      this.refs.chat.push(data);
      this.sound.play();

      var notification = new Notify(data.sender, {
        body: data.text,
        icon: '/favicon/favicon-96x96.png',
        timeout: 5
      });

      notification.show();

      if (!this.state.isChatModalOpen) {
        this.refs.controls.incrementBubble();
        this.refs.controls.showPopover(data.sender, data.text);
      }
    }
  },

  handleReceiveChatHistory: function(history) {
    this.refs.chat.pushHistory(history);
  },

  handleInitialUserList: function(data) {
    var users = this.state.users;

    // Update local user list
    for (var username in data) {
      var user = data[username];

      var newUser = {
        data: user,
        timestamp: new Date().getTime()
      };

      users[user.username] = newUser;
      this.refs.map.addMarker(newUser, user);
    }

    this.setState({users: users});
  },

  handleLocationUpdate: function(data) {
    var users = this.state.users;
    var user = users[data.username];

    if (!user) {
      var newUser = {
        data: data,
        timestamp: new Date().getTime()
      };

      users[data.username] = newUser;
      this.refs.map.addMarker(newUser, data);

      if (data.username != this.state.username) {
        this.refs.notifications.show(data.username + ' has joined.');
      }
    } else {
      user.data = data;
      user.timestamp = new Date().getTime();
      this.refs.map.updateMarker(user, data);
    }

    this.setState({users: users});
  },

  handleLocationFound: function(e) {
    var data = {
      username: this.state.username,
      timestamp: e.timestamp,
      latitude: e.latitude,
      longitude: e.longitude,
      altitude: e.altitude,
      accuracy: e.accuracy,
      altitudeAccuracy: e.altitudeAccuracy
    }

    this.socket.emit('user:location', data);
  },

  handleLocationError: function(e) {
    this.refs.notifications.show(e.message);
  },

  handleChatButtonClick: function() {
    $('#chat-modal').modal();
  },

  handleUsersButtonClick: function() {
    $('#users-modal').modal();
  },

  handleLocationButtonClick: function() {
    var user = this.state.users[this.state.username];
    this.refs.map.zoomTo(user);
  },

  handleUserButtonClick: function(username) {
    var user = this.state.users[username];
    this.refs.map.zoomTo(user);
  },

  handleChatModalShown: function() {
    this.setState({isChatModalOpen: true});
    this.refs.controls.resetBubble();
  },

  handleChatModalHidden: function() {
    this.setState({isChatModalOpen: false});
  },

  render: function() {
    return (
      <div>
        <NotificationsBar timeout='5000' ref='notifications' />
        <CustomMapControls onChatButtonClick={this.handleChatButtonClick} onUsersButtonClick={this.handleUsersButtonClick} onLocationButtonClick={this.handleLocationButtonClick} ref='controls' />
        <Map users={this.state.users} username={this.state.username} onLocationFound={this.handleLocationFound} onLocationError={this.handleLocationError} pollInterval={this.props.pollInterval} ref='map' />
        <SignUpModal initialUsername={this.randomName} onSignUp={this.handleSignUp} />
        <UsersModal users={this.state.users} onClick={this.handleUserButtonClick} />
        <ChatModal onShown={this.handleChatModalShown} onHidden={this.handleChatModalHidden} onSendMessage={this.handleSendMessage} ref='chat' />
      </div>
    );
  }
});

var Map = React.createClass({
  getInitialState: function() {
    return {
      // Flag to indicate the first time got location lock
      isFirstLock: true
    };
  },

  componentDidMount: function() {
    // Dynamically resize map to fill the entire screen
    $(window).resize(function() {
      $('#map').height($(window).height());
    });

    // Trigger resize event only for the first time
    $(window).trigger('resize');

    // Create a map instance, set map center to London
    var map = this.map = L.map(this.getDOMNode()).setView([51.505, -0.09], 2);

    // Use OpenStreetMap as tile provider
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create custom controls
    var legend = L.control({
      position: 'bottomright'
    });

    // Create custom controls container
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'legend-controls');
      return div;
    };

    // Add custom controls to map
    legend.addTo(map);
    var legendControls = $('.legend-controls');
    $('#controls').detach().appendTo(legendControls);

    // Prevent map zooming while double-clicking custom controls
    legendControls.dblclick(L.DomEvent.stopPropagation);

    // Geolocation event handlers
    map.on('locationfound', this.onLocationFound);
    map.on('locationerror', this.onLocationError);
  },

  zoomTo: function(user) {
    var marker = user.marker;
    this.map.setView(marker.getLatLng(), 16);
    marker.openPopup();
  },

  addMarker: function(user, data) {
    var latlng = L.latLng(data.latitude, data.longitude);
    var radius = data.accuracy / 2;

    var marker = L.marker(latlng).addTo(this.map);
    var circle = L.circle(latlng, radius).addTo(this.map);

    var self = this;

    marker.on('click', function(e) {
      self.map.panTo(e.latlng);
    });

    marker.on('dblclick', function(e) {
      self.map.setView(e.latlng, 16);
    });

    marker.on('popupopen', function(e) {
      var popupContent = self.generatePopupContent(marker.username);
      e.popup.setContent(popupContent);
    });

    marker.bindPopup();
    marker.username = data.username;

    user.marker = marker;
    user.circle = circle;

    if ((this.state.isFirstLock) && (data.username == this.props.username)) {
      marker.openPopup();
      this.setState({isFirstLock: false});
      this.map.stopLocate();
      this.locate();
    }
  },

  updateMarker: function(user, data) {
    var latlng = L.latLng(data.latitude, data.longitude);
    var radius = data.accuracy / 2;

    var existingMarker = user.marker;
    existingMarker.setLatLng(latlng);

    var existingCircle = user.circle;
    existingCircle.setLatLng(latlng);
    existingCircle.setRadius(radius);
  },

  removeMarker: function(user) {
    if (!user) return;

    var marker = user.marker;
    var circle = user.circle;

    this.map.removeLayer(marker);
    this.map.removeLayer(circle);
  },

  generatePopupContent: function(username) {
    var user = this.props.users[username];
    var me = this.props.users[this.props.username];

    // Sometimes, other user's location got received ahead of ours.
    // We need our location data to calculate distance information on marker popups.
    // If we don't have the data yet, use the generic marker popup.
    // This is also the case if we deny sharing our location.
    if (!me) {
      var html = '<span class="marker-title">' + username + '</span><br>LatLng: [' + user.data.latitude.toFixed(4) + ', ' + user.data.longitude.toFixed(4) + ']<br>Accuracy: ' + user.data.accuracy + ' m<br>Last updated: ' + $.timeago(user.data.timestamp);
      return html;
    }

    var myLatLng = L.latLng(me.data.latitude, me.data.longitude);
    var userLatLng = L.latLng(user.data.latitude, user.data.longitude);
    var you = username == this.props.username ? ' (you)' : '';
    var distance = username == this.props.username ? '' : '<br>Distance from me: ' + userLatLng.distanceTo(myLatLng).toFixed(0) + ' m';

    var html = '<span class="marker-title">' + username + you + '</span>' + distance + '<br>LatLng: [' + user.data.latitude.toFixed(4) + ', ' + user.data.longitude.toFixed(4) + ']<br>Accuracy: ' + user.data.accuracy + ' m<br>Last updated: ' + $.timeago(user.data.timestamp);
    return html;
  },

  locate: function() {
    this.map.locate({
      watch: true,
      setView: this.state.isFirstLock,
      maxZoom: 16,
      enableHighAccuracy: true
    });
  },

  onLocationFound: function(e) {
    this.props.onLocationFound(e);
  },

  onLocationError: function(e) {
    this.props.onLocationError(e);
  },

  render: function() {
    return (
      <div id='map'></div>
    );
  }
});

var UserNode = React.createClass({
  handleClick: function() {
    this.props.onClick(this.props.name);
  },

  render: function() {
    return (
      <button type='button' className='btn btn-default user-node' onClick={this.handleClick}>{this.props.name}</button>
    )
  }
});

var UserList = React.createClass({
  getInitialState: function() {
    return {
      filter: ''
    };
  },

  componentDidMount: function() {
    // Select input text on focus
    $('#users-modal').on('shown.bs.modal', function() {
      $('#input-user-search').focus(function() {
        $(this).select();
      });
    });

    // Webkit text input hack
    $('input:text').mouseup(function(e) {
      return false;
    });
  },

  handleChange: function(e) {
    this.setState({filter: e.target.value})
  },

  handleClick: function(name) {
    this.props.onClick(name);
  },

  render: function() {
    var self = this;
    var users = this.props.users;

    var userNodes = Object.keys(users).map(function(user) {
      if (user.toLowerCase().indexOf(self.state.filter.toLowerCase()) > -1) {
        return (
          <UserNode name={user} key={user} onClick={self.handleClick} />
        );
      } else {
        return;
      }
    });

    return (
      <div className='userList'>
        <div className='input-group'>
          <span className='input-group-addon' id='basic-addon1'>@</span>
          <input id='input-user-search' type='text' className='form-control' placeholder='Search for...' aria-describedby='basic-addon1' onChange={this.handleChange} />
        </div>
        <div className='user-nodes'>
          {userNodes}
        </div>
      </div>
    );
  }
});

var ChatModal = React.createClass({
  getInitialState: function() {
    return {
      messages: []
    };
  },

  componentDidMount: function() {
    var self = this;

    $('#chat-modal').on('shown.bs.modal', function() {
      var elem = document.getElementById('message-list');
      elem.scrollTop = elem.scrollHeight;
      self.props.onShown();
    });

    $('#chat-modal').on('hidden.bs.modal', function() {
      self.props.onHidden();
    });
  },

  pushHistory: function(history) {
    var messages = this.state.messages;
    var appendedMessages = history.concat(messages);
    this.setState({messages: appendedMessages});
  },

  push: function(message) {
    var messages = this.state.messages;
    var appendedMessages = messages.concat([message]);
    this.setState({messages: appendedMessages});

    // HACK HACK
    setTimeout(function() {
      var elem = document.getElementById('message-list');
      elem.scrollTop = elem.scrollHeight;
    }, 1);
  },

  handleSubmit: function(message) {
    $('#chat-modal').on('shown.bs.modal', function() {
      var elem = document.getElementById('message-list');
      elem.scrollTop = elem.scrollHeight;
    });

    this.props.onSendMessage(message);
  },

  render: function() {
    return (
      <div id='chat-modal' tabIndex={-1} role='dialog' aria-labelledby='chat-modal-label' className='modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
              <h4 id='chat-modal-label' className='modal-title'>Chat Room</h4>
            </div>
            <div className='modal-body'>
              <MessageList messages={this.state.messages} />
              <MessageForm onSubmit={this.handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Message = React.createClass({
  render: function() {
    var rawMarkup = sanitizeHtml(this.props.children.toString(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    rawMarkup = autolinker.link(rawMarkup);

    return (
      <div className='message'>
        <span className='message-sender' title={this.props.timestamp}>{this.props.sender}</span>: <span dangerouslySetInnerHTML={{__html: rawMarkup}}></span>
      </div>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.messages.map(function(message) {
      return (
        <Message sender={message.sender} key={message.sender + message.timestamp} timestamp={message.timestamp}>
          {message.text}
        </Message>
      );
    });
    return (
      <div id='message-list' className='well message-container'>
        {messageNodes}
      </div>
    );
  }
});

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var message = React.findDOMNode(this.refs.message).value.trim();
    if (!message) { return; }

    this.props.onSubmit(message);
    React.findDOMNode(this.refs.message).value = '';
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='input-group'>
          <input id='input-message' type='text' placeholder='Say something...' maxLength={200} aria-describedby='basic-addon1' className='form-control' ref='message' />
          <span className='input-group-btn'>
            <input type='submit' className='btn btn-success' defaultValue='Send' />
          </span>
        </div>
      </form>
    );
  }
});

var UsersModal = React.createClass({
  handleClick: function(name) {
    $('#users-modal').modal('hide');
    this.props.onClick(name);
  },

  render: function() {
    return (
      <div id='users-modal' tabIndex={-1} role='dialog' aria-labelledby='users-modal-label' className='modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
              <h4 id='users-modal-label' className='modal-title'>Active Users</h4>
            </div>
            <div className='modal-body'>
              <UserList users={this.props.users} onClick={this.handleClick} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var SignUpModal = React.createClass({
  getInitialState: function() {
    return {username: this.props.initialUsername};
  },

  componentDidMount: function() {
    // Select input text on focus
    $('#signup-modal').on('shown.bs.modal', function() {
      $('#input-username').focus(function() {
        $(this).select();
      });
    });

    // Webkit text input hack
    $('input:text').mouseup(function(e) {
      return false;
    });
  },

  handleChange: function(e) {
    this.setState({username: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var username = this.state.username;
    var re = new RegExp('^[-a-zA-Z0-9]+$');
    if ((!username) || (!re.test(username))) {return;}

    this.props.onSignUp(username);
  },

  render: function() {
    return (
      <div id='signup-modal' tabIndex={-1} role='dialog' aria-labelledby='signup-modal-label' className='modal fade'>
        <div role='document' className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 id='signup-modal-label' className='modal-title'><img src='/img/wadjet.svg' width={33} />&nbsp;&nbsp;Bekti Geolocation Services</h4>
            </div>
            <div className='modal-body'>
              <p>You will need to enable geolocation feature in your browser to be able to share your location with other users.</p>
              <p>To help the others identify you on the map, please provide a unique name.</p>
              <form role='form' onSubmit={this.handleSubmit}>
                <div className='input-group'><span id='basic-addon1' className='input-group-addon'>@</span>
                  <input id='input-username' type='text' placeholder='Username' maxLength={20} aria-describedby='basic-addon1' className='form-control' value={this.state.username} ref='username' onChange={this.handleChange} />
                  <span className='input-group-btn'>
                    <input type='submit' className='btn btn-success' defaultValue='Start' />
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

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
      this.state.count == 0 ? null : <div className='noti-bubble'>{this.state.count}</div>
    );
  }
});

var NotificationsBar = React.createClass({
  getInitialState: function() {
    return {
      alertTimer: null
    };
  },

  show: function(message) {
    $('#alert').html(message);
    $('#alert').slideDown();

    clearTimeout(this.state.alertTimer);
    var alertTimer = setTimeout(this.dismiss, this.props.timeout);
  },

  dismiss: function() {
    $('#alert').slideUp();
  },

  render: function() {
    return (
      <div id='alert' role='alert' className='alert alert-warning'>
      </div>
    );
  }
});

React.render(
  <Application pollInterval='10000' />, document.getElementById('react-root')
);
