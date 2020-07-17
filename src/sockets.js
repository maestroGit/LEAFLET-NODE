//archivo por separado para escuchar los eventos
//Creo funcion q reciba 'escuche' la conexión io- 

module.exports = io => {
    io.on('connection', (socket) => {
        console.log('New Usser connected');
        //escucho evento 'userCoordinates' q me envía el navegador y q lo muestre por consola del servidor
        socket.on('userCoordinates', coords => {
            console.log(coords);
            //podría almacenarlo en una ddbb
            //vamos a reenviarlo a todos los clientes
            socket.broadcast.emit('newUserCoordinates', coords);
        })

    });

}