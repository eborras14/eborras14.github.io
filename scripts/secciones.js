var div = ["Sucesos", "Internacional", "Politica","Economia","Deportes"];
var cache = ["Sucesos1", "Internacional1", "Politica1","Economia1","Deportes1"];
var seccionFavorite = ["suc","inte","pol","","dep"];
var matFavoritas = [];
var contador = 0;
function general(seccion){
status = navigator.onLine;
    if(status=="true"){
        if(seccion==cache[0]){
            descargaArchivo(0,'http://www.lavanguardia.com/mvc/feed/rss/sucesos');  
        }
        if(seccion==cache[1]){
            descargaArchivo(1,'http://www.lavanguardia.com/mvc/feed/rss/internacional');
        }
        if(seccion==cache[2]){
            descargaArchivo(2,'http://www.lavanguardia.com/mvc/feed/rss/politica');
        }
        if(seccion==cache[4]){
            descargaArchivo(4,'http://www.lavanguardia.com/mvc/feed/rss/deportes');
        }
    }else if(status=="false"){
        for(i=0;i<1;i++){
            var muestraNoticia = localStorage.getItem(seccion);
            if(muestraNoticia != null && muestraNoticia.length != 0){
                muestraHTML(seccion, muestraNoticia);
            }else{
                $('#' + seccion).append("<h4>No tienes conexion, y no hay contenido disponible</h4>"); 
            }
        }  
    }
}
function descargaArchivo(id,url) {
    if(window.XMLHttpRequest) {
        peticionHttp = new XMLHttpRequest();
    }else if(window.ActiveXObject) {
        peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
        peticionHttp.open('GET',url, true);
        peticionHttp.send(null);
    
        peticionHttp.onreadystatechange = function (){
            if(peticionHttp.readyState == 4 && peticionHttp.status == 200) {
                //Creamos el objeto de tipo documento XML
                var documentoXml = peticionHttp.responseXML;
                var seccion = div[id];
                var guardo = cache[id];
                procesaContenido(guardo,documentoXml,id,guardo);
            }
        }    
}
function procesaContenido (seccion,documentoXml,id,guardo){
   var root = documentoXml.getElementsByTagName("channel")[0];
    var tope = root.getElementsByTagName("item").length;
    var contentList = [];
        //Recorremos todos los elementos del documento
        for(var i = 0; i < 20 ; i++){
            item = root.getElementsByTagName("item")[i];
            guid = item.getElementsByTagName("guid")[0].firstChild.nodeValue;
            titulo = item.getElementsByTagName("title")[0].firstChild.nodeValue;
            try{
                descripcion = item.getElementsByTagName("description")[0].firstChild.nodeValue; 
            }catch(err){
                descripcion = " "; 
            }
            link = item.getElementsByTagName("link")[0].firstChild.nodeValue;
            try {
                url = item.getElementsByTagName("enclosure")[0].getAttribute('url');
            }
            catch(err) {
                url = "images/error.png";
            }
               
               var noticia = {
                id: guid,
                tituloN: titulo,
                descripN: descripcion,
                enlace:link,
                img: url
            };
            contentList.push(noticia);
    }    
        var noticiaAGuardar = JSON.stringify(contentList);
        localStorage.setItem(guardo, noticiaAGuardar);
        muestraHTML(seccion, noticiaAGuardar,id);       
}
function muestraHTML(seccion, contentList,id){
        var types = JSON.parse(contentList);
        for(x=0; x<20; x++) {
                var ideNoticia=types[x].id;
                var titulo=types[x].tituloN;
                var descripcion=types[x].descripN;
                var enlace=types[x].enlace;
                var url = types[x].img;
                /*  $('.pop').append('<div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title" align="center">Estas seguro?</h4></div><div class="modal-body" align="center"><button type="button" class="btn btn-default " data-dismiss="modal" onclick="alert('+ x +');">Si</button><button type="button" class="btn btn-default" data-dismiss="modal">No</button></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button></div></div></div></div>');*/
         
                  $('#' + seccion).append("<div class='col-sm-12'><div class='col-sm-10 noticia'><b>" + titulo + "<br></b><div class='noticia1'>" + descripcion + "<div class='imagencita'><a href='" + enlace +"' target='_blank'><img class='leerMas' src='images/leer_mas.png'/></a></div></div></div><div class='col-sm-2'><img class='img-circle' src='" + url + "'/></div><a href='#' id='"+ideNoticia+"' class='linked' onclick='favorite("+id+","+x+",`"+ideNoticia+"`);'><div class='like'><div class='textoLike'><span class='glyphicon glyphicon-heart'></span> Añadir</div></div></a></div><br>");
                
        }
        // VERIFICA QUE NOTICIAS CONSTAN COMO AÑADIDAS A FAVORITOS Y BLOQUEA LA OPCION DE AÑADIRLAS D NUEVO
        var posicion = cache.indexOf(seccion);
        var cacheFavorite = localStorage.getItem(seccionFavorite[posicion]);
        var contentParse =  JSON.parse(cacheFavorite);
        
        if(contentParse!=null){
            for(i=0;i<20;i++){
                try{
                    idenoticia = contentParse[i].id;
                    $("#"+idenoticia).html("<div class='like'><div class='textoLike'><span class='glyphicon glyphicon-ok'></span><b> Añadida</b></div></div>");
                    $("#"+idenoticia).prop('onclick',null).off('click'); 
                }catch(e){
                    break;
                }
                            
              
        }       
    }
}
function principal(url){
    $( location ).attr("href", url);
}
function error(seccion){
    var muestraNoticia = localStorage.getItem(seccion);
    if(muestraNoticia != null && muestraNoticia.length != 0){
        welcome("ERROR, contenido cargado de cache");
        muestraHTML(seccion, muestraNoticia);
    }else{
        $("#" + seccion).html("<h4>Se ha producido un error,vaya a la configuracion de la pagina para resolverlo.</h4>");
    }
}
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});
function welcome(mensaje) {
  if (!Notification) {
    alert('No tienes permisos para notificaciones.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('MyApp PWA', {
      icon: 'myapp.png',
      body: mensaje,
    });

    notification.onclick = function () {
      window.open("http://127.0.0.1:8887");      
    };
    
  }
}
function favorite(id,x,ideNoticia){
    //VARIABLE PARA EL NOMBRE DEL LOCALSTORAGE
    var notiFavorita = seccionFavorite[id];
    var seccion = cache[id];
    var object = localStorage.getItem(seccion);
    var types = JSON.parse(object);
    var titulo=types[x].tituloN;
    var descripcion=types[x].descripN;
    var enlace=types[x].enlace;
    var url = types[x].img;
    $("#"+ideNoticia).html("<div class='like'><div class='textoLike'><span class='glyphicon glyphicon-ok'></span><b> Añadida</b></div></div>");
    $("#"+ideNoticia).prop('onclick',null).off('click');
    var noticia = {
        id: ideNoticia,
        tituloN: titulo,
        descripN: descripcion,
        enlace:enlace,
        img: url
    };
    var oldItems = JSON.parse(localStorage.getItem(notiFavorita)) || [];
    var comprueboCache  = localStorage.getItem(notiFavorita);
    if(comprueboCache != null){
        oldItems.push(noticia);
        localStorage.setItem(notiFavorita, JSON.stringify(oldItems));
    }else{
        matFavoritas.push(noticia);
        var noticiaAGuardar = JSON.stringify(matFavoritas);
        localStorage.setItem(notiFavorita,noticiaAGuardar);
    }
}
function mostrarFavoritos(){
    for(var x=0;x<5;x++){
        var muestraNoticia = localStorage.getItem(seccionFavorite[x]);
        if(muestraNoticia!=null && muestraNoticia.length != 0){
             for(i=0;i<1;i++){
             if(muestraNoticia != null && muestraNoticia.length != 0){
                    var seccion = seccionFavorite[x];
                    var types = JSON.parse(muestraNoticia);
                    for(z=0;z<20;z++){
                        try{
                            var id = types[z].id;
                            var titulo = types[z].tituloN;
                            var descripcion=types[z].descripN;
                            var enlace=types[z].enlace;
                            var url = types[z].img;
                                $('#' + seccion).append("<div class='col-sm-12'><div class='col-sm-10 noticia'><b>" + titulo + "<br></b><div class='noticia1'>" + descripcion + "<div class='imagencita'><a href='" + enlace +"' target='_blank'><img class='leerMas' src='images/leer_mas.png'/></a></div></div></div><div class='col-sm-2'><img class='img-circle' src='" + url + "'/></div><a href='#' id='"+id+"' onclick='removeFavorite(`"+seccion+"`,`"+z+"`);' class='linked'><div class='like'><div class='textoLike'><span class='glyphicon glyphicon-remove'></span> Eliminar</div></div></a></div></div><br>");
                        }catch(err){
                            break;
                        }
                    }
                }
            }
        }else{
            contador++;
        }
    }
    if(contador == 5){
        //$( "body" ).append("<h4>No hay noticias añadidas a favoritos</h4>");
        $('#myModal').modal('show');
    }
}
function removeFavorite(seccion,id){
    var takeNoticia = JSON.parse(localStorage.getItem(seccion));
    takeNoticia.splice(id, 1);
    var noticiaAguardar = JSON.stringify(takeNoticia);
    localStorage.setItem(seccion,noticiaAguardar);
    
    if(takeNoticia.length == 0){
        localStorage.removeItem(seccion);
    }
    
    location.reload(); 
}