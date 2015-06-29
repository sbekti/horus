var adjectives = new Array(
  'accurate', 'abundant', 'addicted', 'adorable', 'adventurous', 'afraid', 'aggressive', 'agreeable', 'alcoholic', 'alert',
  'aloof', 'ambitious', 'amused', 'ancient', 'angry', 'animated', 'annoyed', 'annoying', 'anxious', 'arrogant', 'ashamed',
  'attractive', 'auspicious', 'average', 'awesome', 'awful', 'bad', 'bashful', 'beautiful', 'belligerent', 'beneficial', 'best',
  'better', 'big', 'bitter', 'bizarre', 'black', 'blue', 'boiling', 'boring', 'brainy', 'brave', 'breezy', 'brief', 'bright',
  'broad', 'broken', 'bumpy', 'busy', 'calm', 'capable', 'careful', 'careless', 'caring', 'cautious', 'charming', 'cheap',
  'cheerful', 'chilly', 'chubby', 'clean', 'clever', 'clumsy', 'cold', 'colorful', 'colossal', 'combative', 'comfortable',
  'concerned', 'confused', 'cooing', 'cool', 'cooperative', 'courageous', 'crazy', 'creepy', 'crowded', 'cruel', 'cuddly',
  'curious', 'curly', 'curved', 'cute', 'damaged', 'damp', 'dangerous', 'dark', 'deafening', 'deep', 'defeated', 'defective',
  'defiant', 'delicate', 'delicious', 'delightful', 'depressed', 'determined', 'different', 'dirty', 'disgusted', 'disgusting',
  'disturbed', 'dizzy', 'dry', 'dull', 'dusty', 'eager', 'early', 'educated', 'efficient', 'elated', 'elderly', 'elegant',
  'embarrassed', 'empty', 'encouraging', 'energetic', 'enthusiastic', 'envious', 'evil', 'excellent', 'excited', 'exciting',
  'expensive', 'exuberant', 'fabulous', 'faint', 'fair', 'faithful', 'famous', 'fancy', 'fantastic', 'fast', 'fat', 'fearful',
  'fearless', 'fertile', 'few', 'fierce', 'filthy', 'fine', 'flaky', 'flat', 'fluffy', 'foolish', 'forgetful', 'frail', 'frantic',
  'fresh', 'friendly', 'frightened', 'funny', 'fuzzy', 'gentle', 'giant', 'gigantic', 'glamorous', 'glorious', 'good', 'gorgeous',
  'graceful', 'grateful', 'greasy', 'great', 'greedy', 'green', 'grieving', 'grubby', 'grumpy', 'handsome', 'happy', 'hard', 'harsh',
  'healthy', 'heavy', 'helpful', 'helpless', 'high', 'hilarious', 'hissing', 'historical', 'hollow', 'homeless', 'horrible', 'hot',
  'huge', 'humorous', 'hungry', 'hurt', 'hushed', 'husky', 'icy', 'ignorant', 'ill', 'illegal', 'imaginary', 'immense', 'impolite',
  'important', 'impossible', 'innocent', 'intelligent', 'interesting', 'itchy', 'jealous', 'jittery', 'jolly', 'juicy', 'juvenile',
  'kind', 'large', 'late', 'lazy', 'legal', 'light', 'literate', 'little', 'lively', 'lonely', 'long', 'loose', 'loud', 'lovely',
  'low', 'lucky', 'macho', 'magical', 'magnificent', 'many', 'massive', 'mature', 'mean', 'melodic', 'melted', 'messy', 'mighty',
  'miniature', 'moaning', 'modern', 'mute', 'mysterious', 'narrow', 'nasty', 'naughty', 'nervous', 'new', 'nice', 'noisy', 'nosy',
  'numerous', 'nutritious', 'nutty', 'obedient', 'obese', 'obnoxious', 'odd', 'old', 'orange', 'ordinary', 'outrageous',
  'overconfident', 'panicky', 'peaceful', 'perfect', 'petite', 'pink', 'plastic', 'pleasant', 'polite', 'poor', 'powerful',
  'precious', 'pretty', 'prickly', 'proud', 'puny', 'purple', 'purring', 'quaint', 'quick', 'quickest', 'quiet', 'rainy',
  'rapid', 'rare', 'raspy', 'ratty', 'red', 'relieved', 'remarkable', 'repulsive', 'resonant', 'responsible', 'rich', 'ripe',
  'roasted', 'robust', 'romantic', 'rotten', 'rough', 'round', 'royal', 'rude', 'sad', 'salty', 'scary', 'scattered', 'scintillating',
  'scrawny', 'screeching', 'secretive', 'selfish', 'serious', 'shaggy', 'shaky', 'shallow', 'sharp', 'shiny', 'shivering', 'shocking',
  'short', 'shrill', 'shy', 'silent', 'silky', 'silly', 'sincere', 'skinny', 'slim', 'slimy', 'slippery', 'slow', 'small', 'smiling',
  'smooth', 'soft', 'solid', 'sore', 'sour', 'spicy', 'spiritual', 'splendid', 'spotty', 'square', 'squealing', 'stale', 'steady',
  'steep', 'sticky', 'stingy', 'straight', 'strange', 'striped', 'strong', 'successful', 'sweet', 'swift', 'talented', 'tall', 'tame',
  'tan', 'tart', 'tasteless', 'tasty', 'tender', 'tense', 'terrible', 'terrific', 'testy', 'thick', 'thin', 'thirsty', 'thoughtful',
  'thoughtless', 'thundering', 'tight', 'tiny', 'tired', 'tough', 'tricky', 'troubled', 'ugliest', 'ugly', 'uneven', 'unique',
  'untidy', 'upset', 'uptight', 'vast', 'victorious', 'violent', 'vivacious', 'voiceless', 'vulgar', 'warm', 'wasteful', 'watery',
  'weak', 'wealthy', 'weary', 'wet', 'whispering', 'wicked', 'wide', 'wide-eyed', 'wise', 'witty', 'wonderful', 'wooden', 'worried',
  'yellow', 'young', 'youthful', 'yummy', 'zany', 'zealous'
);

