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

function agregarImg(titulo, enlace){
  var p = '<h3>Titulo: '+titulo+'</h3>';
  p += '<img src='+enlace+' alt='+titulo+' width=100%>';
  p += '<br><br>';
  $(p).appendTo('#resultados');
}

function agregarVideo(titulo, nasa_id){
  var p = '<h3>Titulo: '+titulo+'</h3>';
  p +='<iframe id="'+nasa_id+'" type="text/html" width="100%"></iframe>';
  p += '<br><br>';
  $(p).appendTo('#resultados');
  agregarUrlVideo(nasa_id);
}

function agregarEtiquetas(keywords){
  keywords.forEach(function(item){
    var func = "generarConsulta('";
    func += item + "');";
    var etiqueta = '<a href="#" onclick="'+func+'"">'+item+'</a>';
    $(etiqueta).appendTo('#resultados');
    console.log(item);
  });
}

function ejecutarConsulta(url){
  $.ajax({
    url: url,
    success: function(result){
      result.collection.items.forEach(function(recurso){
        if (recurso.data[0].media_type=='image'){
          agregarImg(recurso.data[0].title, recurso.links[0].href);
          agregarEtiquetas(recurso.data[0].keywords);
        } if (recurso.data[0].media_type=='video'){
          agregarVideo(recurso.data[0].title, recurso.data[0].nasa_id);
          agregarEtiquetas(recurso.data[0].keywords);
        }
      });
    }
  });
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
  url += texto+'&media_type='+$('#media_type').val();
  console.log(url);
  ejecutarConsulta(url);
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
