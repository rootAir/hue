$(document)
  .ready(function () {
    var script = document.createElement('script');
    script.src = "/static/ifrs9/js/analisis/consulta_contrato.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    setTitle(environment);
    $('#search_by_contract_finalidad')
      .val(environment);

  });
