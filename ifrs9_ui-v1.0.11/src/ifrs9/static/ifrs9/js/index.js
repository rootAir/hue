$(document)
  .ready(function () {
    $.ajaxSetup({
      cache: false
    });
    // $(window)
    //   .scroll(function (event) {
    //     var scroll = $(window)
    //       .scrollTop();
    //     var fixTTop = $('#ifrs9_cabeceraLoad')
    //       .height() - scroll;
    //     if (fixTTop < 0) {
    //       fixTTop = 0;
    //     }
    //     $('.main-menu')
    //       .css('top', fixTTop);
    //     $('.searchMenu')
    //       .css('top', fixTTop);
    //
    //   });

    var idioma;
    $('#ifrs9_cabeceraLoad')
      .load('/static/ifrs9/html/includes/cabecera.html', function () {
        var script = document.createElement('script');
        script.src = "/static/ifrs9/js/cabecera.js";
        document.getElementsByTagName('head')[0].appendChild(script);
      });
    $('#ifrs9_menuLoad')
      .load('importar_menu/', function () {
        var script = document.createElement('script');
        script.src = "/static/ifrs9/js/menu.js";
        document.getElementsByTagName('head')[0].appendChild(script);
      });

    $('#ifrs9_myModalSettings')
      .load('/static/ifrs9/html/includes/modalSettings.html', function () {});
  });
