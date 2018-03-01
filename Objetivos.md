# Objetivos

* Chat que almacena la información de los mensajes usando MongoDB.
* Autenticación con OAuth 2.0 usando algún proveedor real.

## Tareas

* Capturar el Bearer token y dirigir a la pantalla de autenticación cuando no exista.
* Mantener el token de authenticación del lado del cliente.
* Asegurar que el token es enviado con cada request (Cookie?).
* Guardar algún dato de usuario en Mongo para registrarlo también de nuestro lado.
* Obtener la información de GitHub para el nombre de usuario.
* Almacenar mensajes según el nombre de usuario de GitHub.
* Leer los mensajes del usuario basado en el username de GitHub.
* Opcional: Hostear chat en Heroku.
* Cambiar el string de state.