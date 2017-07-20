$(document)
  .ready(function () {
    $('select')
      .material_select();

    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");

    $('#ifrs9_idCliente')
      .on('keyup blur', function () {
        if ($(this)
          .val()
          .length !== 0) {
          $('#ifrs9_btnBuscar')
            .removeClass('button-disabled')
            .prop('disabled', false);
        } else {
          $('#ifrs9_btnBuscar')
            .addClass('button-disabled')
            .prop('disabled', true);
        }
      });
    // Desplegar al buscar
    $('#ifrs9_btnBuscar')
      .click(function (e) {
        e.preventDefault();
        $('#ifrs9_contracts-table')
          .bootstrapTable('destroy');
        $('.loadingDiv')
          .show();
        $('#ifrs9_contentTableResultados')
          .addClass('filaOculta');
        $('#ifrs9_detalleCliente')
          .addClass('filaOculta');
        $('#ifrs9_collapseResultados')
          .removeClass('in');
        $.ajax({
          type: "post",
          data: $('#form_consulta_cliente')
            .serialize(),
          url: "consulta_cliente/",
          dataType: "json",
          success: function (data) {
            console.log(data)
            var tr = "",
              info_execution,
              detalle;
            if (typeof (data.cliente.customer_id) != 'undefined' && data.cliente.customer_id.value !== "") {
              $('.id_cliente')
                .text(data.cliente.customer_id.value);
            } else {
              $('.id_cliente')
                .text(i18next.t('No disponible', {
                  lng: $('#hiddenlan')
                    .val()
                }));
            }
            if (typeof (data.cliente.type) != 'undefined' && data.cliente.type.value !== "") {
              $('.tipo')
                .text(data.cliente.type.value)
            } else {
              $('.tipo')
                .text(i18next.t('No disponible', {
                  lng: $('#hiddenlan')
                    .val()
                }));
            }
            if (typeof (data.cliente.customer_name) != 'undefined' && data.cliente.customer_name.value !== "") {
              $('.nombre_cliente')
                .text(data.cliente.customer_name.value);
            } else {
              $('.nombre_cliente')
                .text(i18next.t('No disponible', {
                  lng: $('#hiddenlan')
                    .val()
                }));
            }
            var date_aux;
            if (data.contratos.length > 0) {
              for (var i = 0; i < data.contratos.length; i++) {
                for (var j = 0; j < data.contratos[i].results.length; j++) {
                  console.log("Contrato ID: " + data.contratos[i].results[j].contract_id.value)
                  datos_motor = '<ul>' +
                    '<li><b>' + i18next.t('Importe', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getValueJsonImporteTable(data.contratos[i].results[j].importe.value, data.contratos[i].detalle.currency.value) + '</li>';

                  datos_motor = datos_motor + '<li><b>' + i18next.t('Stage', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getValueJsonTable(data.contratos[i].results[j].stage.value) + '</li>' +
                    '<li><b>' + i18next.t('LGD', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + addDecimals(data.contratos[i].results[j].lgd.value) + '</li>' +
                    '</ul>';


                  ajustados = '<ul>' +
                    '<li><b>' + i18next.t('Importe', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getValueJsonImporteDirectoTable(data.contratos[i].results[j].importe.value, data.contratos[i].results[j].importe.ajuste, data.contratos[i].results[j].importe.directo, data.contratos[i].detalle.currency.value) + '</li>';

                  var NaN_msg = $('#hiddenNan')
                    .val();
                  if (data.contratos[i].results[j].porcentaje.directo == "1" && data.contratos[i].results[j].porcentaje.pct_in != "" && data.contratos[i].results[j].porcentaje.pct_in != NaN_msg) {
                    ajustados = ajustados + '<li><b>% ' + i18next.t('Importe', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getPorcImporteJsonDirectoTable(data.contratos[i].results[j].porcentaje.pct_in, data.contratos[i].results[j].porcentaje.directo) + '</li>';
                    data.contratos[i].results[j].porcentaje.pct_in = addDecimals(data.contratos[i].results[j].porcentaje.pct_in);
                  }

                  ajustados = ajustados + '<li><b>' + i18next.t('Stage', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getValueJsonStageDirectoTable(data.contratos[i].results[j].stage.value, data.contratos[i].results[j].stage.ajuste, data.contratos[i].results[j].stage.directo, data.contratos[i].results[j].exclusion_30d.value) + '</li>' +
                    '<li><b>' + i18next.t('LGD', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + ': </b>' + getValueJsonLGDDirectoTable(data.contratos[i].results[j].lgd.value, data.contratos[i].results[j].lgd.ajuste, data.contratos[i].results[j].lgd.directo, data.contratos[i].results[j].exclusion_30d.value) + '</li>' +
                    // }) + ': </b>' + getValueJsonLGDDirectoTable(data.contratos[i].results[j].lgd.value, data.contratos[i].results[j].lgd.ajuste, data.contratos[i].results[j].lgd.directo, "Y") + '</li>' +
                    '</ul>';
                  // preparando las variables con los objetos json que viajarán al detalle
                  date_aux = data.contratos[i].results[j].data_timestamp_part.value
                  data.contratos[i].results[j].data_timestamp_part.value = formatTimestamp_cc(data.contratos[i].results[j].data_timestamp_part.value);
                  data.contratos[i].results[j].amount.value = addDecimals(data.contratos[i].results[j].amount.value);
                  info_contract = JSON.stringify(data.contratos[i].results[j]);
                  info_contract = escape(info_contract);
                  detalle = JSON.stringify(data.contratos[i].detalle);
                  detalle = escape(detalle);
                  customer = JSON.stringify(data.cliente);
                  customer = escape(customer);
                  //******************************\\
                  tr += "<tr>";
                  tr += '<td class="text-center">' +
                    '<a href="javascript:void(0)" onclick="verDetalleConsultaCliente(' +
                    data.contratos[i].results[j].contract_id.value + ',\'' + info_contract.trim() + '\', \'' + detalle.trim() + '\', \'' + customer.trim() + '\')" class="fa fa-eye color-icon" title="' + i18next.t('Detalle', {
                      lng: $('#hiddenlan')
                        .val()
                    }) + '"></a></td>';
                  tr += "<td>" + data.contratos[i].results[j].contract_id.value + "</td>";
                  tr += "<td data-timestamp='" + date_aux + "'>" + data.contratos[i].results[j].data_timestamp_part.value + "</td>";
                  tr += "<td>" + data.contratos[i].detalle.branch.value + "</td>";
                  tr += "<td>" + data.contratos[i].detalle.product_grouper.value + "</td>";
                  tr += "<td>" + datos_motor + "</td>";
                  tr += "<td>" + ajustados + "</td>";
                  tr += "</tr>";
                }
              }

              $('#ifrs9_contracts-table tbody')
                .empty()
                .append(tr);

              $('#ifrs9_contracts-table')
                .bootstrapTable({
                  striped: true,
                  sortable: true,
                  pagination: true,
                  paginationLoop: true,
                  pageSize: 5,
                  sortName: "fechaLastExec",
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
                          }) + " " + initialTableLength + " " + i18next.t('Entradas', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ")"
                        })
                        .appendTo('#ifrs9_my-customers .pagination-detail');
                    }
                  }
                });
              var initialTableLength = $('#ifrs9_contracts-table')
                .bootstrapTable('getOptions')
                .totalRows;
              $('#ifrs9_contentTableResultados')
                .removeClass('filaOculta');
              $('#ifrs9_detalleCliente')
                .removeClass('filaOculta');
              $('#ifrs9_collapseResultados')
                .addClass('in');
              /* Colapsar filtros */
              $('.collapsible-header')
                .removeClass("active");
              $(".collapsible-body")
                .addClass('filaOculta');
              /* Quitar línea cabecera */

              $("#ifrs9_cabFiltro span")
                .removeClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro h4")
                .removeClass("cabFiltroLineOn");
              $("#ifrs9_cabFiltro span")
                .addClass("cabFiltroLineOff");
              $("#ifrs9_cabFiltro h4")
                .addClass("cabFiltroLineOff");

              $('#ifrs9_indicador_leyenda')
                .removeClass("filaOculta");
            }
            $('.loadingDiv')
              .hide();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText)
            if (xhr.status == 405) {
              $.jHueNotify.warn(xhr.responseText);
            } else {
              $('#search-no-customer')
                .addClass('show_warning');
              setTimeout(function () {
                $('#search-no-customer')
                  .removeClass('show_warning');
              }, 2000);
            }

            $('.loadingDiv')
              .hide();

            $('#ifrs9_contentTableResultados')
              .addClass('filaOculta');
            $('#ifrs9_collapseResultados')
              .removeClass('in');
            /* Colapsar filtros */
            $('.collapsible-header')
              .addClass("active");
            $(".collapsible-body")
              .removeClass('filaOculta');
            /* Quitar línea cabecera */
            $("#ifrs9_cabFiltro span")
              .addClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro h4")
              .addClass("cabFiltroLineOn");
            $("#ifrs9_cabFiltro span")
              .removeClass("cabFiltroLineOff");
            $("#ifrs9_cabFiltro h4")
              .removeClass("cabFiltroLineOff");

            $('#ifrs9_detalleCliente')
              .addClass('filaOculta');
            $('#ifrs9_detalleCliente')
              .removeClass('in');

            $('#ifrs9_indicador_leyenda')
              .addClass("filaOculta");
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
        $('.fa-eye')
          .click(function () {
            $('#ifrs9_paginaLoad')
              .load('html/analisis/detalle_ejecucion_cliente.html', function () {
                var script = document.createElement('script');
                script.src = "/static/ifrs9/js/analisis/detalle_ejecucion_cliente.js";
                document.getElementsByTagName('head')[0].appendChild(script);
              });
          });
      });
  });


function formatTimestampSort(date1) {
  var datetime = date1.split(' ');

  if (datetime.length == 1) {
    datetime = date1.split('T');
  }
  var date = datetime[0];
  var time = datetime[1];

  var formato = date.split('-');
  return formato[2] + '-' + formato[1] + '-' + formato[0] + " " + time;
}


function verDetalleConsultaCliente(id_contrato, obj, detalle, customer) {
  obj = unescape(obj);
  detalle = encodeURIComponent(unescape(detalle));
  customer = encodeURIComponent(unescape(customer));
  $.ajax({
    type: "post",
    url: "detalle_consulta_cliente/",
    data: "environment=" + environment + "&id_contrato=" + id_contrato + "&info_execution=" + obj + "&detalle=" + detalle + "&customer=" + customer,
    success: function (data) {
      $('#ifrs9_paginaLoad')
        .hide();
      $('#ifrs9_detalleLoad')
        .empty()
        .html(data)
        .show();
    },
    error: function (error) {

    }
  });
}

function volver_al_listado() {
  $('#ifrs9_paginaLoad')
    .show();
  $('#ifrs9_detalleLoad')
    .hide();
}

function myCustomSortTable(a, b) {
  if (a.timestamp < b.timestamp) return -1;
  if (a.timestamp > b.timestamp) return 1;
  return 0;
}
