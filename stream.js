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
        console.log(`datos entrada : ${data}`);
        const jsonObject = JSON.parse(`${data}`)    
        console.log(`room : ${jsonObject.room}`);
        socket.join(data.room);
        socket.join(data.socketId);

        if( socket.adapter.rooms[data.room].length > 1  ){
            
            socket.to(data.room).emit(nuevoUsuario,{socketId : data.socketId });
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