$('#submit_execution_form')
  .on('submit', function (e) {
    var data = $(this)
      .serialize();
    e.preventDefault();
    $.ajax({
      url: $(this)
        .attr('action'),
      type: 'post',
      data: data,
      success: function (data) {
        if (data == "ok") {
          $('#ifrs9_modalConfirmacion')
            .closeModal();
          $('#submit_execution_form')[0].reset();
          $('.ellipsis_desc')
            .text('');
          $('#ifrs9_detalleEjecucion .collapsible-header')
            .click();
          // reload the results table...
          $('.loadingDivNoAjax')
            .show();
          $('.table-container')
            .hide();
          $.ajax({
            url: 'filter_executions/',
            type: 'post',
            data: $('#filter_form')
              .serialize() + "&environment=" +
              environment,
            dataType: "json",
            success: function (data) {
              $('#ifrs9_customers-table')
                .bootstrapTable('destroy');
              $('.loadingDivNoAjax')
                .hide();
              $('.table-container')
                .show();
              var tr = "",
                fecha_exec;
              for (var i = 0; i < data.length; i++) {
                fecha_exec = data[i].fechaejecucion !== "" ? formatTimestampEjecucion(data[i].fechaejecucion, true) : ""
                tr += "<tr>";
                tr += "<td data-align='center'><a href='#' id='ifrs9_icon1' class='fa fa-eye color-icon' title='Detalle'></a><input type='hidden' value='" + data[i].ejecucion_id + "' /></td>";
                tr += "<td>" + fecha_exec + "</td>";
                tr += "<td>" + formatTimestamp(data[i].fechaalta) + "</td>";
                tr += "<td>" + data[i].estado.descripcion + "</td>";
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
                          }) + " " + data.length + " " + i18next.t('Entradas', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ")"
                        })
                        .appendTo('.pagination-detail');
                    }
                  },
                  showFooter: false,
                  pageList: []
                });
              $('#ifrs9_btnEjecutar')
                .prop('disabled', true)
                .addClass('button-disabled');
              $('.success_message')
                .addClass('show_success');
              setTimeout(function () {
                $('.success_message')
                  .removeClass('show_success');
              }, 2000);
            }
          });
        } else {
          console.log("Error al añadir ejecución")
          $('#ifrs9_modalConfirmacion')
            .closeModal();
          $('#submit_execution_form')[0].reset();
          $('.ellipsis_desc')
            .text('');
          $('#ifrs9_detalleEjecucion .collapsible-header')
            .click();
          $('.warning_message')
            .addClass('show_warning');
          setTimeout(function () {
            $('.warning_message')
              .removeClass('show_warning');
          }, 2000);
          $('#ifrs9_btnEjecutar')
            .prop('disabled', true)
            .addClass('button-disabled');
        }
      },
      error: function (xhr, errrmsg, error) {}
    });
  });


function submit_import_rules(button) {
  $('#ifrs9_btnImportar')
    .prop("disabled", true)
    .addClass('button-disabled');
  $(this)
    .prop('disabled', true);
  $('#import_rules_params_analisis')
    .submit();
}


var env = 0,
  executions_result,
  selectedRow;


function setTitle(env) {
  switch (env) {
    case 1:
      $('#env1')
        .show();
      break;
    case 2:
      $('#env2')
        .show();
      break;
    case 3:
      $('#env3')
        .show();
      break;
  }
}

function selectParameter() {
  var file_name = $('#ifrs9_listado-param-table_subida > tbody > tr.selected')
    .find('td')[0],
    elemField = $('#sourceField')
    .val();

  $('#' + elemField)
    .val($(file_name)
      .text())
    .prop("disabled", false)
    .prop("readonly", true);
  elemField_split = elemField.split('_');
  $('#ifrs9_comentariosProvParam_' + elemField_split[elemField_split.length - 1])
    .prop("disabled", false);
  $('#ifrs9_modalParametrosSubida')
    .closeModal();

  $('#ifrs9_btnImportar')
    .attr('disabled', false)
    .removeClass('button-disabled');
}

function formatTimestamp(date1) {

  if (date1 === null) {
    return;
  }

  var datetime = date1.split(' ');

  if (datetime.length == 1) {
    datetime = date1.split('T');
  }
  var date = datetime[0];
  var time = datetime[1];

  var formatodate = date.split('-');

  // var formatotime = time.split('.');
  return formatodate[2] + '-' + formatodate[1] + '-' + formatodate[0]; // + ' ' + formatotime[0]
}


