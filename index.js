'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParse = require('body-parser');

//configuracion del servidor
app.use(bodyParse.urlencoded({ extended : true}));
app.use(bodyParse.json());

//inicializa el primer Api
app.get('/',(solicitud,respuesta)=>{
    respuesta.send("mola");
});


//inicio configuracion de socket
//const stream = require('./stream');
const streaming = require('./streaming');
const io = require('socket.io')(server);
const os = require('os');
io.of('/').on('connection',(socket)=>{
    //stream(io,socket,os);
    streaming(io,socket,os);
});

//inicializa el puerto
const puerto = process.env.PORT || 3000;
server.listen(puerto,()=>{
    console.log("listening on * : "+puerto)
});



