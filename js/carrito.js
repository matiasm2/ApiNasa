$(document).ready(function() {
    loadCart();
    nasa_id = '';
    $('.nuevoitem').hide();
    if (getParameterByName("nasa_idc")){
      nasa_id = getParameterByName("nasa_idc");
      resource = getResource(nasa_id);
      setNewItem(resource)
      $('.nuevoitem').show();
    }



    $('#btn-add2cart').click(function (){
      add2Cart(nasa_id, $('#cant').val());
    });


});

function add2Cart(nasa_idc, cant){
      if (localStorage.getItem('cart') && localStorage.getItem('cart').length > 0){
      var item = {
        nasa_idc : nasa_idc,
        cant : cant
      }

      var cart = JSON.parse(localStorage.getItem('cart'));
      var isIn = false;
      cart.items.forEach(function(i){
        if(i.nasa_idc == item.nasa_idc){
          i.cant = item.cant;
          isIn = true;
        }
      });
      if (!isIn){
        cart.items.push(item);
      }
      //console.log(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location = "carrito.html";

    } else {
      var item = {
        nasa_idc : nasa_idc,
        cant : cant
      }
      var cart = {
        items : [item]
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location = "carrito.html";
    }
}

function loadCart(){
  var total = 0;
  if (localStorage.getItem('cart')){
    var cart = JSON.parse(localStorage.getItem('cart'));
    cart.items.forEach(function(i){
        resource =  getResource(i.nasa_idc);
        row = createRow(resource, i.cant);
        $(row).appendTo('#cart')
        total += resource.data[0].title.length*10*parseInt(i.cant);
      })
    };
  totalRow = '<tr>'+
              '<td>Total</td>'+
              '<td>$'+total.toString()+'</td>'+
              '<td></td>'+
              '<td><button>Pagar</button></td>'+
            '</tr>';
  $(totalRow).appendTo('#cart')

}

function deleteFromCart(nasa_idc){
  if (localStorage.getItem('cart')){
    var cart = JSON.parse(localStorage.getItem('cart'));
    var items = [];
    cart.items.forEach(function(i){
      if(i.nasa_idc == nasa_idc){
      } else{
        items.push(i);
      }
    });
    cart.items = items;
    //console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location = "carrito.html?nasa_idc="+nasa_idc;

  }
}

function createRow(resource, cant){
  return '<tr>'+
              '<td>'+
                '<img class="thumb" src="'+resource.links[0].href+'" alt="thumb'+resource.data[0].nasa_id+'">'+
              '</td>'+
              '<td>$'+(resource.data[0].title.length*10).toString()+'</td>'+
              '<td>'+cant+'</td>'+
              '<td><button type="submit" onclick="deleteFromCart(\''+resource.data[0].nasa_id+'\')">Borrar</button></td>'+
            '</tr>'
}

function getResource(nasa_id){
  var url = "https://images-api.nasa.gov/search?q="+nasa_id;
  var resource;
  $.ajax({
    url: url,
    async: false,
    success: function(result){
      resource = result.collection.items[0];
    }
  });
  return resource;
}

function addThumbnail(link){
  img = '<img src='+link+' width=100%>';
  $(img).appendTo('.img');
}

function setNewItem(resource){
    $('#title').html(resource.data[0].title);
    $('#price').html('Precio $'+(resource.data[0].title.length*10).toString());
    addThumbnail(resource.links[0].href)
}
