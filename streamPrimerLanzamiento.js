const namespace = "/stream";

//registro usuario
const conexionEstablecida = "conexionEstablecida";
const registrarUsuario = "registrarUsuario";
const finalizarRegistroUsuario = "finalizarRegistroUsuario";

//negociacion webrtc
const salaCreada = "salaCreada";
const unirASala = "unirASala";
const salaLlena = "salaLlena"
const salirDeSala = "salirDeSala";
const receptorSalioDeSala = "receptorSalioDeSala"
const mensaje = "mensaje"
const tiempoVideollamada = "tiempoVideollamada"
const finalizarVideollamada = "finalizarVideollamada"


var usuariosRegistrados = {};
var detalleWebRTCDeUsuario = {};
var tiempoVideollamadaSala = {};

const streaming = (io, socket, os) => {
 
    //Estados de conexion dentro de la app
    conectarUsuario(io, socket, os);
    registrarUsuarioACanal(io, socket, os);
    desvicularUsuario(io, socket, os)

    ///manejo de la videollamada
    unirmeASala(io, socket, os)
    salirSala(io, socket, os)
    recibirMensaje(io, socket, os)
    recibirTiempoVideollamada(io, socket, os);
    console.log("hola Mundo");
}

///No eliminar de la linea 19-46 estas funciones son las que establecen los estados de conexion dentro de la app
function conectarUsuario(io, socket, os) {
    //var socketActual = io.nsps["/stream"].sockets[socket.id];
    socket.emit(conexionEstablecida, "Conectado")
}

function desvicularUsuario(io, socket, os) {
    socket.on(finalizarRegistroUsuario, (data) => {
        var detalle = JSON.parse(JSON.stringify(data))
        console.log("datos: "+ detalle.usuario);
        
        if(usuariosRegistrados[detalle.usuario] != undefined) {
            usuariosRegistrados[detalle.usuario] = undefined;
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
        const detalle = JSON.parse(JSON.stringify(data))
        var clientesEnSala = io.nsps[namespace].adapter.rooms[data.Sala];
        var numeroClientesEnSala = clientesEnSala ? Object.keys(clientesEnSala.sockets).length : 0 ;

        if(numeroClientesEnSala === 0) {
            socket.join(data.Sala)
            socket.emit(salaCreada,{ seUnio: true, mensaje: "Ha creado la sala"})
            detalleWebRTCDeUsuario[detalle.emisor] = detalle
        } else if(numeroClientesEnSala === 1) {
            socket.join(data.Sala)
            socket.emit(unirASala,{ seUnio: true, mensaje: "Se ha unido a la sala"})
            detalleWebRTCDeUsuario[detalle.emisor] = detalle
        } else if(numeroClientesEnSala >= 2) {
            if(!io.nsps[namespace].adapter.rooms[data.Sala].sockets[usuariosRegistrados[detalle.emisor]]) {
                socket.emit(salaLlena, {seUnio: false, mensaje: "La sala esta llena"})
            }
        }

    });
}

function salirSala(io, socket, os) {
    socket.on(salirDeSala,(data)=>{
        const detalle = JSON.parse(JSON.stringify(data))
        if(detalleWebRTCDeUsuario[detalle.emisor] !== undefined) {
            detalleWebRTCDeUsuario[detalle.emisor] = undefined
        }
        console.log(detalle);
        socket.leave(data.Sala)
        socket.emit(salirDeSala,{desvinculado: true})

        if(usuariosRegistrados[detalle.receptor] !== undefined && detalleWebRTCDeUsuario[detalle.receptor] !== undefined) {
            if(detalle.finalizarVideollamada) {
                socket.to(usuariosRegistrados[detalle.receptor]).emit(finalizarVideollamada,{})
            } else {
                socket.to(usuariosRegistrados[detalle.receptor]).emit(receptorSalioDeSala, {})
            }
        }

    });
}

//Manejador oferta webrtc
function recibirMensaje(io, socket, os) {
    socket.on(mensaje, (data)=>{
        
        const detalle = JSON.parse(JSON.stringify(data))
        //console.log(detalle)
        if(detalleWebRTCDeUsuario[detalle.receptor] != undefined) {
            socket.to(usuariosRegistrados[detalle.receptor]).emit(mensaje,detalle)
        }
        socket.emit(mensaje, detalle)
    });
}

//Manejador tiempo videollamada
function recibirTiempoVideollamada(io, socket, os) {
    socket.on(tiempoVideollamada, (data) => {
        const detalle = JSON.parse(JSON.stringify(data))
        tiempoVideollamadaSala[detalle.emisor] = detalle
        if(tiempoVideollamadaSala[detalle.receptor] !== undefined) {
            var minuteroEmisor = detalle.minutero
            var segunderoEmisor = detalle.segundero
            var minuteroReceptor = tiempoVideollamadaSala[detalle.receptor].minutero
            var segunderoReceptor = tiempoVideollamadaSala[detalle.receptor].segundero

            if(minuteroEmisor == minuteroReceptor && segunderoEmisor == segunderoReceptor) {
                socket.to(usuariosRegistrados[detalle.receptor]).emit(tiempoVideollamada, {
                    minutero: minuteroEmisor,
                    segundero: segunderoEmisor,
                    emisor: usuariosRegistrados[detalle.receptor],
                    receptor: detalle.emisor,
                    sala: detalle.Sala
                })
                socket.emit(tiempoVideollamada, detalle);
                return
            }

            if(minuteroEmisor == minuteroReceptor ) {
                if(segunderoEmisor < segunderoReceptor) {
                    var detalleVideollamada = {
                        minutero: minuteroEmisor,
                        segundero: segunderoReceptor,
                        emisor: usuariosRegistrados[detalle.receptor],
                        receptor: detalle.emisor,
                        sala: detalle.Sala
                    }
                    socket.to(usuariosRegistrados[detalle.receptor]).emit(tiempoVideollamada, detalleVideollamada)
                    socket.emit(tiempoVideollamada, detalleVideollamada);
                    return 
                }
                var detalleVideollamada = {
                    minutero: minuteroEmisor,
                    segundero: segunderoEmisor,
                    emisor: usuariosRegistrados[detalle.receptor],
                    receptor: detalle.emisor,
                    sala: detalle.Sala
                }
                socket.to(usuariosRegistrados[detalle.receptor]).emit(tiempoVideollamada, detalleVideollamada)
                socket.emit(tiempoVideollamada, detalleVideollamada);
                return 
            }

            if(minuteroReceptor < minuteroEmisor) {
                var detalleVideollamada = {
                    minutero: minuteroEmisor,
                    segundero: segunderoEmisor,
                    emisor: usuariosRegistrados[detalle.receptor],
                    receptor: detalle.emisor,
                    sala: detalle.Sala
                }
                socket.to(usuariosRegistrados[detalle.receptor]).emit(tiempoVideollamada, detalleVideollamada)
                socket.emit(tiempoVideollamada, detalleVideollamada);
                return 
            } else {
                var detalleVideollamada = {
                    minutero: minuteroReceptor,
                    segundero: segunderoReceptor,
                    emisor: usuariosRegistrados[detalle.receptor],
                    receptor: detalle.emisor,
                    sala: detalle.Sala
                }
                socket.to(usuariosRegistrados[detalle.receptor]).emit(tiempoVideollamada, detalleVideollamada)
                socket.emit(tiempoVideollamada, detalleVideollamada);
            }
        }
        
    });
}




module.exports = streaming