      $(function () {
      
        var apiURL = "https://api.github.com/user?access_token=" + Cookies.get("Authorization_cookie");
        $.ajax(
          {
            url: apiURL, 
            success: function(result){
              var usernameInput = document.getElementById("usuario");
              usernameInput.value = result.login;
            }
          }
        );

        
        var socket = io();

        // emite evento al servidor
        $('form').submit(function(){

          // captura de nombre y mensaje
          var nombreTxt = $('#usuario').val() || "Anonimo";
          var mensajeTxt = $('#m').val();

          if (colorHexTxt == "")
          {
            colorHexTxt = getRandomColor();
          }

          // composicion del mensaje en formato JSON para enviar
          // al server NODE
          var jsonMsg = { usuario:nombreTxt, mensage: mensajeTxt, color: colorHexTxt};
          

          // pequena validacion de no enviar nada al server vacio
          if (nombreTxt.trim() != undefined && nombreTxt.trim() != ""){
            socket.emit('chat_message', JSON.stringify(jsonMsg));
            console.log("Emitted chat message from client." + JSON.stringify(mensajeTxt));
            $('#m').val('');
          }

          return false;
        });

        // Escucha el server
        socket.on('chat_message', function(msg){
          console.log("Message event recieved on the client.");
          // recibimos mensaje como un objeto JSON
          var msgJson =  JSON.parse(msg);

          // lo ponemos en un formato
          var mensajeDisplay = "<b style='color:"+ msgJson.color +"'>" + msgJson.usuario + "</b>: " + msgJson.mensage;

          // imprimimos el mensaje en pantalla
          $('#messages').append($('<li>').html(mensajeDisplay));
          window.scrollTo(0, document.body.scrollHeight);
        });

      });

      var colorHexTxt = "";

      // genera colores aleatorios en hexadeximal
      function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
  
          return color;
       }
  