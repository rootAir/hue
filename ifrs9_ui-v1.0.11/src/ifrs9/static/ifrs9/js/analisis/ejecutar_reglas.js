$(document)
  .ready(function () {

    $('#ifrs9_customers-table')
      .bootstrapTable({
        striped: true,
        sortable: true,
        pagination: true,
        paginationLoop: true,
        pageSize: 5,
        search: true,
        showHeader: true,
        sortOrder: "desc",
        sortName: "insertDate",
        searchAlign: "left",
        showFooter: false,
        pageList: [],
        onPostBody: function () {
          $('.table-container')
            .removeClass('ifrs9_hidden');
          $('.loadingDivNoAjax')
            .addClass('ifrs9_hidden');
        },
        onPageChange: function () {
          if ($('#ifrs9_my-customers .search')
            .find('input[type="text"]')
            .val()
            .length > 0) {
            $('<span/>', {
                class: "total-results",
                text: "(" + i18next.t('De un total de', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + " " + $('#last_ten_executions_count')
                  .val() + " " + i18next.t('Entradas', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ")"
              })
              .appendTo('.pagination-detail');
          }
        }
      });

    if ($('#hiddenlan')
      .val() === 'es-ES') {
      $('.datepicker')
        .pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year
          firstDay: true,
          format: 'dd-mm-yyyy',
          labelMonthNext: 'Mes siguiente',
          labelMonthPrev: 'Mes anterior',
          labelMonthSelect: 'Selecciona un mes',
          labelYearSelect: 'Selecciona un año',
          monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          weekdaysLetter: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
          today: 'Hoy',
          clear: 'Limpiar',
          close: 'Cerrar',
          onClose: checkDates
        });
    } else if ($('#hiddenlan')
      .val() === 'pt-PT') {
      $('.datepicker')
        .pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year
          firstDay: true,
          format: 'dd-mm-yyyy',
          labelMonthNext: 'Próximo mês',
          labelMonthPrev: 'Mês passado',
          labelMonthSelect: 'Selecione um mês',
          labelYearSelect: 'Selecione um ano',
          monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
          weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          weekdaysLetter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
          today: 'Hoje',
          clear: 'Limpar',
          close: 'Cerrar',
          onClose: checkDates
        });
    } else {
      $('.datepicker')
        .pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year
          firstDay: true,
          format: 'dd-mm-yyyy',
          labelMonthNext: 'Next month',
          labelMonthPrev: 'Last month',
          labelMonthSelect: 'Select a month',
          labelYearSelect: 'Select a year',
          monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          weekdaysLetter: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          today: 'Today',
          clear: 'Clear',
          close: 'Close',
          onClose: checkDates
        });
    }

    $('select')
      .material_select();

    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });

    $(".switch")
      .click(function () {
        var checked = $("#ifrs9_checkBusqFiltro")
          .prop("checked");
        if (checked) {
          $('#ifrs9_inputUsuario')
            .val($('#user_name_logged')
              .val());

          $('#ifrs9_inputUsuario')
            .prop("readonly", true);
        } else {
          $('#ifrs9_inputUsuario')
            .val('');
          $('#ifrs9_inputUsuario')
            .prop("readonly", false);
        }
        Materialize.updateTextFields();
      });

    $('select')
      .on('contentChanged', function () {
        // re-initialize (update)
        $(this)
          .material_select();
      });

    $(document) //Event handler for all dynamic tables where we want to select a row and copy its values to a specific place (Params)
      .on('click', '#ifrs9_my-listado-param tbody tr', function () {
        $('tr')
          .removeClass('selected');
        $(this)
          .addClass('selected');
        $('#ifrs9_btnSeleccionarParam')
          .removeClass('button-disabled')
          .prop('disabled', false);
      });

    $(document) //Event handler for all dynamic tables where we want to select a row and copy its values to a specific place (Rules)
      .on('click', '#ifrs9_my-listado-reglas tbody tr', function () {
        $('tr')
          .removeClass('selected');
        $(this)
          .addClass('selected');
        $('#ifrs9_btnSeleccionarReglas')
          .removeClass('button-disabled')
          .prop('disabled', false);
      });
    $(document) //Event handler for all dynamic tables where we want to select a row and copy its values to a specific place (Rules)
      .on('click', '#ifrs9_listado-operaciones-table tbody tr', function () {
        $('tr')
          .removeClass('selected');
        $(this)
          .toggleClass('selected');
        $('#ifrs9_btnSeleccionarOperaciones')
          .removeClass('button-disabled')
          .prop('disabled', false);
      });

    var filaSeleccionada;

    $('#ifrs9_iconSeleccionarOper')
      .on('click', function () {
        $('#ifrs9_listado-operaciones-table')
          .bootstrapTable('destroy');
        $('#ifrs9_listado-param-table')
          .bootstrapTable('destroy');
        $('.show-hide-table, #ifrs9_btnSeleccionarOperaciones')
          .addClass('ifrs9_hidden');
        $('.loadingDiv')
          .show();
        $('#ifrs9_listado-operaciones-table')
          .bootstrapTable('destroy');
        $('#ifrs9_modalOperaciones')
          .openModal({
            complete: function () {
              $('.show-hide-table, #ifrs9_btnSeleccionarOperaciones')
                .addClass('ifrs9_hidden');
            }
          });
        $.ajax({
          type: "post",
          url: "get_operations/",
          contentTye: "json",
          data: "environment=" + environment,
          success: function (data) {
            $('.show-hide-table, #ifrs9_btnSeleccionarOperaciones')
              .removeClass('ifrs9_hidden');
            $('.loadingDiv')
              .hide();
            var tr = "";
            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                tr += "<tr>";
                tr += "<td>" + formatTimestamp(data[i]) + "<input type='hidden' value='" + data[i] + "' /></td>";
                tr += "</tr>";
              }
              $('#ifrs9_listado-operaciones-table tbody')
                .html(tr);

              $('#ifrs9_listado-operaciones-table')
                .bootstrapTable({
                  cache: false,
                  striped: true,
                  sortable: true,
                  pagination: true,
                  paginationLoop: false,
                  pageSize: 5,
                  search: true,
                  showHeader: true,
                  sortOrder: "desc",
                  sortName: "operations",
                  searchAlign: "left",
                  onPageChange: function () {
                    if ($('#ifrs9_my-listado-operaciones .search')
                      .find('input[type="text"]')
                      .val()
                      .length > 0) {
                      $('<span/>', {
                          class: "total-results",
                          text: "(" + i18next.t('De un total de', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + " " + initialTableLengthOper + " " + i18next.t('Entradas', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ")"
                        })
                        .appendTo('#ifrs9_modalOperaciones .pagination-detail');
                    }
                  },
                  showFooter: false,
                  pageList: []
                });
              var initialTableLengthOper = $('#ifrs9_listado-operaciones-table')
                .bootstrapTable('getOptions')
                .totalRows;
            } else {
              tr = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
                lng: $('#hiddenlan')
                  .val()
              }) + '</td></tr>';
              $('#ifrs9_listado-operaciones-table tbody')
                .html(tr);

              $('#ifrs9_listado-operaciones-table')
                .bootstrapTable({
                  cache: false,
                  striped: false,
                  sortable: false,
                  pagination: false,
                  paginationLoop: false,
                  sortOrder: "desc",
                  sortName: "operations",
                  pageSize: 5,
                  search: false,
                  showHeader: true,
                  showFooter: false
                });
            }
            $('.show-hide-table, #ifrs9_btnSeleccionarOperaciones')
              .removeClass('ifrs9_hidden');
          },
          error: function (xhr, ajaxOptions, trhownError) {
            if (xhr.status == 405) {
              console.log(xhr.responseText)
              $.jHueNotify.warn(xhr.responseText);
            }
          }
        });
      });
    $(document)
      .on('click', '#ifrs9_botonModal #ifrs9_inputReglasSeleccionadas', function () {
        filaSeleccionada = $(this)
          .parent()
          .parent()
          .parent()
          .prop("id");
        filaSeleccionada = filaSeleccionada.substring(filaSeleccionada.length - 1);
        $('#ifrs9_modalReglas')
          .openModal();
        $(".dataTables_scrollHeadInner")
          .css("width", "100%");
        $(".dataTables_scrollHeadInner table")
          .css("width", "100%");
      });
    $(document)
      .on('click', '#ifrs9_botonModal #ifrs9_inputParamSeleccionados', function () {
        filaSeleccionada = $(this)
          .parent()
          .parent()
          .parent()
          .prop("id");
        filaSeleccionada = filaSeleccionada.substring(filaSeleccionada.length - 1);
        $('#ifrs9_modalParametros')
          .openModal();
        $(".dataTables_scrollHeadInner")
          .css("width", "100%");
        $(".dataTables_scrollHeadInner table")
          .css("width", "100%");
      });

    $('#ifrs9_btnSeleccionarReglas')
      .on('click', function (e) {
        $('#ifrs9_modalReglas')
          .closeModal();
        var selectedname = $('#ifrs9_listado-reglas-table tbody tr.selected')
          .find('td:first')
          .text();
        var selecteddesc = $('#ifrs9_listado-reglas-table tbody tr.selected')
          .find('td:last')
          .text();

        var rule_id = $('#ifrs9_listado-reglas-table tbody tr.selected')
          .find('td:first input[type="hidden"]')
          .val();

        $('#ifrs9_listado-reglas-table tbody tr')
          .removeClass('selected');

        $('#ifrs9_' + selectedRow)
          .val(selectedname);

        $('#ifrs9_' + selectedRow)
          .closest('tr')
          .find('.ellipsis_desc')
          .html(selecteddesc)
          .attr('id', 'ellipsis_desc_rule_' + rule_id);
        // .attr('title', selecteddesc);

        $('#ifrs9_' + selectedRow)
          .closest('tr')
          .find('input[type="hidden"]')
          .val(rule_id);

        $('#ifrs9_listado-reglas-table')
          .bootstrapTable('destroy');

        Materialize.updateTextFields();
        $("html, body")
          .animate({
            scrollTop: $(document)
              .height() - $(window)
              .height()
          });

        $(this)
          .addClass('button-disabled')
          .prop('disabled', true);


        $('#ellipsis_desc_rule_' + rule_id)
          .tooltipster({
            theme: 'tooltipster-borderless',
            side: ['left', 'bottom'],
            content: selecteddesc,
            maxWidth: '400'
          })

        enableRunButton();
      });


    $('#ifrs9_btnSeleccionarParam')
      .on('click', function (e) {
        $('#ifrs9_modalParametros')
          .closeModal();
        var selectedname = $('#ifrs9_listado-param-table tbody tr.selected')
          .find('td:first')
          .text();
        var selecteddesc = $('#ifrs9_listado-param-table tbody tr.selected')
          .find('td:last')
          .text();
        var param_id = $('#ifrs9_listado-param-table tbody tr.selected')
          .find('td:first input[type="hidden"]')
          .val();

        $('#ifrs9_listado-param-table tbody tr')
          .removeClass('selected');

        $('#ifrs9_' + selectedRow)
          .val(selectedname);

        $('#ifrs9_' + selectedRow)
          .closest('tr')
          .find('.ellipsis_desc')
          .html(selecteddesc)
          .attr('id', 'ellipsis_desc_param_' + param_id);
        // .attr('title', selecteddesc);

        $('#ifrs9_' + selectedRow)
          .closest('tr')
          .find('input[type="hidden"]')
          .val(selecteddesc);
        $('#ifrs9_' + selectedRow)
          .closest('tr')
          .find('input[type="hidden"]')
          .val(param_id);

        Materialize.updateTextFields();
        $("html, body")
          .animate({
            scrollTop: $(document)
              .height() - $(window)
              .height()
          });
        $(this)
          .addClass('button-disabled')
          .prop('disabled', true);

        $('#ellipsis_desc_param_' + param_id)
          .tooltipster({
            theme: 'tooltipster-borderless',
            side: ['left', 'bottom'],
            content: selecteddesc,
            maxWidth: '400'
          })

        enableRunButton();
      });


    $('#ifrs9_btnSeleccionarOperaciones')
      .on('click', function (e) {
        $('#ifrs9_modalOperaciones')
          .closeModal();
        var selected = $('#ifrs9_listado-operaciones-table tbody tr.selected')
          .find('td')
          .text();
        var id_selected = $('#ifrs9_listado-operaciones-table tbody tr.selected')
          .find('input[type="hidden"]')
          .val();
        $('#ifrs9_inputOperacionesSeleccionadas')
          .val(selected);
        $('#ifrs9_ops_selected_id')
          .val(id_selected);
        $('#ifrs9_listado-operaciones-table tbody tr')
          .removeClass('selected');
        $('#ifrs9_inputOperacionesSeleccionadas')
          .prop("title", selected);
        Materialize.updateTextFields();
        $("html, body")
          .animate({
            scrollTop: $(document)
              .height() - $(window)
              .height()
          });
        $(this)
          .addClass('button-disabled')
          .prop('disabled', true);

        enableRunButton();
      });

    // Desplegar al buscar
    $('#ifrs9_btnBuscar')
      .click(function (e) {
        $.ajax({
          url: 'filter_executions/',
          type: 'post',
          data: $('#filter_form')
            .serialize() + "&environment=" +
            environment,
          dataType: "json",
          success: function (data) {
            console.log(data);
            e.preventDefault();
            $('#ifrs9_contentTableResultados')
              .removeClass("filaOculta");
            $('#ifrs9_contentTableResultados')
              .addClass('in');
            /* Colapsar filtros */
            $('.collapsible-header')
              .removeClass("active");
            $(".collapsible-body")
              .addClass("filaOculta");

            $('.table-container')
              .hide();
            $('.loadingDivNoAjax')
              .show();
            $('#ifrs9_customers-table')
              .bootstrapTable('destroy');
            $('.loadingDivNoAjax')
              .hide();
            $('.table-container')
              .show();
            var tr = "",
              fecha_exec;
            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                fecha_exec = data[i].fechaejecucion !== "" ? formatTimestampEjecucion(data[i].fechaejecucion, true) : ""
                tr += "<tr>";
                tr += "<td data-align='center'><a href='#' id='ifrs9_icon1' class='fa fa-eye color-icon' title='Detalle'></a><input type='hidden' value='" + data[i].ejecucion_id + "' /></td>";
                tr += "<td>" + fecha_exec + "</td>";
                tr += "<td>" + formatTimestampEjecucion(data[i].fechaalta, false) + "</td>";
                tr += "<td>" + i18next.t(data[i].estado.descripcion, {
                  lng: $('#hiddenlan')
                    .val()
                }) + "</td>";

                if (data[i].first_name && data[i].last_name) {
                  tr += "<td>" + data[i].usuarioalta.username + " (" + data[i].first_name + ", " + data[i].last_name + ")</td>";
                } else if (data[i].first_name) {
                  tr += "<td>" + data[i].usuarioalta.username + " (" + data[i].first_name + ")</td>";
                } else {
                  tr += "<td>" + data[i].usuarioalta.username + "</td>";
                }
                tr += "</tr>";
              }
              $('#ifrs9_customers-table tbody')
                .empty()
                .append(tr);

              $('#ifrs9_customers-table')
                .bootstrapTable({
                  striped: true,
                  sortable: true,
                  pagination: true,
                  paginationLoop: true,
                  pageSize: 5,
                  search: true,
                  showHeader: true,
                  sortName: "insertDate",
                  sortOrder: "desc",
                  searchAlign: "left",
                  onPageChange: function () {
                    if ($('#ifrs9_my-customers .search')
                      .find('input[type="text"]')
                      .val()
                      .length > 0) {
                      $('<span/>', {
                          class: "total-results",
                          text: "(" + i18next.t('De un total de', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + " " + initialTableLength + " " + i18next.t('Entradas', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ")"
                        })
                        .appendTo('.table-container .pagination-detail');
                    }
                  },
                  showFooter: false,
                  pageList: []
                });
              var initialTableLength = $('#ifrs9_customers-table')
                .bootstrapTable('getOptions')
                .totalRows;
            } else {
              tr = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
                lng: $('#hiddenlan')
                  .val()
              }) + '</td></tr>';
              $('#ifrs9_customers-table tbody')
                .empty()
                .append(tr);

              $('#ifrs9_customers-table')
                .bootstrapTable({
                  striped: false,
                  sortable: false,
                  pagination: false,
                  paginationLoop: false,
                  pageSize: 5,
                  search: false,
                  showHeader: true,
                  searchAlign: "left",
                  showFooter: false
                });
            }
          },
          error: function (error) {
            console.log(error);
            if (error.status === 404) {
              $('.warning_text')
                .text(i18next.t('El usuario introducido no existe', {
                  lng: $('#hiddenlan')
                    .val()
                }));
              $('#panel-error')
                .addClass('show_warning');
              setTimeout(function () {
                $('#panel-error')
                  .removeClass('show_warning');
              }, 2000);

              $('#ifrs9_filtro .collapsible-header')
                .addClass("active");
              $("#ifrs9_filtro .collapsible-body")
                .removeClass("filaOculta");
              // $('#ifrs9_contentTableResultados')
              //   .addClass("filaOculta");
              $('#ifrs9_contentTableResultados')
                .removeClass('in');
              /* Quitar línea cabecera */

              $("#ifrs9_cabFiltro span")
                .addClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro h4")
                .addClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro span")
                .removeClass("cabFiltroLineOff");
              $("#ifrs9_cabFiltro h4")
                .removeClass("cabFiltroLineOff");
            } else {
              $('.show-hide-table')
                .removeClass('ifrs9_hidden');
              $('.loadingDiv')
                .addClass('ifrs9_hidden');
              $('.error_message')
                .addClass('show_error');
              setTimeout(function () {
                $('.error_message')
                  .removeClass('show_error');
              }, 2000);
              $('#ifrs9_customers-table')
                .bootstrapTable({
                  cache: false,
                  striped: false,
                  sortable: false,
                  pagination: false,
                  paginationLoop: false,
                  pageSize: 5,
                  search: false,
                  showHeader: true,
                  showFooter: false
                });
            }
          }
        });

        $("#ifrs9_cabFiltro span")
          .removeClass("cabFiltroLineOn");
        $("#ifrs9_cabFiltro h4")
          .removeClass("cabFiltroLineOn");
        $("#ifrs9_cabFiltro span")
          .addClass("cabFiltroLineOff");
        $("#ifrs9_cabFiltro h4")
          .addClass("cabFiltroLineOff");
      });

    $(".collapsible-header")
      .click(function (e) {
        $(".collapsible-body")
          .removeClass("filaOculta");
        $(".collapsible-header span")
          .removeClass("cabFiltroLineOff");
        $(".collapsible-header h4")
          .removeClass("cabFiltroLineOff");
        $(".collapsible-header span")
          .addClass("cabFiltroLineOn");
        $(".collapsible-header h4")
          .addClass("cabFiltroLineOn");
        if ($(this)
          .hasClass('addExecution') && !$(this)
          .hasClass('active')) {
          /* Scroll al final de la página*/
          var target = $(this);
          setTimeout(function () {
            if (target.length) {
              e.preventDefault();
              $('html, body')
                .animate({
                  scrollTop: target.offset()
                    .top
                }, 500);
            }
          }, 300);
        }
      });

    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");
    /* Pinchar en botón añadir ejecución*/
    $('#ifrs9_anadirEjecucion')
      .click(function (e) {
        e.preventDefault();
        $("#ifrs9_contratos-table_info")
          .addClass("filaOculta");
        $("#ifrs9_contratos-table_paginate")
          .addClass("filaOculta");

        rowWidth = $("#ifrs9_contratos-table tbody tr");
        rowWidth = $(rowWidth)
          .width();
        headerWidth = $(".dataTables_scrollHeadInner");
        $(headerWidth)
          .css("width", rowWidth + "px");
        for (i = 0; i <= 3; i++) {
          row = $("#ifrs9_contratos-table tbody tr td")[i];
          sizeCell = $(row)
            .width() + 10;
          header = $("#ifrs9_contratos-table_wrapper thead tr th")[i];
          $(header)
            .css("width", sizeCell + "px");
          $(header)
            .css("padding-right", "0");
          $(header)
            .css("padding-left", "10px");
        }

        /* Scroll al final de la página*/
        $("html, body")
          .animate({
            scrollTop: $(document)
              .height() - $(window)
              .height()
          });
      });
  });

