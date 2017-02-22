//Service Worker y mensajes push
/*if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
  console.log('◕‿◕', reg);
}, function(err) {
  console.log('ಠ_ಠ', err);
})
}*/
//var aleatorio = Math.round(Math.random()*50);
//POOOPUUPP Y COOKIE
comprovarPop();
function comprovarPop(){
    var x=document.cookie;
    if(x==""){
        muestraPop();
    }
}
function crearCookie(){
    var x=document.cookie = "visita=1; expires=Thu, 18 Dec 2050 12:00:00 UTC;path=/";
}
function muestraPop(){
   $(window).load(function(){
        $('#myModal').modal('show');
    });
}
// Hacer peticion y obtener el XML---------------------------
var div = ["Sucesos", "Internacional", "Politica","Economia","Deportes"];
var ids = ["suc","int","pol","eco","dep"];

function descargaArchivo(id,url,e) {
if(window.XMLHttpRequest) {
     peticionHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
    peticionHttp.open('GET',url, true);
    peticionHttp.send(null);
    peticionHttp.onreadystatechange = function (){
        if(peticionHttp.readyState == 4 && peticionHttp.status == 200) {
                //Creamos el objeto de tipo documento XML
                var documentoXml = peticionHttp.responseXML;
                var seccion = div[id];
                procesaContenido(seccion,documentoXml,id,e);
        }
    }    
}
function procesaContenido (seccion,documentoXml,id,e){
   var root = documentoXml.getElementsByTagName("channel")[0];
    var tope = root.getElementsByTagName("item").length;
    var contentList = [];
        //Recorremos todos los elementos del documento
        for(var i = 0; i < 2 ; i++){ 
            item = root.getElementsByTagName("item")[i]; 
            titulo = item.getElementsByTagName("title")[0].firstChild.nodeValue;
            try{
                descripcion = item.getElementsByTagName("description")[0].firstChild.nodeValue; 
            }catch(err){
                descripcion = " "; 
            }
            link = item.getElementsByTagName("link")[0].firstChild.nodeValue;
            try{
              url = item.getElementsByTagName("enclosure")[0].getAttribute('url');  
            }catch(err){
              url = "images/error.png";  
            }
               var noticia = {
                id: i,
                tituloN: titulo,
                descripN: descripcion,
                enlace:link,
                img: url
            };
            contentList.push(noticia);
    }    
        var noticiaAGuardar = JSON.stringify(contentList);
        localStorage.setItem(seccion, noticiaAGuardar);
        document.getElementById(id).disabled = true;
        crearCookie();
        if(e<3){
          muestraHTML(seccion, noticiaAGuardar);  
            
        }else{
           refreshHTML(seccion,noticiaAGuardar); 
        }
}
function gestionaNoticias(sec,opc){
   if(opc==1){
    if(sec=="Sucesos"){
        descargaArchivo(0,'http://www.lavanguardia.com/mvc/feed/rss/sucesos',3);
    }
    else if(sec=="Internacional"){
         descargaArchivo(1,'http://www.lavanguardia.com/mvc/feed/rss/internacional',3);
    }else if(sec=="Politica"){
        descargaArchivo(2,'http://www.lavanguardia.com/mvc/feed/rss/politica',3);
    }else if(sec=="Economia"){
        descargaArchivo(3,'http://www.lavanguardia.com/mvc/feed/rss/economia',3);
    }else if(sec=="Deportes"){
        descargaArchivo(4,'http://www.lavanguardia.com/mvc/feed/rss/deportes',3);
    }
   }else if(opc==2){
    var url = "index.html";
        if(sec=="Sucesos"){
            document.getElementById(0).disabled = false;
        }
        else if(sec=="Internacional"){
           document.getElementById(1).disabled = false;
        }else if(sec=="Politica"){
            document.getElementById(2).disabled = false;;
        }else if(sec=="Economia"){
            document.getElementById(3).disabled = false;
        }else if(sec=="Deportes"){
            document.getElementById(4).disabled = false;
        }
      localStorage.removeItem(sec);
      $( location ).attr("href", url);
   }  
}
function muestraHTML(seccion, contentList){
    var o = "pp";
    if (seccion != null && seccion.length != 0 && contentList != null && contentList.length != 0) {
        var idContainer = document.getElementById(seccion);
        if (idContainer != null) {
            //TODO generar html y pintar en el id
              $('#' + seccion).append("<br><p class='shadow text1'>"+seccion+"</p><br><br>");
            var types = JSON.parse(contentList);
            for(x=0; x<2; x++) {
                var titulo=types[x].tituloN;
                var descripcion=types[x].descripN;
                var enlace=types[x].enlace;
                var url = types[x].img;
                $('#' + seccion).append("<div class='col-sm-12'><div class='col-sm-10 noticia'><b>" + titulo + "<br></b><div class='noticia1'>" + descripcion + "<div class='imagencita'><a href='" + enlace +"' target='_blank'><img class='leerMas' src='images/leer_mas.png'/></a></div></div></div><div class='col-sm-2'><img class='img-circle' src='" + url + "'/></div>"+ "<div class='fb-share-button' data-href='" + enlace + "' data-layout='button_count's></div>" + "<div class='tweet'><a class='twitter-share-button' href='https://twitter.com/intent/tweet'  data-size='default' data-text='" + descripcion + "' data-url='"+ enlace +"' data-hashtags='lavanguardia,MyAppPWA' data-via='LaVanguardia' data-related='twitterapi,twitter'>Tweet</a></div>"+"</div><br>");
            }
        }
    }
   
}
function refreshHTML(seccion,contentList){
  $('#' + seccion).html("<a class='linked' href='#popupCloseRight' data-rel='popup' data-role='button' data-inline='true' data-position-      to='origin'>" + seccion + "</a><hr>" 
  ); 
   var types = JSON.parse(contentList);
            for(x=0; x<2; x++) {
                var titulo=types[x].tituloN;
                var descripcion=types[x].descripN;
                var enlace=types[x].enlace;
                var url = types[x].img;
                       $('#' + seccion).append("<div class='g_noticia'><div class='noticia'><b>" + titulo + "<br></b>" +   descripcion +  "<a href='" + enlace +"' target='_blank'>Leer mas</a></div><img class='imagen' src='" + url + "'/>" + "<div class='fb-share-button' data-href='" + enlace + "' data-layout='button_count's></div>" + "<div class='tweet'><a class='twitter-share-button' href='https://twitter.com/intent/tweet'  data-size='default' data-text='" + descripcion + "' data-url='"+ enlace +"' data-hashtags='LaVanguardia,MyAppPWA' data-via='LaVanguardia' data-related='twitterapi,twitter'>Tweet</a></div>");
            }
            $( location ).attr("href", "index.html");
}
function principal(url){
    $( location ).attr("href", url);
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
function error(seccion){
    var muestraNoticia = localStorage.getItem(seccion);
    if(muestraNoticia != null && muestraNoticia.length != 0){
        welcome("ERROR, contenido cargado de cache");
        muestraHTML(seccion, muestraNoticia);
    }else{
        $("#" + seccion).html("<h4>Se ha producido un error,vaya a la configuracion de la pagina para resolverlo.</h4>");
    }  
}
