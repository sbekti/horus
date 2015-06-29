var socket = io();
var map;
var userMarker;
var markers = {};
var infowindow = new google.maps.InfoWindow();
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
      marker == null;
      delete markers[uid];
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

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      title: data.uid,
      accuracy: data.accuracy,
      timestamp: data.timestamp
    });

    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(18);
      map.setCenter(marker.getPosition());
      infowindow.setContent('<strong>' + marker.title + '</strong><br>Accuracy: ' + marker.accuracy + 'm');
      infowindow.open(map, marker);
    });

    markers[data.uid] = marker;
  }
});

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 2,
    center: new google.maps.LatLng(0, 0)
  });

  userMarker = new google.maps.Marker({
    map: map,
    title: 'My position',
  });

  google.maps.event.addListener(userMarker, 'click', function() {
    map.setZoom(18);
    map.setCenter(userMarker.getPosition());
    infowindow.setContent('<strong>' + userMarker.title + '</strong><br>Accuracy: ' + userMarker.accuracy + 'm');
    infowindow.open(map, userMarker);
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
}

function errorCallback(err) {
  console.log(err);
}
