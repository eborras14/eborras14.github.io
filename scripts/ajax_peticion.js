    $(document).ready(function(){
    //Funcion que comprueba si hay conexion a internet si la hay muestra contenido de internet sino muestra contenido de cache si esque hay
    status = navigator.onLine;
      if(status=="true"){
          for(i=0;i<div.length;i++){
            seccion=div[i];
            var muestraNoticia = localStorage.getItem(seccion);
            if(muestraNoticia != null && muestraNoticia.length != 0){
                document.getElementById(i).disabled = true;
                muestraHTML(seccion, muestraNoticia);
            }
        }
        }else if(status=="false"){
        welcome("Sin conexion");
         $(".enabledDisabled").hide();
          $(".subscription-details").hide();

         for(i=0;i<div.length;i++){
            seccion=div[i];
            var muestraNoticia = localStorage.getItem(seccion);
            if(muestraNoticia!=null){
                document.getElementById(i).disabled = true;
                muestraHTML(seccion, muestraNoticia);
            }
        }              
      }
//Popover de cada seccion-----------------------------
    $('[data-toggle="popover"]').popover();  
//---------------Facebook ---------------------------
(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.8&appId=351755105201498";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
//TWITTER --------------------------------------
    window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
  return t;
}(document, "script", "twitter-wjs"));
        
comprovarPop();
        
//Comprovamos si esta la session iniciada
var x = document.cookie;
var n = x.search("session=true");
var str = x.slice(n, x.length);
if(str=="session=true"){
        $("#isAdmin").css({"display": "initial"});
        $("#adminFooter").css({"display": "inherit"});
        $("#isLogin").css({"display": "none"});     
}

});
 

//Comprobación si hay cookie creada, para saber si es la primera vez que entras
function comprovarPop(){
    var x=document.cookie;
    if(x==""){
        muestraPop();
    }
}
//Crea la cookie si no esta creada
function crearCookie(){
    var x=document.cookie = "visita=1; expires=Thu, 18 Dec 2050 12:00:00 UTC;path=/";
}
//Muestra el pop-up de configuracion de la pagina
function muestraPop(){
   $(window).load(function(){
        $('#myModal').modal('show');
    });
}
//Arrays para las secciones de la pantalla principal
var div = ["Sucesos", "Internacional", "Politica","Economia","Deportes"];
var ids = ["suc","int","pol","eco","dep"];
//Hace la petición a la URL pasada por parametro
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
//Recoge los valores del XML y crea objetos noticia añadiendolos a un array
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
//Gestiona los botones de actualizar y de eliminar las noticias principales en index.html
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
//Printa toda la informacion almacenada en los objetos y las formata en HTML
function muestraHTML(seccion, contentList){
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
//Redirecciona a la pagina que le pases por parametro
function principal(url){
    $( location ).attr("href", url);
}        
// Notificaciones
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
//Funcion generalizada para los errores.
function error(seccion){
    var muestraNoticia = localStorage.getItem(seccion);
    if(muestraNoticia != null && muestraNoticia.length != 0){
        welcome("ERROR, contenido cargado de cache");
        muestraHTML(seccion, muestraNoticia);
    }else{
        $("#" + seccion).html("<h4>Se ha producido un error,vaya a la configuracion de la pagina para resolverlo.</h4>");
    }  
}
//Funcion que gestiona el panel de administración
function adminPanel(id){
    if(id==1){
        localStorage.clear();
    }else if(id==2){
        var cookies = document.cookie.split(";");
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }else if(id==3){
        location.reload();
    }else if(id==4){
        var usuario = $("#usr").val();
        var password = $("#pwd").val();
        
        //Comprueba si soporta Web SQL
        if (window.openDatabase) {
            //Creamos la base de datos  
            var mydb = openDatabase("users_db", "0.1", "BBDD para administracion", 1024 * 1024);

            //creamos la tabla
            mydb.transaction(function (t) {
                t.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY ASC, usuario TEXT, password TEXT)");  
            });
            if (mydb) {
                //Comprueba si hay usuarios en la BBDD
                  mydb.transaction(function (t) {
                    t.executeSql("SELECT count(*) as contador FROM users", [], function(transaction, result){
                        var row = result.rows.item(0);
                        var filas = row.contador;
                        filas = parseInt(filas);
                        if(filas==0){
                            mydb.transaction(function (t) {
                                t.executeSql("INSERT INTO users (usuario, password) VALUES (?, ?)", ["admin","admin"]);
                                console.log("INSERT OK");
                                resultsDB(usuario,password);
                            });  
                        }else{
                            //Comprabacion si tienen contenido
                            if (usuario !== "" && password !== "") {
                                resultsDB(usuario,password);
                            } else {
                                alert("Introduce usuario/contraseña");
                            } 
                        }
                         
                    });
            });
            }else {
                    alert("Base de datos no soportada");
            }
        } else {
            alert("WebSQL no soportado");
        }
    }else if(id==5){
        document.cookie = "session=false;";
        $("#isAdmin").css({"display": "none"});
        $("#adminFooter").css({"display": "none"});
        $("#isLogin").css({"display": "inherit"});
    }
}
//Comprueba si el usuario que ha hecho login es el mismo que el de la BBDD
function resultsDB(usuario,password){
    var mydb = openDatabase("users_db", "0.1", "BBDD para administracion", 1024 * 1024);
        if (mydb) {
            mydb.transaction(function (t) {
                t.executeSql("SELECT * FROM users", [], function(transaction, result){
                                                        for (var i=0; i < result.rows.length; i++) { 
                                                            var row = result.rows.item(i);
                                                            if(row.usuario!="" && row.password !=""){
                                                                if(row.usuario==usuario && row.password==password){
                                                                    $("#isAdmin").css({"display": "initial"});
                                                                    $("#adminFooter").css({"display": "inherit"});
                                                                    $("#isLogin").css({"display": "none"});
                                                                    $("#contraseña").removeClass( "form-group has-error has-feedback" ).addClass( "form-group" );
                                                                    $("#usuario").removeClass( "form-group has-error has-feedback" ).addClass( "form-group" );
                                                                    document.cookie = "session=true";
                                                                    
                                                                    }else{
                                                                        if(row.password!=password){
                                                                            $("#contraseña").removeClass( "form-group" ).addClass( "form-group has-error has-feedback" );
                                                                            $("#pwd").val("");
                                                                            $("#pwd").attr("placeholder", "Contraseña incorrecta");
                                                                        }   
                                                                        if(row.usuario!=usuario){
                                                                            $("#usuario").removeClass( "form-group" ).addClass( "form-group has-error has-feedback" );
                                                                            $("#usr").val("");
                                                                            $("#usr").attr("placeholder", "Usuario incorrecto");
                                                                        }
                                                                    
                                                                }
                                                            }
                                                        }
                                                        });
            });
         
        }else {
            alert("Error al acceder a la base de datos");
        }
}