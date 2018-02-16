/*
Vista de contacto.
Menu.
Filtro fecha, APOD
Agregar mas info a los recursos (autor y palabras claves)
Enlazar palabras claves a nuevas consultas.
Paginacion.
Envio de correo.

*/

function cargarMapa(){
      var laplata = {lat: -34.933333333333, lng: -57.95};
      var map = new google.maps.Map(document.getElementById('posicion'), {
        zoom: 15,
        center: laplata
      });
      var marker = new google.maps.Marker({
        position: laplata,
        map: map,
        title: 'Nosotros'
      });
}

function cargarMapaGeo() {
        var map = new google.maps.Map(document.getElementById('posicion'), {
          center: {lat: -34.933333333333, lng: -57.95},
          zoom: 6
        });
        var infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }


function mostrarResultado(){
  if(validarCampo()){
    generarConsulta($('#texto').val());

  }
}

function mostrarResultadoAPOD(){
    generarConsultaAPOD('hoy');
}

function agregarHistorial(){
    if (localStorage.getItem('lStorage')){
      var lStorage = JSON.parse(localStorage.getItem('lStorage'));
      //console.log(lStorage);

      var msg = '<h4>Ultimas consultas:</h4>'
      $(msg).appendTo('.historial');
      lStorage.busquedas.forEach(function(item){
        //console.log(item);
        var func = "generarConsulta('";
        func += item.texto + "');";
        var etiqueta = '<a href="#" onclick="'+func+'">'+item.texto+'</a>';
        $(etiqueta).appendTo('.historial');
      });


      var boton = '<button type="button" onclick="reiniciarLocalStorage()">Borrar historial</button>';
      $(boton).appendTo('.historial');
    }
}


function consultarLocalStorage(texto, apod){
    if (localStorage.getItem('lStorage')){
      var busqueda = {
        texto : texto,
        apod : apod
      }

      var lStorage = JSON.parse(localStorage.getItem('lStorage'));
      lStorage.busquedas.push(busqueda);
      //console.log(lStorage);
      localStorage.setItem('lStorage', JSON.stringify(lStorage));

    } else {
      var busqueda = {
        texto : texto,
        apod : apod
      }
      var lStorage = {
        busquedas : [busqueda]
      }
      localStorage.setItem('lStorage', JSON.stringify(lStorage));
    }
}

function reiniciarLocalStorage() {
  $('.historial').html('');
  localStorage.removeItem('lStorage');

}

function ejecutarConsultaAPOD(url){

  console.log(url);

  $.ajax({
    url: url,
    success: function(result){
      //consultarLocalStorage(result.date, true);
      var p = '<h3>Titulo: '+result.title+'</h3>';
      if(result.media_type == "video") {
        p +='<iframe src='+result.url+' type="text/html" width="100%"></iframe>';
      }
      else {
        p += '<img src='+result.url+' alt='+result.title+' width=100%>';
      }
      p += '<p>'+result.explanation+'</p>'
      $(p).appendTo('#resultados');
      agregarCompartirAPOD(result.date);
      $('.texto').hide();
      $('.formulario').hide();
      $('#reintentar').show();
    }
  });
}

function agregarImg(titulo, autor, enlace, nasa_id){
  var p = '<h3>'+titulo+' - '+autor+'</h3>';
  /*  var p = '<h3>Titulo: '+titulo+'</h3>';
  p += '<h4>Autor: '+autor+'</h4>';*/
  p += '<img src='+enlace+' alt='+titulo+' width=100%>';
  var tags = '<div class="tag'+nasa_id+'"></div>';
  var div = '<div class="elemento">'+p+tags+'</div>';
  $(div).appendTo('#resultados');
}

function agregarVideo(titulo, autor, nasa_id){
  var p = '<h3>Titulo: '+titulo+'</h3>';
  p += '<h4>Autor: '+autor+'</h4>';
  p +='<iframe id="'+nasa_id+'" type="text/html" width="100%"></iframe>';
  var tags = '<div class="tag'+nasa_id+'"></div>';
  var div = '<div class="elemento">'+p+tags+'</div>';
  $(div).appendTo('#resultados');
  agregarUrlVideo(nasa_id);
}

function agregarPrecio(nasa_id, title){
  var input = '<input type="hidden" name="nasa_idc" value="'+nasa_id+'">'
  var input2 = '<p>Precio $'+ (title.length * 10).toString() +'</p>'
  var boton = '<button class="btncompartir" type="submit">Agregar al carro</button>';
  var form = '<form action="carrito.html" method="get">'+input+input2+boton+'</form>';
  $(form).appendTo('.tag'+nasa_id);
}

function agregarCompartir(nasa_id){
  var input = '<input type="hidden" name="nasa_id" value="'+nasa_id+'">'
  var boton = '<button class="btncompartir" type="submit">Compartir</button>';
  var form = '<form action="compartir.html" method="get">'+input+boton+'</form>';
  $(form).appendTo('.tag'+nasa_id);
}

function agregarCompartirAPOD(fecha){
  var input = '<input type="hidden" name="fecha" value="'+fecha+'">'
  var boton = '<button class="btncompartir" type="submit">Compartir</button>';
  var form = '<form action="compartir.html" method="get">'+input+boton+'</form>';
  $(form).appendTo('#resultados');
}

