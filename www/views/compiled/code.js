!function(){var a=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};n["code"]=a({compiler:[7,">= 4.0.0"],main:function(a,n,e,l,o){var i,s=null!=n?n:{},c=e.helperMissing,d="function",r=a.escapeExpression;return'\n	<header class="htrans">\n		<div class="toolbar">\n			<a href="ingreso.html" class="back hook" data-resource="login" style="display:block"><img src="'+r((i=null!=(i=e.cordova_full_path||(null!=n?n.cordova_full_path:n))?i:c,typeof i===d?i.call(s,{name:"cordova_full_path",hash:{},data:o}):i))+'images/back.svg"></a>\n		</div>\n	</header>\n	<div id="container" class="login">\n		<img class="logo" src="'+r((i=null!=(i=e.cordova_full_path||(null!=n?n.cordova_full_path:n))?i:c,typeof i===d?i.call(s,{name:"cordova_full_path",hash:{},data:o}):i))+'images/logo.svg">\n		<h4>VALIDACIÓN DE CUENTA</h4>\n		<form id="code_form" class="code_form">\n			<p>Hemos enviado un código de a tu correo electrónico, por favor ingrésalo aquí para continuar con tu registro</p>\n			<input id="code" type="number" name="code" placeholder="Código de validación">\n			<input type="submit" class="send_login" value="">\n		</form>\n	</div>\n\n	<div class="overscreen7" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5>Atención</h5>\n			<p>El código de validación que has introducido no es correcto, revisa la información e intenta nuevamente.</p>\n			<div class="di-options">\n				<a id="_alert_validate" class="accept">Aceptar</a>\n			</div>\n		</div>\n	</div>'},useData:!0})}();