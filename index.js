const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//configuracion de app
app.use(express.static(__dirname+'/vista'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');


app.get('/',function(solicitud,respuesta){
    //respuesta.send('Hola mundo');
    respuesta.render('index.html');
});

const puerto = 3000;

app.listen(puerto,function(){
    console.log(`escuchando en el puerto : ${puerto}`);
});