$('#ifrs9_customers-table')
  .on('click', 'tbody tr td', function () {

    $('#ifrs9_ajustes-table tbody')
      .bootstrapTable('destroy');
    var selectedRow = $(this)
      .closest('tr')
      .find('td:first input[type="hidden"]')
      .val();
    //console.log("selectedRow", selectedRow);
    if (selectedRow == undefined) {
      return;
    }
    $('#ifrs9_executionDetail .modal')
      .openModal();
    $('#ifrs9_my-ajustes')
      .hide();
    $('#ifrs9_ajustes-table')
      .bootstrapTable('destroy');
    $.ajax({
      type: "post",
      data: "execution_id=" + selectedRow + "&environment=" + environment,
      url: "load_detail_execution/",
      success: function (data) {
        console.log(data);
        $('#ifrs9_my-ajustes')
          .show();
        $('#execution_name')
          .text(formatTimestamp(data['execution'][0].fichero));
        $('#execution_desc')
          .text(data['execution'][0].comentario);

        var tr = "",
          tr_params = "";
        if (data['projects'].length > 0) {
          for (var i = 0; i < data['projects'].length; i++) {
            if (data['projects'][i].parametros != "") {
              tr_params += "<tr>";
              tr_params += "<td>" +
              i18next.t(data['projects'][i].proyecto.tipoproyecto.descripcion, {
                lng: $('#hiddenlan')
                  .val()
              })  + "</td>";
              tr_params += "<td>" + i18next.t('Params', {
                lng: $('#hiddenlan')
                  .val()
              }) + "</td>";
              tr_params += "<td>" + data['projects'][i].parametros.nombrefichero + "</td>";
              tr_params += "<td>" + formatTimestamp(data['projects'][i].parametros.fechaalta) + "</td>";
              tr_params += "<td>" + data['projects'][i].parametros.motivo + "</td>";
              tr_params += "</tr>";
            }
            tr += "<tr>";
            tr += "<td>" +
            i18next.t(data['projects'][i].proyecto.tipoproyecto.descripcion, {
              lng: $('#hiddenlan')
                .val()
            }) + "</td>";
            tr += "<td>" + i18next.t('Reglas', {
              lng: $('#hiddenlan')
                .val()
            }) + "</td>";
            tr += "<td>" + data['projects'][i].reglas.nombrefichero + "</td>";
            tr += "<td>" + formatTimestamp(data['projects'][i].reglas.fechaalta) + "</td>";
            tr += "<td>" + data['projects'][i].reglas.motivo + "</td>";
            tr += "</tr>";
          }

          tr += tr_params;

          $('#ifrs9_ajustes-table tbody')
            .empty()
            .append(tr);

          $('#ifrs9_ajustes-table')
            .bootstrapTable({
              cache: false,
              striped: true,
              sortable: true,
              pagination: false,
              paginationLoop: false,
              search: false,
              showHeader: true,
              sortOrder: "desc",
              searchAlign: "left",
              showFooter: false,
              pageList: []
            });
        } else {
          tr = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
            lng: $('#hiddenlan')
              .val()
          }) + '</td></tr>';
          $('#ifrs9_ajustes-table tbody')
            .empty()
            .append(tr);

          $('#ifrs9_ajustes-table')
            .bootstrapTable({
              cache: false,
              striped: false,
              sortable: false,
              pagination: false,
              paginationLoop: false,
              search: false,
              showHeader: true,
              searchAlign: "left",
              showFooter: false,
              pageList: []
            });
        }

      }
    });
  });

