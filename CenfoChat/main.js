var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var mongoConnection = require('./mongo/mongodb-connect.js');

const credentials = require('./config/oauth-configuration.json')

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2').create(credentials);


// Authorization uri definition
// No scope defined means: 
// Grants read-only access to public information (includes public user profile info, public repository info, and gists)
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: '',
  state: '<ThisMustBeChangedToARandomString>',
});

// Create the connection with MongoDB.
mongoConnection.connectToMongo();


// root: presentar html
app.get('/', function(req, res){





  res.sendFile(__dirname + '/index.html');
});

app.get('/mongo/log/', function(req, res){
  mongoConnection.GetAllMessagesForUser(req, res, "Perrito");
});

// escuchar una conexion por socket
io.on('connection', function(socket){
  // si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function(msg){
    // volvemos a emitir el mismo mensaje
    mongoConnection.insertChatMessage(msg);
    io.emit('Evento-Mensaje-Server', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
