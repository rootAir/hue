$(document)
  .ready(function () {

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


    // Desplegar al buscar
    $('#ifrs9_btnBuscar')
      .click(function (e) {
        if (checkForm()) {
          // Si busco por contrato
          var checked = $("#ifrs9_checkBusqFiltro")
            .prop("checked");
          if (checked) {
            $('#ifrs9_ajustes-table-contract tbdoy')
              .empty();
            $('#ifrs9_ajustes-table-contract')
              .bootstrapTable('destroy');
            var id_search = $('#ifrs9_idContrato')
              .val(),
              fecha_inicio = $('#ifrs9_dateExclusionInicio')
              .val();
            fecha_fin = $('#ifrs9_dateExclusionFin')
              .val();
            $('.loadingDiv')
              .show();
            $.ajax({
              type: "post",
              data: "environment=" + environment + "&id=" + id_search + "&fecha_inicio=" + fecha_inicio + "&fecha_fin=" + fecha_fin,
              url: "application_search_contract_exclusion/",
              dataType: "json",
              success: function (data) {
                console.log(data);
                $('.loadingDiv')
                  .hide();
                e.preventDefault();
                /* Colapsar filtros */
                $('#ifrs9_filtro .collapsible-header')
                  .removeClass("active");
                $("#ifrs9_filtro .collapsible-body")
                  .addClass("filaOculta");

                var id_contrato, fecha, fecha_formatted, fecha_formatted_string, datos_motor, ajustados, tr = "";
                $('.ifrs9_info_id_contrato')
                  .text(data.detalle.contract_id.value);
                $('.ifrs9_info_entidad')
                  .text(data.detalle.entity.value);
                $('.ifrs9_info_centro')
                  .text(data.detalle.branch.value);
                $('.ifrs9_info_agrupacion')
                  .text(data.detalle.product_grouper.value);

                if (getValueJsonDecimals(data.ajuste.importe.value, $('.ifrs9_info_importe'), "") == true) {
                  $('.ifrs9_info_moneda')
                    .text(data.detalle.currency.value);
                } else {
                  $('.ifrs9_info_moneda')
                    .text("");
                }

                getValueJson(data.ajuste.stage.value, $('.ifrs9_info_stage'), "")
                getValueJsonDecimals(data.ajuste.lgd.value, $('.ifrs9_info_lgd'), "")

                $('.ifrs9_ultima_ejecucion')
                  .text(unixTimestamptToDate(data.ajuste.data_timestamp_part.value));
                // $('.ifrs9_info_usuario_alta')
                //   .text(data.detalle.titular.value);


                var tr = "",
                  fecha_inicio, fecha_fin;
                for (var i = 0; i < data.tramos.length; i++) {
                  tr += "<tr>";
                  tr += "<td>" + i18next.t(data.tramos[i].tipo.nombre, {
                    lng: $('#hiddenlan')
                      .val()
                  }) + "</td>";
                  tr += "<td>" + formatTimestamp(data.tramos[i].fechaini) + "</td>";
                  tr += "<td>" + formatTimestamp(data.tramos[i].fechafin) + "</td>";
                  tr += "</tr>";
                }

                $('#ifrs9_ajustes-table-contract tbody')
                  .empty()
                  .append(tr);

                $('#ifrs9_ajustes-table-contract')
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
                    searchAlign: "left",
                    sortName: "fechaIni",
                    showFooter: false,
                    pageList: [],
                    onPageChange: function () {
                      if ($('#ifrs9_my-ajustes_contract .search')
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
                          .appendTo('#ifrs9_my-ajustes_contract .pagination-detail');
                      }
                    }
                  });
                var initialTableLength = $('#ifrs9_ajustes-table-contract')
                  .bootstrapTable('getOptions')
                  .totalRows;
                $('#ifrs9_contentTableResultados')
                  .removeClass("filaOculta");
                $('#ifrs9_contentTableResultados')
                  .addClass('in');
                $('#ifrs9_contratosCliente')
                  .addClass("filaOculta");
                $('#ifrs9_contratosCliente')
                  .addClass('in');
                $('#ifrs9_detalleCliente')
                  .addClass("filaOculta");
                $('#ifrs9_detalleCliente')
                  .removeClass('in');
                $('#ifrs9_datosUltimaEjecucion')
                  .removeClass("filaOculta");
                $('#ifrs9_datosUltimaEjecucion')
                  .addClass('in');
                $('.loadingDiv')
                  .addClass('ifrs9_hidden')
                $('#ifrs9_detalleContrato')
                  .removeClass("filaOculta");
                $('#ifrs9_detalleContrato')
                  .addClass('in');
              },
              error: function (error) {
                console.log(error);
                $('.warning_text')
                  .text(i18next.t('El ID Contrato introducido no existe', {
                    lng: $('#hiddenlan')
                      .val()
                  }));
                $('#panel-error')
                  .addClass('show_warning');
                setTimeout(function () {
                  $('#panel-no-customer')
                    .removeClass('show_warning');
                }, 2000);

                $('.loadingDiv')
                  .hide();

                $('#ifrs9_contentTableResultados')
                  .addClass("filaOculta");
                $('#ifrs9_contentTableResultados')
                  .removeClass('in');

                $('#ifrs9_contratosCliente')
                  .addClass("filaOculta");
                $('#ifrs9_contratosCliente')
                  .removeClass('in');
                $('#ifrs9_datosUltimaEjecucion')
                  .addClass("filaOculta");
                $('#ifrs9_datosUltimaEjecucion')
                  .removeClass('in');
                $('#ifrs9_filtro .collapsible-header')
                  .addClass("active");
                $("#ifrs9_filtro .collapsible-body")
                  .removeClass("filaOculta");

                $('#ifrs9_detalleContrato')
                  .addClass("filaOculta");
                $('#ifrs9_detalleContrato')
                  .removeClass('in');
                $('#ifrs9_detalleCliente')
                  .addClass("filaOculta");
                $('#ifrs9_detalleCliente')
                  .removeClass('in');
              }
            });
          } else {
            $('#ifrs9_customers-table tbody')
              .empty();
            $('#ifrs9_customers-table')
              .bootstrapTable('destroy');
            var id_search = $('#ifrs9_idCliente')
              .val();
            $('.loadingDiv')
              .show();
            $.ajax({
              type: "post",
              data: "environment=" + environment + "&id=" + id_search + "&fechaini=" + $('#ifrs9_dateExclusionInicio')
                .val() + "&fechafin=" + $('#ifrs9_dateExclusionFin')
                .val(),
              url: "application_search_customer_exclusion/",
              dataType: "json",
              success: function (data) {
                console.log(data)
                data = data.sort(custom_sort);
                // Relleno los campos id_cliente y nombre_cliente
                console.log(data)
                if (data.length > 0) {
                  // $('.id_cliente')
                  //   .text(data[0].customer_id.value);
                  // $('.nombre_cliente')
                  //   .text(data[0].customer_name.value);

                  if (data[0].no_criteria != null) {
                    if (data[0].no_criteria == "1") {
                      $('.id_cliente')
                        .text(data[0].no_criteria_data.customer_id);
                      $('.nombre_cliente')
                        .text(data[0].no_criteria_data.customer_name);
                      var tr = "";
                      $('#ifrs9_customers-table')
                        .bootstrapTable('destroy');

                      $('#ifrs9_customers-table tbody')
                        .empty()
                        .append(tr);

                      $('#ifrs9_customers-table')
                        .bootstrapTable({
                          striped: true,
                          paginationLoop: false,
                          pageSize: 5,
                          showHeader: true,
                          showFooter: false,
                          pageList: []
                        });
                      $('#ifrs9_contentTableResultados')
                        .addClass("filaOculta");
                      $('#ifrs9_contentTableResultados')
                        .removeClass('in');
                      $('#ifrs9_detalleContrato')
                        .addClass("filaOculta");
                      $('#ifrs9_detalleContrato')
                        .removeClass('in');
                      $('#ifrs9_contratosCliente')
                        .removeClass("filaOculta");
                      $('#ifrs9_contratosCliente')
                        .addClass('in');
                      $('#ifrs9_detalleCliente')
                        .removeClass("filaOculta");
                      $('#ifrs9_datosUltimaEjecucion')
                        .addClass("filaOculta");
                      $('#ifrs9_datosUltimaEjecucion')
                        .removeClass('in');
                      $('.loadingDiv')
                        .addClass('ifrs9_hidden')
                        .hide();

                    } else {
                      $('.id_cliente')
                        .text('----');
                      $('.nombre_cliente')
                        .text('----');
                    }
                  } else {
                    $('.id_cliente')
                      .text(data[0].customer_id.value);
                    $('.nombre_cliente')
                      .text(data[0].customer_name.value);
                    var id_contrato, fecha, fecha_formatted, fecha_formatted_string, datos_motor, ajustados, tr = "";

                    $('.loadingDiv')
                      .hide();
                    e.preventDefault();
                    /* Colapsar filtros */
                    $('#ifrs9_filtro .collapsible-header')
                      .removeClass("active");
                    $("#ifrs9_filtro .collapsible-body")
                      .addClass("filaOculta");
                    for (var i = 0; i < data.length; i++) {
                      if (data[i].no_criteria == null) {

                        tr += "<tr>";
                        id_contrato = data[i].contract_id.value;
                        fecha = data[i].data_timestamp_part.value;
                        fecha_formatted = new Date(parseInt(fecha));
                        fecha_formatted_string = addZero(fecha_formatted.getDate()) + "-" + addZero(fecha_formatted.getMonth() + 1) + "-" + fecha_formatted.getFullYear() + " " + addZero(fecha_formatted.getHours()) + ":" +
                          addZero(fecha_formatted.getMinutes()) + ":" + addZero(fecha_formatted.getSeconds());
                        datos_motor = '<ul>' +
                          '<li><b>' + i18next.t('Importe', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ': </b>' + getValueJsonImporteTable(data[i].importe.value, data[i].currency.value) + '</li>';

                        if (data[i].porcentaje.directo == "1" && data[i].porcentaje.pct_in != "") {
                          datos_motor = datos_motor + '<li><b>% ' + i18next.t('Importe', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ' : </b>' + addDecimals(data[i].porcentaje.pct_in) + '</li>';
                        }

                        datos_motor = datos_motor + '<li><b>' + i18next.t('Stage', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ': </b>' + getValueJsonTable(data[i].stage.value) + '</li>' +
                          '<li><b>' + i18next.t('LGD', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ': </b>' + addDecimals(data[i].lgd.value) + '</li>' +
                          '</ul>';

                        fecha_inicio = $('#ifrs9_dateExclusionInicio')
                          .val();
                        fecha_fin = $('#ifrs9_dateExclusionFin')
                          .val();

                        tr += "<td><a href='javascript:void(0);' onclick=\"show_contract_exclusions_detail(" + id_contrato + ", " + id_search + ", \'" + fecha_inicio + "\', \'" + fecha_fin + "\');\"><span class='fa fa-eye color-icon'></span></a></td>";
                        tr += "<td>" + id_contrato + "</td>";
                        tr += "<td>" + data[i].branch.value + "</td>";
                        tr += "<td>" + data[i].product_grouper.value + "</td>";
                        tr += "<td>" + fecha_formatted_string + "</td>";
                        tr += "<td>" + datos_motor + "</td>";
                        tr += "</tr>";
                      }
                    }

                    $('#ifrs9_customers-table tbody')
                      .empty()
                      .append(tr);

                    $('#ifrs9_customers-table')
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
                        sortName: "execDate",
                        searchAlign: "left",
                        showFooter: false,
                        pageList: [],
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
                              .appendTo('#ifrs9_my-customers .pagination-detail');
                          }
                        }
                      });
                    var initialTableLength = $('#ifrs9_customers-table')
                      .bootstrapTable('getOptions')
                      .totalRows;
                    $('#ifrs9_contentTableResultados')
                      .addClass("filaOculta");
                    $('#ifrs9_contentTableResultados')
                      .removeClass('in');
                    $('#ifrs9_detalleContrato')
                      .addClass("filaOculta");
                    $('#ifrs9_detalleContrato')
                      .removeClass('in');
                    $('#ifrs9_contratosCliente')
                      .removeClass("filaOculta");
                    $('#ifrs9_contratosCliente')
                      .addClass('in');
                    $('#ifrs9_detalleCliente')
                      .removeClass("filaOculta");
                    $('.loadingDiv')
                      .addClass('ifrs9_hidden')
                    $('#ifrs9_datosUltimaEjecucion')
                      .addClass("filaOculta");
                    $('#ifrs9_datosUltimaEjecucion')
                      .removeClass('in');
                  }
                }
              },
              error: function (error) {
                console.log(error);
                // console.log("Error!!: Cliente no encontrado. Por favor, inténtelo de nuevo");
                $('.warning_text')
                  .text(i18next.t('El ID Cliente introducido no existe', {
                    lng: $('#hiddenlan')
                      .val()
                  }));
                $('#panel-error')
                  .addClass('show_warning');
                setTimeout(function () {
                  $('#panel-no-customer')
                    .removeClass('show_warning');
                }, 2000);

                $('.loadingDiv')
                  .hide();

                $('#ifrs9_contentTableResultados')
                  .addClass("filaOculta");
                $('#ifrs9_contentTableResultados')
                  .removeClass('in');
                $('#ifrs9_detalleContrato')
                  .addClass("filaOculta");
                $('#ifrs9_detalleContrato')
                  .removeClass('in');
                $('#ifrs9_detalleCliente')
                  .addClass("filaOculta");
                $('#ifrs9_detalleCliente')
                  .removeClass('in');
                $('#ifrs9_contratosCliente')
                  .addClass("filaOculta");
                $('#ifrs9_contratosCliente')
                  .removeClass('in');
                $('#ifrs9_filtro .collapsible-header')
                  .addClass("active");
                $("#ifrs9_filtro .collapsible-body")
                  .removeClass("filaOculta");
                $('#ifrs9_datosUltimaEjecucion')
                  .addClass("filaOculta");
                $('#ifrs9_datosUltimaEjecucion')
                  .removeClass('in');
                $('.loadingDiv')
                  .addClass('ifrs9_hidden');

              }
            });

            // $('#ifrs9_customers-table_wrapper thead th')[0].click(function (e) {});
          }
          /* Quitar línea cabecera */
          $("#ifrs9_cabFiltro span")
            .removeClass("cabFiltroLineOn");
          $("#ifrs9_cabFiltro h4")
            .removeClass("cabFiltroLineOn");
          $("#ifrs9_cabFiltro span")
            .addClass("cabFiltroLineOff");
          $("#ifrs9_cabFiltro h4")
            .addClass("cabFiltroLineOff");
        }
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
      });

    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");

    /* SWITCH ID CONTRATO/CLIENTE */
    $(".switch")
      .click(function () {
        var checked = $("#ifrs9_checkBusqFiltro")
          .prop("checked");
        if (checked) {
          $('#ifrs9_buscarAjustesTipoBusquedaContrato')
            .removeClass('filaOculta');
          $('#ifrs9_buscarAjustesTipoBusquedaCliente')
            .addClass('filaOculta');
        } else {
          $('#ifrs9_buscarAjustesTipoBusquedaContrato')
            .addClass('filaOculta');
          $('#ifrs9_buscarAjustesTipoBusquedaCliente')
            .removeClass('filaOculta');
        }
        $('.form-field-desc')
          .each(function () {
            $(this)
              .removeClass('check-field-coloured');
          });
        $('#ifrs9_idCliente')
          .removeClass('check-field-coloured')
        $('#ifrs9_idContrato')
          .removeClass('check-field-coloured')
        $('#panel-error')
          .removeClass('show_warning')
      });

    $('#ifrs9_dateInicioIcon')
      .on('click', function () {
        $('#ifrs9_dateInicio_root')
          .addClass("picker--focused picker--opened");
        $('.picker__select--month')
          .prop("disabled", false);
        $('.picker__select--year')
          .prop("disabled", false);
        $(".btn-flat")
          .prop("disabled", false);
      });

    $('#ifrs9_dateFinIcon')
      .on('click', function () {
        $('#ifrs9_dateFin_root')
          .addClass("picker--focused picker--opened");
        $('.picker__select--month')
          .prop("disabled", false);
        $('.picker__select--year')
          .prop("disabled", false);
        $(".btn-flat")
          .prop("disabled", false);
      });

  });

