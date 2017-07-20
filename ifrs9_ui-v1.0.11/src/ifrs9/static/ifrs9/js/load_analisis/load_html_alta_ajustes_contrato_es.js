$(document)
  .ready(function () {
    $('#myModalConfirmacionAltaAjusteContrato')
      .load('modal_confirmacion_new_adjustment_contract',
        function () {
          var script = document.createElement('script');
          script.src = "/static/ifrs9/js/analisis/alta_ajustes_contrato.js";
          document.getElementsByTagName('head')[0].appendChild(script);
          setTitle(environment);
          $('#flagclientecontratoaltaajustegeneric')
            .val(flagclientecontrato);
          $('#environmentaltaajustegeneric')
            .val(environment);
          $('#tipoajuste')
            .val(tipo_ajuste);
        }
      )
  });
