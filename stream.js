const stream = (socket)=>{
    suscripcion('subscribe','new user',socket);
    newUserStart('newUserStart',socket);
    return;
    sdp('sdp',socket);
    iceCandidates('ice candidates',socket);
    chat('chat',socket);

}

function suscripcion(nombre,nuevoUsuario,socket){
    socket.on(nombre,(data)=>{
        //subscribirse unirse a sala
        
                
        socket.join(convertirAJson(data).room);
        socket.join(convertirAJson(data).socketId);

        if( socket.adapter.rooms[convertirAJson(data).room].length > 1  ){
            socket.to(convertirAJson(data).room).emit(nuevoUsuario,{socketId : convertirAJson(data).socketId });
        }

    });
}

function convertirAJson(data){
    return JSON.parse(`${data}`)
}

function newUserStart(nombre,socket){
    socket.on(nombre,(data)=>{
        console.log(`data : ${convertirAJson(data)}`);
        socket.to(convertirAJson(data).to).emit(nombre,{ sender : convertirAJson(data).sender });
    });
}

function sdp(nombre,socket){
    socket.on(nombre,(data)=>{
        socket.to(convertirAJson(data).to).emit(nombre, { description : convertirAJson(data).description, sender : convertirAJson(data).sender });
    });
}

function iceCandidates(nombre,socket){

    socket.on(nombre,(data)=>{
        socket.to(convertirAJson(data).to).emit(nombre,{ candidate : convertirAJson(data).candidate, sender : convertirAJson(data).sender });
    })

}

function chat(nombre,socket){
    socket.on(nombre,(data)=>{
        socket.to(convertirAJson(data).room).emit(nombre,{ sender : convertirAJson(data).sender, msg : convertirAJson(data).msg });
    });
}

module.exports = stream;