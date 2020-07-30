let express = require('express');
let app = express();
let server = require('http').Server(app);
let path = require('path');

app.get('/',(req,res)=>{
    res.send("Melo");
});

let io = require('socket.io')(server);
let streaming = require('stream');

/*
io.of('/').on('connection',(socket)=>{
    console.log("hola mundo");
});
*/
io.of('/').on('connect',(socket)=>{
    console.log("Llegue hasta connect");
})

const puerto = 3000;
server.listen(puerto);