var animals = new Array(
  'aardvark', 'alligator', 'anteater', 'antelope', 'ape', 'armadillo', 'ass', 'baboon', 'badger', 'bat', 'bear', 'beaver',
  'bighorn', 'bison', 'boar', 'buffalo', 'bull', 'bunny', 'camel', 'canary', 'cat', 'chameleon', 'cheetah', 'chimpanzee',
  'chinchilla', 'chipmunk', 'colt', 'cougar', 'cow', 'coyote', 'crocodile', 'crow', 'deer', 'dingo', 'doe', 'dog', 'donkey',
  'dormouse', 'duckbill', 'elephant', 'elk', 'fawn', 'ferret', 'fish', 'fox', 'frog', 'gazelle', 'giraffe', 'goat', 'gopher',
  'gorilla', 'grizzly bear', 'ground hog', 'guinea pig', 'hamster', 'hare', 'hedgehog', 'hippopotamus', 'hog', 'horse', 'hyena',
  'iguana', 'jackal', 'jaguar', 'kangaroo', 'kitten', 'koala', 'lamb', 'lemur', 'leopard', 'lion', 'lizard', 'llama', 'lovebird',
  'mink', 'mole', 'mongoose', 'monkey', 'moose', 'mouse', 'mule', 'muskrat', 'newt', 'ocelot', 'opossum', 'orangutan', 'otter', 'ox',
  'panda', 'panther', 'parrot', 'pig', 'platypus', 'polar bear', 'pony', 'porcupine', 'prairie dog', 'puma', 'puppy', 'rabbit',
  'raccoon', 'ram', 'rat', 'reindeer', 'rhinoceros', 'roebuck', 'salamander', 'seal', 'sheep', 'shrew', 'silver fox', 'skunk',
  'sloth', 'snake', 'squirrel', 'stallion', 'tiger', 'toad', 'turtle', 'walrus', 'warthog', 'waterbuck', 'weasel', 'whale',
  'wildcat', 'wolf', 'wombat', 'yak', 'yetti', 'zebra'
);

function getRandomName() {
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  var animal = animals[Math.floor(Math.random() * animals.length)];

  return (adjective + ' ' + animal).split(' ').join('-');
}

function showAlert(message) {
  $('#alert').html(message);
  $('#alert').slideDown();
}

function dismissAlert() {
  $('#alert').slideUp();
}

var socket = io();
var username;
var users = {};
var isFirstLock = true;

function initialize() {
  map = L.map('map').setView([51.505, -0.09], 2);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend-controls');
    return div;
  };

  legend.addTo(map);
  var legendControls = $('.legend-controls');
  var dropup = $('#dropup-tracking').detach().appendTo(legendControls);
  legendControls.first().dblclick(L.DomEvent.stopPropagation);
  legendControls.first().mousedown(L.DomEvent.stopPropagation);

  // Webkit text input hack
  $('input:text').mouseup(function(e) {
    return false;
  });

  // Pre-populate username
  $('#input-username').val(getRandomName());

  $('#form-signup').submit(function(e) {
    signup();
    e.preventDefault();
  });

  $('#btn-start').click(function() {
    signup();
  });

  // Select input text on focus
  $('#signup').on('shown.bs.modal', function() {
    $('#input-username').focus(function() {
      $(this).select();
    });
  })

  $('#signup').modal({
    backdrop: 'static',
    keyboard: false
  });
}

function signup() {
  var input = $('#input-username').val();

  if (!input || !input.length) {

  } else {
    username = input;
    updateLocation();
    $('#signup').modal('hide');
  }
}

function updateLocation() {
  showAlert('Getting location...');

  map.locate({
    setView: isFirstLock,
    maxZoom: 16
  });
}

function onLocationFound(e) {
  dismissAlert();

  var data = {
    username: username,
    timestamp: e.timestamp,
    latitude: e.latitude,
    longitude: e.longitude,
    altitude: e.altitude,
    accuracy: e.accuracy,
    altitudeAccuracy: e.altitudeAccuracy
  }

  socket.emit('update', data);
  isFirstLock = false;

  setTimeout(function() {
    updateLocation();
  }, 10000);
}

function onLocationError(e) {
  showAlert(e.message);
}

socket.on('update', function(data) {
  if (!users[data.username]) {
    users[data.username] = {};
    $('#dropup-tracking ul').append('<li><a href="#!/' + data.username + '">' + data.username + '</a></li>');
  } else {
    var existingMarker = users[data.username].marker;
    map.removeLayer(existingMarker);
  }

  var marker = L.marker([data.latitude, data.longitude]).addTo(map);
  marker.bindPopup(data.username);

  users[data.username].data = data;
  users[data.username].marker = marker;
});

function processLocationHash() {

}

(function() {
  window.onhashchange = processLocationHash;
  initialize();
})();
