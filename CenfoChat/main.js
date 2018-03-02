var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var mongoConnection = require('./mongo/mongodb-connect.js');
var setCookie = require('set-cookie');
var cookieParser = require('cookie-parser');

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

// Enable files to be retrieved from public folder.
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(function (req, res, next) {
  var cookie = cookieParser.JSONCookies(req.cookies);
  var isValidCookie = cookie.Authorization_cookie != undefined && cookie.Authorization_cookie != null && cookie.Authorization_cookie != "";
  // var userIsValid = isValidCookie && validateUserAgainstWhiteList();
  if(!isValidCookie && (req.path != '/auth' && req.path != '/callback') ){
    res.send('Hola <br><a href="/auth">Inicia sesión con Github!</a>');
  }else{
    next();
  }
});

// Página para redirigir a GitHub
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const options = {
    code,
  };

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);
    console.log('Serialized token: ', JSON.stringify(token));

    var tokenValue = token.token.access_token;
    var cookieValue = "Authorization_cookie=" + tokenValue + ";";
    res.writeHead(302, {  "Location": req.protocol + '://' + req.hostname + ":" + port + "/", 'Set-Cookie': cookieValue});
    res.end();
  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/mongo/log/:id', function(req, res){
  mongoConnection.GetAllMessagesForUser(req, res, req.param.id);
});

// escuchar una conexion por socket
io.on('connection', function(socket){
  // si se escucha "chat message"
  socket.on('chat_message', function(msg){
    // volvemos a emitir el mismo mensaje
    mongoConnection.insertChatMessage(msg);
    io.emit('chat_message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
