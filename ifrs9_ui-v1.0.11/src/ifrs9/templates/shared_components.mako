
<%!
def is_selected(section, matcher):
  if section == matcher:
    return "active"
  else:
    return ""
%>

<%def name="menubar(section='')">
  <link href="${static('ifrs9/css/jquery-ui.min.css')}"  rel="stylesheet"/>
  <link href="${static('ifrs9/css/dataTables.min.css')}" rel="stylesheet" media="screen"/>
  <link href="${static('ifrs9/css/materialize.css')}"  rel="stylesheet"/>
  <link href="${static('ifrs9/css/main.css')}" rel="stylesheet"/>
  <link href="${static('ifrs9/css/ifrs9.css')}" rel="stylesheet"/>
  <link href="${static('ifrs9/css/bootstrap.min.css')}"  rel="stylesheet"/>
  <link href="${static('ifrs9/css/tooltipster.bundle.min.css')}"  rel="stylesheet"/>
  <link href="${static('ifrs9/css/tooltipster-sideTip-borderless.min.css')}"  rel="stylesheet"/>
  <link href="${static('ifrs9/resources/bootstrap-tables/dist/bootstrap-table.min.css')}" rel="stylesheet"/>
  <meta charset="utf-8" />
  <div class="ifrs9">
			<div id="ifrs9_cabeceraLoad" class="width100cent border0"></div>
			<div id="ifrs9_menuLoad" class="width100cent border0"></div>
      <div id="ifrs9_paginaLoad"></div>
			<div id="ifrs9_detalleLoad"></div>
			<div id="ifrs9_myModalSettings"></div>
      <input type="hidden" id="hiddenlan" value="${lan}" />
		</div>
    <script type="text/javascript" src="${static('ifrs9/js/ifrs9.js')}"></script>
		<script type="text/javascript" src="${static('ifrs9/js/index.js')}"></script>
		<script type="text/javascript" src="${static('ifrs9/resources/js/tabla.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/js/i18next.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/js/i18nextBrowserLanguageDetector.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/js/i18nextXHRBackend.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/js/materialize.js')}"></script>
		<script type="text/javascript" src="${static('ifrs9/resources/tooltipster/tooltipster.bundle.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/bootstrap-tables/dist/bootstrap-table.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/bootstrap-tables/dist/locale/bootstrap-table-en-US.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/bootstrap-tables/dist/locale/bootstrap-table-es-ES.min.js')}"></script>
    <script type="text/javascript" src="${static('ifrs9/resources/bootstrap-tables/dist/locale/bootstrap-table-pt-PT.min.js')}"></script>

    <script type="text/javascript">
      //import LanguageDetector from 'i18next-browser-languagedetector';
      i18next
      .use(window.i18nextXHRBackend)

    i18next.init({
            load:['en-US', 'pt', 'es-ES'],
            fallbackLng: 'es-ES',
            lng: $('#hiddenlan').val(),
            "debug": true,
            "ns": [
              "translation"
            ],
            "backend": {
              "loadPath": "/static/ifrs9/js/locale/{{lng}}/{{ns}}.json"
            }

            });
    /*  nanModellica = null;
      $(document).ready(function() {
        $.ajax({
          url: "getNanModellica/",
          type: "post",
          success: function(data) {
          console.log(data)
              nanModellica = data;
              $('#hiddenNan').val(data);
          }
        })
      })*/

    </script>
</%def>
