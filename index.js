let express = require('express');
let app = express();
let server = require('http').Server(app);
let path = require('path');

const puerto = 3000;
server.listen(puerto);

app.get('/',(req,res)=>{
    res.send("Melo");
});

let io = require('socket.io')(server);
let stream = require('stream');
