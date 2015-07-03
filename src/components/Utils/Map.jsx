var React = require('react');
var EasyButton = require('../../lib/easy-button');

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

    // Create a map instance, set map center to London
    var map = this.map = L.map(this.getDOMNode()).setView([51.505, -0.09], 2);

    // Bright OSM map theme
    L.tileLayer('https://{s}.tiles.mapbox.com/v4/sbekti.d89539e1/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
      + (L.Browser.retina ? '&scale=2': ''), {
      detectRetina: true,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.easyButton('glyphicon-screenshot', function(btn, map){
      alert('hahaha');
    }).addTo(map);

    L.easyButton('glyphicon-user', function(btn, map){
      alert('hahaha');
    }).addTo(map);

    L.easyButton('glyphicon-comment', function(btn, map){
      alert('hahaha');
    }).addTo(map);

    /*

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

    */

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

  render: function() {
    return (
      <div ref='map' className='map'></div>
    );
  }
});

module.exports = Map;
