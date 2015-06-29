var socket = io();
var map;
var userMarker;
var userCircle;
var markers = {};
var circles = {};
var infoWindow = new google.maps.InfoWindow();
var uid = Math.random().toString(16).substring(2, 15);

setInterval(function() {
  updateCoordinates();
}, 5000);

setInterval(function() {
  var now = new Date().getTime();

  for (var uid in markers) {
    if (now - markers[uid].timestamp > 30000) {
      var marker = markers[uid];
      marker.setMap(null);
      marker = null;
      delete markers[uid];

      var circle = circles[uid];
      circle.setMap(null);
      circle = null;
      delete circles[uid];
    }
  }
}, 15000);

socket.on('coords', function(data) {
  if (data.uid != uid) {
    if (markers[data.uid] != undefined) {
      var marker = markers[data.uid];
      marker.setMap(null);
      marker = null;
      delete markers[data.uid];
    }

    if (circles[data.uid] != undefined) {
      var circle = circles[data.uid];
      circle.setMap(null);
      circle = null;
      delete circles[data.uid];
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      title: data.uid,
      accuracy: data.accuracy,
      timestamp: data.timestamp
    });

    var circle = new google.maps.Circle({
      center: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      radius: data.accuracy
    });

    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(18);
      map.setCenter(marker.getPosition());
      updateInfoWindow(marker);
      infoWindow.open(map, marker);
    });

    markers[data.uid] = marker;
    circles[data.uid] = circle;
  }
});

function updateInfoWindow(marker) {
  infoWindow.setContent('<strong>' + marker.title + '</strong><br>Accuracy: ' + marker.accuracy + 'm');
}

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 2,
    center: new google.maps.LatLng(0, 0)
  });

  userMarker = new google.maps.Marker({
    map: map,
    title: 'My position',
  });

  userCircle = new google.maps.Circle({
    map: map
  });

  google.maps.event.addListener(userMarker, 'click', function() {
    map.setZoom(18);
    map.setCenter(userMarker.getPosition());
    updateInfoWindow(userMarker);
    infoWindow.open(map, userMarker);
  });

  updateCoordinates();
}

google.maps.event.addDomListener(window, 'load', initialize);

function updateCoordinates() {
  if (navigator.geolocation) {
    var options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  } else {
    alert("Yikes!! Please upgrade your dinasaur browser.");
  }
}

function successCallback(pos) {
  var now = new Date().getTime();

  var data = {
    uid: uid,
    timestamp: now,
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy
  };

  socket.emit('coords', data);

  var latlng = new google.maps.LatLng(data.lat, data.lng);
  userMarker.setPosition(latlng);
  userMarker.accuracy = data.accuracy;
  userCircle.setCenter(latlng);
  userCircle.setRadius(data.accuracy);
}

function errorCallback(err) {
  console.log(err);
}
