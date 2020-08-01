const stream = (socket)=>{
    suscripcion('subscribe','new user',socket);
    newUserStart('newUserStart',socket);
    sdp('sdp',socket);
    iceCandidates('ice candidates',socket);
    chat('chat',socket);
    

}

function suscripcion(nombre,nuevoUsuario,socket){
    socket.on(nombre,(data)=>{
        //subscribirse unirse a sala
        
        socket.join(convertirAJson(data).room);
        socket.join(convertirAJson(data).socketId);


        if(socket.adapter.rooms[convertirAJson(data).room].length >1){
            
            let listaSockets = []
            for(let item in socket.adapter.rooms[convertirAJson(data).room].sockets){
                 listaSockets.push(item)
            }

            var jsonAEnviar = { sockets : listaSockets}
            socket.to(convertirAJson(data).room).emit(nuevoUsuario,jsonAEnviar);
            
        }

    });
}

function convertirAJson(data){
    return JSON.parse(`${data}`)
}

function newUserStart(nombre,socket){
    socket.on(nombre,(data)=>{
        console.log(`llegue a ${nombre} ${data}`);
        socket.to(convertirAJson(data).to).emit(nombre,{ sender : convertirAJson(data).sender });
    });
}

function sdp(nombre,socket){
    socket.on(nombre,(data)=>{
        //console.log(`llegue a sdp ${data}`);
        socket.to(convertirAJson(data).to).emit(nombre, { description : convertirAJson(data).description, sender : convertirAJson(data).sender });
        
    });
}

function iceCandidates(nombre,socket){
    
    socket.on(nombre,(data)=>{
        console.log(`data iceCandidates : ${data}`);
        socket.to(convertirAJson(data).to).emit(nombre,{ candidate : convertirAJson(data).candidate, sender : convertirAJson(data).sender });
    })

}

function chat(nombre,socket){
    
    socket.on(nombre,(data)=>{
        console.log(`data chat : ${data}`);
        return;
        socket.to(convertirAJson(data).room).emit(nombre,{ sender : convertirAJson(data).sender, msg : convertirAJson(data).msg });
    });
}

module.exports = stream;