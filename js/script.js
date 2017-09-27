
function mostrarResultado(){
  var url = "https://images-api.nasa.gov/search?q=";
  generarUrl();
}

function ejecutarConsulta(url){
  $.ajax({
    url: url,
    success: function(result){
      //console.log(result);
      //console.log(JSON.stringify(result));
      result.collection.items.forEach(function(recurso){
        //console.log(recurso);
        var p = '<h3>Titulo: '+recurso.data[0].title+'</h3>';
        p += '<h3>nasa_id: '+recurso.data[0].nasa_id+'</h3>';
        p += '<img src='+recurso.links[0].href+' alt='+recurso.data[0].title+' width=100%>';
        p += '<br><br>';
        $(p).appendTo('#resultados');
      });
    }
  });
}

function generarUrl(){
  var url = "https://images-api.nasa.gov/search?q=";
  var texto = $('#texto').val();
  if (texto){
    url += texto+'&media_type='+$('#media_type').val();
    console.log(url);
    ejecutarConsulta(url);
    $('.texto').hide();
    $('.formulario').hide();
    $('#reintentar').show();

  } else {
    console.log('No ha ingresado el texto a buscar.');
    $('#texto').focus();
  }
}

function restaurar(){
  $('#resultados').html('');
  $('.formulario').show();
  $('#reintentar').hide();
}