function formatTimestamp_cc(date1) {
  var date = new Date(parseInt(date1));
  var month = date.getMonth();
  var year = date.getFullYear();
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return addZero(day) + "-" + addZero(month + 1) + "-" + year + " " + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);
}

$('#form_insertar_ajuste_contrato')
  .on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "add_new_adjustment_by_contract/",
      data: $('#form_insertar_ajuste_contrato')
        .serialize() + "&id_contrato=" + $('#ifrs9_idContrato')
        .val(),
      success: function (data) {
        $('#myModalConfirmacionAltaAjusteContrato .modal')
          .closeModal();
        $('#form_insertar_ajuste_contrato')[0].reset();
        $('#ifrs9_collapseDatosUltimaEjecucion label.active')
          .removeClass('active');
        $('.success_message')
          .addClass('show_success');
        setTimeout(function () {
          $('.success_message')
            .removeClass('show_success');
        }, 2000)

      },
      error: function (error) {

      }
    });
  });
$('#form_insertar_ajuste_cliente')
  .on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "add_new_adjustment_by_customer/",
      data: $('#form_insertar_ajuste_cliente')
        .serialize() + "&id_contrato=" + $('#ifrs9_idCliente')
        .val(),
      success: function (data) {
        $('#myModalConfirmacionAltaAjusteCustomer .modal')
          .closeModal();
        $('#form_insertar_ajuste_cliente')[0].reset();
        $('#ifrs9_collapseDatosUltimaEjecucion label.active')
          .removeClass('active');
        $('.success_message')
          .addClass('show_success');
        setTimeout(function () {
          $('.success_message')
            .removeClass('show_success');
        }, 2000)

      },
      error: function (error) {

      }
    });
  });

$('#alta_exclusion_contrato')
  .on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "add_new_exclusion_by_contract/",
      data: $('#alta_exclusion_contrato')
        .serialize() + "&id_contrato=" + $('#ifrs9_idContrato')
        .val(),
      success: function (data) {
        $('#myModalConfirmacionAltaExclusionContrato .modal')
          .closeModal();
        $('#alta_exclusion_contrato')[0].reset();
        $('#ifrs9_collapseDatosUltimaEjecucion label.active')
          .removeClass('active');
        $('.success_message')
          .addClass('show_success');
        setTimeout(function () {
          $('.success_message')
            .removeClass('show_success');
        }, 2000)

      },
      error: function (error) {

      }
    });
  });

$('#alta_exclusion_cliente')
  .on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "add_new_exclusion_by_customer/",
      data: $('#alta_exclusion_cliente')
        .serialize() + "&id_contrato=" + $('#ifrs9_idCliente')
        .val(),
      success: function (data) {
        $('#myModalConfirmacionAltaExclusionCustomer .modal')
          .closeModal();
        $('#alta_exclusion_cliente')[0].reset();
        $('#ifrs9_collapseDatosUltimaEjecucion label.active')
          .removeClass('active');
        $('.success_message')
          .addClass('show_success');
        setTimeout(function () {
          $('.success_message')
            .removeClass('show_success');
        }, 2000)

      },
      error: function (error) {

      }
    });
  });

function addDecimals(number) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (number == "" || number == NaN_msg) {
    return "----";
  }

  if ($('#hiddenlan')
    .val() == "en-US") {
    if (number.indexOf(".") == -1) {
      return (number + ".00")
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    } else {

      var temp = number.split(".");
      var longTemp2 = temp[1].length;
      if (longTemp2 == 1) {
        return (temp[0] + '.' + temp[1].charAt(0) + '0')
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      } else {
        return (temp[0] + '.' + temp[1].charAt(0) + temp[1].charAt(1))
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
    }
  } else {
    number = number.replace(".", ",")
    if (number.indexOf(",") == -1) {
      return (number + ",00")
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    } else {

      var temp = number.split(",");
      var longTemp2 = temp[1].length;
      if (longTemp2 == 1) {
        return (temp[0] + ',' + temp[1].charAt(0) + '0')
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      } else {
        return (temp[0] + ',' + temp[1].charAt(0) + temp[1].charAt(1))
          .toString()
          .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    }
  }
}

// ALTA CONTRATO
function getValueJsonDecimals(ajuste, elem, value) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    elem.text(addDecimals(ajuste));
    return true;
  } else {
    if (value == "" || value == NaN_msg) {
      elem.text("----");
      return false;
    } else {
      elem.text(addDecimals(value));
      return true;
    }
  }
}

