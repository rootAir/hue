$(document)
  .ready(function () {
    var script = document.createElement('script');
    script.src = "/static/ifrs9/js/analisis/consulta_cliente.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    setTitle(environment);
    $('#search_by_customer_finalidad')
      .val(environment);
  });
