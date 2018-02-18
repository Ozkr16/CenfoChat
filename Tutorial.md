# Tutorial CenfoChat

La idea de este ejercicio será mejorar el codigo fuente de CenfoChat de manera
que se utilice la autenticación
por medio de OAuth, usando cuentas de Gmail, y almacenando los datos en una base
 de datos de tipo NoSQL usando MongoDB.

## Pasos para instalar y correr MongoDb en la maquina servidor de DB

Pueden seguirse los pasos en estos links para instalar la version "Comunity" del
 proceso/servidor de MongoDb.

* <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/>
* <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/>

Una vez instalado, debe iniciarse el proceso de mongoDb para que este pueda
responder a las peticiones. Debemos utilizar los comandos:

Para crear la carpeta de datos de MongoDB:
mkdir -p ./data/db

Luego corremos el comando:
mongod --dbpath ./data/db

Si el proceso fue satisfactorio, deberemos observar en la consola, un mensaje
similar a este:
[initandlisten] waiting for connections on port 27017

## Pasos para instalar las dependencias de MongoDB en Node

1) Copiar carpeta en BackUp/CenfoChat a la carpeta base.
2) Nos movemos a la carpeta de CenfoChat.
3) Por medio de una terminal, instalar las dependencias (paquetes de NPM), de
CenfoChat. Utilice el comando "npm install".
4) Ahora instalamos el paquete de MongoDB utilizando NPM, con el comando:
"npm install mongodb"

## Pasos para utilizar MongoDB en CenfoChat

La idea del ejercicio será almacenar una serie de datos de los usuarios y sus
mensajes en una base de Mongo. Dicho almacenamiento sucederá del lado del
servidor de NodeJS que recibe y envía los mensajes.

1) Creamos el archivo mmongodb-connect.js agregamos:

```javascript
var mongo = require("mongodb");
```

2) El siguiente paso es la creación de una base de datos. La base de datos se
accederá por medio de un objeto MongoClient.

```javascript
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cenfochatdb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Base de datos creada.");
  db.close();
});
```

3) Ahora debemos correr el script anterior con nodejs, para que se de la
creación de la DB. El comando sería "node mongodb-connect.js".
La terminal deberá mostrar el mensaje "Base de datos creada.".

## Pasos para instalar las dependencias de OAuth 2.0

Pasos.

## Referencias

Referencias utilizadas para el tutorial:

* <https://docs.mongodb.com/manual/>
* <https://mongodb.github.io/node-mongodb-native/>
* <https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp>
