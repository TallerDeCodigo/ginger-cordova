!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["record-weight"]=a({compiler:[7,">= 4.0.0"],main:function(a,e,l,n,r){var t,s,o=null!=e?e:{},i=l.helperMissing,d="function",c=a.escapeExpression;return'	<div id="container" class="tracks">\n		<header class="hwhite2">\n			<div class="toolbar">\n				<a class="back hook" data-resource="my-plan" href="dieta.html"><img src="'+c((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:i,typeof s===d?s.call(o,{name:"cordova_full_path",hash:{},data:r}):s))+'images/back.svg"></a>\n				<h2 class="titulo">'+c((s=null!=(s=l.header_title||(null!=e?e.header_title:e))?s:i,typeof s===d?s.call(o,{name:"header_title",hash:{},data:r}):s))+'</h2>\n				<a class="menu hook" data-resource="main-menu" href="menu.html"><img src="'+c((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:i,typeof s===d?s.call(o,{name:"cordova_full_path",hash:{},data:r}):s))+'images/menu.svg"></a>\n			</div>\n		</header>\n		<h2 class="mainline">Agrega tu peso en kg</h2>\n		<div class="r_peso">\n			<div class="rojo">\n				<img src="'+c((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:i,typeof s===d?s.call(o,{name:"cordova_full_path",hash:{},data:r}):s))+'images/peso.svg">\n				<!-- <p>67.</p> -->\n				<input name="peso_metric" value="" onkeypress="return event.charCode >= 46 && event.charCode <= 57">\n			</div>\n			<div class="arrows-vertical">\n				<img id="r_peso-up" src="'+c((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:i,typeof s===d?s.call(o,{name:"cordova_full_path",hash:{},data:r}):s))+'images/leftarrow.png"><br><br>\n				<img id="r_peso-dw" src="'+c((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:i,typeof s===d?s.call(o,{name:"cordova_full_path",hash:{},data:r}):s))+'images/rightarrow.png">\n			</div>\n			<input id="track_peso" name="track_peso" value="" type="hidden" >\n		</div>\n		<a id="add_weight" class="btn-gre" href="#">Agregar</a>\n	</div>\n\n'+(null!=(t=a.invokePartial(n.footer_menu,e,{name:"footer_menu",data:r,indent:"	",helpers:l,partials:n,decorators:a.decorators}))?t:"")+"\n"+(null!=(t=a.invokePartial(n.footer_activities,e,{name:"footer_activities",data:r,indent:"	",helpers:l,partials:n,decorators:a.decorators}))?t:"")+'\n	<div class="alert_tracking" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5>Peso</h5>\n			<p>¿Deseas guardar los datos?</p>\n			<div class="di-options">\n				<a id="add_tracking" class="accept">Aceptar</a>\n				<a class="cancel">Cancelar</a>\n			</div>\n		</div>\n	</div>\n		'},usePartial:!0,useData:!0})}();