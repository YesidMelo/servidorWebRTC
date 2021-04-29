
var usuariosRegistrados = new Map();

const ingresarUsuarioVideollamada = "ingresarUsuario";
const salirUsuarioVideollamada = "salirUsuario";

const streaming = (io, socket, os) => {
    notificarQueSeHaConectado(socket)
    notificarQueSeHaDadoDeBajaAlUsuario(socket)
}

function notificarQueSeHaConectado(socket) {
    socket.on(ingresarUsuarioVideollamada, (data) => {
        var usuario =JSON.parse(data)
        if(usuariosRegistrados[usuario.email] == undefined) {
            usuariosRegistrados[usuario.email] = socket;
        } else if(usuariosRegistrados[usuario.email].id != socket.id){
            usuariosRegistrados[usuario.email] = socket;
        }
        usuariosRegistrados[usuario.email].emit(ingresarUsuarioVideollamada,{
            'status': true
        });
        console.log(usuariosRegistrados[usuario.email]);
    });
}

function notificarQueSeHaDadoDeBajaAlUsuario(socket) {
    socket.on(salirUsuarioVideollamada, (data)=>{
        var usuario =JSON.parse(data)
        if(usuariosRegistrados[usuario.email] != undefined) {
            usuariosRegistrados[usuario.email] = undefined;
        } 
        socket.emit(salirUsuarioVideollamada,{
            'status': false
        });
        console.log(usuariosRegistrados[usuario.email]);
    });
}

module.exports = streaming;