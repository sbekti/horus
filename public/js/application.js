var socket = io();
var map;
var userMarker;
var userCircle;
var markers = {};
var circles = {};
var infoWindow = new google.maps.InfoWindow();
var uid = Math.random().toString(16).substring(2, 15);
var firstLock = true;
var centerControlDiv;

function CenterControl(marker, controlDiv, map) {
  var existingElement = document.getElementById(marker.uid);

  if (existingElement) {
    return;
  }

  controlDiv.style.clear = 'both';

  var controlUI = document.createElement('div');
  controlUI.id = marker.uid;
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.float = 'left';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Go to this location';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = marker.title;
  controlUI.appendChild(controlText);

  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(marker.getPosition());
    map.setZoom(18);
  });
}

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

      var controlElement = document.getElementById(uid);
      google.maps.event.clearListeners(controlElement, 'click');
      controlElement.parentNode.removeChild(controlElement);
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
      uid: data.uid,
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
      map.setCenter(marker.getPosition());
      updateInfoWindow(marker);
      infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'dblclick', function() {
      map.setZoom(18);
      map.setCenter(marker.getPosition());
      updateInfoWindow(marker);
      infoWindow.open(map, marker);
    });

    markers[data.uid] = marker;
    circles[data.uid] = circle;

    console.log('dapet')
    var centerControl = new CenterControl(marker, centerControlDiv, map);
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
    uid: uid,
    map: map,
    title: 'My position'
  });

  userCircle = new google.maps.Circle({
    map: map
  });

  google.maps.event.addListener(userMarker, 'click', function() {
    map.setCenter(userMarker.getPosition());
    updateInfoWindow(userMarker);
    infoWindow.open(map, userMarker);
  });

  google.maps.event.addListener(userMarker, 'dblclick', function() {
    map.setZoom(18);
    map.setCenter(userMarker.getPosition());
    updateInfoWindow(userMarker);
    infoWindow.open(map, userMarker);
  });

  centerControlDiv = document.createElement('div');
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

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

  var centerControl = new CenterControl(userMarker, centerControlDiv, map);

  if (firstLock) {
    map.setCenter(userMarker.getPosition());
    updateInfoWindow(userMarker);
    infoWindow.open(map, userMarker);
    firstLock = false;
  }
}

function errorCallback(err) {
  console.log(err);
}
