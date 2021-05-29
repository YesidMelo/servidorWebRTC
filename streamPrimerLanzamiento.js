//registro usuario
const conexionEstablecida = "conexionEstablecida";
const registrarUsuario = "registrarUsuario";
const finalizarRegistroUsuario = "finalizarRegistroUsuario";

//negociacion webrtc
const unirASala = "unirASala";
const salirDeSala = "salirDeSala";

var usuariosRegistrados = {};

const streaming = (io, socket, os) => {
    
    //Estados de conexion dentro de la app
    conectarUsuario(io, socket, os);
    registrarUsuarioACanal(io, socket, os);
    desvicularUsuario(io, socket, os)

    ///manejo de la videollamada
    unirmeASala(io, socket, os)
    salirSala(io, socket, os)
    console.log("hola Mundo");
}

///No eliminar de la linea 19-46 estas funciones son las que establecen los estados de conexion dentro de la app
function conectarUsuario(io, socket, os) {
    //var socketActual = io.nsps["/stream"].sockets[socket.id];
    socket.emit(conexionEstablecida, "Conectado")
}

function desvicularUsuario(io, socket, os) {
    socket.on(finalizarRegistroUsuario, (data) => {
        console.log("datos: "+ usuario["usuario"]);
        if(usuariosRegistrados[usuario.usuario] != undefined) {
            usuariosRegistrados[usuario.usuario] = undefined;
        }
        socket.emit(finalizarRegistroUsuario, {});
    })
}

function registrarUsuarioACanal(io, socket, os) {
    socket.on(registrarUsuario, (data)=>{
        const usuario = JSON.parse(JSON.stringify(data))
        if(usuariosRegistrados[usuario.usuario] == undefined) {
            usuariosRegistrados[usuario.usuario] = socket.id;
        } else if(usuariosRegistrados[usuario.usuario].id != socket.id){
            usuariosRegistrados[usuario.usuario] = socket.id;
        }

        socket.emit(registrarUsuario, { socketId: socket.id,})
    })
}

///Metodos encargados de la negocion del webRTC
//union y desvinculacion a sala socket
function unirmeASala(io, socket, os) {
    socket.on(unirASala, (data)=>{
        var clientesEnSala = io.nsps["/stream"].adapter.rooms[data.Sala];
        var numeroClientesEnSala = clientesEnSala ? Object.keys(clientesEnSala.sockets).length : 0 ;
        console.log(clientesEnSala);

        if(numeroClientesEnSala === 0) {
            socket.join(data.Sala)
            socket.emit(unirASala,{ seUnio: true, mensaje: "Se ha unido a la sala"})
        } else if(numeroClientesEnSala === 1) {
            socket.join(data.Sala)
            socket.emit(unirASala,{ seUnio: true, mensaje: "Se ha unido a la sala"})
        } else {
            socket.emit(unirASala, {seUnio: false, mensaje: "La sala esta llena"})
        }

    });
}

function salirSala(io, socket, os) {
    socket.on(salirDeSala,(data)=>{
        const detalle = JSON.parse(JSON.stringify(data))
        console.log(detalle);
        socket.leave(data.Sala)
        socket.emit(salirDeSala,{desvinculado: true})
    });
}

//manejo de oferta y respuesta webrtc




module.exports = streaming