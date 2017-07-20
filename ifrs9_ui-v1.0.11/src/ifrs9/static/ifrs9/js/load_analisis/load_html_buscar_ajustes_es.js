$(document)
  .ready(function () {

    $.ajax({
      type: "GET",
      data: "environment=" + environment,
      url: "modal_delete",
      success: function (data) {
        $('#ifrs9_myModalDelete')
          .empty()
          .html(data);
        $.ajax({
          type: "GET",
          data: "environment=" + environment,
          url: "modal_conf_promotion",
          success: function (data) {
            $('#ifrs9_myModalPromotion')
              .empty()
              .html(data);
            $.ajax({
              type: "GET",
              data: "environment=" + environment,
              url: "modal_conf_traspaso",
              success: function (data) {
                $('#ifrs9_myModalTraspaso')
                  .empty()
                  .html(data);
                var script = document.createElement('script');
                script.src = "/static/ifrs9/js/analisis/buscar_ajustes.js";
                document.getElementsByTagName('head')[0].appendChild(script);
                setTitle(environment);
                $('#buscarAjustesEnvironment')
                  .val(environment);
              }
            });
          }
        });
      }
    });
    // $('#ifrs9_myModalDelete')
    //   .load('modal_delete', function () {
    //     $('#ifrs9_myModalPromotion')
    //       .load('modal_conf_promotion', function () {
    //         $('#ifrs9_myModalTraspaso')
    //           .load('modal_conf_traspaso', function () {
    //             var script = document.createElement('script');
    //             script.src = "/static/ifrs9/js/analisis/buscar_ajustes.js";
    //             document.getElementsByTagName('head')[0].appendChild(script);
    //             setTitle(environment);
    //             $('#buscarAjustesEnvironment')
    //               .val(environment);
    //           });
    //       });
    //   });
  });
