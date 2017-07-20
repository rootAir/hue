$(document)
  .ready(function () {
    $('#ifrs9_myModalConfirmacion')
      .load('modal_confirmacion', function () {
        $('#ifrs9_myModalExiste')
          .load('modal_existe', function () {
            $('#ifrs9_myModalParamsSubida')
              .load('modal_parametros_subida', function () {
                $('#ifrs9_myModalCalculoProvisionesSubida')
                  .load('modal_calculo_provisiones_subida', function () {
                    var script = document.createElement('script');
                    script.src = "/static/ifrs9/js/analisis/importar_reglas.js";
                    document.getElementsByTagName('head')[0].appendChild(script);
                    setTitle(environment);
                  });
              });
          });
      });
  });
