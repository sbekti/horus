var React = require('react');
var NotificationBubble = require('./NotificationBubble');

var Map = React.createClass({
  getInitialState: function() {
    return { isFirstPositionLock: true };
  },

  componentDidMount: function() {
    var mapDiv = React.findDOMNode(this.refs.map);

    // Dynamically resize map to fill the entire screen
    $(window).resize(function() {
      $(mapDiv).height($(window).height());
    });

    // Trigger resize event only for the first time
    $(window).trigger('resize');

    // Create a map instance
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2Jla3RpIiwiYSI6IjQ3NWU2ZDk4NTUyOGYwMjIyNjk5YzJhOTIwOWM1ZjE0In0.NWyuhzBr1fzqnrzSYbD0OQ';

    var map = this.map = L.mapbox.map(mapDiv, null, {
      center: [51.505, -0.09],
	    zoom: 2,
      attributionControl: false
    });

    L.control.layers({
      'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
      'Mapbox OSM Bright 2': L.mapbox.tileLayer('mapbox.osm-bright'),
      'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark')
    }).addTo(map);

    var nav = React.findDOMNode(this.refs.nav);

    var legend = L.control({
      position: 'bottomright'
    });

    legend.onAdd = function(map) {
      return nav;
    };

    legend.addTo(map);

    // Geolocation event handlers
    map.on('locationfound', this.onLocationFound);
    map.on('locationerror', this.onLocationError);

    var messageButton = React.findDOMNode(this.refs.messageButton);
    $(messageButton).popover({
      placement: 'top',
      trigger: 'manual'
    });
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

    if (this.state.isFirstPositionLock && (data.username == this.props.username)) {
      marker.openPopup();

      this.setState({ isFirstPositionLock: false });
      this.stopLocate();
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
      setView: this.state.isFirstPositionLock,
      maxZoom: 16,
      enableHighAccuracy: true
    });
  },

  stopLocate: function() {
    this.map.stopLocate();
  },

  onLocationFound: function(e) {
    this.props.onLocationFound(e);
  },

  onLocationError: function(e) {
    this.props.onLocationError(e);
  },

  handleLocateButtonClick: function(e) {
    e.preventDefault();
    var user = this.props.users[this.props.username];
    this.zoomTo(user);
  },

  handleUserListButtonClick: function(e) {
    e.preventDefault();
    this.props.onUserListButtonClick();
  },

  handleMessageButtonClick: function(e) {
    e.preventDefault();
    this.props.onMessageButtonClick();
  },

  incrementBubble: function() {
    this.refs.notificationBubble.increment();
  },

  resetBubble: function() {
    this.refs.notificationBubble.reset();
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

  render: function() {
    return (
      <div ref='map' className='map'>
        <div ref='nav' className='horus-nav'>
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
      </div>
    );
  }
});

module.exports = Map;
