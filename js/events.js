function ordenLoad(obj){
    //asignar ordenId a pantalla de orden
    $('#orden').attr('orden',obj.attr('orden')).attr('mesa',(obj.attr('id')).substr(3));
    //Limpiar pantalla de orden
    $('#pedidos .pedidos ul').html('');
    $('#pedidos .tab .may .total').text('0.00');
    $('#pendientes .body ul').html('');
    //Asignar datos de orden
    $('#orden .title').text('Mesa '+(obj.attr('id')).substr(3));
    getPedidosOrden(obj.attr('orden'));
}

function putPedidoPendiente(pedidoId,prodId,producto,precio,tipoId){
    if(tipoId==1){//Si es tlayuda
        $('<li class="pending" id="pend'+prodId+'" precio="'+precio+'" pedido="'+pedidoId+'">'+producto+'</li>').appendTo('#pendientes .body ul');//Verificar tlayudaReady()
    }else{
        $('<li class="ready" id="pend'+prodId+'" precio="'+precio+'" pedido="'+pedidoId+'">'+producto+'</li>').appendTo('#pendientes .body ul');
    }
}

function putPedidoEntregado(id,des,pr){
    var i=0;
    var sel = null;
    $('#orden .pedidos ul li').each(function(){
        if($(this).attr('rel')==id){
            sel=$(this);
            i++;
        }
    });
    if(i>0){
        var cant = sel.children('.cant');
        cant.text(parseInt(cant.text())+1);
        //var precio = sel.children('precio');
        var costo = sel.find('.precio').children('.costo');
        costo.text(parseFloat(costo.text())+parseFloat(pr));
    }else{
        $('#orden .pedidos ul').append('<li rel="'+id+'"><span class="cant">1</span>'+des+'<span class="precio">$ <span class="costo">'+pr+'</span></span></li>');//.append('<li rel="'+id+'"><span class="cant">1</span>'+des+'<span class="costo">'+pr+'</span></li>');
    }
    var tot = 0;
    //alert(tot);
    $('#orden .pedidos ul li').each(function(){
        tot+=parseFloat($(this).find('.precio').children('.costo').text());
    });
    $('#pedidos .tab .may .total').text('$ '+tot);
}