/*
Vista de contacto.
Menu.
Filtro fecha, APOD
Agregar mas info a los recursos (autor y palabras claves)
Enlazar palabras claves a nuevas consultas.
Paginacion.
Envio de correo.

*/

function mostrarResultado(){
  if(validarCampo()){
    generarConsulta($('#texto').val());
  }
}
function mostrarResultadoAPOD(){
    generarConsultaAPOD('hoy');
}

function ejecutarConsultaAPOD(url){

  console.log(url);

  $.ajax({
    url: url,
    success: function(result){

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

function agregarImg(titulo, autor, enlace){
  var p = '<h3>Titulo: '+titulo+'</h3>';
  p += '<h4>Autor: '+autor+'</h4>';
  p += '<img src='+enlace+' alt='+titulo+' width=100%>';
  $(p).appendTo('#resultados');
}

function agregarVideo(titulo, autor, nasa_id){
  var p = '<h3>Titulo: '+titulo+'</h3>';
  p += '<h4>Autor: '+autor+'</h4>';
  p +='<iframe id="'+nasa_id+'" type="text/html" width="100%"></iframe>';
  $(p).appendTo('#resultados');
  agregarUrlVideo(nasa_id);
}

function agregarCompartir(nasa_id){
  var input = '<input type="hidden" name="nasa_id" value="'+nasa_id+'">'
  var boton = '<button type="submit">Compartir</button>';
  var form = '<form action="compartir.html" method="get">'+input+boton+'</form>';
  $(form).appendTo('#resultados');
}

function agregarCompartirAPOD(fecha){
  var input = '<input type="hidden" name="fecha" value="'+fecha+'">'
  var boton = '<button type="submit">Compartir</button>';
  var form = '<form action="compartir.html" method="get">'+input+boton+'</form>';
  $(form).appendTo('#resultados');
}

function agregarEtiquetas(keywords){
  var msg = '<p>Mas imagenes acerca:</p>'
  $(msg).appendTo('#resultados');
  keywords.forEach(function(item){
    var func = "generarConsulta('";
    func += item + "');";
    var etiqueta = '<a href="#" onclick="'+func+'">'+item+'</a>';
    $(etiqueta).appendTo('#resultados');
  });
  var linea = '<hr width="75%">';
  linea += '<br>';
  $(linea).appendTo('#resultados');
}

function ejecutarConsulta(url){
  $.ajax({
    url: url,
    success: function(result){
      result.collection.items.forEach(function(recurso){
        if (recurso.data[0].media_type=='image'){
          agregarImg(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.links[0].href);
          agregarCompartir(recurso.data[0].nasa_id);
          agregarEtiquetas(recurso.data[0].keywords);
        } if (recurso.data[0].media_type=='video'){
          agregarVideo(recurso.data[0].title, recurso.data[0].secondary_creator, recurso.data[0].nasa_id);
          agregarCompartir(recurso.data[0].nasa_id);
          agregarEtiquetas(recurso.data[0].keywords);
        }
      });
    }
  });
}

function enviarMail() {
  var mailto = 'mailto:'+$('#email').val();
  mailto += '?subject=Mira esta imagen de la nasa';
  if (getParameterByName('nasa_id')){
    mailto += '&body=vermedia.html?nasa_id='+getParameterByName("nasa_id");
  } else {

    mailto += '&body=vermedia.html?fecha='+getParameterByName('fecha');
  }
  $('<a href="' + mailto + '">click</a> id="correo"').appendTo('.contenido');
  $('#correo').click();
  $('#correo').remove();

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
  var url = "https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";
  if ($('#hdchk').is(':checked')){
    url += '&hd=true';
  } if ($('fecha').val() != undefined){
    url += '$date='+$('fecha').val();
  } if (fecha != 'hoy') {
    url += '&date='+fecha;
  }

  console.log(url);
  ejecutarConsultaAPOD(url);
  $('.texto').hide();
  $('#resultados').html('');
  $('.formulario').hide();
  $('#reintentar').show();
}

function restaurar(){
  $('#resultados').html('');
  $('.formulario').show();
  $('#reintentar').hide();
}

function getParameterByName(name) {
 return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function() {
    if (getParameterByName("nasa_id")){
      console.log('nasa_id: '+getParameterByName("nasa_id"));
      generarConsulta(getParameterByName("nasa_id"));
    } if (getParameterByName('fecha')){
      generarConsultaAPOD(getParameterByName('fecha'));
    }
});
