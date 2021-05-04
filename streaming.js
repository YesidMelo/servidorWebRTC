
var usuariosRegistrados = {};


const estadoConexionReceptor = "estadoConexionReceptor"
const emisorEnviaCanalVideollamada = "emisorEnviaCanalVideollamada"
const finalizarVideollamada = "finalizarVideollamada"
const ingresarUsuarioVideollamada = "ingresarUsuario";
const salirUsuarioVideollamada = "salirUsuario";
const solicitarVideollamada = "solicitarVideollamada";
const receptorAceptoVideollamada = "receptorAceptoVideollamada"
const receptorEnviaCanalVideollamada = "receptorEnviaCanalVideollamada";


const streaming = (io, socket, os) => {
    notificarQueSeHaConectado(io, socket)
    notificarQueSeHaDadoDeBajaAlUsuario(io, socket)
    notificarQueFinalizoLaVideollamada(io, socket)
    notificarQueSeSolicitaUnaVideollamada(io,socket)
    notificarQueElReceptorAceptoVideollamada(io, socket)
    notificarQueElEmisorEnviarCanalVideollamada(io, socket)
    notificarQueElReceptorEnviaCanalVideollamada(io, socket)
}

function notificarQueSeHaConectado(io, socket) {
    socket.on(ingresarUsuarioVideollamada, (data) => {
        
        var usuario =JSON.parse(data)
        socket.userId = usuario.email;
        if(usuariosRegistrados[usuario.email] == undefined) {
            usuariosRegistrados[usuario.email] = socket.id;
        } else if(usuariosRegistrados[usuario.email].id != socket.id){
            usuariosRegistrados[usuario.email] = socket.id;
        }
        io.to(usuariosRegistrados[usuario.email]).emit(ingresarUsuarioVideollamada,{
            'status': true,
            'socketId': socket.id
        });
        console.log(usuariosRegistrados);
              
    });
}

function notificarQueSeHaDadoDeBajaAlUsuario(io, socket) {
    socket.on(salirUsuarioVideollamada, (data)=>{
        
        var usuario =JSON.parse(data)
        if(usuariosRegistrados[usuario.email] != undefined) {
            usuariosRegistrados[usuario.email] = undefined;
        } 
        socket.emit(salirUsuarioVideollamada,{
            'status': false
        });
        
        //console.log(usuariosRegistrados[usuario.email]);
    });
}

function notificarQueFinalizoLaVideollamada(io, socket) {
    socket.on(
        finalizarVideollamada,
        (data) => {
            var solicitud =JSON.parse(data)
            if(usuariosRegistrados[solicitud.email_emisor] != undefined) {
                io.to(usuariosRegistrados[solicitud.email_emisor])
                    .emit(finalizarVideollamada,solicitud)
            }
            if(usuariosRegistrados[solicitud.email_receptor] != undefined) {
                io.to(usuariosRegistrados[solicitud.email_receptor])
                    .emit(finalizarVideollamada,solicitud)
            }
        }
    )
}


function notificarQueSeSolicitaUnaVideollamada(io, socket) {
    socket.on(solicitarVideollamada, (data) =>{
        
        var solicitud =JSON.parse(data)
        if(usuariosRegistrados[solicitud.email_receptor] == undefined) {
            socket.emit(
                estadoConexionReceptor,
                {
                    "receptorConectado" : false
                }
            );
        } else {
            solicitud.receptorConectado = true;
            socket.emit(estadoConexionReceptor, solicitud);
            io.to(usuariosRegistrados[solicitud.email_receptor]).emit(
                solicitarVideollamada,
                solicitud
            )
        }
        console.log(solicitud);
        
    });
}

function notificarQueElReceptorAceptoVideollamada(io, socket) {
    socket.on(
        receptorAceptoVideollamada,
        (data) => {
            var solicitud =JSON.parse(data)
            if(usuariosRegistrados[solicitud.email_emisor] == undefined) {
                console.log("usuario no registrado")
                return;
            }

            io.to(usuariosRegistrados[solicitud.email_emisor]).emit(
                receptorAceptoVideollamada,
                solicitud
            )
        }
    );
}

function notificarQueElEmisorEnviarCanalVideollamada(io, socket) {
    socket.on(
        emisorEnviaCanalVideollamada,
        (data) =>{
            var solicitud =JSON.parse(data)
            if(usuariosRegistrados[solicitud.email_receptor] != undefined) {
                io.to(usuariosRegistrados[solicitud.email_receptor]).emit(
                    emisorEnviaCanalVideollamada,
                    solicitud
                )
            }

            
        }
    );
}

function notificarQueElReceptorEnviaCanalVideollamada(io, socket) {
    socket.on(
        receptorEnviaCanalVideollamada,
        (data) => {
            var solicitud =JSON.parse(data)
            if(usuariosRegistrados[solicitud.email_emisor] != undefined) {
                io.to(usuariosRegistrados[solicitud.email_emisor]).emit(
                    emisorEnviaCanalVideollamada,
                    solicitud
                )
            }
        }
    )
}



module.exports = streaming;