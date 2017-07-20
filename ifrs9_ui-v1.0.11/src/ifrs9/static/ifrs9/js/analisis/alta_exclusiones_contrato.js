var $datepicker;

$(document)
  .ready(function () {
    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      })
    $('select')
      .material_select();


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

    $('#ifrs9_idContrato')
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
          $('#ifrs9_datosAjusteUltEje')
            .addClass("filaOculta");
          $('#ifrs9_datosAjusteUltEje')
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
        }
      });
    $(".switch")
      .click(function () {
        var checked = $("#ifrs9_checkBusqFiltro")
          .prop("checked");
        if (checked) {
          $('#ifrs9_buscarAjustesTipoBusquedaCliente')
            .addClass('filaOculta');
          $('#ifrs9_buscarAjustesTipoBusquedaContrato')
            .removeClass('filaOculta');
        } else {
          $('#ifrs9_buscarAjustesTipoBusquedaContrato')
            .addClass('filaOculta');
          $('#ifrs9_buscarAjustesTipoBusquedaCliente')
            .removeClass('filaOculta');
        }
      });

      $('#ifrs9_btnBuscar')
        .click(function (e) {
          e.preventDefault();
          //get data from server
          id_search = $('#ifrs9_idContrato').val();
          $('.loadingDiv')
            .show();
          $.ajax({
            type: "post",
            data: "environment=" + environment + "&flagclientecontrato=" + flagclientecontrato + "&id=" + id_search,
            url: "search_info_contract_for_adjustment_insert/",
            dataType: "json",
            success: function (data) {

              $('#ifrs9_datosAjusteUltEje')
                .removeClass("filaOculta");
              $('#ifrs9_datosAjusteUltEje')
                .addClass('in');
              /* Colapsar filtros */
              $('#ifrs9_filtro .collapsible-header')
                .removeClass("active");
              $("#ifrs9_filtro .collapsible-body")
                .addClass("filaOculta");
              /* Quitar línea cabecera */

              $("#ifrs9_cabFiltro span")
                .removeClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro h4")
                .removeClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro span")
                .addClass("cabFiltroLineOff");
              $("#ifrs9_cabFiltro h4")
                .addClass("cabFiltroLineOff");

                $('.loadingDiv')
                  .hide();
            },
            error: function (error) {

              console.log("Error!!: No se ha encontrado el contrato");
              $('#panel-no-contract')
                .addClass('show_warning');
              setTimeout(function () {
                $('#panel-no-contract')
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
              /* Quitar línea cabecera */

              $("#ifrs9_cabFiltro span")
                .addClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro h4")
                .addClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro span")
                .removeClass("cabFiltroLineOff");
              $("#ifrs9_cabFiltro h4")
                .removeClass("cabFiltroLineOff");

                $('.loadingDiv')
                  .hide();
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

        Materialize.updateTextFields();
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

function submit_new_exclusion_by_contract() {
  $('#alta_exclusion_contrato')
    .submit();

  $('#ifrs9_anadir_exclusion')
    .addClass("button-disabled")
    .prop("disabled", true)

  var $picker0_aux = $($datepicker[0])
  var $picker1_aux = $($datepicker[1])
  var picker0 = $picker0_aux.pickadate('picker');
  var picker1 = $picker1_aux.pickadate('picker');
  picker0.clear();
  picker1.clear();
}

function limpiar_alta_exclusion_contrato() {
  var $picker0_aux = $($datepicker[0])
  var $picker1_aux = $($datepicker[1])
  var picker0 = $picker0_aux.pickadate('picker');
  var picker1 = $picker1_aux.pickadate('picker');
  picker0.clear();
  picker1.clear();
  $('#alta_exclusion_contrato')[0].reset();
  $('#ifrs9_collapseDatosUltimaEjecucion label.active')
    .removeClass('active');

  $('input:disabled')
    .prop('disabled', false);
  $('#ifrs9_anadir_exclusion')
    .addClass("button-disabled")
    .prop("disabled", true);
  $('#panel-error')
    .removeClass('show_warning')

  $('.form-field-desc')
    .each(function () {
      $(this)
        .removeClass('check-field-coloured');
    });
}

function checkFields() {

  if ($('#ifrs9_anadir_exclusion')
    .is(":disabled")) {

    $('#ifrs9_anadir_exclusion')
      .removeClass("button-disabled")
      .prop("disabled", false);
  }

  var isValid = true;

  $('.form-field-desc')
    .each(function () {
      if ($(this)
        .val()
        .length === 0) {
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


function mostrarModalConfirmacion() {

  var allWell = true;

  $('.form-field-desc')
    .each(function () {
      if ($(this)
        .val()
        .length === 0) {
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
    if (checkDates() && commentLength()) {
      $('#myModalConfirmacionAltaExclusionContrato .modal')
        .openModal();
    }
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
      $('#ifrs9_anadir_exclusion')
        .addClass("button-disabled")
        .prop("disabled", true);
      $('#ifrs9_dateInicio')
        .addClass('check-field-coloured');
      $('#ifrs9_dateFin')
        .addClass('check-field-coloured');
      return false;

    } else {
      $('#panel-error')
        .removeClass('show_warning');
      $('#ifrs9_dateInicio')
        .removeClass('check-field-coloured');
      $('#ifrs9_dateFin')
        .removeClass('check-field-coloured');
      $('#ifrs9_anadir_exclusion')
        .removeClass("button-disabled")
        .prop("disabled", false);
    }
  } else {
    $('#panel-error')
      .removeClass('show_warning');
    $('#ifrs9_dateInicio')
      .removeClass('check-field-coloured');
    $('#ifrs9_dateFin')
      .removeClass('check-field-coloured');
    $('#ifrs9_anadir_exclusion')
      .removeClass("button-disabled")
      .prop("disabled", false);
  }
  return true;
}

function commentLength() {
  if ($('#ifrs9_comentarios')
    .val()
    .length > 250) {
    $('#ifrs9_anadir_exclusion')
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
    $('#ifrs9_anadir_exclusion')
      .removeClass('button-disabled')
      .prop('disabled', false);
    $('#panel-error')
      .removeClass('show_warning');
    $('#ifrs9_comentarios')
      .removeClass('check-field-coloured');
    return true;
  }
}
