$(document)
  .ready(function () {
    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");
    $('#ifrs9_volver')
      .click(function () {
        $('#ifrs9_paginaLoad')
          .load('html/analisis/consulta_contrato.html', function () {
            var script = document.createElement('script');
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
          });
      });
  });


function volver_al_listado() {
  $('#ifrs9_paginaLoad')
    .show();
  $('#ifrs9_detalleLoad')
    .empty()
    .hide();
}
