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


//Configuracion inicial socket
//const stream = require('./stream');

//Configuracion tentativa
//const streaming = require('./streaming');

//configuracion de lanzamiento
const streaming = require('./streamPrimerLanzamiento');

const io = require('socket.io')(server);
const os = require('os');
io.of('/stream').on('connection',(socket)=>{
    //stream(io,socket,os);
    //streaming(io, socket, os);
    streaming(io, socket, os)
});

//inicializa el puerto
const puerto = process.env.PORT || 3000;
server.listen(puerto,()=>{
    console.log("listening on * : "+puerto)
});



