var $datepicker;

$(document)
  .ready(function () {
    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      })
    $('select')
      .material_select();

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
        sortName: "execDate",
        searchAlign: "left",
        showFooter: false,
        pageList: [],
        onPostBody: function () {
          $('.table-container')
            .removeClass('ifrs9_hidden');
          $('.loadingDiv')
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

    var myEnvi = environment;

    if ($('#hiddenlan')
      .val() === 'es-ES') {
      if (myEnvi === 3) {
        $datepicker = $('.datepicker')
          .pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            firstDay: true,
            min: true,
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
      } else {
        $datepicker = $('.datepicker')
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
      }
    } else if ($('#hiddenlan')
      .val() === 'pt-PT') {
      if (myEnvi === 3) {
        $datepicker = $('.datepicker')
          .pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            firstDay: true,
            min: true,
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
        $datepicker = $('.datepicker')
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
      }
    } else {
      if (myEnvi === 3) {
        $datepicker = $('.datepicker')
          .pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            firstDay: true,
            min: true,
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
      } else {
        $datepicker = $('.datepicker')
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
    }

    $('#ifrs9_idCliente')
      .on('keyup blur', function () {
        if ($(this)
          .val()
          .length > 0) {
          $('#ifrs9_btnBuscar')
            .removeClass('button-disabled')
            .prop('disabled', false);
        } else {
          $('#ifrs9_btnBuscar')
            .addClass('button-disabled')
            .prop('disabled', true);
          $('#ifrs9_filtro .collapsible-header')
            .addClass("active");
          $("#ifrs9_filtro .collapsible-body")
            .removeClass("filaOculta");
          $('#ifrs9_datosAjuste')
            .addClass("filaOculta");
          $('#ifrs9_datosAjuste')
            .removeClass('in');
          $('#ifrs9_detalleCliente')
            .addClass("filaOculta");
          $('#ifrs9_detalleCliente')
            .removeClass('in');
          $('#ifrs9_datosAjusteUltEje')
            .addClass("filaOculta");
          $('#ifrs9_datosAjusteUltEje')
            .removeClass('in');
          /* Quitar l�nea cabecera */

          $("#ifrs9_cabFiltro span")
            .addClass("cabFiltroLineOn");
          $("#ifrs9_cabFiltro h4")
            .addClass("cabFiltroLineOn");
          $("#ifrs9_cabFiltro span")
            .removeClass("cabFiltroLineOff");
          $("#ifrs9_cabFiltro h4")
            .removeClass("cabFiltroLineOff");
        }
      });

    // Desplegar al buscar
    $('#ifrs9_btnBuscar')
      .click(function (e) {
        $('#ifrs9_customers-table')
          .bootstrapTable('destroy');
        id_search = $('#ifrs9_idCliente')
          .val();
        $('.loadingDiv')
          .show();
        $.ajax({
          type: "post",
          data: "environment=" + environment + "&flagclientecontrato=" + flagclientecontrato + "&id=" + id_search,
          url: "search_info_contract_for_adjustment_insert_by_client/",
          dataType: "json",
          success: function (data) {
            console.log(data)
            e.preventDefault();

            $('.loadingDiv')
              .hide();
            // Relleno los campos id_cliente y nombre_cliente
            if (data.contracts.length > 0) {
              $('.id_cliente')
                .text(data.detalle.customer_id.value);
              $('.nombre_cliente')
                .text(data.detalle.customer_name.value);
            } else {
              $('.id_cliente')
                .text('----');
              $('.nombre_cliente')
                .text('----');
            }

            data = data.contracts.sort(custom_sort) //ordenaci�n por fecha del array de elementos

            /* Quitar l�nea cabecera */
            $("#ifrs9_cabFiltro span")
              .removeClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro h4")
              .removeClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro span")
              .addClass("cabFiltroLineOff");
            $("#ifrs9_cabFiltro h4")
              .addClass("cabFiltroLineOff");

            var id_contrato, fecha, fecha_formatted, fecha_formatted_string, datos_motor, ajustados, tr = "";

            for (var i = 0; i < data.length; i++) {
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

              datos_motor = datos_motor + '<li><b>' + i18next.t('Stage', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getValueJsonTable(data[i].stage.value) + '</li>' +
                '<li><b>' + i18next.t('LGD', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + addDecimals(data[i].lgd.value) + '</li>' +
                '</ul>';

              ajustados = '<ul>' +
                '<li><b>' + i18next.t('Importe', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getValueJsonImporteDirectoTable(data[i].importe.value, data[i].importe.ajuste, data[i].importe.directo, data[i].currency.value) + '</li>'

              var NaN_msg = $('#hiddenNan')
                .val()
              if (data[i].porcentaje.directo == "1" && data[i].porcentaje.pct_in != "" && data[i].porcentaje.pct_in != NaN_msg) {
                ajustados = ajustados + '<li><b>% ' + i18next.t('Importe', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getPorcImporteJsonDirectoTable(data[i].porcentaje.pct_in, data[i].porcentaje.directo) + '</li>'
              }

              ajustados = ajustados + '<li><b>' + i18next.t('Stage', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getValueJsonStageDirectoTable(data[i].stage.value, data[i].stage.ajuste, data[i].stage.directo, data[i].exclusion_30d.value) + '</li>' +
                '<li><b>' + i18next.t('LGD', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getValueJsonLGDDirectoTable(data[i].lgd.value, data[i].lgd.ajuste, data[i].lgd.directo, data[i].exclusion_30d.value) + '</li>' +
                '</ul>';

              tr += "<td>" + id_contrato + "</td>";
              tr += "<td data-timestamp='" + fecha + "'>" + fecha_formatted_string + "</td>";
              tr += "<td>" + datos_motor + "</td>";
              tr += "<td>" + ajustados + "</td>";
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
                      .appendTo('.pagination-detail');
                  }
                }
              });
            var initialTableLength = $('#ifrs9_customers-table')
              .bootstrapTable('getOptions')
              .totalRows;
            $('#ifrs9_filtro .collapsible-header')
              .removeClass("active");
            $("#ifrs9_filtro .collapsible-body")
              .addClass("filaOculta");
            $('#ifrs9_datosAjuste')
              .removeClass("filaOculta");
            $('#ifrs9_datosAjuste')
              .addClass('in');
            $('#ifrs9_datosAjusteUltEje')
              .removeClass("filaOculta");
            $('#ifrs9_datosAjusteUltEje')
              .addClass('in');
            /* Quitar l�nea cabecera */

            $("#ifrs9_cabFiltro span")
              .removeClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro h4")
              .removeClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro span")
              .addClass("cabFiltroLineOff");
            $("#ifrs9_cabFiltro h4")
              .addClass("cabFiltroLineOff");
            $('#ifrs9_detalleCliente')
              .removeClass("filaOculta");

            $('#ifrs9_indicador_leyenda')
              .removeClass("filaOculta");
          },
          error: function (error) {
            console.log(error);
            $('.loadingDiv')
              .hide();
            // console.log("Error!!: Cliente no encontrado. Por favor, int�ntelo de nuevo");
            $('#panel-no-customer')
              .addClass('show_warning');
            setTimeout(function () {
              $('#panel-no-customer')
                .removeClass('show_warning');
            }, 2000);

            $('#ifrs9_filtro .collapsible-header')
              .addClass("active");
            $("#ifrs9_filtro .collapsible-body")
              .removeClass("filaOculta");
            $('#ifrs9_datosAjuste')
              .addClass("filaOculta");

            $('#ifrs9_datosAjuste')
              .removeClass('in');
            $('#ifrs9_datosAjusteUltEje')
              .addClass("filaOculta");
            $('#ifrs9_datosAjusteUltEje')
              .removeClass('in');
            /* Quitar l�nea cabecera */

            $("#ifrs9_cabFiltro span")
              .addClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro h4")
              .addClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro span")
              .removeClass("cabFiltroLineOff");
            $("#ifrs9_cabFiltro h4")
              .removeClass("cabFiltroLineOff");

            $('#ifrs9_detalleCliente')
              .addClass("filaOculta");

            $('#ifrs9_indicador_leyenda')
              .addClass("filaOculta");
          }
        })
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

    $('#ifrs9_importe')
      .keyup(function (e) {
        if ($('#ifrs9_importe')
          .val() != '') {
          $('#ifrs9_porcImporte')
            .prop("disabled", true);
        } else {
          $('#ifrs9_porcImporte')
            .prop("disabled", false);
        }
      });
    $('#ifrs9_porcImporte')
      .keyup(function (e) {
        if ($('#ifrs9_porcImporte')
          .val() != '') {
          $('#ifrs9_importe')
            .prop("disabled", true);
        } else {
          $('#ifrs9_importe')
            .prop("disabled", false);
        }
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

$('#ifrs9_anadir_ajuste')
  .click(function (e) {
    e.preventDefault();

    $('#ifrs9_anadir_ajuste')
      .submit();
  });

function limpiar_alta_ajuste_cliente() {
  var $picker0_aux = $($datepicker[0])
  var $picker1_aux = $($datepicker[1])
  var picker0 = $picker0_aux.pickadate('picker');
  var picker1 = $picker1_aux.pickadate('picker');
  picker0.clear();
  picker1.clear();
  $('#form_insertar_ajuste_cliente')[0].reset();
  $('#ifrs9_collapseDatosUltimaEjecucion label.active')
    .removeClass('active');
  $('input:disabled')
    .prop('disabled', false);
  $('#ifrs9_anadir_ajuste')
    .addClass("button-disabled")
    .prop("disabled", true);
  $('#panel-error')
    .removeClass('show_warning')

  $('.form-all-field')
    .each(function () {
      $(this)
        .removeClass('check-field-coloured');
    });
  $('div.first-input')
    .children('input')
    .removeClass('check-field-coloured');
}


function checkSpecialFields() {

  if ($('#ifrs9_anadir_ajuste')
    .is(":disabled")) {

    $('#ifrs9_anadir_ajuste')
      .removeClass("button-disabled")
      .prop("disabled", false);
  }

  var isValid = true;

  if (($('#ifrs9_importe')
      .val()
      .length === 0) &&
    ($('#ifrs9_porcImporte')
      .val()
      .length === 0) &&
    ($('#select_stage')
      .val() === "0")) {
    $('#ifrs9_importe')
      .removeClass('check-field-coloured');
    $('#ifrs9_porcImporte')
      .removeClass('check-field-coloured');
    $('div.first-input')
      .children('input')
      .removeClass('check-field-coloured');
    $('#panel-error')
      .removeClass('show_warning')
    isValid = false;
  }

  if ($('#ifrs9_importe')
    .val()
    .length != 0) {
    formatearImporte();
    $('#ifrs9_porcImporte')
      .removeClass('check-field-coloured');
    $('div.first-input')
      .children('input')
      .removeClass('check-field-coloured');
    if (!isValidImporte()) {
      $('.warning_text')
        .text(i18next.t('El campo Importe debe ser numérico y mayor que 0', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#panel-error')
        .addClass('show_warning');
      $('#ifrs9_importe')
        .addClass('check-field-coloured');
      isValid = false;
    } else {
      $('#ifrs9_importe')
        .removeClass('check-field-coloured');
    }
  }

  if ($('#ifrs9_porcImporte')
    .val()
    .length != 0) {
    formatearPorcImporte();
    $('#ifrs9_importe')
      .removeClass('check-field-coloured');
    $('div.first-input')
      .children('input')
      .removeClass('check-field-coloured');
    if (!isValidPorcImporte()) {
      $('.warning_text')
        .text(i18next.t('El campo % Importe debe estar comprendido entre 0 y 100 sin ceros delante', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#panel-error')
        .addClass('show_warning');
      $('#ifrs9_porcImporte')
        .addClass('check-field-coloured');
      isValid = false;
    } else {
      $('#ifrs9_porcImporte')
        .removeClass('check-field-coloured');
    }
  }

  if (isValid) {
    $('#ifrs9_importe')
      .removeClass('check-field-coloured');
    $('#ifrs9_porcImporte')
      .removeClass('check-field-coloured');
    $('div.first-input')
      .children('input')
      .removeClass('check-field-coloured');
    $('#panel-error')
      .removeClass('show_warning')
  }
}

$(".first-input")
  .change(function () {
    checkSpecialFields();
  });

function checkFields() {

  if ($('#ifrs9_anadir_ajuste')
    .is(":disabled")) {

    $('#ifrs9_anadir_ajuste')
      .removeClass("button-disabled")
      .prop("disabled", false);
  }

  var isValid = true;

  $('.form-all-field')
    .each(function () {
      if (($(this)
          .val() === "") || ($(this)
          .val() === 0)) {
        isValid = false
      } else {
        $(this)
          .removeClass('check-field-coloured');
      }
    });

  if (isValid) {
    $('#panel-error')
      .removeClass('show_warning')
  }
}

$('#ifrs9_importe')
  .keypress(function (event) {

    if ($('#hiddenlan')
      .val() == "en-US") {
      var $this = $(this);

      if ((event.which != 46 || $this.val()
          .indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }

      var text = $(this)
        .val();
      if ((event.which == 46) && (text.indexOf('.') == -1)) {
        setTimeout(function () {
          if ($this.val()
            .substring($this.val()
              .indexOf('.'))
            .length > 3) {
            $this.val($this.val()
              .substring(0, $this.val()
                .indexOf('.') + 3));
          }
        }, 1);
      }

      if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.'))
          .length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
        event.preventDefault();
      }
    } else {
      var $this = $(this);

      if ((event.which != 44 || $this.val()
          .indexOf(',') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }

      var text = $(this)
        .val();
      if ((event.which == 44) && (text.indexOf(',') == -1)) {
        setTimeout(function () {
          if ($this.val()
            .substring($this.val()
              .indexOf(','))
            .length > 3) {
            $this.val($this.val()
              .substring(0, $this.val()
                .indexOf(',') + 3));
          }
        }, 1);
      }

      if ((text.indexOf(',') != -1) &&
        (text.substring(text.indexOf(','))
          .length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
        event.preventDefault();
      }
    }
  });

$('#ifrs9_porcImporte')
  .keypress(function (event) {

    if ($('#hiddenlan')
      .val() == "en-US") {
      var $this = $(this);

      if ((event.which != 46 || $this.val()
          .indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }

      var text = $(this)
        .val();
      if ((event.which == 46) && (text.indexOf('.') == -1)) {
        setTimeout(function () {
          if ($this.val()
            .substring($this.val()
              .indexOf('.'))
            .length > 3) {
            $this.val($this.val()
              .substring(0, $this.val()
                .indexOf('.') + 3));
          }
        }, 1);
      }

      if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.'))
          .length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
        event.preventDefault();
      }
    } else {
      var $this = $(this);

      if ((event.which != 44 || $this.val()
          .indexOf(',') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }

      var text = $(this)
        .val();
      if ((event.which == 44) && (text.indexOf(',') == -1)) {
        setTimeout(function () {
          if ($this.val()
            .substring($this.val()
              .indexOf(','))
            .length > 3) {
            $this.val($this.val()
              .substring(0, $this.val()
                .indexOf(',') + 3));
          }
        }, 1);
      }

      if ((text.indexOf(',') != -1) &&
        (text.substring(text.indexOf(','))
          .length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
        event.preventDefault();
      }
    }
  });

function formatearImporte() {
  var number = $('#ifrs9_importe')
    .val()

  if (number != "") {
    if ($('#hiddenlan')
      .val() == "en-US") {
      unformattedNumber = number.replace(/\,/g, '')
      if (unformattedNumber.indexOf(".") == -1) {
        unformattedNumber = unformattedNumber + '.00'
      } else {
        var temp = unformattedNumber.split(".");
        var longTemp2 = temp[1].length;
        if (longTemp2 == 1) {
          unformattedNumber = temp[0] + '.' + temp[1].charAt(0) + '0';
        } else {
          unformattedNumber = temp[0] + '.' + temp[1].charAt(0) + temp[1].charAt(1);
        }
      }
      formatNumber = numberWithCommas(unformattedNumber)
    } else {
      unformattedNumber = number.replace(/\./g, '')
      if (unformattedNumber.indexOf(",") == -1) {
        unformattedNumber = unformattedNumber + ',00'
      } else {
        var temp = unformattedNumber.split(",");
        var longTemp2 = temp[1].length;
        if (longTemp2 == 1) {
          unformattedNumber = temp[0] + ',' + temp[1].charAt(0) + '0';
        } else {
          unformattedNumber = temp[0] + ',' + temp[1].charAt(0) + temp[1].charAt(1);
        }
      }
      formatNumber = numberWithPoints(unformattedNumber)
      unformattedNumber = unformattedNumber.replace(",", ".")
    }


    $('#ifrs9_hiddenImporte')
      .val(unformattedNumber)
    $('#ifrs9_importe')
      .val(formatNumber)
  }
}

function numberWithCommas(num) {

  return num.toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

function numberWithPoints(num) {

  return num.toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
}

function formatearPorcImporte() {
  var number = $('#ifrs9_porcImporte')
    .val()

  if (number != "") {
    if ($('#hiddenlan')
      .val() == "en-US") {
      if (number.indexOf(".") == -1) {
        number = number + '.00'
      } else {
        var temp = number.split(".");
        var longTemp2 = temp[1].length;
        if (longTemp2 == 1) {
          number = temp[0] + '.' + temp[1].charAt(0) + '0';
        } else {
          number = temp[0] + '.' + temp[1].charAt(0) + temp[1].charAt(1);
        }
      }
      unformattedNumber = number
    } else {
      if (number.indexOf(",") == -1) {
        number = number + ',00'
      } else {
        var temp = number.split(",");
        var longTemp2 = temp[1].length;
        if (longTemp2 == 1) {
          number = temp[0] + ',' + temp[1].charAt(0) + '0';
        } else {
          number = temp[0] + ',' + temp[1].charAt(0) + temp[1].charAt(1);
        }
      }
      unformattedNumber = number.replace(",", ".")
    }

    $('#ifrs9_hiddenPorcImporte')
      .val(unformattedNumber)
    $('#ifrs9_porcImporte')
      .val(number)
  }
}

function mostrarModalConfirmacionAltaAjusteCliente() {
  allWell = true;

  $('.form-field-desc')
    .each(function () {
      if (($(this)
          .val() === "") || ($(this)
          .val() === 0)) {
        $(this)
          .addClass('check-field-coloured')
        allWell = false;
        $('.warning_text')
          .text(i18next.t('Por favor, rellene todos los campos marcados', {
            lng: $('#hiddenlan')
              .val()
          }));
        $('#panel-error')
          .addClass('show_warning');
      }
    });

  if (allWell) {
    if (($('#ifrs9_importe')
        .val()
        .length === 0) &&
      ($('#ifrs9_porcImporte')
        .val()
        .length === 0) &&
      ($('#select_stage')
        .val() === "0")) {
      $('#ifrs9_importe')
        .addClass('check-field-coloured');
      $('#ifrs9_porcImporte')
        .addClass('check-field-coloured');
      $('div.first-input')
        .children('input')
        .addClass('check-field-coloured');
      openModal = false;
      $('.warning_text')
        .text(i18next.t('Por favor, rellene al menos uno de los tres campos', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#panel-error')
        .addClass('show_warning');
      return;
    } else {
      if ($('#ifrs9_importe')
        .val()
        .length != 0) {
        if (!isValidImporte()) {
          $('.warning_text')
            .text(i18next.t('El campo Importe debe ser num�rico y mayor que 0', {
              lng: $('#hiddenlan')
                .val()
            }));
          $('#panel-error')
            .addClass('show_warning');
          $('#ifrs9_importe')
            .addClass('check-field-coloured');
          return;
        }
      }
      if ($('#ifrs9_porcImporte')
        .val()
        .length != 0) {
        if (!isValidPorcImporte()) {
          $('.warning_text')
            .text(i18next.t('El campo % Importe debe estar comprendido entre 0 y 100 sin ceros delante', {
              lng: $('#hiddenlan')
                .val()
            }));
          $('#panel-error')
            .addClass('show_warning');
          $('#ifrs9_porcImporte')
            .addClass('check-field-coloured');
          isValid = false;
          return;
        }
      }
    }
    if (checkDates() && commentLength()) {
      $('#myModalConfirmacionAltaAjusteCustomer .modal')
        .openModal();
    }
  }
}

function submit_new_adjustment_by_customer() {
  $('#form_insertar_ajuste_cliente')
    .submit();

  $('input:disabled')
    .prop('disabled', false);
  $('#ifrs9_anadir_ajuste')
    .addClass("button-disabled")
    .prop("disabled", true);

  var $picker0_aux = $($datepicker[0])
  var $picker1_aux = $($datepicker[1])
  var picker0 = $picker0_aux.pickadate('picker');
  var picker1 = $picker1_aux.pickadate('picker');
  picker0.clear();
  picker1.clear();
}


function isValidPorcImporte() {
  if ($('#hiddenlan')
    .val() == "en-US") {
    var pattern = /^(([1-9]?[0-9]|^100.00$)(\.[0-9]{1,2})?)$/;
    var valueInput = $('#ifrs9_porcImporte')
      .val();

    if (!pattern.test(valueInput)) {
      return false;
    }
    return true;
  } else {
    var pattern = /^(([1-9]?[0-9]|^100.00$)(\,[0-9]{1,2})?)$/;
    var valueInput = $('#ifrs9_porcImporte')
      .val();

    if (!pattern.test(valueInput)) {
      return false;
    }
    return true;
  }
}

function isValidImporte() {
  if ($('#hiddenlan')
    .val() == "en-US") {
    var pattern = /^[0-9]{1,3}(?:[0-9]*(?:[.][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)$/;
    var valueInput = $('#ifrs9_importe')
      .val();

    if (!pattern.test(valueInput)) {
      return false;
    }
    return true;
  } else {
    var pattern = /^[0-9]{1,3}(?:[0-9]*(?:[,][0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{1,2})?)$/;
    var valueInput = $('#ifrs9_importe')
      .val();

    if (!pattern.test(valueInput)) {
      return false;
    }
    return true;
  }
}


function checkDates() {

  var fecha_inicio = $('#ifrs9_dateInicio')
    .val()
    .split("-");
  var fecha_fin = $('#ifrs9_dateFin')
    .val()
    .split("-");

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
      $('#ifrs9_anadir_ajuste')
        .addClass("button-disabled")
        .prop("disabled", true);
      return false;

    } else {
      $('#panel-error')
        .removeClass('show_warning');
    }
  } else {
    $('#panel-error')
      .removeClass('show_warning');
  }
  return true;
}

function commentLength() {
  if ($('#ifrs9_comentarios')
    .val()
    .length > 250) {
    $('#ifrs9_anadir_ajuste')
      .addClass("button-disabled")
      .prop("disabled", true);
    $('.warning_text')
      .text(i18next.t('Comentario demasiado largo, El limite máximo son 250 caracteres', {
        lng: $('#hiddenlan')
          .val()
      }));
    $('#panel-error')
      .addClass('show_warning');
    $('#ifrs9_comentarios')
      .addClass('check-field-coloured');
    return false;
  } else {
    $('#ifrs9_anadir_ajuste')
      .removeClass('button-disabled')
      .prop('disabled', false);
    $('#panel-error')
      .removeClass('show_warning');
    $('#ifrs9_comentarios')
      .removeClass('check-field-coloured');
    return true;
  }
}


function custom_sort(a, b) {
  return a.data_timestamp_part.value -
    b.data_timestamp_part.value;
}

// function custom_sort_table(a, b) {
//   return new Date(formatTimestamp(a))
//     .getTime() - new Date(formatTimestamp(b))
//     .getTime();
// }

function myCustomSortTable(a, b) {
  if (a.timestamp < b.timestamp) return -1;
  if (a.timestamp > b.timestamp) return 1;
  return 0;
}
