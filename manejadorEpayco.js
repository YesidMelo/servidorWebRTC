
function respuestaEpayco(solicitud,respuesta){
    console.log("recibo respuesta epayco");
    var resp = {}
    respuesta.send(resp);
}

function confirmacionEpayco(solicitud,respuesta){
    console.log("recibo confirmacion epayco");
    var resp = {}
    resp.send(resp);
}

module.exports = {
    respuestaEpayco,
    confirmacionEpayco
}
