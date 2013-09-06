$(function(){
    document.addEventListener("deviceready",function(){
        /* Seleccionar Meseros */
        showMeseros();
        $(document).hammer().on('tap','#meseros .opt',function(){$('body').attr('mesero',$(this).attr('rel'));$('#meseros').hide();});
        /* Mesas y Ordenes */
        var listenerShowTables = setInterval(function(){showTables()},1500);
        $('#options select').change(function(){openTable($(this).val())});
        $(document).hammer().on("tap", "#tables li",function(){ordenLoad($(this));$('#home').hide();$('#orden').show();});
        $(document).hammer().on("tap", "#orden .left",function(){$('#home').show();$('#orden').hide();});
        /* Pedidos */
        showMenu();
        $(document).hammer().on('tap','#orden .carta .option',function(){hacerPedido($(this));});
        $(document).hammer().on('tap','#btnPendientes',function(){$('#pedidos').hide();$('#pendientes').show();});
        $(document).hammer().on('tap','#btnOrden',function(){$('#pedidos').show();$('#pendientes').hide();});
        $(document).hammer().on('tap','#pendientes .body .ready',function(){entregarPedido($(this));});
        $(document).hammer().on('tap','#btnClose',function(){closeTable();});
    },false);
});