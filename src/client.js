require('bootstrap-webpack');
require('./styles/style.less');

var React = require('react');
var Application = require('./components/Application.jsx');

React.render(
  <Application pollInterval='10000' />, document.getElementById('react-root')
);

// Hiring smart people
if (typeof console !== 'undefined' && typeof console.log === 'function' && !window.test) {
    console.log('\r\n%c                     *      .--.\r\n%c                           \/ \/  `\r\n%c          +               | |\r\n%c                 \'         \\ \\__,\r\n%c             *          +   \'--\'  *\r\n%c                 +   \/\\\r\n%c    +              .\'  \'.   *\r\n%c           *      \/======\\      +\r\n%c                 ;:.  _   ;\r\n%c                 |:. (_)  |\r\n%c                 |:.  _   |\r\n%c       +         |:. (_)  |          *\r\n%c                 ;:.      ;\r\n%c               .\' \\:.    \/ `.\r\n%c              \/ .-\'\':._.\'`-. \\\r\n%c              |\/    \/||\\    \\|\r\n%c            _..--\"\"\"````\"\"\"--.._\r\n%c      _.-\'``                    ``\'-._\r\n%c    -\'         %cAnjinglah maneh%c        \'-\r\n%c',
    'color:#D0E3F1','color:#D0E3F1','color:#C0DAEC','color:#C0DAEC','color:#B0D1E8','color:#B0D1E8','color:#A1C7E3','color:#A1C7E3','color:#91BEDE','color:#91BEDE','color:#81B5D9','color:#81B5D9','color:#72ABD5','color:#72ABD5','color:#62A2D0','color:#62A2D0','color:#5299CB','color:#5299CB','color:#4390C7','color:#4390C7', 'color:#4390C7', 'color: #000000');
}
