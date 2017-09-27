function mostrarmsj(){
  $('<p>Hola grupoo</p>').appendTo('#resultados');
  $('.texto').hide();
  $('.formulario').hide();
  $('#reintentar').show();

}

function restaurar(){
  $('.formulario').show();
  $('#reintentar').hide();
}
