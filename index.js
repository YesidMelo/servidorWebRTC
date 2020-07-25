const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/*
Configuracion relacionado con la pagina y el api rest
*/
//configuracion de app

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

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

/*configuracion relacionada con la videollamada */
