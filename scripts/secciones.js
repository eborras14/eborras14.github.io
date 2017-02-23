//Arrays para localstorage
var div = ["Sucesos", "Internacional", "Politica","Economia","Deportes"];
var cache = ["Sucesos1", "Internacional1", "Politica1","Economia1","Deportes1"];
var seccionFavorite = ["suc","inte","pol","","dep"];
var matFavoritas = [];
var contador = 0;
//Carga de cada una de las secciones de la pagina
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
//Obtiene el documento y lo descarga
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
//Recoje el contenido del XML y lo almacena en variables
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
                url = "../images/error.png";
            }
            //Crea el objeto para guardar en el array   
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
        //Guarda el array de objetos en el localstorage
        localStorage.setItem(guardo, noticiaAGuardar);
        muestraHTML(seccion, noticiaAGuardar,id);       
}
//Modela los datos y los printa en html
function muestraHTML(seccion, contentList,id){
        var types = JSON.parse(contentList);
        for(x=0; x<20; x++) {
                var ideNoticia=types[x].id;
                var titulo=types[x].tituloN;
                var descripcion=types[x].descripN;
                var enlace=types[x].enlace;
                var url = types[x].img;
                  $('#' + seccion).append("<div class='col-sm-12'><div class='col-sm-10 noticia'><b>" + titulo + "<br></b><div class='noticia1'>" + descripcion + "<div class='imagencita'><a href='" + enlace +"' target='_blank'><img class='leerMas' src='images/leer_mas.png'/></a></div></div></div><div class='col-sm-2'><img class='img-circle' src='" + url + "'/></div><a href='#' id='"+ideNoticia+"' class='linked' onclick='favorite("+id+","+x+",`"+ideNoticia+"`);'><div class='like'><div class='textoLike'><span class='glyphicon glyphicon-heart'></span> Añadir</div></div></a></div><br>");
                
        }
        // VERIFICA QUE NOTICIAS CONSTAN COMO AÑADIDAS A FAVORITOS Y BLOQUEA LA OPCION DE AÑADIRLAS D NUEVO
        var posicion = cache.indexOf(seccion);
        var cacheFavorite = localStorage.getItem(seccionFavorite[posicion]);
        var contentParse =  JSON.parse(cacheFavorite);
        //Comprueba si una noticia ha sido añadida a favoritos
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
//Redirige a la pagina que le pases por parametro
function principal(url){
    $( location ).attr("href", url);
}
//Notificacion de error
function error(seccion){
    var muestraNoticia = localStorage.getItem(seccion);
    if(muestraNoticia != null && muestraNoticia.length != 0){
        welcome("ERROR, contenido cargado de cache");
        muestraHTML(seccion, muestraNoticia);
    }else{
        $("#" + seccion).html("<h4>Se ha producido un error,vaya a la configuracion de la pagina para resolverlo.</h4>");
    }
}
//Comprobaciones para permitir las notificaciones push "Locales"
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
      icon: '../images/myapp.png',
      body: mensaje,
    });

    notification.onclick = function () {
      window.open("http://127.0.0.1:8887");      
    };
    
  }
}
//Añade una noticia al localstorage para luego tratarla como una noticia favorita
function favorite(id,x,ideNoticia){
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
    //Obtiene el contenido de la cache
    var oldItems = JSON.parse(localStorage.getItem(notiFavorita)) || [];
    var comprueboCache  = localStorage.getItem(notiFavorita);
    //Si hay contenido lo añade al array para guardarlo con el contenido nuevo
    if(comprueboCache != null){
        oldItems.push(noticia);
        localStorage.setItem(notiFavorita, JSON.stringify(oldItems));
    //Si no hay contenido se guarda el contenido nuevo en el localstorage directamente
    }else{
        matFavoritas.push(noticia);
        var noticiaAGuardar = JSON.stringify(matFavoritas);
        localStorage.setItem(notiFavorita,noticiaAGuardar);
    }
}
//Muestra las noticias favoritas 
function mostrarFavoritos(){
    //Recorre las 5 secciones posibles para añadir a favoritas
    for(var x=0;x<5;x++){
        var muestraNoticia = localStorage.getItem(seccionFavorite[x]);
        //Si la seccion no es nula lee todo su contenido
        if(muestraNoticia!=null && muestraNoticia.length != 0){
             for(i=0;i<1;i++){
             //Vuelve a comprobar que no sea nula la informacion
             if(muestraNoticia != null && muestraNoticia.length != 0){
                    //Parsea los objetos JSON
                    var seccion = seccionFavorite[x];
                    var types = JSON.parse(muestraNoticia);
                    //Los almacena en variables y los muestra
                    for(z=0;z<20;z++){
                        //En el caso que no encuentre noticia saltara un error y entonces se rompera el bucle
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
        //Va sumando al contador si las secciones de favoritas son nulas
        }else{
            contador++;
        }
    }
    //En el caso que el contador llegue a 5 salta una notificación y entiende que todas las secciones son nulas
    if(contador == 5){
        $('#myModal').modal('show');
    }
}
//Elimina una noticia añadida a favoritas
function removeFavorite(seccion,id){
    //Obtiene el objeto de la cache
    var takeNoticia = JSON.parse(localStorage.getItem(seccion));
    //Con el id pasado por parametro se borra la noticia
    takeNoticia.splice(id, 1);
    var noticiaAguardar = JSON.stringify(takeNoticia);
    //Volvemos a guardar el contenido actualizado en cache
    localStorage.setItem(seccion,noticiaAguardar);
    //Si el registro no contiene nada se borra todo el registro de la cache
    if(takeNoticia.length == 0){
        localStorage.removeItem(seccion);
    }
    
    location.reload(); 
}