$(document)
  .ready(function () {
    $('#myModalConfirmacionAltaExclusionCustomer')
      .load('modal_confirmacion_new_exclusion_customer/', function () {
        var script = document.createElement('script');
        script.src = "/static/ifrs9/js/analisis/alta_exclusiones_cliente.js";
        document.getElementsByTagName('head')[0].appendChild(script);
        setTitle(environment);
        $('#flagclientecontratoaltaexclusiongeneric')
          .val(flagclientecontrato);
        $('#environmentaltaexclusiongeneric')
          .val(environment);
        $('#tipoexclusion')
          .val(tipo_exclusion);
      });
  });