function checkForm() {
  var isValid = true;

  if (($('#ifrs9_idCliente')
      .val()
      .length === 0) &&
    ($('#ifrs9_buscarAjustesTipoBusquedaContrato')
      .hasClass('filaOculta'))) {
    isValid = false;
    $('#ifrs9_idCliente')
      .addClass('check-field-coloured');
  }

  if (($('#ifrs9_idContrato')
      .val()
      .length === 0) &&
    ($('#ifrs9_buscarAjustesTipoBusquedaCliente')
      .hasClass('filaOculta'))) {
    isValid = false;
    $('#ifrs9_idContrato')
      .addClass('check-field-coloured');
  }

  if (!isValid) {
    $('.warning_text')
      .text(i18next.t('Por favor, rellene los campos marcados', {
        lng: $('#hiddenlan')
          .val()
      }));
    $('#panel-error')
      .addClass('show_warning');
  }
  return isValid;
}

function checkFields() {

  var isValid = true;

  if (($('#ifrs9_idCliente')
      .val()
      .length === 0) &&
    ($('#ifrs9_buscarAjustesTipoBusquedaContrato')
      .hasClass('filaOculta'))) {
    isValid = false;
  } else {
    $('#ifrs9_idCliente')
      .removeClass('check-field-coloured');
  }

  if (($('#ifrs9_idContrato')
      .val()
      .length === 0) &&
    ($('#ifrs9_buscarAjustesTipoBusquedaCliente')
      .hasClass('filaOculta'))) {
    isValid = false;
  } else {
    $('#ifrs9_idContrato')
      .removeClass('check-field-coloured');
  }

  // $('.form-field-desc')
  // .each(function () {
  //   if (($(this)
  //   .val() === "") || ($(this)
  //   .val() === 0)) {
  //     isValid = false
  //   } else {
  //     $(this)
  //     .removeClass('check-field-coloured');
  //   }
  // });

  if (isValid) {
    $('#panel-error')
      .removeClass('show_warning')
  }
}