function agregarEtiquetas(nasa_id, keywords){
  var msg = '<p class="masimg" >Mas imagenes acerca:</p>'
  $(msg).appendTo('.tag'+nasa_id);
  keywords.forEach(function(item){
    var func = "generarConsulta('";
    func += item + "');";
    var etiqueta = '<a href="#" onclick="'+func+'">'+item+'</a>';
    $(etiqueta).appendTo('.tag'+nasa_id);
  });
}

function agregarBtnBuscarMas(url){
  var js = "javascript:buscarMas('"+url+"')";
  var boton = '<button type="button" onclick="'+js+'">Buscar Mas</button>';
  $(boton).appendTo('#resultados');
}

function buscarMas(url){
  $.ajax({
    url: url,
    success: function(result){
      result.collection.items.forEach(function(recurso){
          if (recurso.data[0].media_type=='image'){
            agregarImg(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.links[0].href, recurso.data[0].nasa_id);
            agregarCompartir(recurso.data[0].nasa_id);
            agregarEtiquetas(recurso.data[0].nasa_id, recurso.data[0].keywords);
          } if (recurso.data[0].media_type=='video'){
            agregarVideo(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.data[0].nasa_id);
            agregarCompartir(recurso.data[0].nasa_id);
            agregarEtiquetas(recurso.data[0].nasa_id, recurso.data[0].keywords);
          }
      });
      $('.historial').html('');
    }
  });
}

function ejecutarConsulta(url){
  $.ajax({
    url: url,
    success: function(result){
      var contador = 0
      result.collection.items.forEach(function(recurso){
        if (contador < 10){
          if (recurso.data[0].media_type=='image'){
            agregarImg(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.links[0].href, recurso.data[0].nasa_id);
            agregarPrecio(recurso.data[0].nasa_id, recurso.data[0].title);
            agregarCompartir(recurso.data[0].nasa_id);
            agregarEtiquetas(recurso.data[0].nasa_id, recurso.data[0].keywords);
          } if (recurso.data[0].media_type=='video'){
            agregarVideo(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.data[0].nasa_id);
            agregarCompartir(recurso.data[0].nasa_id);

            agregarPrecio(recurso.data[0].nasa_id);
            agregarEtiquetas(recurso.data[0].nasa_id, recurso.data[0].keywords);
          }
          contador++;
        }
      });
      if (contador = 10){
        agregarBtnBuscarMas(url);
      }

      $('.historial').html('');
    }
  });
}

function enviarMail() {
  var mailto = 'mailto:'+$('#email').val();
  mailto += '?subject=Mira esta imagen de la nasa';
  var msg = '';
  if ($('#nombre').val() != ""){
    msg += $('#nombre').val() + 'o ';
  }
  msg += $('#emisor').val() + ' te ha recomendado que veas este multimedia:';
  if (getParameterByName('nasa_id')){
    mailto += '&body='+msg+' vermedia.html?nasa_id='+getParameterByName("nasa_id");
  } else {

    mailto += '&body='+msg+' vermedia.html?fecha='+getParameterByName('fecha');
  }
  //$('<a href="' + mailto + '">click</a> id="correo"').appendTo('.contenido');
  window.location.assign(mailto);

}

function agregarUrlVideo(nasa_id){
  var url = 'https://images-api.nasa.gov/asset/'+nasa_id;
  var urlVideo = "";
  $.ajax({
    url: url,
    success: function(result){
      urlVideo = result.collection.items[1].href;
      $('#'+nasa_id).attr('src',urlVideo);
    }
  });
}

function validarCampo(){
  if($('#texto').val()){
    return true
  }
  alert("No ha ingresado un parametro en el campo de texto.");
  $('#texto').focus();
  return false;
}

function generarConsulta(texto){
  var url = "https://images-api.nasa.gov/search?q=";
  console.log()
  consultarLocalStorage(texto, false);
  if ($('#media_type').val() != undefined){
    url += texto+'&media_type='+$('#media_type').val();
  } else {
    url += texto;
  }
  console.log(url);
  ejecutarConsulta(url);
  $('.texto').hide();
  $('#resultados').html('');
  $('.formulario').hide();
  $('#reintentar').show();
}

function generarConsultaAPOD(fecha){
  var url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
  if ($('#hdchk').is(':checked')){
    url += '&hd=true';
  } if ($('fecha').val() != undefined){
    url += '$date='+$('fecha').val();
  } if (fecha != 'hoy') {
    url += '&date='+fecha;
  }

  console.log(url);
  ejecutarConsultaAPOD(url);
  $('.historial').html('');
  $('.texto').hide();
  $('#resultados').html('');
  $('.formulario').hide();
  $('#reintentar').show();
}

function restaurar(){
  $('#resultados').html('');
  $('.formulario').show();
  $('#reintentar').hide();
  agregarHistorial();
}

function getParameterByName(name) {
 return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function() {
    agregarHistorial();
    if (getParameterByName("nasa_id")){
      console.log('nasa_id: '+getParameterByName("nasa_id"));
      generarConsulta(getParameterByName("nasa_id"));
    } if (getParameterByName('fecha')){
      generarConsultaAPOD(getParameterByName('fecha'));
    }
});
