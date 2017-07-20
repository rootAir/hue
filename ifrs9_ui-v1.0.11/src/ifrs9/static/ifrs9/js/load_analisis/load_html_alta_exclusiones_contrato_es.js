$(document)
  .ready(function () {
    $('#myModalConfirmacionAltaExclusionContrato')
      .load('modal_confirmacion_new_exclusion_contract', function () {
        var script = document.createElement('script');
        script.src = "/static/ifrs9/js/analisis/alta_exclusiones_contrato.js";
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
