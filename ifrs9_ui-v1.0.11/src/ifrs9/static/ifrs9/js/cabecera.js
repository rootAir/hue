$(document)
  .ready(function () {
    $('.settingsBlock')
      .on('click', function (e) {
        $('#ifrs9_modalSettings')
          .openModal();
        $('#ifrs9_settings-table_wrapper thead th')[0].click(function (e) {});
      });
    $('.dropdown-button')
      .dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
      });


    var nombreOriginal, apellidosOriginal, checkOriginal, perfilOriginal;

    $(document)
      .on('click', '#ifrs9_botonera .fa-pencil', function () {
        var idRowSelected = $(this)
          .parent()
          .parent()
          .prop("id");
        idRowSelected = idRowSelected.substring(idRowSelected.length - 1);
        var idUsuario = $("#ifrs9_idUsuario" + idRowSelected)[0];
        var nombre = $("#ifrs9_nombre" + idRowSelected)[0];
        var apellidos = $("#ifrs9_apellidos" + idRowSelected)[0];
        var check = $("#ifrs9_check" + idRowSelected)[0];
        var perfil = $("#ifrs9_perfil" + idRowSelected)[0];

        nombreOriginal = $($("#ifrs9_nombre" + idRowSelected)[0])
          .text();
        apellidosOriginal = $($("#ifrs9_apellidos" + idRowSelected)[0])
          .text();
        checkOriginal = $($("#ifrs9_check" + idRowSelected)[0])
          .is(":checked");
        perfilOriginal = $($("#ifrs9_perfil" + idRowSelected)[0])
          .text();

        var firstButton = $("#ifrs9_firstButton" + idRowSelected)[0];
        var secondButton = $("#ifrs9_secondButton" + idRowSelected)[0];
        var thirdButton = $("#ifrs9_thirdButton" + idRowSelected)[0];
        var forthButton = $("#ifrs9_forthButton" + idRowSelected)[0];


        $("#ifrs9_nombre" + idRowSelected)
          .eq(0)
          .html("<input class='margin-bottom0' id=\'ifrs9_nombre" + idRowSelected + "\' value=\'" + $(nombre)
            .text() + "\' ></input>");
        $("#ifrs9_apellidos" + idRowSelected)
          .eq(0)
          .html("<input class='margin-bottom0' id=\'ifrs9_apellidos" + idRowSelected + "\' value=\'" + $(apellidos)
            .text() + "\' ></input>");
        $(check)
          .prop("disabled", false);

        $("#ifrs9_perfil" + idRowSelected)
          .eq(0)
          .html(
            "<select id=\'ifrs9_perfil" + idRowSelected + "\' data-placeholder=\'1\'>" +
            "	<option value=\'0\'>P. Consulta</option>" +
            "	<option value=\'1\'>P. Ejecución</option>" +
            "	<option value=\'2\'>P. Administrador</option>" +
            "</select>"
          );
        $('select')
          .material_select();
        $(".select-dropdown")
          .css("margin-bottom", "0");
        $($("#ifrs9_firstButton" + idRowSelected)[0])
          .addClass("filaOculta");
        $($("#ifrs9_thirdButton" + idRowSelected)[0])
          .addClass("filaOculta");
        $($("#ifrs9_secondButton" + idRowSelected)[0])
          .removeClass("filaOculta");
        $($("#ifrs9_forthButton" + idRowSelected)[0])
          .removeClass("filaOculta");

      })

    $(document)
      .on('click', '#ifrs9_botonera .fa-floppy-o', function () {
        var idRowSelected = $(this)
          .parent()
          .parent()
          .prop("id");
        idRowSelected = idRowSelected.substring(idRowSelected.length - 1);
        var firstButton = $("#ifrs9_firstButton" + idRowSelected)[0];
        var secondButton = $("#ifrs9_secondButton" + idRowSelected)[0];
        var thirdButton = $("#ifrs9_thirdButton" + idRowSelected)[0];
        var forthButton = $("#ifrs9_forthButton" + idRowSelected)[0];


        $("#ifrs9_idUsuario" + idRowSelected)
          .eq(0)
          .html($("#ifrs9_idUsuario" + idRowSelected + " input")
            .val());
        $("#ifrs9_nombre" + idRowSelected)
          .eq(0)
          .html($("#ifrs9_nombre" + idRowSelected + " input")
            .val());
        $("#ifrs9_apellidos" + idRowSelected)
          .eq(0)
          .html($("#ifrs9_apellidos" + idRowSelected + " input")
            .val());
        $("#ifrs9_perfil" + idRowSelected)
          .eq(0)
          .html($("#ifrs9_perfil" + idRowSelected + " option:selected")
            .text());
        $("#ifrs9_check" + idRowSelected)
          .eq(0)
          .prop("disabled", "disabled");

        $($("#ifrs9_secondButton" + idRowSelected)[0])
          .addClass("filaOculta");
        $($("#ifrs9_forthButton" + idRowSelected)[0])
          .addClass("filaOculta");
        $($("#ifrs9_firstButton" + idRowSelected)[0])
          .removeClass("filaOculta");
        $($("#ifrs9_thirdButton" + idRowSelected)[0])
          .removeClass("filaOculta");

        perfilOriginal = '';
        nombreOriginal = '';
        apellidosOriginal = '';
        checkOriginal = '';
      })

    $(document)
      .on('click', '#ifrs9_botonera .fa-times', function () {
        var idRowSelected = $(this)
          .parent()
          .parent()
          .prop("id");
        idRowSelected = idRowSelected.substring(idRowSelected.length - 1);
        var firstButton = $("#ifrs9_firstButton" + idRowSelected)[0];
        var secondButton = $("#ifrs9_secondButton" + idRowSelected)[0];
        var thirdButton = $("#ifrs9_thirdButton" + idRowSelected)[0];
        var forthButton = $("#ifrs9_forthButton" + idRowSelected)[0];

        if ((nombreOriginal == null || nombreOriginal == "") && (apellidosOriginal == null || apellidosOriginal == "")) {
          $(this)
            .parent()
            .parent()
            .remove();
        } else {
          $("#ifrs9_nombre" + idRowSelected)
            .eq(0)
            .text(nombreOriginal);
          $("#ifrs9_apellidos" + idRowSelected)
            .eq(0)
            .text(apellidosOriginal);
          $("#ifrs9_perfil" + idRowSelected)
            .eq(0)
            .text(perfilOriginal);
          $("#ifrs9_check" + idRowSelected)
            .eq(0)
            .prop("checked", checkOriginal);
          $("#ifrs9_check" + idRowSelected)
            .eq(0)
            .prop("disabled", "disabled");

          $($("#ifrs9_firstButton" + idRowSelected)[0])
            .removeClass("filaOculta");
          $($("#ifrs9_thirdButton" + idRowSelected)[0])
            .removeClass("filaOculta");
          $($("#ifrs9_secondButton" + idRowSelected)[0])
            .addClass("filaOculta");
          $($("#ifrs9_forthButton" + idRowSelected)[0])
            .addClass("filaOculta");
        }
      })

    $(document)
      .on('click', '#ifrs9_botonera .fa-trash', function (e) {
        $(this)
          .parent()
          .parent()
          .remove();
        e.preventDefault();
      })

    /* Añadir fila a tabla settings */
    $(document)
      .on('click', '#ifrs9_buttonNuevaFila', function () {
        var idNuevo = $('#ifrs9_modalSettings tbody tr')
          .length + 1;
        $('#ifrs9_modalSettings tbody')
          .append("<tr id='ifrs9_" + idNuevo + "' rol='row' class='" + (idNuevo % 2 === 0 ? 'even' : 'odd') + "'>" +
            "<td class='text-left sorting_1' id='ifrs9_idUsuario" + idNuevo + "' >" +
            "<input class='margin-bottom0' value=''></input>" +
            "</td>" +
            "<td class='text-left' id='ifrs9_nombre" + idNuevo + "' >" +
            "<input class='margin-bottom0' value=''></input>" +
            "</td>" +
            "<td class='text-left' id='ifrs9_apellidos" + idNuevo + "'>" +
            "<input class='margin-bottom0' value=''></input>" +
            "</td>" +
            "<td class='text-center' id=\'ifrs9_perfil" + idNuevo + "\' >" +
            "<select data-placeholder=\'1\'>" +
            "	<option value=\'0\'>P. Consulta</option>" +
            "	<option value=\'1\'>P. Ejecución</option>" +
            "	<option value=\'2\'>P. Administrador</option>" +
            "</select>" +
            "</td>" +
            "<td class='text-center'>" +
            "<input type='checkbox' id='ifrs9_check" + idNuevo + "' class='filled-in'></input>" +
            "<label class='top6' for='ifrs9_check" + idNuevo + "'></label>" +
            "</td>" +
            "<td class='text-center' id='ifrs9_botonera'>" +
            "<a id='ifrs9_firstButton" + idNuevo + "' href='#' class='padding-right15 fa fa-trash color-icon' data-toggle='modal' title='Borrar'></a>" +
            "<a id='ifrs9_secondButton" + idNuevo + "' href='#' class='padding-right15 fa fa-times color-icon' data-toggle='modal' title='Cancelar'></a> " +
            "<a id='ifrs9_thirdButton" + idNuevo + "' href='#' class='fa fa-pencil color-icon' title='Editar'></a>" +
            "<a id='ifrs9_forthButton" + idNuevo + "' href='#' class='fa fa-floppy-o color-icon' title='Guardar'></a>" +
            "</td>" +
            "</tr>')");

        /* Pintar select. Ocultar búsqueda */
        $('select')
          .material_select();
        $(".select-dropdown")
          .css("margin-bottom", "0");
        $('#ifrs9_settings-table')
          .DataTable();
        $($("#ifrs9_firstButton" + idNuevo)[0])
          .addClass("filaOculta");
        $($("#ifrs9_thirdButton" + idNuevo)[0])
          .addClass("filaOculta");
      });

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
        close: 'Cerrar'
      });

    $('select')
      .material_select();

    $('.collapsible')
      .collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });


    /* Cabecera */
    // $('.langBlock .header-separator')
    //   .click(function () {
    //     $(".langBlock .header-separator")
    //       .removeClass('selected');
    //     $(this)
    //       .addClass('selected');
    //   });
    //
    // $('.idioma .bandera')
    //   .click(function () {
    //     var id = $(this)
    //       .attr('id');
    //     id = id.split("ifrs9_")[1];
    //     var nombre = $(this)
    //       .children();
    //     var texto = nombre[1];
    //     texto = $(texto)
    //       .text();
    //     $('.idioma .bandera-select')
    //       .attr('src', 'images/banderas/' + id + '.png');
    //     $('.idioma .texto-bandera-select')
    //       .text(texto);
    //   });
  });
