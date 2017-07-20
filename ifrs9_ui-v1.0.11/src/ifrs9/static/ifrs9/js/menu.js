$(document)
  .ready(function () {
    $(document)
      .mouseup(function (e) {
        var container = $("#ifrs9_analisisMenu");
        if ((!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target)
            .length === 0) || (container.has(e.target) && !(e.target.tagName.toLowerCase() === 'a'))) // ... nor a descendant of the container
        {
          container.hide();
          // $('#ifrs9_showAnalisisMenu')
          //   .removeClass('menu-selected');
        }
        var container = $("#ifrs9_preproduccionMenu");
        if ((!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target)
            .length === 0) || (container.has(e.target) && !(e.target.tagName.toLowerCase() === 'a'))) // ... nor a descendant of the container
        {
          container.hide();
          // $('#ifrs9_showPreproduccionMenu')
          //   .removeClass('menu-selected');
        }
        var container = $("#ifrs9_contabilizacionMenu");
        if ((!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target)
            .length === 0) || (container.has(e.target) && !(e.target.tagName.toLowerCase() === 'a'))) // ... nor a descendant of the container
        {
          container.hide();
          // $('#ifrs9_showContabilizacionMenu')
          //   .removeClass('menu-selected');
        }
        if (typeof (environment) != "undefined" && environment != null) {
          highlightMenu(environment);
        }
      });

    /* Análisis */

    $('#ifrs9_importar_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "get",
          data: "environment=1",
          url: "importar_reglas/",
          success: function (data) {
            if ($('script[src="' + "/static/ifrs9/js/analisis/load_html_importar_reglas_es.js" + '"]')
              .length > 0) {
              // handleCheckboxImport();
              return;
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_importar_reglas_es.js";
            environment = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            $('#importReglasParamsEnvironment')
              .val(environment);
            document.getElementsByTagName('head')[0].appendChild(script);
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_ejecutar_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          url: 'ejecutar_reglas/',
          type: "GET",
          data: 'environment=1',
          success: function (data) {

            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_ejecutar_reglas_es.js";
            environment = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            document.getElementsByTagName('head')[0].appendChild(script);
            highlightMenu(environment);

          }
        });
      });

    $('#ifrs9_buscar_ajustes_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=1",
          url: 'buscar_ajustes/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        //   $('#ifrs9_paginaLoad')
        //     .load('buscar_ajustes', function () {
        //       var script = document.createElement('script');
        //       script.type = "text/javascript";
        //       script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
        //       document.getElementsByTagName('head')[0].appendChild(script);
        //       environment = 1;
        //     });
      });

    $('#ifrs9_alta_ajustes_contrato_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=1&flagclientecontrato=1",
          url: 'alta_ajustes_contrato/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 1;
            flagclientecontrato = 1;
            tipo_ajuste = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_alta_ajustes_cliente_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=1flagclientecontrato=0",
          url: "alta_ajustes_cliente/",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_cliente_es.js";
            environment = 1;
            flagclientecontrato = 0;
            tipo_ajuste = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_buscar_tramos_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos/",
          type: "GET",
          data: "enviroment=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
            environment = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_exclusiones_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=1",
          url: 'buscar_exclusiones/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_alta_exclusiones_contrato')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_contrato",
          data: "environment=1&flagclientecontrato=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 1;
            flagclientecontrato = 1;
            tipo_exclusion = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_alta_exclusiones_cliente')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_cliente",
          data: "environment=1&flagclientecontrato=0",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 1;
            flagclientecontrato = 0;
            tipo_exclusion = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_exclusiones_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_tramos_exclusion_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos_exclusiones/",
          type: "GET",
          data: "enviroment=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
            environment = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_contrato_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          url: "consulta_contrato/",
          type: "GET",
          data: "enviroment=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
            environment = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_contrato', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_cliente_analisis')
      .click(function () {
        $('#ifrs9_analisisMenu')
          .hide();
        $.ajax({
          url: "consulta_cliente/",
          type: "GET",
          data: "enviroment=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
            environment = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    /* Pre-producción */

    $('#ifrs9_importar_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "get",
          data: "environment=2",
          url: "importar_reglas/",
          success: function (data) {
            if ($('script[src="' + "/static/ifrs9/js/analisis/load_html_importar_reglas_es.js" + '"]')
              .length > 0) {
              return;
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_importar_reglas_es.js";
            environment = 2;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            $('#importReglasParamsEnvironment')
              .val(environment);
            document.getElementsByTagName('head')[0].appendChild(script);
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_ejecutar_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: 'ejecutar_reglas/',
          type: "GET",
          data: 'environment=2',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_ejecutar_reglas_es.js";
            environment = 2;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            document.getElementsByTagName('head')[0].appendChild(script);
            highlightMenu(environment);

          }
        });
      });

    $('#ifrs9_buscar_ajustes_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: 'buscar_ajustes/',
          type: "GET",
          data: 'environment=2',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
            environment = 2;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            document.getElementsByTagName('head')[0].appendChild(script);
            highlightMenu(environment);

          }
        });
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_ajustes', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_alta_ajustes_contrato_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=2&flagclientecontrato=1",
          url: 'alta_ajustes_contrato/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 2;
            flagclientecontrato = 1;
            tipo_ajuste = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_alta_ajustes_cliente_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=2flagclientecontrato=0",
          url: "alta_ajustes_cliente/",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_cliente_es.js";
            environment = 2;
            flagclientecontrato = 0;
            tipo_ajuste = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_buscar_tramos_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos/",
          type: "GET",
          data: "enviroment=2",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
            environment = 2;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_exclusiones_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=2",
          url: 'buscar_exclusiones/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 2;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });


    $('#ifrs9_alta_exclusiones_contrato_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_contrato",
          data: "environment=2&flagclientecontrato=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 2;
            flagclientecontrato = 1;
            tipo_exclusion = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
      });

    $('#ifrs9_alta_exclusiones_cliente_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_cliente",
          data: "environment=2&flagclientecontrato=0",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 2;
            flagclientecontrato = 0;
            tipo_exclusion = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_exclusiones_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
        //     environment = 1;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_tramos_exclusion_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos_exclusiones/",
          type: "GET",
          data: "enviroment=2",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
            environment = 2;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_paginaLoad')
              .html(data);
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_contrato_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: "consulta_contrato/",
          type: "GET",
          data: "enviroment=2",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
            environment = 2;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_contrato', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_cliente_preproduccion')
      .click(function () {
        $('#ifrs9_preproduccionMenu')
          .hide();
        $.ajax({
          url: "consulta_cliente/",
          type: "GET",
          data: "enviroment=2",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
            environment = 2;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
        //     environment = 2;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    /* Contabilización */

    $('#ifrs9_buscar_ajustes_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=3",
          url: 'buscar_ajustes/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_ajustes', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_ajustes_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_alta_ajustes_contrato_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=3&flagclientecontrato=1",
          url: 'alta_ajustes_contrato/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 3;
            flagclientecontrato = 1;
            tipo_ajuste = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_ajustes_contrato', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_contrato_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_alta_ajustes_cliente_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=3flagclientecontrato=0",
          url: "alta_ajustes_cliente/",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_cliente_es.js";
            environment = 3;
            flagclientecontrato = 0;
            tipo_ajuste = 1;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_ajustes_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_ajustes_cliente_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_tramos_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos/",
          type: "GET",
          data: "enviroment=3",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
            environment = 3;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_exclusiones_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          data: "environment=3",
          url: 'buscar_exclusiones/',
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_exclusiones_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });


    $('#ifrs9_alta_exclusiones_contrato_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_contrato",
          data: "environment=3&flagclientecontrato=1",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_contrato_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 3;
            flagclientecontrato = 1;
            tipo_exclusion = 3;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_exclusiones_contrato', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_contrato_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_alta_exclusiones_cliente_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          type: "GET",
          url: "alta_exclusiones_cliente",
          data: "environment=3&flagclientecontrato=0",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            environment = 3;
            flagclientecontrato = 0;
            tipo_exclusion = 1;
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('alta_exclusiones_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_alta_exclusiones_cliente_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_buscar_tramos_exclusion_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          url: "buscar_tramos_exclusiones/",
          type: "GET",
          data: "enviroment=3",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
            environment = 3;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('buscar_tramos_exclusiones', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_buscar_tramos_exclusiones_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_contrato_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          url: "consulta_contrato/",
          type: "GET",
          data: "enviroment=3",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
            environment = 3;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_contrato', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_contrato_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    $('#ifrs9_consulta_cliente_contabilizacion')
      .click(function () {
        $('#ifrs9_contabilizacionMenu')
          .hide();
        $.ajax({
          url: "consulta_cliente/",
          type: "GET",
          data: "enviroment=3",
          success: function (data) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
            environment = 3;
            document.getElementsByTagName('head')[0].appendChild(script);
            $('#ifrs9_detalleLoad')
              .empty()
              .hide();
            $('#ifrs9_paginaLoad')
              .html(data)
              .show();
            highlightMenu(environment);

          }
        })
        // $('#ifrs9_paginaLoad')
        //   .load('consulta_cliente', function () {
        //     var script = document.createElement('script');
        //     script.type = "text/javascript";
        //     script.src = "/static/ifrs9/js/load_analisis/load_html_consulta_cliente_es.js";
        //     environment = 3;
        //     document.getElementsByTagName('head')[0].appendChild(script);
        //   });
      });

    function menuAnalisis(_this) {
      $('#ifrs9_contabilizacionMenu')
        .hide();
      $('#ifrs9_preproduccionMenu')
        .hide();
      $('#ifrs9_analisisMenu')
        .fadeToggle();
      $('#ifrs9_showAnalisisMenu')
        .addClass('menu-selected selected');
      $('#ifrs9_showPreproduccionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showContabilizacionMenu')
        .removeClass('menu-selected selected');
      // $(_this)
      //   .toggleClass("menu-selected");
    }
    $('#ifrs9_showAnalisisMenu')
      .on('click mouseover', function () {
        var _this = this;
        menuAnalisis(_this);
      });

    function menuPreproduccion(_this) {
      $('#ifrs9_contabilizacionMenu')
        .hide();
      $('#ifrs9_analisisMenu')
        .hide();
      $('#ifrs9_preproduccionMenu')
        .fadeToggle();
      $('#ifrs9_showPreproduccionMenu')
        .addClass('menu-selected selected');
      $('#ifrs9_showContabilizacionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showAnalisisMenu')
        .removeClass('menu-selected selected');
      // $(_this)
      //   .toggleClass("menu-selected");
    }
    $('#ifrs9_showPreproduccionMenu')
      .on('click mouseover', function () {
        var _this = this;
        menuPreproduccion(_this);
      });

    function menuContabilizacion(_this) {
      $('#ifrs9_analisisMenu')
        .hide();
      $('#ifrs9_preproduccionMenu')
        .hide();
      $('#ifrs9_contabilizacionMenu')
        .fadeToggle();
      $('#ifrs9_showContabilizacionMenu')
        .addClass('menu-selected selected');
      $('#ifrs9_showPreproduccionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showAnalisisMenu')
        .removeClass('menu-selected selected');
      // $(_this)
      //   .toggleClass("menu-selected");
    }
    $('#ifrs9_showContabilizacionMenu')
      .on('click mouseover', function () {
        var _this = this;
        menuContabilizacion(_this);
      });

  });


function highlightMenu(environment) {
  switch (environment) {
    case 1:
      $('#ifrs9_showContabilizacionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showPreproduccionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showAnalisisMenu')
        .addClass('menu-selected selected');
      break;
    case 2:
      $('#ifrs9_showContabilizacionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showPreproduccionMenu')
        .addClass('menu-selected selected');
      $('#ifrs9_showAnalisisMenu')
        .removeClass('menu-selected selected');
      break;
    case 3:
      $('#ifrs9_showContabilizacionMenu')
        .addClass('menu-selected selected');
      $('#ifrs9_showPreproduccionMenu')
        .removeClass('menu-selected selected');
      $('#ifrs9_showAnalisisMenu')
        .removeClass('menu-selected selected');
      break;

  }
}
