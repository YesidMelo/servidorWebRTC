/**
 * esta aplicacionon esta basada en el codigo : https://github.com/shivammaindola/AndroidWebRTC 
 * 
 * adicionar en el index para usar el repo de videollamada
 *  const stream = require('./stream');
    const io = require('socket.io')(server);
    const os = require('os');
    io.of('/').on('connection',(socket)=>{
        stream(io,socket,os);
    });
 * 
 */

const logRespuesta = 'log';
const stream = (io,socket,os)=>{

    // convenience function to log server messages on the client
    function log() {
      var array = ['Mensaje del servidor:'];
      array.push.apply(array, arguments);
      socket.emit(logRespuesta, array);
    }

    escuchadorMensaje(log,socket);
    escuchadorCrearOUnirHabitacion(log,socket,io);
    escuchadorIp(socket,os);
    escuchadorAdios(socket);
  
}

const mensaje = "message";
function escuchadorMensaje(funcionLog,socket){
    
    socket.on(mensaje, function(message) {
        funcionLog('Cliente dice: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit(mensaje, message);
      });

}

const crear_o_unir = "create or join"
const creado = "created";
const unir = "join";
const unido = "joined";
const leer = "ready";
const lleno = "full";
function escuchadorCrearOUnirHabitacion(log,socket,io){
    socket.on(crear_o_unir, function(room) {
        console.log('recibe solicitud para crear o unir a la habitacion :' + room);
    
        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        console.log('Habitacion ' + room + ' tiene ahora ' + numClients + ' cliente(s)');
    
        if (numClients === 0) {
          socket.join(room);
          console.log('id del cliente ' + socket.id + ' habitacion creada ' + room);
          socket.emit(creado, room, socket.id);
    
        } else if (numClients === 1) {
          console.log('id del cliente ' + socket.id + ' se ha unido a la habitacion ' + room);
          io.sockets.in(room).emit(unir, room);
          socket.join(room);
          socket.emit(unido, room, socket.id);
          io.sockets.in(room).emit(leer);
        } else { // max two clients
          socket.emit(lleno, room);
        }
      });
}

const ipAddr = "ipaddr";
function escuchadorIp(socket,os){
    socket.on(ipAddr, function() {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
          ifaces[dev].forEach(function(details) {
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
              socket.emit(ipAddr, details.address);
            }
          });
        }
      });
}

const adios = "bye";
function escuchadorAdios(socket){
    socket.on(adios, function(sala){
        socket.leave(sala);
        socket.to(sala).emit(adios,socket.id);
        console.log('received bye');
    });
      
}


module.exports = stream;