// PRAGSIS

$('#ifrs9_detalleEjecucion')
  .collapsible({
    accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });

function getRules(id_project, idFill) {
  $('#ifrs9_modalReglas')
    .openModal();
  $('#ifrs9_listado-reglas-table')
    .bootstrapTable('destroy');
  $('#ifrs9_listado-reglas-table tbody')
    .empty();
  $('#ifrs9_btnSeleccionarReglas, .ifrs9_listado_reglas')
    .hide();
  $('.loadingDiv')
    .show();
  $.ajax({
    type: "post",
    dataType: "json",
    url: "get_rules_project/",
    data: "id_project=" + id_project + "&environment=" + environment,
    success: function (data) {
      $('.ifrs9_listado_reglas, #ifrs9_btnSeleccionarReglas')
        .show();
      $('.loadingDiv')
        .hide();
      var tr = "";
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tr += "<tr>";
          tr += "<td>" + data[i].nombrefichero + "<input type='hidden' value='" + data[i].id_rule + "' /></td>";
          tr += "<td>" + formatTimestampEjecucion(data[i].fechaalta, false) + "</td>";
          tr += "<td>" + data[i].motivo + "</td>";
          tr += "</tr>";
        }
        $('#ifrs9_listado-reglas-table tbody')
          .empty()
          .html(tr);

        $('#ifrs9_listado-reglas-table')
          .bootstrapTable({
            cache: false,
            striped: true,
            sortable: true,
            pagination: true,
            paginationLoop: false,
            pageSize: 5,
            search: true,
            showHeader: true,
            sortOrder: "desc",
            sortName: "importDate",
            searchAlign: "left",
            onPageChange: function () {
              if ($('.ifrs9_listado_reglas .search')
                .find('input[type="text"]')
                .val()
                .length > 0) {
                $('<span/>', {
                    class: "total-results",
                    text: "(" + i18next.t('De un total de', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + " " + initialTableLengthRules + " " + i18next.t('Entradas', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ")"
                  })
                  .appendTo('#ifrs9_modalReglas .pagination-detail');
              }
            },
            showFooter: false,
            pageList: []
          });
        var initialTableLengthRules = $('#ifrs9_listado-reglas-table')
          .bootstrapTable('getOptions')
          .totalRows;
        selectedRow = idFill;
      } else {
        tr = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
          lng: $('#hiddenlan')
            .val()
        }) + '</td></tr>';
        $('#ifrs9_listado-reglas-table tbody')
          .empty()
          .html(tr);

        $('#ifrs9_listado-reglas-table')
          .bootstrapTable({
            cache: false,
            striped: true,
            pageSize: 5,
            search: true,
            showHeader: true,
            searchAlign: "left",
          });
      }
    }
  });
}

