$(document)
  .ready(function () {
    // Desplegar al buscar
    $('#ifrs9_buscarAjustesFinalidad option:last-child')
      .attr('selected', 'selected');
    if (environment === 1) {
      $('#ifrs9_buscarAjustesFinalidad')
        .find('option')
        .eq(0)
        .remove();
    }
    $('#ifrs9_buscarAjustesFinalidad')
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

    $('#ifrs9_btnBuscarAjustes')
      .click(function (e) {
        if (checkForm()) {
          $('.loadingDiv')
            .show();
          $.ajax({
            type: "post",
            url: "buscar_ajustes/",
            data: $('#form_buscar_ajustes')
              .serialize() + "&environment=" + environment,
            success: function (data) {
              $('.loadingDiv')
                .hide();
              var tr = "",
                promocionar, adjusted_values, lgd_ajustada, importe_ajustado, detail_function, stage_ajustado, traspasar;
              if (data != "0") {
                if (data.length > 0) {
                  e.preventDefault();
                  $('#ifrs9_contentTableResultados')
                    .removeClass("filaOculta");
                  $('#ifrs9_collapseResultados')
                    .addClass('in');
                  /* Colapsar filtros */
                  $('.collapsible-header')
                    .removeClass("active");
                  $(".collapsible-body")
                    .addClass("filaOculta");
                  /* Quitar l�nea cabecera */
                  $("#ifrs9_cabFiltro span")
                    .removeClass("cabFiltroLineOn");
                  $("#ifrs9_cabFiltro h4")
                    .removeClass("cabFiltroLineOn");
                  $("#ifrs9_cabFiltro span")
                    .addClass("cabFiltroLineOff");
                  $("#ifrs9_cabFiltro h4")
                    .addClass("cabFiltroLineOff");
                  // $('#ifrs9_customers-table_wrapper thead th')[0].click(function (e) {});

                  $('#ifrs9_customers-table')
                    .bootstrapTable('destroy');
                  $('.show-hide-table')
                    .removeClass('ifrs9_hidden');
                  $('.loadingDiv')
                    .addClass('ifrs9_hidden');

                  for (var i = 0; i < data.length; i++) {
                    if (environment > data[i].finalidad.id) {
                      if (data[i].tipo.tipo_id === "2" || data[i].tipo.tipo_id === "4") {
                        promocionar = "";
                      } else {
                        promocionar = '<a href="javascript:void(0)" onclick="promocionarAjuste(' + data[i].id_ajuste + ')" class="fa fa-step-forward color-icon" title="' + i18next.t('Promocionar', {
                          lng: $('#hiddenlan')
                            .val()
                        }) + '"></a>';
                      }

                    } else {
                      promocionar = "";
                    }

                    if (environment == data[i].finalidad.id && environment !== 1) {
                      if (data[i].tipo.tipo_id === "2" || data[i].tipo.tipo_id === "4") {
                        traspasar = "";
                      } else {
                        traspasar = '<a href="javascript:void(0)" onclick="traspasarAjuste(' + data[i].id_ajuste + ')" class="fa fa-step-backward color-icon" title="' + i18next.t('Traspasar', {
                          lng: $('#hiddenlan')
                            .val()
                        }) + '"></a>';
                      }
                    } else {
                      traspasar = "";
                    }

                    if (data[i].lgdajustada == "") {
                      lgd_ajustada = "";
                    } else {
                      lgd_ajustada = '<li><b>' + i18next.t('LGD', {
                        lng: $('#hiddenlan')
                          .val()
                      }) + ': </b>' + addDecimals(data[i].lgdajustada) + '</li>';
                    }

                    if (data[i].importeajustado == "") {
                      importe_ajustado = "";
                    } else {
                      importe_ajustado = '<li><b>' + i18next.t('Importe', {
                        lng: $('#hiddenlan')
                          .val()
                      }) + ': </b>' + getValueJsonImporteTable(data[i].importeajustado, data[i].moneda.moneda_id) + '</li>'
                    }

                    if (data[i].porcentajeimporteajustado == "") {
                      porcentaje_ajustado = "";
                    } else {
                      porcentaje_ajustado = '<li><b>% ' + i18next.t('de Importe', {
                        lng: $('#hiddenlan')
                          .val()
                      }) + ': </b>' + addDecimals(data[i].porcentajeimporteajustado) + '</li>';
                    }

                    if (data[i].stageajustado == "") {
                      stage_ajustado = "";
                    } else {
                      stage_ajustado = '<li><b>' + i18next.t('Stage', {
                        lng: $('#hiddenlan')
                          .val()
                      }) + ': </b>' + getValueJsonTable(data[i].stageajustado.descripcion) + '</li>';
                    }

                    //Tengo que nombrar la funci�n en base al tipo de ajuste.
                    switch (data[i].tipo.tipo_id) {
                      case "1":
                        detail_function = 'onclick="detalle_ajuste_cliente_manual(' + data[i].id_ajuste + ", " + data[i].finalidad.id + ', ' + environment + ')"';
                        break;
                      case "2":
                        detail_function = 'onclick="detalle_ajuste_cliente_masivo(' + data[i].id_ajuste + ", " + data[i].finalidad.id + ', ' + environment + ')"';
                        break;
                      case "3":
                        detail_function = 'onclick="detalle_ajuste_contrato_manual(' + data[i].id_ajuste + ", " + data[i].finalidad.id + ', ' + environment + ')"';
                        break;
                      case "4":
                        detail_function = 'onclick="detalle_ajuste_contrato_masivo(' + data[i].id_ajuste + ", " + data[i].finalidad.id + ', ' + environment + ')"';
                        break;
                    }

                    adjusted_values = '<ul>' + importe_ajustado + lgd_ajustada + porcentaje_ajustado + stage_ajustado + '</ul>'

                    tr += "<tr>";
                    tr += '<td class="text-center">' +
                      '<a href="javascript:void(0)" ' + detail_function + '  class="fa fa-eye color-icon" title="' + i18next.t('Detalle', {
                        lng: $('#hiddenlan')
                          .val()
                      }) + '"></a></td>'
                    tr += "<td>" + i18next.t(data[i].finalidad.descripcion, {
                      lng: $('#hiddenlan')
                        .val()
                    }) + "</td>"; //Scope
                    tr += "<td>" + i18next.t(data[i].tipo.nombre, {
                      lng: $('#hiddenlan')
                        .val()
                    }) + "</td>"; //Tipo ajuste
                    tr += "<td>" + data[i].operacion_id + "</td>"; //Id contrato
                    // tr += "<td>" + data[i].entidad.descripcion + "</td>"; //Entidad
                    tr += "<td>" + formatTimestamp(data[i].fechaini) + "</td>"; //Fecha Inicio
                    tr += "<td>" + formatTimestamp(data[i].fechafin) + "</td>"; //Fecha Fin
                    tr += "<td>" + adjusted_values + "</td>"; //Esta es la que hay que montar. Ajustados
                    tr += "<td>" + i18next.t(data[i].finalidadorigen.descripcion, {
                      lng: $('#hiddenlan')
                        .val()
                    }) + "</td>"; //Origen
                    if (data[i].first_name && data[i].last_name) {
                      tr += "<td>" + data[i].usuarioalta.username + " (" + data[i].first_name + ", " + data[i].last_name + ")</td>";
                    } else if (data[i].first_name) {
                      tr += "<td>" + data[i].usuarioalta.username + " (" + data[i].first_name + ")</td>";
                    } else {
                      tr += "<td>" + data[i].usuarioalta.username + "</td>";
                    }
                    //tr += "<td>" + data[i].usuarioalta.username + "</td>"; //usuario alta
                    var envperm = $('#envperm')
                      .val();
                    var ctxperm = $('#ctxperm')
                      .val();
                    ctxperm = ctxperm.replace(/'/g, "\"")
                      .replace(/T/g, 't')
                      .replace(/F/g, 'f');
                    ctxperm = JSON.parse(ctxperm);

                    if ((envperm === '1' && ctxperm.anw) || (envperm == '2' && ctxperm.pew) || (envperm == '3' && ctxperm.pow)) {

                      if (envperm === '3') {

                        var date1 = formatTimestamp(data[i].fechafin);
                        date1 = date1.split(" ");
                        date1 = date1[0].split("-");

                        var fecha_fin_ajuste = new Date(date1[2], date1[1] - 1, date1[0]);
                        var fecha_hoy = new Date();
                        fecha_hoy.setHours(0, 0, 0, 0);

                        if (fecha_fin_ajuste.getTime() >= fecha_hoy.getTime()) {
                          tr += '<td class="text-center">' +
                            '<a href="javascript:void(0)" onclick="deleteAjuste(' + data[i].id_ajuste + ')" class="fa fa-trash-o color-icon right-spacer" title="' + i18next.t('Borrar', {
                              lng: $('#hiddenlan')
                                .val()
                            }) + '"></a>' + promocionar;
                        } else {
                          tr += '<td class="text-center">';
                          if (data[i].finalidad.id < 3) {
                            tr += '<a href="javascript:void(0)" onclick="deleteAjuste(' + data[i].id_ajuste + ')" class="fa fa-trash-o color-icon right-spacer" title="' + i18next.t('Borrar', {
                              lng: $('#hiddenlan')
                                .val()
                            }) + '"></a>';
                          }
                        }
                      } else {
                        tr += '<td class="text-center">' +
                          '<a href="javascript:void(0)" onclick="deleteAjuste(' + data[i].id_ajuste + ')" class="fa fa-trash-o color-icon right-spacer" title="' + i18next.t('Borrar', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + '"></a>' + promocionar;
                      }
                      tr += traspasar;
                      tr += "</td>";
                      tr += "</tr>";
                    }
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
                      sortName: "lastIniAjust",
                      search: true,
                      showHeader: true,
                      sortOrder: "desc",
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
                              }) + " " + initialTableLengthCustomer + " " + i18next.t('Entradas', {
                                lng: $('#hiddenlan')
                                  .val()
                              }) + ")"
                            })
                            .appendTo('.pagination-detail');
                        }
                      }
                    });
                  var initialTableLengthCustomer = $('#ifrs9_customers-table')
                    .bootstrapTable('getOptions')
                    .totalRows;
                } else {
                  e.preventDefault();
                  $('#ifrs9_contentTableResultados')
                    .removeClass("filaOculta");
                  $('#ifrs9_collapseResultados')
                    .addClass('in');
                  /* Colapsar filtros */
                  $('.collapsible-header')
                    .removeClass("active");
                  $(".collapsible-body")
                    .addClass("filaOculta");
                  /* Quitar l�nea cabecera */
                  $("#ifrs9_cabFiltro span")
                    .removeClass("cabFiltroLineOn");
                  $("#ifrs9_cabFiltro h4")
                    .removeClass("cabFiltroLineOn");
                  $("#ifrs9_cabFiltro span")
                    .addClass("cabFiltroLineOff");
                  $("#ifrs9_cabFiltro h4")
                    .addClass("cabFiltroLineOff");
                  // $('#ifrs9_customers-table_wrapper thead th')[0].click(function (e) {});

                  $('#ifrs9_customers-table')
                    .bootstrapTable('destroy');
                  $('.show-hide-table')
                    .removeClass('ifrs9_hidden');
                  $('.loadingDiv')
                    .addClass('ifrs9_hidden');

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
              }
            },
            error: function (error) {
              console.log(error);
              $('.loadingDiv')
                .hide();
              if (error.status === 404) {

                if ($('#ifrs9_idClienteBusqAjuste')
                  .val() != '') {
                  $('.warning_text')
                    .text(i18next.t('El ID Cliente introducido no existe', {
                      lng: $('#hiddenlan')
                        .val()
                    }));
                  $('#panel-error')
                    .addClass('show_warning');
                  setTimeout(function () {
                    $('#panel-error')
                      .removeClass('show_warning');
                  }, 2000);
                } else if ($('#ifrs9_idContratoBusqAjuste')
                  .val() != '') {
                  $('.warning_text')
                    .text(i18next.t('El ID Contrato introducido no existe', {
                      lng: $('#hiddenlan')
                        .val()
                    }));
                  $('#panel-error')
                    .addClass('show_warning');
                  setTimeout(function () {
                    $('#panel-error')
                      .removeClass('show_warning');
                  }, 2000);
                } else {
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
                }

                $('#ifrs9_filtro .collapsible-header')
                  .addClass("active");
                $("#ifrs9_filtro .collapsible-body")
                  .removeClass("filaOculta");
                $('#ifrs9_contentTableResultados')
                  .addClass("filaOculta");
                $('#ifrs9_contentTableResultados')
                  .removeClass('in');
                /* Quitar línea cabecera */

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


    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");

    /* SWITCH ID CONTRATO/CLIENTE */

    $(".switch")
      .click(function () {
        var checked = $("#ifrs9_checkBusqFiltro")
          .prop("checked");
        if (checked) {
          $('#ifrs9_usuario')
            .val($('#user_name_logged')
              .val());
          $('#ifrs9_usuario')
            .prop("readonly", true);
        } else {
          $('#ifrs9_usuario')
            .val('');
          $('#ifrs9_usuario')
            .prop("readonly", false);
        }
        Materialize.updateTextFields();
      });

    /* Select tipo de b�squeda */
    $('#ifrs9_buscarAjustesTipoBusqueda')
      .change(function () {
        var id = $(this)
          .find("option:selected")
          .attr("id");

        switch (id) {
          case "ifrs9_selectTodo":
            $('#ifrs9_buscarAjustesTipoBusquedaCliente')
              .addClass('filaOculta');
            $('#ifrs9_buscarAjustesTipoBusquedaContrato')
              .addClass('filaOculta');
            $('#ifrs9_IDClienteContrato')
              .addClass("filaOculta");
            break;
          case "ifrs9_selectCliente":
            $('#ifrs9_buscarAjustesTipoBusquedaCliente')
              .removeClass('filaOculta');
            $('#ifrs9_buscarAjustesTipoBusquedaContrato')
              .addClass('filaOculta');
            $('#ifrs9_IDClienteContrato')
              .removeClass("filaOculta");
            break;
          case "ifrs9_selectContrato":
            $('#ifrs9_buscarAjustesTipoBusquedaCliente')
              .addClass('filaOculta');
            $('#ifrs9_buscarAjustesTipoBusquedaContrato')
              .removeClass('filaOculta');
            $('#ifrs9_IDClienteContrato')
              .removeClass("filaOculta");
            break;
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

    // $('#ifrs9_idClienteBusqAjuste')
    //   .keyup(function (e) {
    //     if ($('#ifrs9_idClienteBusqAjuste')
    //       .val() != '') {
    //       $('#ifrs9_idContratoBusqAjuste')
    //         .prop("disabled", true);
    //     } else {
    //       $('#ifrs9_idContratoBusqAjuste')
    //         .prop("disabled", false);
    //     }
    //   });
    //
    // $('#ifrs9_idContratoBusqAjuste')
    //   .keyup(function (e) {
    //     if ($('#ifrs9_idContratoBusqAjuste')
    //       .val() != '') {
    //       $('#ifrs9_idClienteBusqAjuste')
    //         .prop("disabled", true);
    //     } else {
    //       $('#ifrs9_idClienteBusqAjuste')
    //         .prop("disabled", false);
    //     }
    //   });

    $("#ifrs9_buscarAjustesTipoAjuste")
      .change(function () {

        $('#ifrs9_idClienteBusqAjuste')
          .removeClass('check-field-coloured');
        $('#ifrs9_idContratoBusqAjuste')
          .removeClass('check-field-coloured');
        $('#panel-error')
          .removeClass('show_warning')

        if ($(this)
          .val() == '1' || $(this)
          .val() == '2') {
          $('#ifrs9_idClienteBusqAjuste')
            .prop("readonly", false);
          $('#ifrs9_idContratoBusqAjuste')
            .prop("readonly", true);
          $('#ifrs9_idClienteBusqAjuste')
            .prop("disabled", false);
          $('#ifrs9_idContratoBusqAjuste')
            .prop("disabled", true);
        } else if ($(this)
          .val() == '3' || $(this)
          .val() == '4') {
          $('#ifrs9_idClienteBusqAjuste')
            .prop("readonly", true);
          $('#ifrs9_idContratoBusqAjuste')
            .prop("readonly", false);
          $('#ifrs9_idClienteBusqAjuste')
            .prop("disabled", true);
          $('#ifrs9_idContratoBusqAjuste')
            .prop("disabled", false);
        } else {
          if ($('#ifrs9_idClienteBusqAjuste')
            .val()
            .length != 0) {
            $('#ifrs9_idClienteBusqAjuste')
              .prop("readonly", false);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("readonly", true);
            $('#ifrs9_idClienteBusqAjuste')
              .prop("disabled", false);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("disabled", true);
          } else if ($('#ifrs9_idContratoBusqAjuste')
            .val()
            .length != 0) {
            $('#ifrs9_idClienteBusqAjuste')
              .prop("readonly", true);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("readonly", false);
            $('#ifrs9_idClienteBusqAjuste')
              .prop("disabled", true);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("disabled", false);
          } else {
            $('#ifrs9_idClienteBusqAjuste')
              .prop("readonly", false);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("readonly", false);
            $('#ifrs9_idClienteBusqAjuste')
              .prop("disabled", false);
            $('#ifrs9_idContratoBusqAjuste')
              .prop("disabled", false);
          }
        }
      });
  });

// function formatTimestamp(date1) {
//
//   var datetime = date1.split(' ');
//
//   if (datetime.length == 1) {
//     datetime = date1.split('T');
//   }
//   var date = datetime[0];
//   // var time = datetime[1];
//
//   var formato = date.split('-');
//
//   return formato[2] + '-' + formato[1] + '-' + formato[0];
// }

function detalle_ajuste_contrato_manual(id, finalidad, finalidad_actual) {
  $.ajax({
    type: "post",
    url: "detalle_ajuste_contrato/",
    data: "id=" + id + "&environment=" + finalidad + "&finalidad_actual=" + finalidad_actual,
    success: function (data) {
      $('#ifrs9_paginaLoad ul, #ifrs9_pageTitle')
        .hide();

      var script = document.createElement('script');
      script.src = "/static/ifrs9/js/analisis/detalle_ajuste_contrato.js";
      document.getElementsByTagName('head')[0].appendChild(script);

      $('#detalle_ajuste_general')
        .html(data)
        .show();

      $('#ifrs9_buscarAjustesFinalidad')
        .material_select(true);
      $('#ifrs9_buscarAjustesTipoAjuste')
        .material_select(true);
    }
  });
}

function detalle_ajuste_contrato_masivo(id, finalidad, finalidad_actual) {
  $.ajax({
    type: "post",
    url: "detalle_ajuste_masivo_contrato/",
    data: "id=" + id + "&environment=" + finalidad + "&finalidad_actual=" + finalidad_actual,
    success: function (data) {
      $('#ifrs9_paginaLoad ul, #ifrs9_pageTitle')
        .hide();

      var script = document.createElement('script');
      script.src = "/static/ifrs9/js/analisis/detalle_ajuste_masivo_contrato.js";
      document.getElementsByTagName('head')[0].appendChild(script);

      $('#detalle_ajuste_general')
        .html(data)
        .show();

      $('#ifrs9_buscarAjustesFinalidad')
        .material_select(true);
      $('#ifrs9_buscarAjustesTipoAjuste')
        .material_select(true);
    }
  });
}

function detalle_ajuste_cliente_manual(id, finalidad, finalidad_actual) {
  $.ajax({
    type: "post",
    url: "detalle_ajuste_cliente/",
    data: "id=" + id + "&environment=" + finalidad + "&finalidad_actual=" + finalidad_actual,
    success: function (data) {
      $('#ifrs9_paginaLoad ul, #ifrs9_pageTitle')
        .hide();

      var script = document.createElement('script');
      script.src = "/static/ifrs9/js/analisis/detalle_ajuste_cliente.js";
      document.getElementsByTagName('head')[0].appendChild(script);

      $('#detalle_ajuste_general')
        .html(data)
        .show();

      $('#ifrs9_buscarAjustesFinalidad')
        .material_select(true);
      $('#ifrs9_buscarAjustesTipoAjuste')
        .material_select(true);
    }
  });
}

function detalle_ajuste_cliente_masivo(id, finalidad, finalidad_actual) {
  $.ajax({
    type: "post",
    url: "detalle_ajuste_masivo_cliente/",
    data: "id=" + id + "&environment=" + finalidad + "&finalidad_actual=" + finalidad_actual,
    success: function (data) {
      $('#ifrs9_paginaLoad ul, #ifrs9_pageTitle')
        .hide();

      var script = document.createElement('script');
      script.src = "/static/ifrs9/js/analisis/detalle_ajuste_masivo_cliente.js";
      document.getElementsByTagName('head')[0].appendChild(script);
      $('#detalle_ajuste_general')
        .html(data)
        .show();

      $('#ifrs9_buscarAjustesFinalidad')
        .material_select(true);
      $('#ifrs9_buscarAjustesTipoAjuste')
        .material_select(true);
    }
  });
}

function deleteAjuste(id) {
  $('#ifrs9_modalDelete')
    .openModal();
  $('#confirm_delete_button')
    .attr('onclick', 'confirmDeleteAjuste(' + id + ')')
}

function confirmDeleteAjuste(id) {
  $.ajax({
    type: "post",
    data: "id=" + id,
    url: "comfirm_delete_ajuste/",
    success: function (data) {
      switch (data) {
        case "0":
          $('#mensaje_success')
            .html(i18next.t('Ajuste eliminado de la base de datos', {
              lng: $('#hiddenlan')
                .val()
            }))
          break;
        case "1":
          $('#mensaje_success')
            .html(i18next.t('Fecha fin de ajuste modificada correctamente', {
              lng: $('#hiddenlan')
                .val()
            }))
          break;
        case "2":
          $('#mensaje_success')
            .html(i18next.t('No se han realizado modificaciones al ajuste', {
              lng: $('#hiddenlan')
                .val()
            }))
          break;
        default:
          $('#mensaje_error')
            .html(i18next.t('Se ha producido un error', {
              lng: $('#hiddenlan')
                .val()
            }))
          $('.error_message')
            .addClass('show_error');
          setTimeout(function () {
            $('.error_message')
              .removeClass('show_error');
          }, 2000);
      }
      $('.success_message')
        .addClass('show_success');
      setTimeout(function () {
        $('.success_message')
          .removeClass('show_success');
      }, 2000);

      // Hay que recargar la tabla de resultados. B�sicamente, volver a aplicar el filtro
      $('#ifrs9_btnBuscarAjustes')
        .click();
    }
  });
}

function checkForm() {
  var isValid = true;

  // if (($('#ifrs9_idClienteBusqAjuste')
  //     .val()
  //     .length === 0) && !($('#ifrs9_idClienteBusqAjuste')
  //     .is(':disabled')) &&
  //   ($('#ifrs9_idContratoBusqAjuste')
  //     .val()
  //     .length === 0) && !($('#ifrs9_idContratoBusqAjuste')
  //     .is(':disabled'))) {
  //   isValid = true;
  //   // $('.warning_text')
  //   //   .text(i18next.t('Por favor, rellene uno de los dos campos', {
  //   //     lng: $('#hiddenlan')
  //   //       .val()
  //   //   }));
  //   // $('#panel-error')
  //   //   .addClass('show_warning');
  //   // $('#ifrs9_idClienteBusqAjuste')
  //   //   .addClass('check-field-coloured');
  //   // $('#ifrs9_idContratoBusqAjuste')
  //   //   .addClass('check-field-coloured');
  // }

  // if (($('#ifrs9_idClienteBusqAjuste')
  //     .val()
  //     .length === 0) &&
  //   ($('#ifrs9_idContratoBusqAjuste')
  //     .is(':disabled'))) {
  //   isValid = false;
  //   $('.warning_text')
  //     .text(i18next.t('Por favor, rellene el campo marcado', {
  //       lng: $('#hiddenlan')
  //         .val()
  //     }));
  //   $('#panel-error')
  //     .addClass('show_warning');
  //   $('#ifrs9_idClienteBusqAjuste')
  //     .addClass('check-field-coloured');
  // }
  //
  // if (($('#ifrs9_idContratoBusqAjuste')
  //     .val()
  //     .length === 0) &&
  //   ($('#ifrs9_idClienteBusqAjuste')
  //     .is(':disabled'))) {
  //   isValid = false;
  //   $('.warning_text')
  //     .text(i18next.t('Por favor, rellene el campo marcado', {
  //       lng: $('#hiddenlan')
  //         .val()
  //     }));
  //   $('#panel-error')
  //     .addClass('show_warning');
  //   $('#ifrs9_idContratoBusqAjuste')
  //     .addClass('check-field-coloured');
  // }

  return isValid;
}

function checkFields() {

  var isValid = true;

  if ($('#ifrs9_idClienteBusqAjuste')
    .val() != '' && !($('#ifrs9_idClienteBusqAjuste')
      .is(':disabled'))) {
    $('#ifrs9_idContratoBusqAjuste')
      .prop("disabled", true);
    $('#ifrs9_idClienteBusqAjuste')
      .removeClass('check-field-coloured');
    $('#ifrs9_idContratoBusqAjuste')
      .removeClass('check-field-coloured');
  } else {
    if ($('#ifrs9_buscarAjustesTipoAjuste')
      .val() === '1' ||
      $('#ifrs9_buscarAjustesTipoAjuste')
      .val() === '2') {
      $('#ifrs9_idContratoBusqAjuste')
        .prop("disabled", true);
      $('#ifrs9_idContratoBusqAjuste')
        .prop("readonly", true);
    } else {
      $('#ifrs9_idContratoBusqAjuste')
        .prop("disabled", false);
      $('#ifrs9_idContratoBusqAjuste')
        .prop("readonly", false);
    }
  }

  if ($('#ifrs9_idContratoBusqAjuste')
    .val() != '' && !($('#ifrs9_idContratoBusqAjuste')
      .is(':disabled'))) {
    $('#ifrs9_idClienteBusqAjuste')
      .prop("disabled", true);
    $('#ifrs9_idClienteBusqAjuste')
      .removeClass('check-field-coloured');
    $('#ifrs9_idContratoBusqAjuste')
      .removeClass('check-field-coloured');
  } else {
    if ($('#ifrs9_buscarAjustesTipoAjuste')
      .val() === '3' ||
      $('#ifrs9_buscarAjustesTipoAjuste')
      .val() === '4') {
      $('#ifrs9_idClienteBusqAjuste')
        .prop("disabled", true);
      $('#ifrs9_idClienteBusqAjuste')
        .prop("readonly", true);
    } else {
      $('#ifrs9_idClienteBusqAjuste')
        .prop("disabled", false);
      $('#ifrs9_idClienteBusqAjuste')
        .prop("readonly", false);
    }
  }

  if (isValid) {
    $('#panel-error')
      .removeClass('show_warning')
  }
}

function checkDates() {

  var validDates = true;

  if ($('#ifrs9_dateAjusteInicio')
    .val()
    .length != 0 &&
    $('#ifrs9_dateAjusteFin')
    .val()
    .length != 0) {

    var fecha_inicio = $('#ifrs9_dateAjusteInicio')
      .val()
      .split("-");
    var fecha_fin = $('#ifrs9_dateAjusteFin')
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

      $('#ifrs9_btnBuscarAjustes')
        .addClass("button-disabled")
        .prop("disabled", true);

      $('#ifrs9_dateAjusteInicio')
        .addClass('check-field-coloured')
      $('#ifrs9_dateAjusteFin')
        .addClass('check-field-coloured')

      validDates = false

    } else {
      $('#panel-error')
        .removeClass('show_warning');

      $('#ifrs9_dateAjusteInicio')
        .removeClass('check-field-coloured')
      $('#ifrs9_dateAjusteFin')
        .removeClass('check-field-coloured')

      $('#ifrs9_btnBuscarAjustes')
        .removeClass("button-disabled")
        .prop('disabled', false);

      validDates = true
    }
  } else {
    if ($('#ifrs9_dateAjusteInicio')
      .val()
      .length === 0) {
      $('#ifrs9_dateAjusteInicio')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    if ($('#ifrs9_dateAjusteFin')
      .val()
      .length === 0) {
      $('#ifrs9_dateAjusteFin')
        .parent()
        .find('label.active:first')
        .removeClass('active');
    }

    $('#panel-error')
      .removeClass('show_warning');

    $('#ifrs9_dateAjusteInicio')
      .removeClass('check-field-coloured')
    $('#ifrs9_dateAjusteFin')
      .removeClass('check-field-coloured')

    $('#ifrs9_btnBuscarAjustes')
      .removeClass("button-disabled")
      .prop('disabled', false);

    validDates = true
  }
  return validDates
}


function promocionarAjuste(id) {
  $.ajax({
    type: "GET",
    data: "environment=" + environment,
    url: "modal_conf_promotion",
    success: function (data) {
      $('#ifrs9_myModalPromotion')
        .empty()
        .html(data);
      $('#id_ajuste_promocion')
        .val(id);
      $('#ifrs9_myModalPromotion select')
        .material_select();
      $('#ifrs9_myModalPromotion .modal')
        .openModal();
    }
  });
}


function aceptar_promocionar_ajuste() {
  var id_ajuste = $('#id_ajuste_promocion')
    .val();
  $.ajax({
    type: "post",
    url: "promocionar_ajuste/",
    data: "id_ajuste=" + id_ajuste + "&environment=" + environment,
    success: function (data) {
      $('#mensaje_success')
        .html(i18next.t('Ajuste promocionado correctamente', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#ifrs9_myModalPromotion .modal')
        .closeModal();
      $('.success_message')
        .addClass('show_success');
      setTimeout(function () {
        $('.success_message')
          .removeClass('show_success');
      }, 2000);
      // Hay que recargar la tabla de resultados. B�sicamente, volver a aplicar el filtro
      $('#ifrs9_btnBuscarAjustes')
        .click();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $('#mensaje_error')
        .html(xhr.responseText);
      // $('#mensaje_error')
      //   .html(i18next.t('Ajuste promocionado correctamente', {
      //     lng: $('#hiddenlan')
      //       .val()
      //   }));
      $('#ifrs9_myModalPromotion .modal')
        .closeModal();
      $('.error_message')
        .addClass('show_error');
      setTimeout(function () {
        $('.error_message')
          .removeClass('show_error');
      }, 2000);

    }
  });
}

function aceptar_traspasar_ajuste() {
  var id_ajuste = $('#id_ajuste_promocion')
    .val(),
    finalidad_destino = $('#traspasar_ajuste_destination')
    .val(); //select que contiene el id de la finalidad de destino
  $.ajax({
    type: "post",
    url: "traspasar_ajuste/",
    data: "id_ajuste=" + id_ajuste + "&environment=" + environment + "&finalidad_destino=" + finalidad_destino,
    success: function (data) {
      $('#mensaje_success')
        .html(i18next.t('Ajuste traspasado correctamente', {
          lng: $('#hiddenlan')
            .val()
        }));
      $('#ifrs9_myModalTraspaso .modal')
        .closeModal();
      $('.success_message')
        .addClass('show_success');
      setTimeout(function () {
        $('.success_message')
          .removeClass('show_success');
      }, 2000);
      // Hay que recargar la tabla de resultados. B�sicamente, volver a aplicar el filtro
      $('#ifrs9_btnBuscarAjustes')
        .click();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $('#mensaje_error')
        .html(xhr.responseText);
      console.log(xhr.responseText)
      // $('#mensaje_error')
      //   .html(i18next.t('Ajuste promocionado correctamente', {
      //     lng: $('#hiddenlan')
      //       .val()
      //   }));
      $('#ifrs9_myModalTraspaso .modal')
        .closeModal();
      $('.error_message')
        .addClass('show_error');
      setTimeout(function () {
        $('.error_message')
          .removeClass('show_error');
      }, 2000);
    }
  });
}

function traspasarAjuste(id) {
  $.ajax({
    type: "GET",
    data: "environment=" + environment,
    url: "modal_conf_traspaso",
    success: function (data) {
      $('#ifrs9_myModalTraspaso')
        .empty()
        .html(data);
      $('#id_ajuste_promocion')
        .val(id);
      $('#ifrs9_myModalTraspaso select')
        .material_select();
      $('#ifrs9_myModalTraspaso .modal')
        .openModal();
    }
  });
}

function custom_sort(a, b) {
  return new Date(formatTimestamp(a))
    .getTime() - new Date(formatTimestamp(b))
    .getTime();
}
