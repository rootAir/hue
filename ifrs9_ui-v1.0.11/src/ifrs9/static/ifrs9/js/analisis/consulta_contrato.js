$(document)
  .ready(function () {

    $('#ifrs9_idContrato')
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
        $.ajax({
          type: "post",
          data: $('#form_consulta_contrato')
            .serialize(),
          url: "consulta_contrato/",
          success: function (data) {
            console.log(data)
            data.contracts = data.contracts.sort(custom_sort);
            // data = JSON.parse(data);
            var tr = "",
              info_execution,
              detalle = data.detalle,
              customer_id = detalle.customer_id.value,
              date_aux;

            detalle = JSON.stringify(data.detalle);
            detalle = escape(detalle);

            if (data.contracts.length > 0) {
              // $('.entidad')
              //   .text(data.detalle.entity.value);
              $('.agrup_producto')
                .text(data.detalle.product_grouper.value);
              $('.centro')
                .text(data.detalle.branch.value);
              $('.id_contrato')
                .text(data.detalle.contract_id.value);
              $('.primer_titular')
                .text(data.detalle.customer_name.value);

              for (var i = 0; i < data.contracts.length; i++) {
                datos_motor = '<ul>' +
                  '<li><b>' + i18next.t('Importe', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + getValueJsonImporteTable(data.contracts[i].importe.value, data.detalle.currency.value) + '</li>';

                datos_motor = datos_motor + '<li><b>' + i18next.t('Stage', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + getValueJsonTable(data.contracts[i].stage.value) + '</li>' +
                  '<li><b>' + i18next.t('LGD', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + addDecimals(data.contracts[i].lgd.value) + '</li>' +
                  '</ul>';

                ajustados = '<ul>' +
                  '<li><b>' + i18next.t('Importe', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + getValueJsonImporteDirectoTable(data.contracts[i].importe.value, data.contracts[i].importe.ajuste, data.contracts[i].importe.directo, data.detalle.currency.value) + '</li>';

                var NaN_msg = $('#hiddenNan')
                  .val()
                if (data.contracts[i].porcentaje.directo == "1" && data.contracts[i].porcentaje.pct_in != "" && data.contracts[i].porcentaje.pct_in != NaN_msg) {
                  ajustados = ajustados + '<li><b>% ' + i18next.t('Importe', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + getPorcImporteJsonDirectoTable(data.contracts[i].porcentaje.pct_in, data.contracts[i].porcentaje.directo) + '</li>';

                  data.contracts[i].porcentaje.pct_in = addDecimals(data.contracts[i].porcentaje.pct_in);
                }

                ajustados = ajustados + '<li><b>' + i18next.t('Stage', {
                  lng: $('#hiddenlan')
                    .val()
                }) + ': </b>' + getValueJsonStageDirectoTable(data.contracts[i].stage.value, data.contracts[i].stage.ajuste, data.contracts[i].stage.directo, data.contracts[i].exclusion_30d.value) + '</li>';

                ajustados = ajustados + '<li><b>' + i18next.t('LGD', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + ': </b>' + getValueJsonLGDDirectoTable(data.contracts[i].lgd.value, data.contracts[i].lgd.ajuste, data.contracts[i].lgd.directo, data.contracts[i].exclusion_30d.value) + '</li>' +
                  '</ul>';
                date_aux = data.contracts[i].data_timestamp_part.value;
                data.contracts[i].data_timestamp_part.value = formatTimestamp_cc(data.contracts[i].data_timestamp_part.value);
                data.contracts[i].amount.value = addDecimals(data.contracts[i].amount.value);
                info_execution = JSON.stringify(data.contracts[i]);
                info_execution = escape(info_execution)
                tr += "<tr>";
                tr += '<td class="text-center">' +
                  '<a href="javascript:void(0)" onclick="verDetalleConsultaContrato(' +
                  data.contracts[i].contract_id.value + ',\'' + info_execution.trim() + '\', \'' + detalle.trim() + '\', \'' + customer_id + '\')" class="fa fa-eye color-icon" title="' + i18next.t('Detalle', {
                    lng: $('#hiddenlan')
                      .val()
                  }) + '"></a></td>';

                tr += "<td data-timestamp='" + date_aux + "'>" + data.contracts[i].data_timestamp_part.value + "</td>";
                // tr += "<td>" + data.detalle.product_grouper.value + "</td>";
                tr += "<td>" + datos_motor + "</td>";
                tr += "<td>" + ajustados + "</td>";
                tr += "</tr>";
              }
              $('#ifrs9_contracts-table tbody')
                .empty()
                .append(tr);

              $('#ifrs9_contracts-table')
                .bootstrapTable({
                  cache: false,
                  striped: true,
                  sortable: true,
                  pagination: true,
                  paginationLoop: false,
                  sortName: "fechaExec",
                  pageSize: 5,
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
            } else {
              $('#ifrs9_contracts-table tbody')
                .empty()
                .append(tr);

              $('#ifrs9_contracts-table')
                .bootstrapTable({
                  cache: false,
                  striped: true,
                  pageSize: 5,
                  showHeader: true,
                  showFooter: false,
                });
            }

            $('#ifrs9_contentTableResultados')
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

            $('#ifrs9_detalleContrato')
              .removeClass("filaOculta");

            $('#ifrs9_indicador_leyenda')
              .removeClass("filaOculta");

            $('.loadingDiv')
              .hide();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            if (xhr.status == 405) {
              $.jHueNotify.warn(xhr.responseText);
            } else {
              $('#search-no-contract')
                .addClass('show_warning');
              setTimeout(function () {
                $('#search-no-contract')
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
            $('#ifrs9_detalleContrato')
              .addClass("filaOculta");

            $('#ifrs9_indicador_leyenda')
              .addClass("filaOculta");
          }
        });
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
    $('select')
      .material_select();

    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
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


function verDetalleConsultaContrato(id_contrato, obj, detalle, id_customer) {
  obj = unescape(obj);
  detalle = encodeURIComponent(unescape(detalle));
  $.ajax({
    type: "post",
    url: "detalle_consulta_contrato/",
    data: "environment=" + environment + "&id_contrato=" + id_contrato + "&info_execution=" + obj + "&detalle=" + detalle + "&id_customer=" + id_customer,
    success: function (data) {
      $('#ifrs9_paginaLoad')
        .hide();
      $('#ifrs9_detalleLoad')
        .empty()
        .html(data)
        .show();
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function volver_al_listado() {
  $('#ifrs9_paginaLoad')
    .show();
  $('#ifrs9_detalleLoad')
    .hide();
}

function custom_sort(a, b) {
  return a.data_timestamp_part.value - b.data_timestamp_part.value;
}

function myCustomSortTable(a, b) {
  if (a.timestamp < b.timestamp) return -1;
  if (a.timestamp > b.timestamp) return 1;
  return 0;
}