function getParameters(id_project, idFill) {
  $('#ifrs9_modalParametros')
    .openModal();
  $('#ifrs9_listado-param-table')
    .bootstrapTable('destroy');
  $('.show-hide-table, #ifrs9_btnSeleccionarParam')
    .hide();
  $('.loadingDiv')
    .show();
  $.ajax({
    type: "post",
    dataType: "json",
    url: "get_params_project/",
    data: "id_project=" + id_project + "&environment=" + environment,
    success: function (data) {
      $('.show-hide-table, #ifrs9_btnSeleccionarParam')
        .show();
      $('.loadingDiv')
        .hide();
      var tr = "";
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tr += "<tr>";
          tr += "<td>" + data[i].nombrefichero + "<input type='hidden' value='" + data[i].id_param + "' /></td>";
          tr += "<td>" + formatTimestampEjecucion(data[i].fechaalta, false) + "</td>";
          tr += "<td>" + data[i].motivo + "</td>";
          tr += "</tr>";
        }
        $('#ifrs9_listado-param-table tbody')
          .html(tr);

        $('#ifrs9_listado-param-table')
          .bootstrapTable({
            cache: false,
            striped: true,
            sortable: true,
            pagination: true,
            paginationLoop: false,
            pageSize: 5,
            search: true,
            showHeader: true,
            sortOrder: "desc",
            sortName: "importDate",
            searchAlign: "left",
            onPageChange: function () {
              if ($('#ifrs9_my-listado-param .search')
                .find('input[type="text"]')
                .val()
                .length > 0) {
                $('<span/>', {
                    class: "total-results",
                    text: "(" + i18next.t('De un total de', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + " " + data.length + " " + i18next.t('Entradas', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ")"
                  })
                  .appendTo('#ifrs9_modalParametros .pagination-detail');
              }
            },
            showFooter: false,
            pageList: []
          });
        selectedRow = idFill;
      } else {
        tr = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
          lng: $('#hiddenlan')
            .val()
        }) + '</td></tr>';
        $('#ifrs9_listado-param-table tbody')
          .html(tr);

        $('#ifrs9_listado-param-table')
          .bootstrapTable({
            cache: false,
            striped: true,
            pageSize: 5,
            search: true,
            showHeader: true,
            searchAlign: "left",
          });
      }
    }
  });
}
//Event handler function to enable Run button when all fields are filled-in

