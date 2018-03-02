$(function () {
        
    var askedUsername = window.prompt("¿Cuál es su nombre de usuario?");
    $("#usuario").val(askedUsername);


    var socket = io();

    // emite evento al servidor
    $('form').submit(function(){

      //socket.emit("connection");
      // EMITIR EL MENSAJE DEL INPUT M
      var textoMensaje = {usuario: $("#usuario").val(), mensage: $("#m").val()};
      socket.emit("chat_message", textoMensaje);
      console.log("Emitted chat message from client." + JSON.stringify(textoMensaje));
      $("#m").val("");
      return false;
    });

    // Escucha el server
    // ESCUCHAR EL EVENTO "Chat Message"
    // IMPRIMIR EN PANTALLA EL MENSAJE DEL SERVER
    // ejemplo: $('#messages').append($('<li>').text(AQUI_VA_EL_MENSAJE));

    
      socket.on("chat_message", function(dataRecieved){
        console.log("Message event recieved on the client.");
        var messageClass = dataRecieved.usuario == $("#usuario").val() ? "my-message" : "other-message";
        var messageElement = $('<li>').text(dataRecieved.usuario + ":  " + dataRecieved.mensage);
          messageElement.addClass(messageClass);
        $('#messages').append(messageElement);
      });
  });