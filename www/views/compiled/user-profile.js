!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["user-profile"]=n({1:function(n,a,l,e,s){var i;return'							<img src="'+n.escapeExpression((i=null!=(i=l.cordova_full_path||(null!=a?a.cordova_full_path:a))?i:l.helperMissing,"function"==typeof i?i.call(null!=a?a:{},{name:"cordova_full_path",hash:{},data:s}):i))+'images/starh.svg">\n'},3:function(n,a,l,e,s){var i;return'							<img src="'+n.escapeExpression((i=null!=(i=l.cordova_full_path||(null!=a?a.cordova_full_path:a))?i:l.helperMissing,"function"==typeof i?i.call(null!=a?a:{},{name:"cordova_full_path",hash:{},data:s}):i))+'images/star.svg">\n'},5:function(n,a,l,e,s){return"hook"},7:function(n,a,l,e,s){return'data-resource="change-coach"'},9:function(n,a,l,e,s){return"cambiocoach.html"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,s){var i,t,r=null!=a?a:{},o=l.helperMissing,c="function",u=n.escapeExpression,p=n.lambda,d=l.blockHelperMissing;return(null!=(i=n.invokePartial(e.header,a,{name:"header",data:s,indent:"	",helpers:l,partials:e,decorators:n.decorators}))?i:"")+'	\n	<div class="profile circle-frame">\n		<img src="'+u((t=null!=(t=l.profile_pic_url||(null!=a?a.profile_pic_url:a))?t:o,typeof t===c?t.call(r,{name:"profile_pic_url",hash:{},data:s}):t))+'">\n	</div>\n	<h2 class="cpur">'+u(p(null!=(i=null!=a?a.me:a)?i.nombre:i,a))+" "+u(p(null!=(i=null!=a?a.me:a)?i.apellido:i,a))+'</h2>\n	<div class="profile-data">\n	<a class="edit-profile" href="edituser.html"><img src="images/profile/pencil.svg">Datos de <span>'+u(p(null!=(i=null!=a?a.me:a)?i.nombre:i,a))+" "+u(p(null!=(i=null!=a?a.me:a)?i.apellido:i,a))+'</span></a>\n		<ul>\n			<li>\n				<span>Objetivo:						<strong id="plan_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.objective:i,a))+'</strong></span>\n			</li>\n			<li>\n				<span>Sexo: 						<strong id="sexo_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.sexo:i,a))+'</strong></span>\n			</li>\n			<li>\n				<span>Edad: 						<strong id="anos_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.age_range:i,a))+' años</strong></span>\n			</li>\n			<li>\n				<span>Código Postal: 				<strong id="cp_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.cp:i,a))+'</strong></span>\n			</li>\n			<li>\n				<span>Estatura: 					<strong id="estatura_perfil">'+u(p(null!=(i=null!=(i=null!=a?a.me:a)?i.perfil:i)?i.estatura:i,a))+' m</strong></span>\n			</li>\n			<li>\n				<span>Peso: 						<strong id="peso_perfil">'+u(p(null!=(i=null!=(i=null!=a?a.me:a)?i.perfil:i)?i.peso:i,a))+' kg</strong></span>\n			</li>\n			<li>\n				<span>Peso Ideal: 					<strong id="ideal_perfil">'+u(p(null!=(i=null!=a?a.me:a)?i.pesoDeseado:i,a))+' kg</strong></span>\n			</li>\n			<li>\n				<span>Tipo de Coach: 				<strong id="coach_type_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.coach_type:i,a))+'</strong></span>\n			</li>\n			<li>\n				<span>Frecuencia de Ejercicio: 		<strong id="frecuencia_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.exercise_freq:i,a))+' días por semana</strong></span>\n			</li>\n			<li>\n				<span>Restricciones Alimenticias: 	<strong id="restricciones_perfil">'+u(p(null!=(i=null!=a?a.data:a)?i.restricciones_concat:i,a))+'</strong></span>\n			</li>\n			<li class="comentario">\n				<span id="comentario_perfil">Otros comentarios:	<i>'+u(p(null!=(i=null!=a?a.me:a)?i.comentarios:i,a))+'</i></span>\n			</li>\n		</ul>\n		<div class="profile-bottom">\n			<ul>\n				<li>\n					<span>Coach: <strong id="coach_name">'+u((t=null!=(t=l.coach_name||(null!=a?a.coach_name:a))?t:o,typeof t===c?t.call(r,{name:"coach_name",hash:{},data:s}):t))+" "+u((t=null!=(t=l.coach_last||(null!=a?a.coach_last:a))?t:o,typeof t===c?t.call(r,{name:"coach_last",hash:{},data:s}):t))+'</strong></span>\n					<div class="rate-stars">\n'+(null!=(i=d.call(a,p(null!=(i=null!=(i=null!=(i=null!=a?a.data:a)?i.coach_rating:i)?i.stars:i)?i.active:i,a),{name:"data.coach_rating.stars.active",hash:{},fn:n.program(1,s,0),inverse:n.noop,data:s}))?i:"")+(null!=(i=d.call(a,p(null!=(i=null!=(i=null!=(i=null!=a?a.data:a)?i.coach_rating:i)?i.stars:i)?i.inactive:i,a),{name:"data.coach_rating.stars.inactive",hash:{},fn:n.program(3,s,0),inverse:n.noop,data:s}))?i:"")+'					</div>\n				</li>\n				<li>\n					<a id="change_coach" class="btn-org '+(null!=(i=d.call(a,p(null!=(i=null!=a?a.data:a)?i.changed_status:i,a),{name:"data.changed_status",hash:{},fn:n.noop,inverse:n.program(5,s,0),data:s}))?i:"")+'" '+(null!=(i=d.call(a,p(null!=(i=null!=a?a.data:a)?i.changed_status:i,a),{name:"data.changed_status",hash:{},fn:n.noop,inverse:n.program(7,s,0),data:s}))?i:"")+' href="'+(null!=(i=d.call(a,p(null!=(i=null!=a?a.data:a)?i.changed_status:i,a),{name:"data.changed_status",hash:{},fn:n.noop,inverse:n.program(9,s,0),data:s}))?i:"")+'">'+u(p(null!=(i=null!=a?a.data:a)?i.change_btn_copy:i,a))+"</a>	\n				</li>\n			</ul>\n		</div>\n	</div>\n"},usePartial:!0,useData:!0})}();