function getValueJsonDecimalsLGD(ajuste, elem, value, directo) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (directo == "1") {
      elem.text(addDecimals(ajuste));
    } else {
      elem.text("----");
    }
  } else {
    elem.text(addDecimals(value));
  }
}

function getValueJson(ajuste, elem, value) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    elem.text(ajuste);
  } else {
    if (value == "" || value == NaN_msg) {
      elem.text("----");
    } else {
      elem.text(value);
    }
  }
}

function getValueJsonDirecto(value, ajuste, directo, elem) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == '0') {
      elem.text('(NA)');
    } else if (value == ajuste && directo == '1') {
      elem.text('(D)');
    } else {
      elem.text(directo == "1" ? '(D)' : '(I)');
    }
  } else {
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")) {
    if (value != NaN_msg && value != "") {
      elem.text('(NA)');
    } else {
      elem.text("");
    }
  }
}

function getValueJsonDirectoStage(value, ajuste, directo, elem, exclusion_30d) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == '0') {
      elem.text('(NA)');
    } else if (value == ajuste && directo == '1') {
      elem.text('(D)');
    } else if (value != ajuste && directo == "0" && exclusion_30d == "Y") {
      elem.text('(E)');
    } else {
      elem.text(directo == "1" ? '(D)' : '(I)');
    }
  } else {
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")){
    if (value != NaN_msg && value != "") {
      elem.text('(NA)');
    } else {
      elem.text("");
    }
  }
}

function getValueJsonDirectoLGD(value, ajuste, directo, elem, exclusion_30d) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == '0') {
      elem.text('(NA)');
    } else if (value == ajuste && directo == '1') {
      elem.text('(D)');
    }
    // else if (value != ajuste && directo == "0" && exclusion_30d == "Y") {
    //   elem.text('(E)');
    // }
    else if (value != ajuste && directo == "1") {
      elem.text('(D)');
    }
    // else {
    //   elem.text(directo == "1" ? '(D)' : '(I)');
    // }
    else if (value != ajuste && directo == "0") {
      elem.text('(NA)');
    } else {
      elem.text('');
    }
  } else {
    elem.text('(NA)');
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")){
    // if(value != NaN_msg && value != ""){
    //   elem.text('(NA)');
    // } else {
    //   elem.text('(NA)');
    // }
  }
}

function getPorcImporteJsonDirecto(ajuste, directo, elem) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    elem.text(directo == "1" ? '(D)' : '(I)');
  } else {
    elem.text("");
  }
}

// ALTA CLIENTE
function getValueJsonImporteTable(number, currency) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (number != "" && number != NaN_msg) {
    return addDecimals(number) +
      '<span style="text-transform: uppercase;"> ' + currency + '</span>';
  } else {
    return "----";
  }
}

function getValueJsonTable(number) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (number != "" && number != NaN_msg) {
    return number;
  } else {
    return "----";
  }
}

function getValueJsonImporteDirectoTable(value, ajuste, directo, currency) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == "1") {
      return addDecimals(ajuste) + '<span style="text-transform: uppercase;"> ' + currency + '</span> (D)';
    } else if (value == ajuste && directo == "0") {
      return addDecimals(ajuste) + '<span style="text-transform: uppercase;"> ' + currency + '</span> (NA)';
    } else {
      return addDecimals(ajuste) + '<span style="text-transform: uppercase;"> ' + currency + '</span> ' + (directo == "1" ? '(D)' : '(I)');
    }
  } else {
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")){
    if (value != NaN_msg && value != "") {
      return addDecimals(value) + '<span style="text-transform: uppercase;"> ' + currency + '</span> (NA)';
    } else {
      return addDecimals(value);
    }
  }
}

function getValueJsonStageDirectoTable(value, ajuste, directo, exclusion_30d) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == "1") {
      return ajuste + ' (D)';
    } else if (value == ajuste && directo == "0") {
      return ajuste + ' (NA)';
    } else if (value != ajuste && directo == "0" && exclusion_30d == "Y") {
      return ajuste + ' (E)';
    } else {
      return ajuste + ' ' + (directo == "1" ? '(D)' : '(I)');
    }
  } else {
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")){
    if (value != NaN_msg && value != "") {
      return value + ' (NA)';
    } else {
      return "----";
    }
  }
}

