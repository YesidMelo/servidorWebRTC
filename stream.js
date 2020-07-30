const stream = (socket)=>{
    suscripcion('subscribe','new user',socket);
    return;
    newUserStart('newUserStart',socket);
    sdp('sdp',socket);
    iceCandidates('ice candidates',socket);
    chat('chat',socket);

}

function suscripcion(nombre,nuevoUsuario,socket){
    socket.on(nombre,(data)=>{
        //subscribirse unirse a sala
        
        const jsonObject = JSON.parse(`${data}`)    
        
        socket.join(jsonObject.room);
        socket.join(jsonObject.socketId);

        if( socket.adapter.rooms[jsonObject.room].length > 1  ){
            console.log(`room : ${jsonObject.room}`);
            socket.to(jsonObject.room).emit(nuevoUsuario,{socketId : jsonObject.socketId });
        }

    });
}

function newUserStart(nombre,socket){
    socket.on(nombre,(data)=>{
        socket.to(data.to).emit(nombre,{ sender : data.sender });
    });
}

function sdp(nombre,socket){
    socket.on(nombre,(data)=>{
        socket.to(data.to).emit(nombre, { description : data.description, sender : data.sender });
    });
}

function iceCandidates(nombre,socket){

    socket.on(nombre,(data)=>{
        socket.to(data.to).emit(nombre,{ candidate : data.candidate, sender : data.sender });
    })

}

function chat(nombre,socket){
    socket.on(nombre,(data)=>{
        socket.to(data.room).emit(nombre,{ sender : data.sender, msg : data.msg });
    });
}

module.exports = stream;