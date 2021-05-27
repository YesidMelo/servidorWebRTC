const conexionEstablecida = "conexionEstablecida";
const registrarUsuario = "registrarUsuario";
const finalizarRegistroUsuario = "finalizarRegistroUsuario";

var usuariosRegistrados = {};

const streaming = (io, socket, os) => {
    console.log("hola Mundo");
    conectarUsuario(io, socket, os);
    registrarUsuarioACanal(io, socket, os);
    desvicularUsuario(io, socket, os)
}

function conectarUsuario(io, socket, os) {
    //var socketActual = io.nsps["/stream"].sockets[socket.id];
    socket.emit(conexionEstablecida, "Conectado")
}

function desvicularUsuario(io, socket, os) {
    socket.on(finalizarRegistroUsuario, (data) => {
        const usuario = JSON.parse(JSON.stringify(data))
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

module.exports = streaming