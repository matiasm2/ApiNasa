function mostrarResultado(){
  var url = "https://images-api.nasa.gov/search?q=";
  generarUrl();


}

function generarUrl(){
  var url = "https://images-api.nasa.gov/search?q=";
  var texto = $('#texto').val();
  if (texto){
    url += texto+'&media_type='+$('#media_type').val();
    console.log(url);
    var p = '<p>'+url+'</p>';
    $(p).appendTo('#resultados');
    $('.texto').hide();
    $('.formulario').hide();
    $('#reintentar').show();

  } else {
    console.log('No ha ingresado el texto a buscar.');
    $('#texto').focus();
  }
}

function restaurar(){
  $('.formulario').show();
  $('#reintentar').hide();
}
