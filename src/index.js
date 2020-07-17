const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http = require ('http'); 

//initializations
const app = express();
const server = http.createServer(app); //inicializará la aplicación desde server
const io = socketIO(server); //me devuelve objeto q es el q me permitirá conectarme con el cliente


//settings

//motor de plantllas

app.engine('ejs', engine);
app.set('view engine',
    'ejs'); // todos los archivos de vistas tendran la extension ejs
// para no tener q indicar toda la ruta C:\Javier_c\CODIGO\javascript\Leaflet\leaflet-node\src\views usamos una cosntante de node: _dirname
// con modulo path evitamos q en la unión de directorios exista confusion en windows o unix por ejemplo con / \
//console.log(__dirname+'/'views')
app.set('views', path.join(__dirname, 'views'));

// routes 
//las creamos en un directorio externo -

app.use(require('./routes/'));

//sockets
//importamos el módulo de sockets require('socket.io')
require('./sockets')(io); // funcion q necesita ejecutar el parámetro de conexión (io)


//statics files - utiliza archivos estaticos de express en la dirección q le pasamos

app.use(express.static(path.join(__dirname, 'public')));

// Startin the server
// app.listen(3000, () => {
//     console.log('Server on port 3000');
// });
//Ahora inicia aplicación server no app
server.listen("https://walk-leaflet-node.herokuapp.com/", () => {
    console.log('Server on port 3000');
});