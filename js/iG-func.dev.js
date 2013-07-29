var serverFile = 'http://192.168.1.76/carlos/APPS/mitierraoaxaca/Web/fnc/ajaxfnc.php';
$(function(){
    //var listener = self.setInterval(function(){listarMesas()},1500);
    listarCarta();
    navigator.nnotification.alert('hola',null,'tit','btn');
    //Ir a pendientes
    $('#btnPendientes').click(function(){
        $('#pedidos').hide();
        $('#pendientes').show();
    });
    //Ir a Orden
    $('#btnOrden').click(function(){
        $('#pedidos').show();
        $('#pendientes').hide();
    });
    //listarMesas();
    $('#options select[name=openTable]').change(function(){
        var table = $(this).val();
        if(table!=''){
            //Verificar que la mesa no esté abierta en el servidor
            tableIsOpen(table);//Si está disponible
            $(this).val('');
        }
    });
    //Back
    $('#orden .left').click(function(){
        $('#orden').hide();
        $('#home').show();
    });
    //Seleccionar Mesa
    $('#tables li').live('click',function(){
        var mid=($(this).attr('id')).substr(5);
        $('#orden').attr('orden',$(this).attr('orden'));
        $('#orden .title').text('Mesa '+mid);
        //Listar datos de la orden
        $('#home').hide();
        $('#orden').show();
        $('#pedidos .pedidos ul').html('');
        $('#pendientes .body ul').html('');
        $('#pedidos .tab .may .total').text('$ 0.00');
        listarPedidos($(this).attr('orden'));
    });
    //Entregar Productos pendientes
    $('#pendientes .ready').live("click",function(){
        subirEntrega($(this).attr('pedido'),$(this).text(),$(this).attr('precio'),($(this).attr('id')).substr(4));
        $(this).remove();
    });
    //Seleccionar Producto para la mesa
    $('#orden .carta .option').live('click',function(){
        crearrPedido($(this).attr('rel'),$('#orden').attr('orden'),$(this));
    });
});
/* Órdenes */
function subirEntrega(id,des,pr,prod){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'subirEntrega',id: id },
        timeout: 300,
        context: $('#extra'),
        success: function(orden){
            if(orden==0)
                alert('error');
            else
                pedidosEntregados(prod,des,pr);
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}

function crearrPedido(pr,or,obj){
     $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'crearPedido',id: pr,or: or },
        timeout: 300,
        success: function(pedido){
            if(pedido==0)
                alert('error');
            else
                pedidosPendientes(obj.attr('rel'),obj.children('.des').text(),obj.children('.precio').text(),(obj.parent('ul').attr('class')).substr(4),pedido);
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}

function listarPedidos(oid){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'listarPedidos',id: oid },
        dataType: 'json',
        timeout: 300,
        context: $('#extra'),
        success: function(pedidos){
            if(pedidos.length>0){
                for(i=0;i<pedidos.length;i++){
                    if(pedidos[i].entrega=='00:00:00'){
                        //listar en pendientes
                        pedidosPendientes(pedidos[i].prodId,pedidos[i].producto,pedidos[i].precio,pedidos[i].tipoId,pedidos[i].pedidoId);
                    }else{
                        //listar en entregados
                        pedidosEntregados(pedidos[i].prodId,pedidos[i].producto,pedidos[i].precio);
                    }
                }
            }
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}

function pedidosPendientes(id,des,pr,tp,pid){
    if(tp==1){
        $('#pendientes .body ul').append('<li class="pending" id="pend'+id+'" precio="'+pr+'" pedido="'+pid+'">'+des+'</li>');
    }else{
        $('#pendientes .body ul').append('<li class="ready" id="pend'+id+'" precio="'+pr+'" pedido="'+pid+'">'+des+'</li>');
    }
}

function pedidosEntregados(id,des,pr){
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
function agregarExtras(id){
    $('#extras').attr('rel',id);
    $('#extras input[type=checkbox]').each(function(){
        $(this)[0].checked=0;
    });//Limpiamos campos
    $('#extras .submit').click(function(){
        var arr=[];var i=0;
        $('#extras input[type=checkbox]').each(function(){
            if($(this)[0].checked){
                arr[i]=$(this).val();
                i++;
            }
        });
        nuevoPedido(id);
        if(arr.length>0)
            extrasPedidos(id,arr);
    });
    
}
function nuevoPedido(id){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'nuevoPedido',id: id },
        dataType: 'json',
        timeout: 300,
        context: $('#extra'),
        success: function(carta){
            for(i=0;i<carta.length;i++){
                var ul = this.children('ul.tipo'+carta[i].tipoId);
                ul.append('<li class="option" rel="'+carta[i].prodId+'"><span class="des">'+carta[i].producto+'</span><span class="precio">'+carta[i].precio+'</span></li>');
            }
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}
function nuevaOrden(id){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'nuevaOrden',id: id },
        timeout: 300,
        context: $('#extra'),
        success: function(orden){
            if(orden==0)
                alert('error');
            else
                $('#table'+id).attr('orden',orden);
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}
function listarCarta(){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'listarCarta' },
        dataType: 'json',
        timeout: 300,
        context: $('#orden .carta'),
        success: function(carta){
            for(i=0;i<carta.length;i++){
                var ul = this.children('ul.tipo'+carta[i].tipoId);
                ul.append('<li class="option" rel="'+carta[i].prodId+'"><span class="des">'+carta[i].producto+'</span><span class="precio">'+carta[i].precio+'</span></li>');
            }
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}
/* Mesas */
function abrirMesa(table){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'abrirMesa',id: table },
        timeout: 300,
        success: function(hecho){
            if(hecho == 1)
                nuevaOrden(table);
            else
                alert('cerrar mesa');//cerrarMesa(table);
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}
function listarMesas(){//mesas disponibles
    //1-Conectar al servidor pidiendo mesas disponibles
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'mesasDisponibles' },
        // tipo de dato que esperamos que regrese
        //2-Recibir objeto json de mesas disponibles
        dataType: 'json',
        timeout: 300,
        //3-Listar en el select[name=openTable]
        context: $('#options select[name=openTable]'),
        success: function(mesas){
            var select=this;
            select.children('option').each(function(){
                if($(this).attr('value')!='')
                    $(this).remove();
            });
            for(i=0;i<mesas.length;i++){
                select.append('<option value="'+mesas[i].mesaId+'">Mesa '+mesas[i].mesaId+'</option>');
            }
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}

function tableIsOpen(tid){
    $.ajax({
        type: 'POST',
        url: serverFile,
        data: { fnc: 'mesaAbierta',id: tid },
        //dataType: 'json',
        timeout: 300,
        context: $('#tables'),
        success: function(abierta){
            //alert(abierta);
            if(abierta=='1'){//Está abierta
                alert("Mesa no disponible");
            }else{//Está disponible
                //crea un nuevo registro de mesa abierta
                $('#tables').append('<li class="table" id="table'+tid+'">Mesa '+tid+'</li>');
                abrirMesa(tid);
            }
        },
        error: function(xhr, type){
            alert('Ajax error!');
        }
    });
}