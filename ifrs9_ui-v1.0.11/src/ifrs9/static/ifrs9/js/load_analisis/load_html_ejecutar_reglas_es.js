$(document)
  .ready(function () {
    $('#ifrs9_myModalConfirmacion')
      .load('modal_confirmacion_new_execution', function () {
        $('#ifrs9_myModalParam')
          .load('modal_parametros', function () {
            $('#ifrs9_myModalOper')
              .load('modal_operaciones', function () {
                $('#ifrs9_myModalReglas')
                  .load('modal_reglas', function () {
                    $('#ifrs9_buttonAceptarConfirmacion')
                      .click(function () {
                        $('#submit_execution_form')
                          .submit();
                      });
                    $('#new_execution_env')
                      .val(environment);
                    var script = document.createElement('script');
                    script.src = "/static/ifrs9/js/analisis/ejecutar_reglas.js";
                    document.getElementsByTagName('head')[0].appendChild(script);
                    setTitle(environment);

                    $('#ifrs9_contratos-table')
                      .bootstrapTable({
                        striped: true,
                        sortable: false,
                        pagination: false,
                        paginationLoop: true,
                        pageSize: 10,
                        search: false,
                        showHeader: true,
                        showFooter: false
                      });
                  });
              });
          });
      });
  });
