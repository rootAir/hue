$(document)
  .ready(function () {
    $('.loadingDivNoAjax')
      .hide()
    // $('#ifrs9_showAnalisisMenu')
    //   .addClass("menu-selected selected");
    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      })
      .removeClass('ifrs9_hidden');

    $('#ifrs9_btnImportar')
      .removeClass('ifrs9_hidden');

    $('select')
      .material_select();

    $('#ifrs9_btnImportar')
      .on('click', function (e) {
        var valid = true;
        var validLength = true;
        var numero_textareas_habilitados = 0;
        $('textarea.form-field-desc:enabled')
          .each(function (index) {
            numero_textareas_habilitados += 1;
            if ($(this)
              .val() === "") {
              valid = false;
            } else if ($(this)
              .val()
              .length > 250) {
              validLength = false;
            }
          });

        if (valid && validLength && numero_textareas_habilitados > 0) {
          $('#ifrs9_modalConfirmacion')
            .openModal();
          $('#ifrs9_buttonAceptarConfirmacion')
            .prop('disabled', false);
        } else {
          $('.form-field-desc:enabled')
            .each(function () {
              if ($(this)
                .val() === "") {
                $(this)
                  .addClass('check-field-coloured');
              }
            });
          if (valid === false) {
            $('#panel-error')
              .addClass('show-control-class');
          }
          if (validLength === false) {
            $('.length_desc_check')
              .addClass('show-control-class');
          }

          $('#ifrs9_btnImportar')
            .addClass('button-disabled')
            .attr('disabled', true);
        }
      });

    $('.ifrs9_fileProvParam')
      .on('click', function (e) {
        $('#ifrs9_btnSeleccionarParam')
          .attr("disabled", true)
          .addClass('button-disabled');
        $('#ifrs9_modalParametrosSubida')
          .openModal();
        $('.show-hide-table, #ifrs9_btnSeleccionarParam')
          .hide();
        $('.loadingDiv')
          .show();
        var origin = $(this)
          .closest('.file-field')
          .find('input.form-field')
          .prop('id');
        $('#ifrs9_listado-param-table_subida')
          .bootstrapTable('destroy');
        var id_project = $(this)
          .prop('id');
        var id_project_split = id_project.split('_');
        var id_project_value = id_project_split[id_project_split.length - 1]
        $.ajax({
          type: "post",
          url: "retrieve_ftp_filelist/",
          data: 'environment=' + environment + "&id_project=" + id_project_value,
          success: function (data) {

            $('.show-hide-table, #ifrs9_btnSeleccionarParam')
              .show();
            $('.loadingDiv')
              .hide();

            var rows = "";

            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                rows += "<tr>";
                rows += "<td>" + data[i][0] + "</td>";
                rows += "<td>" + data[i][1] + "</td>";
                rows += "<td>" + formatTimestamp(data[i][2]) + "</td>";
                rows += "</tr>";
              }

              $('#sourceField')
                .val(origin);

              $('#ifrs9_listado-param-table_subida tbody')
                .empty()
                .html(rows);

              $('#ifrs9_listado-param-table_subida')
                .bootstrapTable({
                  cache: false,
                  striped: true,
                  sortable: true,
                  pagination: true,
                  paginationLoop: false,
                  pageSize: 5,
                  sortName: "lastUpdate",
                  search: true,
                  showHeader: true,
                  sortOrder: "desc",
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
                          }) + " " + initialTableLength + " " + i18next.t('Entradas', {
                            lng: $('#hiddenlan')
                              .val()
                          }) + ")"
                        })
                        .appendTo('#ifrs9_modalParametrosSubida .pagination-detail');
                    }
                  },
                  showFooter: false,
                  pageList: []
                });
              var initialTableLength = $('#ifrs9_listado-param-table_subida')
                .bootstrapTable('getOptions')
                .totalRows;
            } else {
              rows = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
                lng: $('#hiddenlan')
                  .val()
              }) + '</td></tr>';
              $('#ifrs9_listado-param-table_subida tbody')
                .empty()
                .html(rows);
              $('#ifrs9_listado-param-table_subida')
                .bootstrapTable({
                  cache: false,
                  striped: true,
                  pageSize: 5,
                  search: true,
                  showHeader: true,
                  searchAlign: "left",
                });
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {

            $('.show-hide-table, #ifrs9_btnSeleccionarParam')
              .show();
            $('.loadingDiv')
              .hide();
            rows = '<tr class="no-records-found"><td colspan="10">' + i18next.t('No se encontraron resultados', {
              lng: $('#hiddenlan')
                .val()
            }) + '</td></tr>';
            $('#ifrs9_listado-param-table_subida tbody')
              .empty()
              .html(rows);
            $('#ifrs9_listado-param-table_subida')
              .bootstrapTable({
                cache: false,
                striped: true,
                pageSize: 5,
                search: true,
                showHeader: true,
                searchAlign: "left",
              });


            // $('#ifrs9_listado-param-table_subida')
            //   .hide();
            // $('#ifrs9_listado-param-table_subida')
            //   .parent()
            //   .html(error);

            console.log("Error: ",xhr.status);
          }
        });

        $('#ifrs9_listado-param-table_subida > tbody')
          .on('click', 'tr', function () {
            $('#ifrs9_listado-param-table_subida > tbody > tr')
              .removeClass("selected");
            $(this)
              .addClass("selected");

            $('#ifrs9_btnSeleccionarParam')
              .prop("disabled", false)
              .removeClass('button-disabled');
          });

      });
  });