function enableRunButton() {

  if ($('#ifrs9_btnEjecutar')
    .is(":disabled")) {

    $('#ifrs9_btnEjecutar')
      .removeClass("button-disabled")
      .prop("disabled", false);
  }

  // This function will be in charge of validating all fields and showing the elements that need to be filled in.
  var isValid = true;

  $('.form-field-execution')
    .each(function () {
      if ($(this)
        .val() === "") {
        // $(this)
        //   .addClass('check-field-coloured')
        isValid = false
      } else {
        $(this)
          .removeClass('check-field-coloured');
      }
    });

  if (isValid && checkDescLengthEjecutar()) {
    $('#panel-error-ejecutar')
      .removeClass('show_warning')
  }
}

$('#ifrs9_btnEjecutar')
  .click(function () {
    var isValid = true;

    if ($('#ifrs9_motivo')
      .hasClass('invalid')) {
      isValid = false;
    }

    $('.form-field-execution')
      .each(function () {
        if ($(this)
          .val() === "") {
          $(this)
            .addClass('check-field-coloured')
          isValid = false;
          $('.warning_text-ejecutar')
            .text(i18next.t('Por favor, rellene todos los campos marcados', {
              lng: $('#hiddenlan')
                .val()
            }));
          $('#panel-error-ejecutar')
            .addClass('show_warning');
        }
      });
    if (isValid) {
      $('#ifrs9_modalConfirmacion')
        .openModal();
    }
  });

