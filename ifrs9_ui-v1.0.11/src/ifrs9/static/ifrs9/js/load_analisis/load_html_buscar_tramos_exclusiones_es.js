$(document)
  .ready(function () {
    var script = document.createElement('script');
    script.src = "/static/ifrs9/js/analisis/buscar_tramos_exclusiones.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    setTitle(environment);

    $('#search_exclusions_by_contract_finalidad')
      .val(environment);

    // $('#ifrs9_customers-table')
    //   .bootstrapTable({
    //     cache: false,
    //     striped: true,
    //     sortable: true,
    //     pagination: true,
    //     paginationLoop: false,
    //     pageSize: 5,
    //     search: true,
    //     showHeader: true,
    //     sortOrder: "desc",
    //     searchAlign: "left",
    //     showFooter: false,
    //     pageList: []
    //   });
  });
