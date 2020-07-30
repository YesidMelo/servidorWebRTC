let express = require('express');
let app = express();
let server = require('http').Server(app);
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Melo");
});

let io = require('socket.io')(server);
let streaming = require('./stream');


io.of('/').on('connection',(socket)=>{
    streaming(socket);

});

/*
io.of('/').on('connect',(socket)=>{
    streaming(socket);
})
*/

const puerto = 3000;
server.listen(puerto);