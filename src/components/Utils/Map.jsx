var React = require('react');
var NavButtonCollection = require('./NavButtonCollection');

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
      'Mapbox OSM Bright 2': L.mapbox.tileLayer('mapbox.osm-bright').addTo(map),
      'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets'),
      'Mapbox Streets Satellite': L.mapbox.tileLayer('mapbox.streets-satellite'),
      'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
      'Mapbox Light': L.mapbox.tileLayer('mapbox.light'),
      'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
      'Mapbox Pirates': L.mapbox.tileLayer('mapbox.pirates'),
      'Mapbox Comic': L.mapbox.tileLayer('mapbox.comic'),
      'Mapbox Wheatpaste': L.mapbox.tileLayer('mapbox.wheatpaste'),
      'OpenStreetMap': L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'),
      'Stamen Toner': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'),
      'Stamen Watercolor': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png')
    }).addTo(map);

    var navButtonCollection = React.findDOMNode(this.refs.navButtonCollection);

    var legend = L.control({
      position: 'bottomright'
    });

    legend.onAdd = function(map) {
      return navButtonCollection;
    };

    legend.addTo(map);

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
    var self = this;
    var latlng = L.latLng(data.latitude, data.longitude);
    var radius = data.accuracy / 2;

    var marker = L.marker(latlng, {
      icon: L.mapbox.marker.icon({
        'marker-size': 'medium',
        'marker-symbol': 'circle',
        'marker-color': data.color
      })
    }).addTo(this.map);

    var circle = L.circle(latlng, radius, {
      stroke: false
    });

    marker.on('click', function(e) {
      self.map.panTo(e.latlng);
    });

    marker.on('popupopen', function(e) {
      self.map.addLayer(circle);
    });

    marker.on('popupclose', function(e) {
      self.map.removeLayer(circle);
    });

    marker.on('dblclick', function(e) {
      self.map.setView(e.latlng, 16);
    });

    var popupContent = self.generatePopupContent(data.username);
    marker.bindPopup(popupContent);

    user.marker = marker;
    user.circle = circle;

    if (this.state.isFirstPositionLock && (data.username == this.props.username)) {
      this.zoomTo(user);
      marker.openPopup();

      this.setState({ isFirstPositionLock: false });
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

    var popupContent = this.generatePopupContent(data.username);
    existingMarker.setPopupContent(popupContent);
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
      var html = '<span class="marker-title">' + username + '</span><br>LatLng: [' + user.data.latitude.toFixed(5) + ', ' + user.data.longitude.toFixed(5) + ']<br>Accuracy: ' + user.data.accuracy.toFixed(0) + ' m<br>Last updated: ' + $.timeago(user.data.timestamp);
      return html;
    }

    var myLatLng = L.latLng(me.data.latitude, me.data.longitude);
    var userLatLng = L.latLng(user.data.latitude, user.data.longitude);
    var you = username == this.props.username ? ' (you)' : '';
    var distance = username == this.props.username ? '' : '<br>Distance from me: ' + userLatLng.distanceTo(myLatLng).toFixed(0) + ' m';

    var html = '<span class="marker-title">' + username + you + '</span>' + distance + '<br>LatLng: [' + user.data.latitude.toFixed(5) + ', ' + user.data.longitude.toFixed(5) + ']<br>Accuracy: ' + user.data.accuracy.toFixed(0) + ' m<br>Last updated: ' + $.timeago(user.data.timestamp);
    return html;
  },

  locate: function() {
    this.map.locate({
      watch: true,
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
    var user = this.props.users[this.props.username];
    this.zoomTo(user);
  },

  handleUserListButtonClick: function(e) {
    this.props.onUserListButtonClick();
  },

  handleMessageButtonClick: function(e) {
    this.props.onMessageButtonClick();
  },

  incrementBubble: function() {
    this.refs.navButtonCollection.incrementBubble();
  },

  resetBubble: function() {
    this.refs.navButtonCollection.resetBubble();
  },

  showPopover: function(title, content) {
    this.refs.navButtonCollection.showPopover(title, content);
  },

  render: function() {
    return (
      <div ref='map' className='map'>
        <NavButtonCollection ref='navButtonCollection' onLocateButtonClick={this.handleLocateButtonClick} onUserListButtonClick={this.handleUserListButtonClick} onMessageButtonClick={this.handleMessageButtonClick} />
      </div>
    );
  }
});

module.exports = Map;
