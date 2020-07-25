/*obtener permisos del navegador web*/
navigator.mediaDevices.getUserMedia({audio : true, video : true})
    .then(stream =>{
        window.localStream = stream;
    })
    .catch((error)=>{
        console.log(error);
    })
    ;