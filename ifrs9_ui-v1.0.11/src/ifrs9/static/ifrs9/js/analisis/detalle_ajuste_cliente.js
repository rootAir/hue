$(document)
  .ready(function () {
    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");
    $('#ifrs9_volver')
      .click(function () {
        $('#ifrs9_paginaLoad')
          .load('html/analisis/buscar_ajustes.html', function () {
            var script = document.createElement('script');
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
          });
      });
  });

function cerrarAjusteDetalle() {
  $('#detalle_ajuste_general')
    .empty()
    .hide();
  $('#ifrs9_paginaLoad ul, #ifrs9_pageTitle')
    .show();

}
