(function (scriptCode) {
  scriptCode(window.jQuery, window, document);
}(function ($, window, document) {
  // DOM is ready
  $(function () {
    /** **************************************************************************************************** */
    // Init
    var feve = new Feve();
    feve.initialize();

  });

  // End ready

  Feve = function () {

  };

  Feve.prototype = (function () {

    // Atributos privados
    var modulos = {};

    // / Metodos privados

    // Metodos para las tablas
    var initializeTable = function (table, clickTrFunctionEvent, sort) {
      var dataTable = table.dataTable({
        "lengthChange": false,
        "bSort": sort,
        dom: 'Bfrtip',
        "language": {
          "sProcessing": "Procesando...",
          "sLengthMenu": "Mostrar _MENU_ registros",
          "sZeroRecords": "No se encontraron resultados",
          "sEmptyTable": "Ningún dato disponible en esta tabla",
          "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
          "sInfoPostFix": "",
          "sSearch": "Buscar:",
          "sUrl": "",
          "sInfoThousands": ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          },
          "aaSorting": [
            [0, "desc"]
          ]
        }
      });

      // dataTable.column('0:visible')
      //   .order('desc')
      //   .draw();

      $('#ifrs9_button')
        .click(function () {
          table.row('.selected')
            .remove()
            .draw(false);
        });



      // Campo de busqueda
      table.parents("section")
        .find('.search-table input')
        .on('keyup', [dataTable], function (event) {
          var dataTable = event.data[0];
          dataTable.search(this.value)
            .draw();
        });

      table.on("filterData", [dataTable], function (event, column, text) {
        var dataTable = event.data[0];
        var $th = $(this)
          .find("th[data-name='" + column + "']");
        dataTable.column($th)
          .search(text)
          .draw();
      });
    };

    // Metodos para Paginas
    var initEventPage = function () {
      // Definimos el comportamiento de la pagina Customers al contruirse y
      // destruirse
      // var customersSection = $("#ifrs9_my-customers");
      // customersSection.on(conf.eventInitPage, initCustomersPage);
      // customersSection.on(conf.eventDestroyPage, destroyCustomersPage);
      // var settingsSection = $("#ifrs9_my-settings");
      // settingsSection.on(conf.eventInitPage, initSettingsPage);
      // settingsSection.on(conf.eventDestroyPage, destroySettingsPage);
      // var ajustesSection = $("#ifrs9_my-ajustes");
      // ajustesSection.on(conf.eventInitPage, initAjustesPage);
      // ajustesSection.on(conf.eventDestroyPage, destroyAjustesPage);
      // var contratosSection = $("#ifrs9_my-contratos-cliente");
      // contratosSection.on(conf.eventInitPage, initContratosPage);
      // contratosSection.on(conf.eventDestroyPage, destroyContratosPage);
      // var listadoSection = $("#ifrs9_my-listado-param");
      // listadoSection.on(conf.eventInitPage, initListadoPage);
      // listadoSection.on(conf.eventDestroyPage, destroyListadoPage);
      // var listadoReglasSection = $("#ifrs9_my-listado-reglas");
      // listadoReglasSection.on(conf.eventInitPage, initListadoReglasPage);
      // listadoReglasSection.on(conf.eventDestroyPage, destroyListadoReglasPage);
      // var listadoOperSection = $("#ifrs9_my-listado-operaciones");
      // listadoOperSection.on(conf.eventInitPage, initListadoOperPage);
      // listadoOperSection.on(conf.eventDestroyPage, destroyListadoOperPage);

    };

    var initCustomersPage = function () {
      // Mostramos el section de customers y las graficas
      // var customersSection = $("#ifrs9_my-customers");
      //
      // if (!customersSection.hasClass("initialized")) {
      //
      //   // Inicializamos la tabla de Clientes
      //   initializeTable($('#ifrs9_customers-table'), customersClickEvent, true);
      //
      //   customersSection.addClass("initialized");
      // }
      //
      // // Actualizamos breadcrumbs
      // var breadcrumb = $(document.createElement('a'))
      //   .addClass("breadcrumb")
      //   .text("Customers");
      // $(".breadcrumbs-menu .nav-wrapper div")
      //   .html(breadcrumb);
      //
      // // Inicializamos la pestaña
      // // Ocultamos la pestaña
      // var tab = $("#ifrs9_block-details");
      // var lapelTab = tab.find(".lapel-section-tab");
      // lapelTab.each(hideLapel);
      //
      // var custom = $("#ifrs9_customer-details");
      // var group = $("MyGroupDetails");
      //
      // fadeIn(customersSection);
      // fadeIn($(".graph-section[id^='customer']"));
    };
    var destroyCustomersPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-customers"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
        fadeOut($(".graph-section[id^='customer']"));
      }
    };
    // Eventos click de las paginas
    var customersClickEvent = function (event) {
      event.preventDefault();

      // Pasamos el id a la siguiente página
      var customer = $($(this)
          .children()
          .get(1))
        .find("p")
        .text();
      var titulo = $(document.createElement("h2"));
      titulo.text("Customer Review - ");
      titulo.append($(document.createElement("span"))
        .addClass("customerTexto")
        .html(customer))
      $("#ifrs9_customer-review")
        .find("h2")
        .html(titulo.html());

      // Cerramos el section de Customer y las gráficas
      destroyCustomersPage(null, "#ifrs9_customer-review");

      // Añadimos el evento de volver a la pagina
      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("customer-review", "Customer Review", currentPageName);
    };

    var initContratosPage = function () {
      // Mostramos el section de customers y las graficas
      var contratosSection = $("#ifrs9_my-contratos-cliente");

      if (!contratosSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_contratos-table'), ajustesClickEvent, false);

        contratosSection.addClass("initialized");
      }

      fadeIn(contratosSection);
    };
    var destroyContratosPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-contratos-cliente"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
      }
    };

    // Eventos click de las paginas
    var contratosClickEvent = function (event) {
      event.preventDefault();
    };
    var initListadoPage = function () {
      // Mostramos el section de customers y las graficas
      var listadoSection = $("#ifrs9_my-listado-param");

      if (!listadoSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_listado-param-table'), listadoClickEvent, false);

        listadoSection.addClass("initialized");
      }

      fadeIn(listadoSection);
    };
    var destroyListadoPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-listado-param"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
      }
    };

    // Eventos click de las paginas
    var listadoClickEvent = function (event) {
      event.preventDefault();
    };
    var initListadoOperPage = function () {
      // Mostramos el section de customers y las graficas
      var listadoSection = $("#ifrs9_my-listado-operaciones");

      if (!listadoSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_listado-operaciones-table'), listadoClickEvent, false);

        listadoSection.addClass("initialized");
      }

      fadeIn(listadoSection);
    };
    var destroyListadoOperPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-listado-param"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
      }
    };

    // Eventos click de las paginas
    var listadoOperClickEvent = function (event) {
      event.preventDefault();
    };
    var initListadoReglasPage = function () {
      // Mostramos el section de customers y las graficas
      var listadoSection = $("#ifrs9_my-listado-reglas");

      if (!listadoSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_listado-reglas-table'), listadoClickEvent, false);

        listadoSection.addClass("initialized");
      }

      fadeIn(listadoSection);
    };
    var destroyListadoReglasPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-listado-reglas"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
      }
    };

    // Eventos click de las paginas
    var listadoReglasClickEvent = function (event) {
      event.preventDefault();
    };
    var initAjustesPage = function () {
      // Mostramos el section de customers y las graficas
      var ajustesSection = $("#ifrs9_my-ajustes");

      if (!ajustesSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_ajustes-table'), ajustesClickEvent, true);

        ajustesSection.addClass("initialized");
      }

      fadeIn(ajustesSection);
    };
    var destroyAjustesPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-ajustes"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
      }
    };

    // Eventos click de las paginas
    var ajustesClickEvent = function (event) {
      event.preventDefault();
    };

    var initSettingsPage = function () {
      // Mostramos el section de customers y las graficas
      var settingsSection = $("#ifrs9_my-settings");

      if (!settingsSection.hasClass("initialized")) {

        // Inicializamos la tabla de Clientes
        initializeTable($('#ifrs9_settings-table'), settingsClickEvent, true);

        settingsSection.addClass("initialized");
      }

      // Actualizamos breadcrumbs
      var breadcrumb = $(document.createElement('a'))
        .addClass("breadcrumb")
        .text("Customers");
      $(".breadcrumbs-menu .nav-wrapper div")
        .html(breadcrumb);

      // Inicializamos la pestaña
      // Ocultamos la pestaña
      var tab = $("#ifrs9_block-details");
      var lapelTab = tab.find(".lapel-section-tab");
      lapelTab.each(hideLapel);

      var custom = $("#ifrs9_customer-details");
      var group = $("MyGroupDetails");

      fadeIn(settingsSection);
      fadeIn($(".graph-section[id^='customer']"));
    };
    var destroySettingsPage = function (event, idNextPage) {

      if (typeof idNextPage !== "undefined") {
        // Cerramos el section de Customer y las gráficas
        fadeOut($("#ifrs9_my-settings"), function () {
          $(idNextPage)
            .trigger(conf.eventInitPage);
        });
        fadeOut($(".graph-section[id^='customer']"));
      }
    };
    // Eventos click de las paginas
    var settingsClickEvent = function (event) {
      event.preventDefault();
    };


    // Metodos pestañas
    var toogleTab = function (event) {
      var detailsBlock = typeof event.data !== "undefined" ? event.data.detailsBlock :
        $("#ifrs9_block-details .section-tab-body");
      detailsBlock.slideToggle(conf.animationTime);
    };

    // Metodos animaciones
    var fadeOut = function (bloques, callback) {
      bloques.css({
          opacity: 1
        })
        .finish()
        .animate({
          opacity: 0
        }, conf.animationTime, function () {

          // Quitamos el hueco de los section
          bloques.css({
            display: "none"
          });

          if (callback !== null && typeof callback === 'function') {
            callback();
          }
        })
    };
    var fadeIn = function (bloques, callback, display) {
      bloques.css({
          display: typeof display !== "undefined" ? display : "block",
          opacity: 0
        })
        .finish()
        .animate({
          opacity: 1
        }, conf.animationTime, function () {
          if (callback !== null && typeof callback === 'function') {
            callback();
          }
        })
    };
    var showLapel = function () {
      var lapelTabContainer = $(this)
        .closest(".lapel-section-container");
      lapelTabContainer.stop()
        .animate({
          "margin-top": "0"
        });
    };
    var hideLapel = function () {
      var lapelTabContainer = $(this)
        .closest(".lapel-section-container");
      lapelTabContainer.stop()
        .animate({
          "margin-top": "-30px"
        });
    };
    var showMenu = function () {
      var menuContainer = $(this)
        .closest(".search-section-container");
      menuContainer.stop()
        .animate({
          "right": "-2"
        }, {
          duration: conf.animationSlowTime
        });
    };
    var hideMenu = function () {
      var menuContainer = $(this)
        .closest(".search-section-container");
      menuContainer.stop()
        .animate({
          "right": "-235px"
        }, {
          duration: conf.animationSlowTime
        });
    };

    // Metodos historial
    initPopStateListener = function () {
      window.onpopstate = function (ev) {

        // Raised on page load this event will still contain no state.
        var state = ev.state;
        if (state && typeof state.href === "undefined") {

          var target = $(".main-section:visible");
          if (typeof target !== "undefined" && typeof state !== "undefined") {
            target.trigger(conf.eventDestroyPage, ["#ifrs9_" + state]);
          }
        }
      };

    };

    // Metodos resize
    var calculeHeightMenu = function () {
      var windowHeight = $(window)
        .height();
      var offset = 110;

      $("#ifrs9_search-lapel .search-tab-body .collapsible")
        .height(windowHeight - offset);

    };

    // Atributos públicos
    var conf = {
      animationTime: 600,
      animationSlowTime: 800,
      eventDestroyPage: "eventDestroyPage",
      eventInitPage: "eventInitPage"
    };

    // Funcion para añadir filas a la tabla
    var addRow = function () {
      var btnAdd = $("#ifrs9_addRegister");
      btnAdd.on("click", showRow);
    };

    // Evento para mostrar la fila
    var showRow = function (event) {
      var fila = $(".filaOculta");
      fila.css({
        display: "table-row"
      }, {
        duration: conf.animationSlowTime
      });
    };

    // Metodo checked personal o impersonal
    var selecType = function () {
      var labelCustomerType = $(this);
      if (labelCustomerType.hasClass("impersonal")) {
        labelCustomerType.closest(".texto-search")
          .next(".texto-search")
          .find("span")
          .text("J");
      } else {
        labelCustomerType.closest(".texto-search")
          .next(".texto-search")
          .find("span")
          .text("F");
      }

    };

    // Metodos públicos
    var initialize = function () {

      // Inicializamos los eventos de las paginas
      initEventPage();

      // Inicializamos pagina customers
      $("#ifrs9_my-customers")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-settings")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-ajustes")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-contratos-cliente")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-listado-param")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-listado-reglas")
        .trigger(conf.eventInitPage);
      $("#ifrs9_my-listado-operaciones")
        .trigger(conf.eventInitPage);
      // Añadimos el evento del historial
      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-customers", "My Customers", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-settings", "My Settings", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-ajustes", "My Ajustes", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-contratos-cliente", "My Contrato Cliente", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-listado-param", "My Listado Parámetros", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-listado-reglas", "My Listado Reglas", currentPageName);

      var currentPageName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
      window.history.pushState("my-listado-operaciones", "My Listado Operaciones", currentPageName);

      // Calculamos el tamaño del menu y lo añadimos al evento resize
      calculeHeightMenu();
      $(window)
        .on("resize", calculeHeightMenu);

      // Inicializamos los eventos del history
      initPopStateListener();
    };

    return {
      // Atributos publicos
      conf: conf,

      // Metodos publicos
      constructor: Feve,
      initialize: initialize

    };
  })();

}));
