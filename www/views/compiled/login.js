!function(){var a=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};n["login"]=a({compiler:[7,">= 4.0.0"],main:function(a,n,e,i,s){return'	<header class="htrans">\n		<div class="toolbar">\n			<a href="ingreso.html" class="back back_with_logout" style="display:block">\n				<img src="images/back.svg">\n			</a>\n		</div>\n	</header>\n	<div>\n		<img class="logo" src="images/logo.svg">\n		<h4>INICIAR SESIÓN</h4>\n		<form id="login_form" name="login_form" method="POST">\n			<input id="mail" 		 type="email" 	 name="mail" placeholder="Correo electrónico">\n			<input id="pass" 		 type="password" name="pass" placeholder="Contraseña">\n			<input id="enviar_login" type="submit" 	 name="enviar_login" value="">\n		</form>\n	</div>\n	<div class="loader_container" id="spinner">\n		<div class="loading"></div>\n	</div>'},useData:!0})}();