function checkDates() {

  var validDates = true;

  if ($('#ifrs9_dateExclusionInicio')
    .val()
    .length != 0 &&
    $('#ifrs9_dateExclusionFin')
    .val()
    .length != 0) {

    var fecha_inicio = $('#ifrs9_dateExclusionInicio')
      .val()
      .split("-");
    var fecha_fin = $('#ifrs9_dateExclusionFin')
      .val()
      .split("-");

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

      $('#ifrs9_idContrato')
        .prop("disabled", true)
        .prop("readonly", true);

      $('#ifrs9_idCliente')
        .prop("disabled", true)
        .prop("readonly", true);

      $('#ifrs9_btnBuscar')
        .addClass("button-disabled")
        .prop("disabled", true);

      $('#ifrs9_dateExclusionInicio')
        .addClass('check-field-coloured')
      $('#ifrs9_dateExclusionFin')
        .addClass('check-field-coloured')

      validDates = false

    } else {
      $('#panel-error')
        .removeClass('show_warning');

      $('#ifrs9_dateExclusionInicio')
        .removeClass('check-field-coloured')
      $('#ifrs9_dateExclusionFin')
        .removeClass('check-field-coloured')

      $('#ifrs9_btnBuscar')
        .removeClass("button-disabled")
        .prop('disabled', false);

      $('#ifrs9_idContrato')
        .prop("disabled", false)
        .prop("readonly", false);

      $('#ifrs9_idCliente')
        .prop("disabled", false)
        .prop("readonly", false);

      validDates = true
    }
  } else {
    if ($('#ifrs9_dateExclusionInicio')
      .val()
      .length === 0) {
      $('#ifrs9_dateExclusionInicio')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    if ($('#ifrs9_dateExclusionFin')
      .val()
      .length === 0) {
      $('#ifrs9_dateExclusionFin')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    $('#ifrs9_dateExclusionInicio')
      .removeClass('check-field-coloured')
    $('#ifrs9_dateExclusionFin')
      .removeClass('check-field-coloured')

    $('#panel-error')
      .removeClass('show_warning');

    $('#ifrs9_btnBuscar')
      .removeClass("button-disabled")
      .prop('disabled', false);

    $('#ifrs9_idContrato')
      .prop("disabled", false)
      .prop("readonly", false);

    $('#ifrs9_idCliente')
      .prop("disabled", false)
      .prop("readonly", false);

    validDates = true
  }
  return validDates
}

function search_exclusions_by_contract() {
  $.ajax({
    type: "post",
    data: $('#search_exclusions_application')
      .serialize(),
    url: "search_exclusions_application/",
    success: function (data) {
      console.log(data);
      //TODO add code needed to fill the table with info to get detail in further queries
    }
  });
}

function show_contract_exclusions_detail(id_contrato, id_cliente, fecha_inicio, fecha_fin) {
  $('#ifrs9_ajustes-table-customer')
    .bootstrapTable('destroy');
  $.ajax({
    type: "post",
    url: "buscar_tramos_exclusion_contrato/",
    dataType: "json",
    data: "id_contrato=" + id_contrato + "&id_cliente=" + id_cliente + "&fecha_inicio=" + fecha_inicio + "&fecha_fin=" + fecha_fin + "&environment=" + environment,
    success: function (data) {
      console.log(data);
      //Tengo que crear la tabla. Para cada objeto del array que recibo, debo crear tres filas con los datos que hacen falta.
      var tr = "";
      for (var i = 0; i < data.length; i++) {
        tr += "<tr>";
        tr += "<td>" + i18next.t(data[i].tipo.nombre, {
          lng: $('#hiddenlan')
            .val()
        }) + "</td>";
        tr += "<td>" + formatTimestamp(data[i].fechaini) + "</td>";
        tr += "<td>" + formatTimestamp(data[i].fechafin) + "</td>";
        tr += "</tr>";
      }

      $('#ifrs9_ajustes-table-customer tbody')
        .empty()
        .append(tr);

      $('#ifrs9_ajustes-table-customer')
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
          searchAlign: "left",
          showFooter: false,
          pageList: [],
          onPageChange: function () {
            if ($('#ifrs9_contractDetail .search')
              .find('input[type="text"]')
              .val()
              .length > 0) {
              $('<span/>', {
                  class: "total-results",
                  text: "(" + i18next.t('De un total de', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + " " + $('#ifrs9_ajustes-table-customer')
                    .bootstrapTable('getData')
                    .length + " " + i18next.t('Entradas', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ")"
                })
                .appendTo('#ifrs9_contractDetail .pagination-detail');
            }
          }
        });
      $('#ifrs9_contractDetail .modal')
        .openModal();
    },
    error: function (error) {
      console.log(error)
    }
  })
}

// function formatTimestamp(date1) {
//
//   var datetime = date1.split(' ');
//
//   if (datetime.length == 1) {
//     datetime = date1.split('T');
//   }
//   var date = datetime[0];
//   var time = datetime[1];
//
//   var formato = date.split('-');
//
//   return formato[2] + '-' + formato[1] + '-' + formato[0];
// }


function custom_sort(a, b) {
  return a.data_timestamp_part.value - b.data_timestamp_part.value;
}

function custom_sort_table(a, b) {
  return new Date(formatTimestamp(a))
    .getTime() - new Date(formatTimestamp(b))
    .getTime();
}

function unixTimestamptToDate(timestamp) {
  var date = new Date(parseInt(timestamp));
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  // Will display time in 10:30:23 format
  var formattedTime = day + "-" + addZero(month) + "-" + year + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime
}