function getValueJsonLGDDirectoTable(value, ajuste, directo, exclusion_30d) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg) {
    if (value == ajuste && directo == "1") {
      return addDecimals(ajuste) + ' (D)';
    }
    // else if (value != ajuste && directo == "0" && exclusion_30d == "Y") {
    //   return addDecimals(ajuste) + ' (E)';
    // }
    else if (value == ajuste && directo == "0") {
      return addDecimals(ajuste) + ' (NA)';
    } else if (value != ajuste && directo == "1") {
      return addDecimals(ajuste) + ' (D)';
      // if(value == "" || value == NaN_msg){
      //   return addDecimals(value) + ' (D)';
      // } else {
      //   return addDecimals(ajuste) + ' (D)';
      // }
    } else if (value != ajuste && directo == "0") {
      return addDecimals(value) + ' (NA)';
    }
    // } else {
    //   return addDecimals(ajuste) + ' ' + (directo == "1" ? '(D)' : '(I)');
    // }
    else {
      return addDecimals(value);
    }
  } else {
    return addDecimals(value) + ' (NA)';
    // if((ajuste == NaN_msg || ajuste == "") && (value != NaN_msg && value != "")){
    // if(value != NaN_msg && value != "") {
    //   return addDecimals(value) + ' (NA)';
    //   } else {
    //   return addDecimals(value) + ' (NA)';
    // }
  }
}

function getPorcImporteJsonDirectoTable(ajuste, directo) {
  var NaN_msg = $('#hiddenNan')
    .val()

  if (ajuste != "" && ajuste != NaN_msg && directo == "1") {
    return addDecimals(ajuste) + ' (D)';
  }
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function unixTimestamptToDate(timestamp) {
  //console.log('unixTimestamptToDate fecha antes ' +  timestamp);
  var date = new Date(parseInt(timestamp));
  // Hours part from the timestamp
  var hours = addZero(date.getHours());

  // Minutes part from the timestamp
  var minutes = addZero(date.getMinutes());

  // Seconds part from the timestamp
  var seconds = addZero(date.getSeconds());

  var day = addZero(date.getDate());
  var month = addZero(date.getMonth() + 1);
  var year = date.getFullYear();
  // Will display time in 10:30:23 format
  var formattedTime = day + "-" + month + "-" + year + " " + hours + ':' + minutes + ':' + seconds;
  //console.log('unixTimestamptToDate fecha despues ' +  formattedTime);
  return formattedTime;
}


function checkUserEntity(url) {
  url = "/ifrs9";
  $.ajax({
    url: "check_user_has_entity/",
    type: "post",
    success: function (data) {
      $(document)
        .load(url);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      if (xhr.status == 405) {
        $.jHueNotify.error(xhr.responseText);
      } else {
        $.jHueNotify.warn(xhr.responseText);
      }
      console.log(xhr)
      return;
    }
  });
}

$(document)
  .ready(function () {
    checkUserEntity($('#ifrs9_app_url')
      .val());
    // Stop the backspace function less in cases where it is necessary to enter data

    $(document)
      .keyup(function (e) {
        var classUser = $(document.activeElement)
          .hasClass('validate');
        var classSearch = $(document.activeElement)
          .hasClass('form-control');
        var classTextarea = $(document.activeElement)
          .hasClass('materialize-textarea');

        if (e.keyCode === 8 && !(classUser || classSearch || classTextarea)) {
          return false;
        };

      });

    $(window)
      .keydown(function (e) {
        if (e.keyCode === 13) {
          console.log("Pulsaste enter")
          e.preventDefault();
          return false;
        }
      })

    $('input')
      .on('keyup', function (e) {
        if (e.keyCode === 13) {
          console.log("Pulsaste enter")
          null;
          return false;
        }
      })
  });

function formatTimestampEjecucion(date1, ejecucion) {

  var datetime = date1.split(' ');

  if (datetime.length == 1) {
    datetime = date1.split('T');
  }
  var date = datetime[0];
  var time = datetime[1];

  var formato = date.split('-');
  if (ejecucion) {
    return formato[2] + '-' + formato[1] + '-' + formato[0] + " " + time;
  } else {
    return formato[2] + '-' + formato[1] + '-' + formato[0];
  }

}