function checkDescLength(id_field, id_desc) {

  var elemento = '#' + id_field + id_desc;

  $('#panel-error')
    .removeClass('show-control-class');
  $('.length_desc_check')
    .removeClass('show-control-class');

  if ($(elemento)
    .val()
    .length > 250) {
    $('.length_desc_check')
      .addClass('show-control-class');
    //$('#ifrs9_comentariosAsigReglas_2').addClass('check-field-coloured');
    $(elemento)
      .addClass('check-field-coloured');

    $('#ifrs9_btnImportar')
      .attr('disabled', true)
      .addClass('button-disabled');

  } else {
    $('#ifrs9_btnImportar')
      .attr('disabled', false)
      .removeClass('button-disabled');
    $('.length_desc_check')
      .removeClass('show-control-class');
    $(elemento)
      .removeClass('check-field-coloured');
    $(elemento)
      .removeClass('invalid');
  }
}

function handleCheckboxImport(elem) {
  var id_elem = $(elem)
    .prop('id');
  var id_project = id_elem.substring(id_elem.length - 1);

  if ($('textarea#ifrs9_comentariosAsigReglas_' + id_project)
    .prop('disabled') == true) {
    $('textarea#ifrs9_comentariosAsigReglas_' + id_project)
      .prop('disabled', false)
      .prop('required', true);
    $(elem)
      .prop('required', true);
  } else {
    $('textarea#ifrs9_comentariosAsigReglas_' + id_project)
      .prop('disabled', true)
      .prop('required', false)
      .removeClass('check-field-coloured');
    $(elem)
      .prop('required', false);
  }

  validateImports();
}

function validateImports() {
  var isValid = true;

  $('#panel-error')
    .removeClass('show-control-class');
  $('.length_desc_check')
    .removeClass('show-control-class');

  var numero_checkboxes_habilitados = 0;
  $('.form-field')
    .each(function () {
      if ($(this)
        .is(':checked')) {
        numero_checkboxes_habilitados += 1;
      }
    });

  if (isValid) {
    if (numero_checkboxes_habilitados > 0) {
      $('#ifrs9_btnImportar')
        .removeClass('button-disabled')
        .attr('disabled', false);
    } else {
      $('#ifrs9_btnImportar')
        .addClass('button-disabled')
        .attr('disabled', true);
    }
    $('#panel-error')
      .removeClass('show-control-class');

  } else {
    $('#ifrs9_btnImportar')
      .addClass('button-disabled')
      .attr('disabled', true);
  }

  $('.form-field-desc')
    .each(function () {
      if ($(this)
        .hasClass('check-field-coloured') && $(this)
        .val() === "") {
        $('#panel-error')
          .addClass('show-control-class');
      }
    });
}

function empty_params_field(id_project) {
  var fieldFile = '#ifrs9_fileProvParam_' + id_project;
  var fieldDesc = '#ifrs9_comentariosProvParam_' + id_project;
  $(fieldFile)
    .val('')
    .prop('disabled', true)
    .prop('readonly', false);
  $(fieldDesc)
    .removeClass('check-field-coloured')
    .prop('disabled', true);

  validateImports();
}


$('#import_rules_params_analisis')
  .on('submit', function (e) {
    $('#ifrs9_buttonAceptarConfirmacion')
      .prop('disabled', true)
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
          $('#import_rules_params_analisis')[0].reset();
          $('#ifrs9_modalConfirmacion')
            .closeModal();
          $('.success_message')
            .addClass('show_success');
          $('textarea.form-field-desc:enabled')
            .each(function (index) {
              $(this)
                .prop("disabled", true)
            });
          $('.fix-input-params-width')
            .prop('readonly', false)
            .prop('disabled', true);
          setTimeout(function () {
            $('.success_message')
              .removeClass('show_success');
          }, 2000);
        } else {
          console.log("Error al importar reglas: " + data);
          $('#ifrs9_modalConfirmacion')
            .closeModal();
          $('.error_message')
            .addClass('show_error');
        }
      },
      error: function (xhr, errrmsg, error) {
        console.log(xhr.responseText);
        if (xhr.status == 405) {
          $.jHueNotify.warn(xhr.responseText);
        } else {
          $('#ifrs9_modalConfirmacion')
            .closeModal();
          $('.error_message')
            .addClass('show_error');
          setTimeout(function () {
            $('.error_message')
              .removeClass('show_error');
          }, 2000);
        }
      }
    });
  });

function formatTimestampSort(date1) {
  var formato = date1.split('-');
  return formato[2] + '-' + formato[1] + '-' + formato[0];
}

function custom_sort(a, b) {
  return new Date(formatTimestampSort(a))
    .getTime() - new Date(formatTimestampSort(b))
    .getTime();
}
