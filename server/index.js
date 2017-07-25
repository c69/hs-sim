const express = require('express');
const hs_game = require('../main_rpc');
 
var app = express();
 
// mini-help on root
app.get('/', function(req, res) {
  res.send(`
Endpoints: <br/><ul>
<li><a href='/viewAvailableOptions'>GET /viewAvailableOptions</a></li>
<li><a href='/chooseOption'>POST /chooseOption</a></li>
</ul>
`);
});
 
app.get('/viewAvailableOptions', function(req, res) {
  res.json(
    JSON.parse(
      hs_game.exportState()
    )
  );
  //res.send('42');
});
  
app.get('/chooseOption', function(req, res) {
  let game = hs_game.chooseOption(req);
  //res.json(game); // this does not work, obviously
  res.send(200);
});

// Listen for incoming requests and serve them.
app.listen(process.env.PORT || 3003);