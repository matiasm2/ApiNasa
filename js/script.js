function mostrarResultado(){
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
        if (recurso.data[0].media_type=='image'){
          var p = '<h3>Titulo: '+recurso.data[0].title+'</h3>';
          p += '<img src='+recurso.links[0].href+' alt='+recurso.data[0].title+' width=100%>';
          p += '<br><br>';
          $(p).appendTo('#resultados');
        } if (recurso.data[0].media_type=='video'){
          var p = '<h3>Titulo: '+recurso.data[0].title+'</h3>';
          getUrlVideo(recurso.data[0].nasa_id);
          p +='<iframe id="'+recurso.data[0].nasa_id+'" type="text/html" width="100%"></iframe>';
          p += '<br><br>';
          $(p).appendTo('#resultados');
        }
      });
    }
  });
}

function getUrlVideo(nasa_id){
  var url = 'https://images-api.nasa.gov/asset/'+nasa_id;
  var urlVideo = "";
  $.ajax({
    url: url,
    success: function(result){
      urlVideo = result.collection.items[1].href;
      $('#'+nasa_id).attr('src',urlVideo);
    }
  });
  return urlVideo;
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
