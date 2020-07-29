const stream = (socket)=>{

    suscripcion(socket);
    newUserStart(socket);
    sdp(socket);
    iceCandidates(socket);
    chat(socket);

}

function suscripcion(socket){
    socket.on('subscribe',(data)=>{
        //subscribirse unirse a sala
        socket.join(data.room);
        socket.join(data.socketId);

        if( socket.adapter.rooms[data.room].length > 1  ){
            socket.to(data.room).emit('new user',{socketId : data.socketId });
        }

    });
}

function newUserStart(socket){
    socket.on('newUserStart',(data)=>{
        socket.to(data.to).emit('newUserStart',{ sender : data.sender });
    });
}

function sdp(socket){
    socket.on('sdp',(data)=>{
        socket.to(data.to).emit('sdp', { description : data.description, sender : data.sender });
    });
}

function iceCandidates(socket){

    socket.on('ice candidates',(data)=>{
        socket.to(data.to).emit('ice candidates',{ candidate : data.candidate, sender : data.sender });
    })

}

function chat(socket){
    socket.on('chat',(data)=>{
        socket.to(data.room).emit('chat',{ sender : data.sender, msg : data.msg });
    });
}

module.exports = stream;