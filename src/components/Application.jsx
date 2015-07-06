var React = require('react');
var Notify = require('notifyjs');
var Howler = require('howler');
var Polyname = require('../lib/polyname');
var randomColor = require('../lib/colors.js');

var NotificationBar = require('./Utils/NotificationBar');
var Map = require('./Utils/Map');
var SignUpBox = require('./SignUp/SignUpBox');
var UserBox = require('./Users/UserBox');
var MessageBox = require('./Messages/MessageBox');

var Application = React.createClass({
  getInitialState: function() {
    return {
      username: null,
      users: {},
      isMessageBoxOpen: false
    };
  },

  componentWillMount: function() {
    this.socket = io();

    this.socket.on('user:validate', this.handleReceiveUserValidationResult);
    this.socket.on('user:list', this.handleReceiveInitialUserList);
    this.socket.on('user:location', this.handleReceiveLocationUpdate);
    this.socket.on('user:disconnect', this.handleUserDisconnect);
    this.socket.on('chat:message', this.handleReceiveMessage);
    this.socket.on('chat:history', this.handleReceiveMessageHistory);

    this.socket.emit('user:list');
    this.socket.emit('chat:history');

    this.sound = new Howl({
      urls: ['/img/sound_a.mp3']
    });

    if (Notify.needsPermission) {
      Notify.requestPermission();
    }

    this.randomName = Polyname.generate();
    this.color = randomColor({ luminosity: 'dark' });
  },

  componentDidMount: function() {
    this.refs.signUpBox.showModal();
  },

  handleUserSignUp: function(username) {
    this.socket.emit('user:validate', username);
  },

  handleReceiveUserValidationResult: function(data) {
    if (data.valid) {
      this.refs.signUpBox.hideModal();
      this.setState({ username: data.username });
      this.refs.notificationBar.show('Signed in as ' + data.username + '. Locating...');
      this.refs.map.locate();
    } else {
      this.refs.signUpBox.showAlert('Username is already in use. Please choose a different username.');
    }
  },

  handleUserDisconnect: function(username) {
    var users = this.state.users;
    var user = users[username];

    this.refs.map.removeMarker(user);
    delete users[username];
    this.setState({users: users});

    this.refs.notificationBar.show(username + ' has left.');
  },

  handleSubmitMessage: function(text) {
    var data = {
      sender: this.state.username,
      text: text,
      timestamp: new Date().getTime()
    }

    this.socket.emit('chat:message', data);

    // Optimistic update
    this.refs.messageBox.push(data);
  },

  handleReceiveMessage: function(data) {
    if (data.sender != this.state.username) {
      this.refs.messageBox.push(data);
      this.sound.play();

      var notification = new Notify(data.sender, {
        body: data.text,
        icon: '/favicon/favicon-96x96.png',
        timeout: 5
      });

      notification.show();

      if (!this.state.isMessageBoxOpen) {
        this.refs.map.incrementBubble();
        this.refs.map.showPopover(data.sender, data.text);
      }
    }
  },

  handleReceiveMessageHistory: function(history) {
    this.refs.messageBox.pushHistory(history);
  },

  handleReceiveInitialUserList: function(data) {
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

    this.setState({ users: users });
  },

  handleReceiveLocationUpdate: function(data) {
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
        this.refs.notificationBar.show(data.username + ' has joined.');
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
      altitudeAccuracy: e.altitudeAccuracy,
      color: this.color
    }

    this.socket.emit('user:location', data);
  },

  handleLocationError: function(e) {
    this.refs.notificationBar.show(e.message);
  },

  handleUserSelect: function(username) {
    var user = this.state.users[username];
    this.refs.map.zoomTo(user);
  },

  handleMessageButtonClick: function() {
    this.refs.messageBox.showModal();
  },

  handleUserListButtonClick: function() {
    this.refs.userBox.showModal();
  },

  handleMessageBoxShown: function() {
    this.setState({ isMessageBoxOpen: true });
    this.refs.map.resetBubble();
  },

  handleMessageBoxHidden: function() {
    this.setState({ isMessageBoxOpen: false });
  },

  render: function() {
    return (
      <div>
        <NotificationBar ref='notificationBar' timeout='5000' />
        <Map ref='map' users={this.state.users} username={this.state.username} onLocationFound={this.handleLocationFound} onLocationError={this.handleLocationError} onMessageButtonClick={this.handleMessageButtonClick} onUserListButtonClick={this.handleUserListButtonClick} />
        <SignUpBox ref='signUpBox' initialUsername={this.randomName} onUserSignUp={this.handleUserSignUp} />
        <UserBox ref='userBox' users={this.state.users} onUserSelect={this.handleUserSelect} />
        <MessageBox ref='messageBox' onShown={this.handleMessageBoxShown} onHidden={this.handleMessageBoxHidden} onSubmitMessage={this.handleSubmitMessage} />
      </div>
    );
  }
});

module.exports = Application;
