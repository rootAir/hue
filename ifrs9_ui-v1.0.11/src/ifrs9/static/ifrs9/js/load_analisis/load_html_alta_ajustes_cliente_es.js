$(document)
  .ready(function () {
    $('#myModalConfirmacionAltaAjusteCustomer')
      .load('modal_confirmacion_new_adjustment_customer',
        function () {
          var script = document.createElement('script');
          script.src = "/static/ifrs9/js/analisis/alta_ajustes_cliente.js";
          document.getElementsByTagName('head')[0].appendChild(script);
          setTitle(environment);
          $('#flagclientecontratoaltaajustegeneric')
            .val(flagclientecontrato);
          $('#environmentaltaajustegeneric')
            .val(environment);
          $('#tipoajuste')
            .val(tipo_ajuste);
          $('#ifrs9_customers-table')
            .bootstrapTable({
              cache: false,
              striped: true,
              sortable: true,
              pagination: true,
              paginationLoop: false,
              pageSize: 5,
              search: true,
              showHeader: true,
              sortOrder: "desc",
              searchAlign: "left",
              showFooter: false,
              pageList: []
            });
        }
      )
  });
