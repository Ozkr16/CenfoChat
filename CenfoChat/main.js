var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var mongoConnection = require('./mongo/mongodb-connect.js');
var setCookie = require('set-cookie');


const bearerToken = require('express-bearer-token');
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


// Enable middleware to catch the bearer token contained in any request.
app.use(bearerToken());
app.use(function (req, res, next) {
  // Allow only the Auth URL when there is no Bearer Token (req.token will be added there by the bearerToken middleware)
  if((req.token == null || req.token == undefined || req.token == '') && (req.path != '/auth' && req.path != '/callback') ){
    res.send('Hola <br><a href="/auth">Inicia sesión con Github!</a>');
  }else{
    next();
  }
})

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


    setCookie('myCookie', 'the value of the cookie', {
      domain: '.example.org',
      res: res
    });
    
    res.sendFile(__dirname + '/index.html');
    
    // return res
    //   .status(200)
    //   .json(token);
  });
});

// app.get('/success', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/mongo/log/:id', function(req, res){
  mongoConnection.GetAllMessagesForUser(req, res, req.param.id);
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