function checkDates() {

  var fecha_inicio = $('#ifrs9_dateInicio')
    .val()
    .split("-");
  var fecha_fin = $('#ifrs9_dateFin')
    .val()
    .split("-");
  var result = true;

  if (fecha_inicio != '' && fecha_fin != '') {

    var date1 = new Date(fecha_inicio[2], fecha_inicio[1] - 1, fecha_inicio[0]);
    var date2 = new Date(fecha_fin[2], fecha_fin[1] - 1, fecha_fin[0]);

    if (date2.getTime() < date1.getTime()) {

      $('.warning_text')
        .text(i18next.t('La fecha de fin es menor que la fecha de inicio', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#panel-error')
        .addClass('show_warning');

      $('#ifrs9_btnBuscar')
        .addClass("button-disabled")
        .prop('disabled', true);

      $('#ifrs9_dateInicio')
        .addClass('check-field-coloured')
      $('#ifrs9_dateFin')
        .addClass('check-field-coloured')
    } else {
      $('#panel-error')
        .removeClass('show_warning');

      $('#ifrs9_dateInicio')
        .removeClass('check-field-coloured')
      $('#ifrs9_dateFin')
        .removeClass('check-field-coloured')

      $('#ifrs9_btnBuscar')
        .removeClass("button-disabled")
        .prop('disabled', false);
    }
  } else {
    if ($('#ifrs9_dateInicio')
      .val()
      .length === 0) {
      $('#ifrs9_dateInicio')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    if ($('#ifrs9_dateFin')
      .val()
      .length === 0) {
      $('#ifrs9_dateFin')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    $('#ifrs9_dateInicio')
      .removeClass('check-field-coloured')
    $('#ifrs9_dateFin')
      .removeClass('check-field-coloured')

    $('#panel-error')
      .removeClass('show_warning');

    $('#ifrs9_btnBuscar')
      .removeClass("button-disabled")
      .prop('disabled', false);
  }
}

function checkDescLengthEjecutar(elem) {
  if ($(elem)
    .val()
    .length > 250) {
    $(elem)
      .addClass('check-field-coloured');
    $('.warning_text-ejecutar')
      .text(i18next.t('Descripcion demasiado larga, El limite maximo son 250 caracteres', {
        lng: $('#hiddenlan')
          .val()
      }));
    $('#panel-error-ejecutar')
      .addClass('show_warning');
    return false;
  } else {
    $(elem)
      .removeClass('check-field-coloured');
    $(elem)
      .removeClass('invalid');
    $('#panel-error-ejecutar')
      .removeClass('show_warning');
    return true;
  }
}

function resizeTextArea(textarea) {
  var hiddenDiv = $('.hiddendiv')
    .first();
  if (hiddenDiv.length) {
    hiddenDiv.css('width', textarea.width());
    textarea.css('height', hiddenDiv.height());
  }
}


function custom_sort(a, b) {
  console.log(a + "------" + b)
  return new Date(formatTimestamp(a))
    .getTime() - new Date(formatTimestamp(b))
    .getTime();
}

function custom_sort_one_column(a, b) {
  var a_split = a.split('<'),
    b_split = b.split('<');
  a = a_split[0];
  b = b_split[0];
  return new Date(formatTimestamp(a))
    .getTime() - new Date(formatTimestamp(b))
    .getTime();
}

function custom_sort_operations(a, b) {
  a = a.split('<')[0];
  b = b.split('<')[0];
  return new Date(a)
    .getTime() - new Date(b)
    .getTime();
}
