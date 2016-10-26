var gridag;
var minval_age;

var gridej;
var minval_eje;
var anchot = document.documentElement.clientWidth;

$( function() {

	window.fbAsyncInit = function() {
		FB.init({
					appId      : '239633319765955',
					cookie     : true,
					xfbml      : true,
					version    : 'v2.7'
				});
	}

	$('.add_picture').click(function (e){
		app.get_file_from_device('profile', 'camera');
	});

	if($('body').hasClass('has-finanzas')){

		var response = apiRH.getTransactions();
		var myString = '';

		$.each(response, function( key, value ) {
			$.each(value, function( key, value ) {
				
				console.log(key + ' ::' + value);

				if(key == 'body'){
					$.each(value, function( key, value ) {

						console.log(key + ' :::: ' + value);

						// INSERTAR HTML
						if(key == 'created_at'){
							var d = new Date(value * 1000);
							$('.miembro').append(d.getDate()+'-'+(d.getMonth()+1) +'-' + d.getFullYear());
						}

						if(key == 'trial_end'){
							var d = new Date(value * 1000);
							$('.suscripcion').append(d.getDate()+'-'+(d.getMonth()+1) +'-' + d.getFullYear());
						}
				
						if(key == 'amount'){
							myString += '<tr><td>$'+ value/100 +'.00</td>';	
						}

						if(key == 'paid_at'){
							var meses_year = ['Enero', 'Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ]
							var r = new Date();
							console.log( );
							var d = new Date(value * 1000);
							// $('._month').html(meses_year[r.getMonth()] + " " +d.getUTCFullYear() );

							myString += '<td> ' + meses_year[r.getMonth()+1] + " " +d.getUTCFullYear() + '</td></tr>';
						}
					});
				}
			});
		});

		$('#historial tbody').append(myString);
	}//end finanzas


	if($('body').hasClass('has-change-payment')){



		$('.enter').click(function () {

			var  t_nombre   = $('input[name="nombre"]').val(); 
			var  t_card 	= $('input[name="card"]').val(); 
			var  t_mes  	= $('input[name="mes"]').val(); 
			var  t_ano 		= $('input[name="year"]').val(); 
			var  t_cvc 		= $('input[name="cvc"]').val(); 
			var  t_mail 	= $('input[name="mail"]').val(); 
			var  t_cupon 	= $('input[name="cupon"]').val(); 
			var  t_terms 	= $('input[name="terms"]').val(); 

			Conekta.setPublishableKey('key_C3MaVjaR7emXdiyRGTcbjFQ');
			
			var errorResponseHandler, successResponseHandler, tokenParams;

			tokenParams = {
			  "card": {
				"number": t_card,
				"name": t_nombre,
				"exp_year": t_ano,
				"exp_month": t_mes,
				"cvc": t_cvc
			  }
			};

			successResponseHandler = function(token) 
			{
				var response = apiRH.changePayment(token.id);
				// Funcion de mensaje de bienvenida
				if(response){
					
					if(response)
					{
						app.toast('Los datos se han actualizado');
					}
					else
						app.toast("Error al actualizar datos");
				}else{
					app.toast("Error al procesar tu pago");
				}
				return;
			};

			/* Después de recibir un error */

			errorResponseHandler = function(error) {
			  return console.log(error.message);  //error de conectividad
			  app.toast('Error al procesar tu pago' + error.message);
			};

			/* Tokenizar una tarjeta en Conekta */
			Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
			
		});
			

	}


	if($('body').hasClass('has-chat')){
		
		var mail 		 = app.keeper.getItem('mail');
		var chatPassword = app.keeper.getItem('chatPassword');
		var userLog 	 = JSON.parse(app.keeper.getItem('user'));
		var uChatCoach 	 = userLog.coach.jid;
		
		uChatCoach = uChatCoach.split('-');
		app.keeper.setItem('cCoachID', uChatCoach[0]);
		var user = { login : userLog.mail, pass : userLog.chatPassword};

		$('h2.titulo').html(userLog.coach.nombre + " " + userLog.coach.apellido);
		
		connectToChat(user);
		
		createNewDialog();

	} // END has class has chat
	
	$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});

}); // END function



/*INICIA ON LOAD RESIZE*/
$(window).on("load resize",function(){ 

	var alto = document.documentElement.clientHeight;
	var ancho = document.documentElement.clientWidth;

	var mediad = 300+(ancho*0.64);

	$('textarea.short-descrip').css('height',alto-mediad);

	$('#scroller > ul > li').css("height",alto-245);
	$('.iosm #scroller > ul > li').css("height",alto-265);

	var cuantos = $('.co-option').length;
	cuantos = cuantos*105;
	$(".tipo_coach").css("width",cuantos);

	var cuantos1 = $('.pl-option').length;
	cuantos1 = cuantos1*105;
	$(".tipo_plan").css("width",cuantos1);

	var cuantos2 = $('.re-option').length;
	cuantos2 = cuantos2*105;
	$(".tipo_restric").css("width",cuantos2);

	var cuantos3 = $('.ej-option').length;
	cuantos3 = cuantos3*105.25;
	$(".tipo_ejer").css("width",cuantos3);

	var cuantos4 = $('.me-option').length;
	cuantos4 = cuantos4*105;
	$(".tipo_med").css("width",cuantos4);

	var ancho = document.documentElement.clientWidth;
	var tamano = $('.slide-coach').length;
	var csld = (tamano*ancho*0.8125)+(ancho*0.09375);
	$(".slide-coach").css("width",ancho*0.8125);
	$(".slide-coach:first-of-type").css("margin-left",ancho*0.09375);
	$(".cslider").css("width",csld);

	/*
		ENVIA MENSAJE AL ADMIN PARA AUTORIZAR CAMBIO DE COACH
	*/
	var msg;
	var msg_return;
	$('#send_ch_coach').on('click', function(){
		msg = $('textarea#espacio_comentario').val();

		if(!msg){
			console.log('mensaje vacio');

			if(!$('.alert_chCoach').is(':visible')){
				$('.alert_chCoach').show();
				setTimeout(function() {$('.alert_chCoach').addClass('active');}, 200);
			} else {
				$('.alert_chCoach').removeClass('active');
				setTimeout(function() {$('.alert_chCoach').hide();}, 800);
			}

			$('#blur').toggleClass('blurred');
		}else{
			console.log(msg);
			localStorage.setItem('msg_ch_coach', msg);
			localStorage.setItem('coach_status', "pending_change");

			/*Agregar otro alert con la leyenda: Tu mensaje ha sido enviado para revision, nos pondremos en contacto contigo*/
			if(!$('.alert_chCoach2').is(':visible')){
				$('.alert_chCoach2').show();
				setTimeout(function() {$('.alert_chCoach2').addClass('active');}, 200);
			} else {
				$('.alert_chCoach2').removeClass('active');
				setTimeout(function() {$('.alert_chCoach2').hide();}, 800);
			}

			$('#blur').toggleClass('blurred');
			
			$('#accept_chCoach2').click(function(){
				 $('.alert_chCoach2').hide();
				 $('#blur').toggleClass('blurred');
				 // TODO: Use render methods not hard loading
				 window.location.assign('userdata.html');
			});

		}
		
		$('#accept_chCoach').click(function(){
			$('.alert_chCoach').hide();
			$('#blur').toggleClass('blurred');

		});

	});

		/*
			ADD PROFILE DATA TO PROFILE VIEWS
		*/


		if($('body').hasClass('load_data') || $('body').hasClass('update_data'))
		{
			var user 			= JSON.parse(localStorage.getItem('user'));
			var nombre_coach	= localStorage.getItem('nombre_coach');
			var apellido_coach	= localStorage.getItem('apellido_coach');
			var nombre 			= localStorage.getItem('user_name');
			var apellido 		= localStorage.getItem('user_last_name');
			var sexo 			= user.perfil.sexo;
			var edad 			= user.perfil.fechaNacimiento;
			var cp 	 			= user.cp;
			var estatura 		= user.perfil.estatura;
			var peso 			= user.perfil.peso;
			var ideal 			= user.pesoDeseado;
			var coach_type 		= user.perfil.personalidad;
			var frecuencia 		= user.perfil.ejercicio;
			var restricciones 	= user.perfil.restricciones;
			var plan 			= user.perfil.objetivo;
			var comentario 		= localStorage.getItem('comentario');
			var coach_rate		= localStorage.getItem('coach_rate');
			var coach_status	= localStorage.getItem('coach_status');
			var msg_ch_coach	= localStorage.getItem('msg_ch_coach');
			localStorage.setItem('restricciones', user.perfil.restricciones);

			$('#comentario_perfil i').html(comentario);
			//console.log(edad.substring(0, 4) );
			var date_hoy =  new Date();
			date_hoy = date_hoy.getFullYear();
			var _edad_calc = date_hoy - Number( edad.substring(0, 4));
			//console.log(_edad_calc);
			//console.log('HUEVOS: ' + restricciones.length);
			$('#coach_type').attr("value", coach_type);
			$('#plan').attr("value", plan);
			$('#days_per_week').attr("value", frecuencia);
			$('#update_sexo').attr("value", sexo);

			if( $('.the-comment').html() != " " ){
				console.log(comentario);
				$('.comentario').show();
				$('.the-comment').html(comentario);
				$('.yes').addClass('active');
				$('.not').removeClass('active');

			}else{
				$('.comentario').hide();
			}	
			
			$('.profile.circle-frame').find('img').attr('src', localStorage.getItem('avatar') + '?type=large');

			$('.cpur').html(nombre +" "+ apellido);
			$('.edit-profile span').html(nombre +" "+ apellido);

			if(sexo == 1){
				$('#sexo_perfil').html('Hombre');
			}else{
				$('#sexo_perfil').html('Mujer');
				
			}

			if (sexo) {
				$('#hombre').attr('src','images/hombre.svg');
				$('#mujer').attr('src','images/mujere.svg');
			} else {
				$('#hombre').attr('src','images/hombreh.svg');
				$('#mujer').attr('src','images/mujere.svg');
			}

			$('#anos_perfil').html(_edad_calc + " años");
			$('#age-dato').html(_edad_calc);
			$('#edad_value').val(_edad_calc);

			$('#cp_perfil').html(cp);
			$('input[name="zipcode"]').attr("value",cp);


			$('#estatura_perfil').html(estatura + " m.");

			$('input[name="estatura"]').attr("value", estatura);


			$('#peso_perfil').html(peso + " kg.");
			$('input[name="peso"]').attr("value", peso);

			$('#ideal_perfil').html(ideal + " kg.");
			$('input[name="ideal"]').attr("value", ideal);

			var suma = parseInt(coach_type)+1;

			$('.tipo_coach .co-option:nth-of-type('+suma+')').addClass('active');

			switch(coach_type){
				case 0: 
					$('#coach_type_perfil').html("Estricto");
					$('.co-option.active img:not(.question)').attr("src",'images/coach/estricto2.png');
					break;
				case 1:
					$('#coach_type_perfil').html("Innovador");
					$('.co-option.active img:not(.question)').attr("src",'images/coach/innovador2.png');
					break;
				case 2:
					$('#coach_type_perfil').html("Animador");
					$('.co-option.active img:not(.question)').attr("src",'images/coach/animador2.png');
					break;
				case 3:
					$('#coach_type_perfil').html("Tradicional");
					$('.co-option.active img:not(.question)').attr("src",'images/coach/tradicional2.png');
					break;
			}

				$('#frecuencia_perfil').html(frecuencia +" días por semana");
				$('#ejercicio-dato').html(frecuencia);


				/*
					COMENTA
				*/
				console.log('Comentario ' + comentario);
				if(comentario === 'undefined' || comentario == null){
					$('.comentario').html(comentario);
					$('.the-comment').html(comentario);
				}else{
					$('.the-comment').html(comentario);
				}


				var suma = parseInt(plan)+1;
				$('.tipo_plan .pl-option:nth-of-type('+suma+')').addClass('active');

				switch(plan){
					case 0:
						$('#plan_perfil').html("Bajar de peso");
						$('.pl-option.active img:not(.question)').attr("src",'images/plan/perderpeso2.png');
						break;
					case 1:
						$('#plan_perfil').html("Detox");
						$('.pl-option.active img:not(.question)').attr("src",'images/plan/detox2.png');
						break;
					case 2:
						$('#plan_perfil').html("Rendimiento físico");
						$('.pl-option.active img:not(.question)').attr("src",'images/plan/rendimientofisico2.png');
						break;
					case 3:
						$('#plan_perfil').html("Sentirse mejor");
						$('.pl-option.active img:not(.question)').attr("src",'images/plan/sentirsemejor2.png');
						break;
					default:
						$('#plan_perfil').html("No tiene plan");
				}
				
				//COMPRUEBA SI LAS RESTRICCIONES ESTAN DEFINIDAS

				if(restricciones === 'undefined' || restricciones == "" || restricciones == null){
					console.log('no definido ');
					$('#restricciones_perfil').html("Sin restricciones");
				}else{

					console.log(restricciones);

					var restricc = [ 'huevo', 'pollo', 'pescado', 'mariscos', 'lácteos', 'carne' ];
					// var parseado = JSON.parse(restricciones);
					// parseado = JSON.stringify(parseado);
					// restricciones = restricciones.slice(2,3);
					$('#restricciones_perfil').text("");
					if(restricciones){
						for (var i = 0; i < restricciones.length; i++) {
							// console.log(i);
							if(i == restricciones.length-1)
								coma = "";
							else
								coma = ", ";

							$('#restricciones_perfil').append(restricc[restricciones[i]] + coma);
							
						};
					}else{
						console.log("no hay restricciones");
					}
					

				}


				$('#age').css('left', gridag*(_edad_calc-minval_age));
				$('#age-filler').css('width', (gridag*(_edad_calc-minval_age))+20);

				$('#ejercicio').css('left', gridej*(frecuencia-minval_eje));
				$('#ejercicio-filler').css('width', (gridej*(frecuencia-minval_eje))+20);
				
				console.log(restricciones);

				if(restricciones === undefined || restricciones == null || restricciones == ""){
					console.log('esta indefinido');
				}else{
					//var arreg = JSON.parse(restricciones);
					// console.log('Restricciones: ' + arreg);
					 var uRes = JSON.parse(localStorage.getItem('user'));
					 console.log(uRes);

					 console.log('aqui');

					for (var i = 0; i < uRes.perfil.restricciones.length; i++) {
						
						switch(uRes.perfil.restricciones[i]){
							case 0: 
								$('.tipo_restric .re-option:nth-of-type(1) img').attr("src",'images/restric/huevo2.png');

								break;
							case 1:
								$('.tipo_restric .re-option:nth-of-type(2) img').attr("src",'images/restric/pollo2.png');

								break;
							case 2:
								$('.tipo_restric .re-option:nth-of-type(3) img').attr("src",'images/restric/pescado2.png');

								break;
							case 3:
								$('.tipo_restric .re-option:nth-of-type(4) img').attr("src",'images/restric/camaron2.png');

								break;
							case 4:
								$('.tipo_restric .re-option:nth-of-type(5) img').attr("src",'images/restric/lacteos2.png');

								break;
							case 5:
								$('.tipo_restric .re-option:nth-of-type(6) img').attr("src",'images/restric/carne2.png');

								break;
						}
						uRes.perfil.restricciones[i]++;
						$('.tipo_restric .re-option:nth-of-type('+uRes.perfil.restricciones[i]+')').addClass('active');
					}
				}//end if restricciones

				/*
					NOMBRE DEL COACH
				*/

				$('#coach_name').html(nombre_coach + " " + apellido_coach);

				// console.log(nombre_coach);
				// console.log(apellido_coach);
				// console.log(user);

				var star = Math.round(user.coach.rating);

				//console.log(Math.round(star));

				var count = 5;

				for (var i = 0; i < star; i++) {
					$('.rate-stars').append('<img src="images/starh.svg">');
					//console.log(i);
					
				};
				
				for (var x = 0; x < count - star; x++) {
					//console.log('-' + x);
					$('.rate-stars').append('<img src="images/star.svg">');
				};


				var restricciones_arr = new Array();
				$('#add_updated_profile').on('click', function(){
					if(!$('.overscreen7').is(':visible')){
						$('.overscreen7').show();
						setTimeout(function() {$('.overscreen7').addClass('active');}, 200);
					} else {
						$('.overscreen7').removeClass('active');
						setTimeout(function() {$('.overscreen7').hide();}, 800);
					}
					$('#blur').toggleClass('blurred');
				});//end click add updated profile


				$('#_alert_chCoach').click(function(){
					console.log('CLICK EN ALERT CH-COACH');

						
					// console.log("ZIP>"+ $('input[name="zipocode"]').val());
						var genero 				= $('#update_sexo').val();

						localStorage.setItem('edad', $('#edad_value').val() );
						var edad 				= $('#edad_value').val();
						var zipcode 			= $('input[name="zipcode"]').val();
						var estatura 			= $('input[name="estatura"]').val();
						var peso 				= $('input[name="peso"]').val();
						var peso_ideal 			= $('input[name="ideal"]').val();
						var coach_type 			= $('#coach_type').val();
						var dpw 				= $('#days_per_week').val();
						var comentario 			= $('.the-comment').html();
						var plan 				= $('#plan').val();
						var restricciones 		= localStorage.getItem('restricciones');
						var postal 				= $('input[name="zipcode"]').val();
						
						// console.log("POSTAL > > > > "+postal);
						// console.log("comentario>>>> "+comentario);
						console.log(restricciones);
						//restricciones = restricciones.split(",")

						
						/*calcula fecha de naciemiento a partr de la edad del cliente*/
						var ageyears = new Date();
						var _year =ageyears.getFullYear();
						var _mes = ageyears.getMonth() +1;
						var _dia = ageyears.getDate();
						var _yob = _year - edad;
						var fecha_born = _yob+"/"+ _mes +"/"+_dia;
						var born = new Date(fecha_born);
						var manda_restricciones;

						console.log(restricciones.length );

						if (restricciones.length < 0) {
							restricciones = [];
							console.log('restricciones null');
						} else {
							restricciones = restricciones;
						}

						var json = {
						"sexo" : genero,
						"fechaNacimiento" : _yob+"-"+ _mes +"-"+_dia,
						"perfil":{
							"fechaNacimiento" : _yob+"-"+ _mes +"-"+_dia,
							"sexo" : genero,
							"peso" : peso,
							"estatura" : estatura,
							"ejercicio" : dpw,
							"objetivo" : plan,
							"restricciones" :(restricciones.length>0||restricciones!="")?JSON.parse(restricciones):null,
							"personalidad" : coach_type
						},
						"cp": zipcode,
						"pesoDeseado": peso_ideal,
						"comentario": comentario
					}

					console.log(json);

					var response = apiRH.updatePerfil(json);

					if(response){
						// TODO: Use render methods not hard loading
						window.location.assign('userdata.html');
					}
				});	// end click _alert_chCoach

				$('#_cancel_chCoach').click(function(){
					$('.overscreen7').hide();
					$('#blur').toggleClass('blurred');
				});

				app.hideLoader();
				var text = (coach_status != 'pending_change') ? "Cambiar Coach" : "En revisión";
				var href = (coach_status != 'pending_change') ? "cambiocoach.html" : "";
				$('#change_coach').text(text);
				$('#change_coach').attr('href', href);

		}


		if ($('body').hasClass('update_data')) {
			
		} //END IF BODY HAS CLASS UPDATE DATA

		
});// end Window on Load Resize swipe / dietas 

$(window).load(function(){
	$(function() {

		/*
			DIETA BODY CLASS
		*/

		if($('body').hasClass('dieta') ){

			var dietId = localStorage.getItem('dietaId');
			console.log("Diet Id ::: "+dietId);

			var today = new Date();
			var hoy = today.getDay();
			var day_index;
			var dieta = app.get_diet(dietId);
			var arr_desayuno
			var arr_snack1
			var arr_comida
			var arr_snack2
			var arr_cena
			var comm_id;
			var platillo_id;
			var comentarios = dieta.comentarios;
			var comments;
			var platillos = dieta.platillos;
			var receta;
			var nombre_receta;
			var ingredientes;
			var losplatos = [];
			var i=0;
			console.log(' --- estructura de la dieta ---');
			console.log(dieta);
			$.each( dieta.platillos, function( key, value ) {
				//console.log(dieta.platillos[i].ingredientes);
				losplatos[i]=[];
				$.each( value, function( key, value ) {
					// console.log(key+":::"+value);
					if (key=="_id") {
						losplatos[i][0]=value;
					}
					if (key=="descripcion") {
						losplatos[i][1]=value;
					}
					if (key=="receta") {
						losplatos[i][2]=value;
					}
					if (key=="ingredientes") {
						console.log(' --- ingredientes --- ' + key + ' vlue ' + value);	 	
						var ing = '';
						if(value.length > 0){

							$.each(value, function(key, value){
								if(value._id != null){
									ing = ing + value._id.nombre;
									console.log('fghfghfghfgh <<<<<<'+ value._id.nombre);	
								}	
							});
						}else{
							console.log('sin ingredientes');
						}

						losplatos[i][3]=ing;
						console.log(losplatos[i][3]);
					}
				});
				i++;
			});

			var loscomentarios = [];
			var i=0;
			var j=0;

			$.each( dieta.comentarios, function( key, value ) {
				loscomentarios[i]=[];
				//console.log(loscomentarios);
				j=0;
				$.each( value, function( key, value ) {
					loscomentarios[i][j]=value;
					j++;
				});
				i++;
			});

			// console.log(loscomentarios);


			for (var i=0; i<losplatos.length; i++) {
				losplatos[i][4]="";
				for (var j = 0; j < loscomentarios.length; j++) {
					if (losplatos[i][0]==loscomentarios[j][2]&&losplatos[i][4]=="") {
						losplatos[i][4]=loscomentarios[j][1];
					}
				}
			}

			// console.log(losplatos);
			// console.log('DIETA');
			// console.log(JSON.stringify(dieta));

			var dieta_array = [];
			var dia_prueba=0;
			var dias = [];

			$.each( dieta.estructura, function( key, value ) {
				// los dias de la semana
				
				if(key=="domingo"){dia_prueba=1;} else if (key=="lunes") {dia_prueba=2;} else if (key=="martes") {dia_prueba=3;} else if (key=="miercoles") {dia_prueba=4;} else if (key=="jueves") {dia_prueba=5;} else if (key=="viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
				var estoyen = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';

				$.each( value, function( key, value ) {
					// desayuno, snack, comida,...
					var dentrode = estoyen+'.acc-content.'+key+' ';
					var i=1;
					$.each( value, function( key, value ) {
						// tiempos (1,2,3..)
						var masadentro = dentrode+'div.platillo:nth-of-type('+i+')';
						i++;	
						$.each( value, function( key, value ) {
							// opciones (a,b)
							if ( key=="b" && localStorage.getItem("restricciones") ) {
								// b
								$.each( value, function( key, value ) {
									// id_platillo, id_comentario
									if (key=="platillo") {				
										for (var i = 0; i < losplatos.length; i++) {
											if (value==losplatos[i][0]) {
												$(masadentro).attr("data", losplatos[i][0]);
												$(masadentro).attr("platillo", i);
												$(masadentro+' h5').html(losplatos[i][1]);
												//Receta
												if (losplatos[i][2]!="") {
													$(masadentro+' p.receta').html(losplatos[i][2]);
												} else {
													$(masadentro+' p.receta').hide();
												}
												//Comentarios
												if (losplatos[i][4]!="") {
													$(masadentro+' p.comentario').html(losplatos[i][4]);
													//Comentarios del usuario
													$('.plat-comentario').html(	'');


												} else {
													$(masadentro+' p.comentario').hide();
												}

												if (losplatos[i][3]!="ingredientes") {
													
													$.each(losplatos[i][3], function(key, value){

														console.log('Ingredientes: ' + $(masadentro+' p.ingredientes').html(value));	
														$(masadentro+' p.ingredientes').html(value)

													});
													
												}else{
													$(masadentro+' p.comentario').hide();
												}
											}
										}
									}
								});
							} else {
								// a
								$.each( value, function( key, value ) {
									// id_platillo, id_comentario
									if (key=="platillo") {
										for (var i = 0; i < losplatos.length; i++) {
											if (value==losplatos[i][0]) {
												// console.log(losplatos[i][1]+"<"+losplatos[i][2]+"<"+losplatos[i][4]);
												$(masadentro).attr("data", losplatos[i][0]);
												$(masadentro).attr("platillo", i);
												$(masadentro+' h5').html(losplatos[i][1]);
												if (losplatos[i][2]!="") {
													$(masadentro+' p.receta').html(losplatos[i][2]);
												} else {
													$(masadentro+'p.receta').hide();
												}
												if (losplatos[i][4]!="") {
													$(masadentro+' p.comentario').html(losplatos[i][4]);
												} else {
													$(masadentro+' p.comentario').hide();
												}
											}
										}
									}
								});
							}
						});
					});
				});
				
				setTimeout(getcosumed, 2000);

			});//END DIETA ESTRUCTURA
			
			$('.cancel').on('click', function(){
				$('.comment_pop').hide();
			});

		} /*** END BODY CLASS DIETA ***/


	});//END FUNCTION


	$('.platillo').each(function() {
		if ($(this).attr('data') === undefined) {
		  $(this).remove();
		}
	});
	
	/** 	

		DIETA - CALENDAR 

	**/
	
	// OBTIENE EL NUMERO DE LA SEMANA EN LA QUE NOS ENCONTRAMOS 
	Date.prototype.getWeek = function() {
		var eneroUno = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this - eneroUno) / 86400000) + eneroUno.getDay() + 1) / 7);
	}

	//OBTIENE LA FECHA DE HOY EN FULL FORMAT
	Date.prototype.hoy = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(), !mm[1] && '/' + '0', mm, !dd[1] && '/', dd].join('');
	};

	var fecha = new Date();
	var weekNumber = (new Date()).getWeek();
	var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
	var dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado","Domingo"];

	//console.log(weekNumber);
	var ano = fecha.getFullYear();
	var mes = meses[fecha.getMonth()];
	//console.log(fecha.hoy());
	mes = mes.slice(0,3);
	/*
		IMPRIME EL MES Y EL ANO EN EL HEADER DE LA PANTALLA
	*/
		$('#month').html(mes);
		$('#year').html(ano);

	function getWeekDays(fromDate){
		var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay())),result = [new Date(sunday)];
		while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) 
		{
			result.push(new Date(sunday));
		}
		return result;
	}

	var week = new Object();
	var today = fecha.hoy().toString();
	
	var days = $('.day_of_week');
	var dow = [];
	var str;
	var d = new Date();
	var date_string;
	
	week = getWeekDays( new Date(today) );

	//console.log("str> "+today);
	var domingo;

	for(var i=0; i<dias.length; i++){
		var masuno = i+1;
		date_string = week[i].toString();    	
		$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
		var dataf = new Date(date_string);
		var mes = "";
		var dia = "";
		if((dataf.getMonth()+1) < 10)
			mes = '0'+(dataf.getMonth()+1);
		else
			mes = (dataf.getMonth()+1);

		if((dataf.getDate()) < 10)
			dia = '0'+(dataf.getDate());
		else
			dia = (dataf.getDate());

		$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+ dia);

		// console.log(dia);
	}

   
		var incremento = 168.25;
		var decremento = 167.75;
		var current_day;
		var full_date;
		var left = fecha.hoy().substring(0,8);

		current_day = new Date( + new Date().getTime() + 1 * 60 * 60 * 1000 );
		var dia_semana = current_day.getDay();
		dia_semana++;
		$('tr td.day_of_week:nth-of-type('+dia_semana+')').trigger('click');

		current_day = fecha.hoy().substring(8);
		
		current_day = left + current_day;
		

		$(".nextweek").click(function(){
			week = getWeekDays( new Date( current_day ) );
			full_date = new Date( + new Date( current_day ).getTime() + incremento * 60 * 60 * 1000);
			// console.log(full_date);
			var month = full_date.getMonth();
			
			$('#month').html(meses[month] );
			$('#year').html(full_date.getFullYear());

			for(var i=0; i<dias.length; i++){
				var masuno = i+1;
				date_string = week[i].toString();
				$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
			}
			
			current_day = full_date;
			//console.log("Full date > > "+full_date);
			var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
			for(var i=0; i<dias.length; i++){
				
				var nuevo = JSON.stringify(week2[i]);
				// console.log("wee ::"+week2[i]);

				dow[i] = nuevo.slice(9, 11);

				var masuno = i+1;
				//console.log(dow[i]);
				$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
				var dataf = new Date(week2[i]);

				var mes = "";
				var dia = "";
				if((dataf.getMonth()+1) < 10)
					mes = '0'+(dataf.getMonth()+1);
				else
					mes = (dataf.getMonth()+1);


				if((dataf.getDate()) < 10)
					dia = '0'+(dataf.getDate());
				else
					dia = (dataf.getDate());

				$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+ dia );
			}
		});

		$(".lastweek").click(function(){
			week = getWeekDays( new Date( current_day ) );
			full_date = new Date( + new Date( current_day ).getTime() - decremento * 60 * 60 * 1000);
			// console.log(full_date);
			var month = full_date.getMonth();
			
			$('#month').html(meses[month] );
			$('#year').html(full_date.getFullYear());

			for(var i=0; i<dias.length; i++){
				var masuno = i+1;
				date_string = week[i].toString();
				$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
			}
			
			current_day = full_date;
			//console.log("Full date > > "+full_date);
			var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
			for(var i=0; i<dias.length; i++){
				
				var nuevo = JSON.stringify(week2[i]);
				// console.log("wee ::"+week2[i]);

				dow[i] = nuevo.slice(9, 11);

				var masuno = i+1;
				//console.log(dow[i]);
				$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
				var dataf = new Date(week2[i]);
				var mes = "";
				var dia = "";
				if((dataf.getMonth()+1) < 10)
					mes = '0'+(dataf.getMonth()+1);
				else
					mes = (dataf.getMonth()+1);

				if((dataf.getDate()) < 10)
					dia = '0'+(dataf.getDate());
				else
					dia = (dataf.getDate());
				$('#toda_la_dieta li:nth-of-type('+masuno+')').attr('data', dataf.getFullYear()+ '-'+mes+'-'+dia);
			}
		});

		//});//end date ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		// $(".acc-selector").click(function(){
		// 	if ($(this).hasClass('ui-state-active')) {
		// 		if ($(this).hasClass('desayuno')) {$(this).parent().parent().animate({scrollTop:0}, 300);}
		// 		if ($(this).hasClass('snack1')) {$(this).parent().parent().animate({scrollTop:54}, 300);}
		// 		if ($(this).hasClass('comida')) {$(this).parent().parent().animate({scrollTop:120}, 300);}
		// 		if ($(this).hasClass('snack2')) {$(this).parent().parent().animate({scrollTop:184}, 300);}
		// 		if ($(this).hasClass('cena')) {$(this).parent().parent().animate({scrollTop:248}, 300);}
		// 	}
		// });


 	/*** Add water module ***/

	if($('body').hasClass('water') ){

		var date = new Date();
		var date_today = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
		var agua_local = parseFloat(localStorage.getItem('agua'));
		var agua_lastSaved = localStorage.getItem('agua_lastSaved');
		var agua = (agua_lastSaved != date_today ) ? 0 : agua_local;
		console.log(agua);
		/*** Setting initial value if progress ***/
		$('input[name="litros"]').val(agua);
		$('.vaso p span').text(agua);

		$("#agua-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#agua-up").bind('mousedown', function(e){
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				agua = Number($('.vaso p span').html());
				agua=agua+0.25;

				if(agua == 10.00)
					agua = 10.00;	

				$('.vaso p span').html(agua.toFixed(2));
				$('input[name="litros"]').attr("value", agua);
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		$("#agua-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#agua-dw").bind('mousedown', function(e){
			if (clickTimer == null) {
	        	clickTimer = setTimeout(function () {
		            clickTimer = null;
		        }, 320)
		    } else {
		        clearTimeout(clickTimer);
		        clickTimer = null;
		        e.preventDefault();
		        e.stopPropagation();
		        console.log("double");
		        return false;
		    }
			timeout = setInterval(function(){
				agua = Number($('.vaso p span').html());
				if (agua>0) {
					agua=agua-0.25;
					$('.vaso p span').html(agua.toFixed(2));
					$('input[name="litros"]').attr("value", agua);
				}
			}, timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);


		/*
			localStorage AGUA
		*/
		$('#add_agua').on('click', function(){

			if(!$('.alert_tracking').is(':visible')){
				$('.alert_tracking').show();
				setTimeout(function() {$('.alert_tracking').addClass('active');}, 200);
			} else {
				$('.alert_tracking').removeClass('active');
				setTimeout(function() {$('.alert_tracking').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');

		});

		//----------------------------
		//
		// Tracking Water
		//
		//----------------------------

		$('#add_tracking').click(function(){
			agua_local = parseFloat(localStorage.getItem('agua'));
			agua_lastSaved = localStorage.getItem('agua_lastSaved');
			agua = parseFloat($('input[name="litros"]').val());

			localStorage.setItem('agua_lastSaved', date_today );
			localStorage.setItem('agua', agua );

			var agua = localStorage.getItem('agua');
			console.log(agua);

			/*TODO: Get from catalogue and use same method 7 Agua*/
			var responsedata = apiRH.tracking(7, agua);

			if(responsedata)
				app.toast("Se ha guardado correctamente tu progreso");

			$('.alert_tracking').hide();
			$('#blur').toggleClass('blurred');
		});

		$('.cancel').click(function(){
			console.log("Agua: "+agua_local);
			$('input[name="litros"]').val(agua_local);
			$('.vaso p span').text(agua_local);
			$('.alert_tracking').hide();
			$('#blur').toggleClass('blurred');
		});


	} /*** END water ***/

		if( $('body').hasClass('weight') ){
			var r_peso;
			var usr_peso;
			var response = localStorage.getItem('user');
			response = JSON.parse(response);
			usr_peso = response.perfil.peso;
			$('.r_peso input[name="peso_metric"]').attr("value",usr_peso );

			$("#r_peso-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#r_peso-up").bind('mousedown', function(e){
				if (clickTimer == null) {
		        	clickTimer = setTimeout(function () {
			            clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(clickTimer);
			        clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        console.log("double");
			        return false;
			    }
				timeout = setInterval(function(){
					r_peso = Number($('.r_peso input[name="peso_metric"]').val() );

					if (r_peso<99) {
						r_peso=r_peso+0.5;
						$('.r_peso input[name="peso_metric"]').attr("value", r_peso.toFixed(1));
						$('input[name="track_peso"]').attr('value', r_peso);
					} else {
						r_peso=r_peso+1;
						$('.r_peso input[name="peso_metric"]').attr("value", r_peso.toFixed(0));
						$('input[name="track_peso"]').attr('value', r_peso);
					}
				}, timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$("#r_peso-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#r_peso-dw").bind('mousedown', function(e){
				if (clickTimer == null) {
		        	clickTimer = setTimeout(function () {
			            clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(clickTimer);
			        clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        console.log("double");
			        return false;
			    }
				timeout = setInterval(function(){
					r_peso = Number($('.r_peso input[name="peso_metric"]').val());
					if (r_peso>0.4) {
						if (r_peso<100.1) {
							r_peso=r_peso-0.5;
							$('.r_peso input[name="peso_metric"]').attr("value",r_peso.toFixed(1));
							$('input[name="track_peso"]').attr('value', r_peso);
						} else {
							r_peso=r_peso-1;
							$('.r_peso input[name="peso_metric"]').attr("value",r_peso.toFixed(0));
							$('input[name="track_peso"]').attr('value', r_peso);
						}
					}
				}, timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);


			/*
				localStorage PESO 	*
			*/
			$('#add_peso').on('click', function(){
				localStorage.setItem('track_peso', $('input[name="track_peso"]').val() );
				
				var track_peso = localStorage.getItem('track_peso');
				
				console.log(track_peso);
				
				if(!$('.alert_tracking').is(':visible')){
					$('.alert_tracking').show();
					setTimeout(function() {$('.alert_tracking').addClass('active');}, 200);
				} else {
					$('.alert_tracking').removeClass('active');
					setTimeout(function() {$('.alert_tracking').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');
				//$('a.centro img').toggleClass('onn');
			});

			$('#add_tracking').click(function(){	
				
				track_peso = $('input[name="track_peso"]').val();


				if(track_peso >= 30){

					console.log('Peso <<<');

					var responsedata = apiRH.tracking(0, track_peso);
					
					if(responsedata){
						app.toast("Se ha guardado correctamente tu peso")
					}else{
						app.toast('Error al registrar peso');
					}
				}else{
					app.toast('El peso debe de ser mayor a 40');
				}
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});

			$('.cancel').click(function(){
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});
		}//END IF BODY HAS CLASS WEIGHT
		
		if( $('body').hasClass('mood') ){

			var valor = 0;
			var animo = [ 'increible', 'feliz', 'bien', 'regular', 'triste', 'cansado', 'hambriento', 'frustrado', 'motivado' ];

			$("#animo-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#animo-up").bind('mousedown', function(e){
				if (clickTimer == null) {
		        	clickTimer = setTimeout(function () {
			            clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(clickTimer);
			        clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        console.log("double");
			        return false;
			    }
				timeout = setInterval(function(){
					if (valor < 8) {
						valor++;
					} else {
						valor = 0;
					}
					
					
					$('.carita img').attr("src", "images/caras/"+animo[valor]+".svg");
					if (animo[valor]=="increible") {
						$('.carita h4').html("increíble");
					} else {
						$('.carita h4').html(animo[valor]);
					}
					

					$('#track_animo').attr("value", animo[valor]);

					switch ($('#track_animo').val() ) {
						case 'increible' :
							$('#track_animo').attr("value", "0");
							break;
						case 'feliz' :
							$('#track_animo').attr("value", "1");
							break;
						case 'bien' :
							$('#track_animo').attr("value", "2");
							break;
						case 'regular' :
							$('#track_animo').attr("value", "3");
							break;
						case 'triste' :
							$('#track_animo').attr("value", "4");
							break;    
						case 'cansado' :
							$('#track_animo').attr("value", "5");
							break;   
						case 'hambriento' :
							$('#track_animo').attr("value", "6");
							break;     
						case 'frustrado' :
							$('#track_animo').attr("value", "7");
							break; 
						case 'motivado' :
							$('#track_animo').attr("value", "8");
							break;
					}

				}, timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$("#animo-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#animo-dw").bind('mousedown', function(e){
				if (clickTimer == null) {
		        	clickTimer = setTimeout(function () {
			            clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(clickTimer);
			        clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        console.log("double");
			        return false;
			    }
				timeout = setInterval(function(){
					if (valor > 0) {
						valor--;
					} else {
						valor = 8;
					}
					$('.carita img').attr("src", "images/caras/"+animo[valor]+".svg");
					if (animo[valor]=="increible") {
						$('.carita h4').html("increíble");
					} else {
						$('.carita h4').html(animo[valor]);
					}

					$('#track_animo').attr("value", animo[valor]);

					switch ($('#track_animo').val() ) {
						case 'increible' :
							$('#track_animo').attr("value", "0");
							break;
						case 'feliz' :
							$('#track_animo').attr("value", "1");
							break;
						case 'bien' :
							$('#track_animo').attr("value", "2");
							break;
						case 'regular' :
							$('#track_animo').attr("value", "3");
							break;
						case 'triste' :
							$('#track_animo').attr("value", "4");
							break;    
						case 'cansado' :
							$('#track_animo').attr("value", "5");
							break;   
						case 'hambriento' :
							$('#track_animo').attr("value", "6");
							break;     
						case 'frustrado' :
							$('#track_animo').attr("value", "7");
							break; 
						case 'motivado' :
							$('#track_animo').attr("value", "8");
							break;
					}

				}, timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			
			//--------------------------------------------
			//
			// onClick: add_animo Registro de estado de
			// animo.
			//
			//--------------------------------------------

			$('#add_animo').on('click', function(){

				localStorage.setItem('track_animo', $('#track_animo').val() );

				var track_animo = localStorage.getItem('track_animo');
					console.log(track_animo);

				if(localStorage.getItem('track_animo') == ''){
					track_animo = 0;
				}

				if(!$('.alert_tracking').is(':visible')){
					$('.alert_tracking').show();
					setTimeout(function() {$('.alert_tracking').addClass('active');}, 200);
				} else {
					$('.alert_tracking').removeClass('active');
					setTimeout(function() {$('.alert_tracking').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');
			});

			$('#add_tracking').click(function(){
				//------------------------------
				//  @param tracking 1 - Ánimo
				//  @param value of image selected
				//-------------------------------
				if(localStorage.getItem('track_animo') >= 0){
					var responsedata = apiRH.tracking(1, track_animo);
					if(responsedata){
						app.toast("Se ha guardado tu ánimo");
						return;
					}else{
						alert('Error al registrar ánimo');
					}
				}else{
					alert('Error al registrar el estado de ánimo');
				}
			});
		}


	/*MEDIDAS*/
	var minval_med = 20; 
	var maxval_med = 250;
	var rango_med = maxval_med-minval_med;
	var gridme = ($('.medida .drag-parent').width()-30)/rango_med;

	var medida;
	
	$("#medida-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
	$("#medida-up").bind('mousedown', function(e){
		e.preventDefault();
		if (clickTimer == null) {
        	clickTimer = setTimeout(function () {
	            clickTimer = null;
	        }, 320)
	    } else {
	        clearTimeout(clickTimer);
	        clickTimer = null;
	        e.preventDefault();
	        e.stopPropagation();
	        console.log("double");
	        return false;
	    }
		timeout = setInterval(function(){
			medida = Number($("#medida-up").parent().parent().find('input').val());
			if (medida<99) {
				medida=medida+0.1;
				$("#medida-up").parent().parent().find('input').val(medida.toFixed(1));
				$('input[name="medida"]').attr("value", medida);
			} else {
				medida=medida+1;
				$("#medida-up").parent().parent().find('input').val(medida.toFixed(0));
			}
		}, timer);
		return false;
	})
	 .bind('mouseup', apiRH.clearTimeoutLogic);

	$("#medida-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
	$("#medida-dw").bind('mousedown', function(e){
		e.preventDefault();
		if (clickTimer == null) {
        	clickTimer = setTimeout(function () {
	            clickTimer = null;
	        }, 320)
	    } else {
	        clearTimeout(clickTimer);
	        clickTimer = null;
	        e.preventDefault();
	        e.stopPropagation();
	        console.log("double");
	        return false;
	    }
		timeout = setInterval(function(){
			medida = Number($("#medida-dw").parent().parent().find('input').val());
			if (medida<100.1) {
				medida=medida-0.1;
				$("#medida-dw").parent().parent().find('input').val(medida.toFixed(1));
				$('input[name="medida"]').attr("value", medida);
			} else {
				medida=medida-1;
				$("#medida-dw").parent().parent().find('input').val(medida.toFixed(0));
			}
		}, timer);
		return false;
	})
	 .bind('mouseup', apiRH.clearTimeoutLogic)
	 .dblclick(function(){
		console.log("Double click");
	});

	// $('#medida').draggable({ 
	// 		containment:"parent",axis:"x",grid:[gridme,gridme],drag:function(){
	// 			var percent = $('.medida .drag-parent').width()-30;
	// 			var donde = Math.round(((($('#medida').position().left)*rango_med)/percent)+minval_med);
	// 			$("#medida-filler").css("width",$('#medida').position().left+20);
	// 			$('#medida-dato-span').html(donde);
	// 			$('#medida-dato').attr('value',donde);
	// 		}
	// });


	if( $('body').hasClass('measures') ){
		$('#add_medidas').on('click', function(){
			/* localStorage MEDIDAS / MEASURED AREA */
			
			localStorage.setItem( 'medidas', $('#medida-dato').val() );
			localStorage.setItem( 'measured_area', $('#measured_area').val() )

			if(!$('.alert_tracking').is(':visible')){
				$('.alert_tracking').show();
				setTimeout(function() {$('.alert_tracking').addClass('active');}, 200);
			} else {
				$('.alert_tracking').removeClass('active');
				setTimeout(function() {$('.alert_tracking').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');
			//$('a.centro img').toggleClass('onn');
		});
			$('#add_tracking').click(function(){

				var medidas = localStorage.getItem('medidas');
				var area = localStorage.getItem('measured_area');
				var responsedata = apiRH.tracking(area, medidas);
				if(responsedata){
					console.log(area+" "+medidas);
					app.toast("Se han agregado tus medidas");
					//window.location.assign('dieta.html');
				}
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});
			$('#add_cancelar').click(function(){
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});
	}//end if body has class measures


		/*HORAS MINUTOS*/
	var minval_hora = 0; 
	var maxval_hora = 16;
	var rango_hora = maxval_hora-minval_hora;
	var gridhr = ($('.horaeje .drag-parent').width()-30)/rango_hora;
	$('#horaeje').draggable({ containment:"parent",axis:"x",grid:[gridhr,gridhr],drag:function(){
		var percent = $('.horaeje .drag-parent').width()-30;
		var donde = Math.round(((($('#horaeje').position().left)*rango_hora)/percent)+minval_hora);
		$("#horaeje-filler").css("width",$('#horaeje').position().left+20);
		var hora = (donde/4);
		hora = hora.toString().substr(0,1);
		var minutos = (donde/4)*60;
		if (minutos>179) {
			minutos = minutos-180;
		} else if (minutos>119) {
			minutos = minutos-120;
		} else if (minutos>59) {
			minutos = minutos-60;
		}
		if (minutos==0 || minutos==60) {
			minutos="00";
		}
		$('#horaeje-dato').html(hora+":"+minutos);
		$('#duracion').attr("value", hora+":"+minutos);
	  }
	});

	var minval_int = 0; 
	var maxval_int = 3;
	var rango_int = maxval_int-minval_int;
	var gridin = ($('.inteje .drag-parent').width()-30)/rango_int;
	$('#inteje').draggable({ containment:"parent",axis:"x",grid:[gridin,gridin],drag:function(){
		var percent = $('.inteje .drag-parent').width()-30;
		var donde = Math.round(((($('#inteje').position().left)*rango_int)/percent)+minval_int);
		$("#inteje-filler").css("width",$('#inteje').position().left+20);
		var text_int;
		switch (donde) {
			case 0:
				text_int = "baja";
				break;
			case 1:
				text_int = "moderada";
				break;
			case 2:
				text_int = "alta";
				break;
			case 3:
				text_int = "extrema";
				break;
		}

		$('#intensidad').attr('value',text_int);

		switch ($('#intensidad').val() ) {
			case 'baja':
				$('#intensidad').attr('value','0');
				break;
			case 'moderada':
				$('#intensidad').attr('value','1');;
				break;
			case 'alta' :
				$('#intensidad').attr('value','2');
				break;
			case 'extrema' :
				$('#intensidad').attr('value','3');
				break;
		}
		$('#inteje-dato').html(text_int);
	  }
	});




/*
	FEED HTML
*/

		if(localStorage.getItem('avatar-admin')){
			$('.circle-frame').find('img').attr('src', 'http://ginger-admin.cloudapp.net/pictures/' + localStorage.getItem('avatar-admin'));
		}else{

			if( localStorage.getItem('avatar') ){
				$('.circle-frame').find('img').attr('src', localStorage.getItem('avatar') + '?type=large');
			}else{
				$('.circle-frame').find('img').remove();
			}

		}



		if( $('body').hasClass('excercise') ){

					$('.ej-option').click(function() {
						var valor = $(this).find('.type').attr('value');
						$('.ej-option').each(function() {
							if ($(this).find('img').attr('src').substr(-5, 1)=="2") {
							  $(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
							  $(this).removeClass('active');
							  $(this).attr('value', "");
							}
						}); 

						$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
						$(this).addClass('active');
						$("#ejercicio_type").attr('value', valor);

							//'caminar', 'correr', 'pesas', 'cross', 'bici', 'estacionaria', 'eliptica', 'cardio', 'yoga', 'pilates', 'tenis', 'otro'

						switch($("#ejercicio_type").val() ){
							case 'caminar' :
							$('#ejercicio_type').attr('value','10');
							break;
							case 'correr' :
							$('#ejercicio_type').attr('value','11');
							break;
							case 'pesas' :
							$('#ejercicio_type').attr('value','12');
							break;
							case 'cross' :
							$('#ejercicio_type').attr('value','13');
							break;
							case 'bici' :
							$('#ejercicio_type').attr('value','14');
							break;
							case 'estacionaria' :
							$('#ejercicio_type').attr('value','15');
							break;
							case 'eliptica' :
							$('#ejercicio_type').attr('value','16');
							break;
							case 'cardio' :
							$('#ejercicio_type').attr('value','17');
							break;
							case 'yoga' :
							$('#ejercicio_type').attr('value','18');
							break;
							case 'pilates' :
							$('#ejercicio_type').attr('value','19');
							break;
							case 'tenis' :
							$('#ejercicio_type').attr('value','20');
							break;
							case 'otro	' :
							$('#ejercicio_type').attr('value','21');
							break;
						}

					});

							/*
								localStorage EJERCICIO / DURACION / INTENSIDAD
							 */
					$('#add_ejercicio').on('click', function(){

						localStorage.setItem('track_ejercicio_type', 		$('#ejercicio_type').val() );
						localStorage.setItem('track_ejercicio_duration',	$('#duracion').val() );
						localStorage.setItem('track_ejercicio_intensidad', 	$('#intensidad').val() );

						//console.log(responsedata);
						if(!$('.alert_tracking').is(':visible')){
							$('.alert_tracking').show();
							setTimeout(function() {$('.alert_tracking').addClass('active');}, 200);
						} else {
							$('.alert_tracking').removeClass('active');
							setTimeout(function() {$('.alert_tracking').hide();}, 800);
						}
						$('#blur').toggleClass('blurred');
					});

						$('#add_tracking').click(function(){
							
							var intensidad  = localStorage.getItem('track_ejercicio_intensidad');
							var type 		= localStorage.getItem('track_ejercicio_type');
							var duracion	= localStorage.getItem('track_ejercicio_duration');
							
							var responsedata = apiRH.tracking(type, duracion);
	
							if(responsedata){
								app.toast("Se ha guardado tu progreso correctamente")
								//window.location.assign('dieta.html');
							}else{
								alert('error al insertar datos ');
							}
							$('.alert_tracking').hide();
							$('#blur').toggleClass('blurred');
						});
		}//endif 
		

		$('.centro').click(function() {
			if(!$('.overscreen').is(':visible')){
				$('.overscreen').show();
				setTimeout(function() {$('.overscreen').addClass('active');}, 200);
			} else {
				$('.overscreen').removeClass('active');
				setTimeout(function() {$('.overscreen').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');
			$('a.centro img').toggleClass('onn');
		});

		$('.ov-filler').click(function() {
			$('.overscreen').removeClass('active');
			setTimeout(function() {$('.overscreen').hide();}, 800);
			$('#container').removeClass('blurred');
			$('a.centro img').removeClass('onn');
		});

		$('a.more').click(function() {
			$(this).parent().find('.extra-info').toggle();
			$(this).toggleClass('presionado');
		});

		$('svg.consume').click(function() {
			$(this).parent().parent().addClass('consumido');
			var cosumo = false;
			console.log($(this).parent().parent().attr('data'));
			console.log($(this).parent().parent().parent().parent().parent().parent().attr('data'));

			var idPlatillo = $(this).parent().parent().attr('data');
			var nPlatillo = $(this).parent().parent().attr('platillo');
			var cosumoFecha = $(this).parent().parent().parent().parent().parent().parent().attr('data');
			var comida = -1;

			if($(this).parent().parent().parent().hasClass('desayuno'))
				comida = 0;
			if($(this).parent().parent().parent().hasClass('snack1'))
				comida = 1;
			if($(this).parent().parent().parent().hasClass('comida'))
				comida = 2;
			if($(this).parent().parent().parent().hasClass('snack2'))
				comida = 3;
			if($(this).parent().parent().parent().hasClass('cena'))
				comida = 4;
			
			if($(this).parent().find('svg.consume').find('use').attr('xlink:href') == '#consume2'){
				$(this).html('<use xlink:href="#consume"></use>');	
				$(this).parent().find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');
				cosumo = false;	
					
			}else{
				$(this).html('<use xlink:href="#consume2"></use>');
				$(this).parent().find('svg.noconsu').find('use').attr('xlink:href', '#noconsu');
				cosumo = true;
				//$(this).parent().find('svg.consume').find('use').attr('xlink:href', '#consume');
			}
			
			var json = {
				"plato" : idPlatillo, 
				"fecha" : cosumoFecha,
				"comida"  : comida,
				"platillo": nPlatillo,
				"consumido": cosumo
			};

			if(comida == -1)
				return;
			
			var result = apiRH.makeCosume(json);

			if(result){
				//Llamar a consumidos
				//window.getConsumed();
			}


		});

		$('svg.noconsu').click(function() {

			$(this).parent().parent().addClass('cancelado');

			var idPlatillo = $(this).parent().parent().attr('data');
			var nPlatillo = $(this).parent().parent().attr('platillo');
			var cosumoFecha = $(this).parent().parent().parent().parent().parent().parent().attr('data');
			var comida = -1;
			var consumo = false;
			
			if($(this).parent().parent().parent().hasClass('desayuno'))
				comida = 0;
			if($(this).parent().parent().parent().hasClass('snack1'))
				comida = 1;
			if($(this).parent().parent().parent().hasClass('comida'))
				comida = 2;
			if($(this).parent().parent().parent().hasClass('snack2'))
				comida = 3;
			if($(this).parent().parent().parent().hasClass('cena'))
				comida = 4;
			
			if($(this).parent().find('svg.consume').find('use').attr('xlink:href', '#consume2')){
				$(this).html('<use xlink:href="#noconsu2"></use>');		
				$(this).parent().find('svg.consume').find('use').attr('xlink:href', '#consume');
				var consumo = true;		
			}else{
				$(this).html('<use xlink:href="#noconsu"></use>');	
				$(this).parent().find('svg.consume').find('use').attr('xlink:href', '#consume');
				var consumo = false;
			}
			
			var json = {
				"plato" : idPlatillo, 
				"fecha" : cosumoFecha,
				"comida"  : comida,
				"platillo": nPlatillo,
				"consumido": false
			};
			
			var result = apiRH.makeCosume(json);

			if(result){

				//Llamar a consumidos
				//window.getConsumed();
			}

		});

		$('svg.commenn').click(function() {
			console.log('click');
			$('#comentar').val(''); /*AQUI SE ELIMINA EL COMENTARIO DEL TEXTAREA CUANDO SE HACE CLICK EN EL ICONO QUE LO ABRE*/
			$('.comment_pop').show();

			var idPlatillo 	= $(this).parent().parent().attr('data');
			var nPlatillo 	= $(this).parent().parent().attr('platillo');
			var cosumoFecha = $(this).parent().parent().parent().parent().parent().parent().attr('data');
			var comida = -1;
			
			if($(this).parent().parent().parent().hasClass('desayuno'))
				comida = 0;
			if($(this).parent().parent().parent().hasClass('snack1'))
				comida = 1;
			if($(this).parent().parent().parent().hasClass('comida'))
				comida = 2;
			if($(this).parent().parent().parent().hasClass('snack2'))
				comida = 3;
			if($(this).parent().parent().parent().hasClass('cena'))
				comida = 4;

			$('.comment_pop').attr('idPlatillo', idPlatillo);
			$('.comment_pop').attr('nPlatillo', nPlatillo);
			$('.comment_pop').attr('cosumoFecha', cosumoFecha);
			$('.comment_pop').attr('comida', comida);

			setTimeout(function() {$('.comment_pop').addClass('active');}, 200);

			
		});

		var texto = 'Mostrar Completados';

		$('.toggle-complete').click(function() {
			
		});

		
		function getcosumed(){
			
			var response = apiRH.getConsumed('2016-09-01', '2016-09-30');

			// console.log(JSON.stringify(response));
			console.log("length ::: "+JSON.stringify(response));
			if(!response){
				app.hideLoader();
			}else{
				$.each(response, function(key, value){
					
					console.log(key + '::::' + value);

					if(key == 'consumos')

						$.each(value, function(key, value){
							//Fechas
							console.log(key + ':::::::.' + value);

							var fecha =	key;
							var commentFlag = false;

							$.each(value, function(key, value){
								console.log(key + ':::::::::::' + value);

								if(key == 'desayuno'){

									$.each(value, function(key, value){
										var platillo = '';
										$.each(value, function(key, value){
											console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}
											
											if(key == 'consumido'){
												console.log('consumido::: ' + value);
												if(value){
													$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').addClass('consumido');
													$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('nav').find('svg.consume').find('use').attr('xlink:href', '#consume2');
													
												}else if(key == 'consumido' && !value){
													$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').addClass('cancelado');
													$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('nav').find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');	
												}
											}

											if(key == 'comment'){
												commentFlag = true;
												console.log('comentario: ' +value);
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}

										});
										console.log("commentFlag");
										console.log(commentFlag);
										if(!commentFlag){
											console.log("removing");
											console.log($('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]'));
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('div').find('comment_sub').hide();
										}
										commentFlag = false;
									});
								}

								if(key == 'snack1'){
									console.log('snack1');
									$.each(value, function(key, value){
										var platillo = '';
										var commentFlag = false;
										$.each(value, function(key, value){
											console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}

											if(key == 'consumido' && value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').addClass('consumido');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('nav').find('svg.consume').find('use').attr('xlink:href', '#consume2');
												
											}else if(key == 'consumido' && !value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').addClass('cancelado');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('nav').find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');	
											}

											if(key == 'comment'){
												commentFlag = true;
												console.log('comentario: ' +value);
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
											if(!commentFlag){
												console.log("comment Flag not");
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('div').find('comment_sub').hide();
											}
											commentFlag = false;
										});
									});
								}

								if(key == 'comida'){
									console.log('comida');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}

											if(key == 'consumido' && value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').addClass('consumido');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('nav').find('svg.consume').find('use').attr('xlink:href', '#consume2');
												
											}else if(key == 'consumido' && !value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').addClass('cancelado');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('nav').find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');	
											}

											if(key == 'comment'){
												console.log('comentario: ' +value);
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
										});
									});
								}

								if(key == 'snack2'){
									console.log('snack2');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}

											if(key == 'consumido' && value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').addClass('consumido');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('nav').find('svg.consume').find('use').attr('xlink:href', '#consume2');
												
											}else if(key == 'consumido' && !value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').addClass('cancelado');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('nav').find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');	
											}

											if(key == 'comment'){
												console.log('comentario: ' +value);
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}

										});
									});
								}

								if(key == 'cena'){
									console.log('cena');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}

											if(key == 'consumido' && value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').addClass('consumido');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('nav').find('svg.consume').find('use').attr('xlink:href', '#consume2');
												
											}else if(key == 'consumido' && !value){
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').addClass('cancelado');
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('nav').find('svg.noconsu').find('use').attr('xlink:href', '#noconsu2');	
											}

											if(key == 'comment'){
												console.log('comentario: ' +value);
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}


										});
									});
								}

							});
						});
				});
			}
		}


		$('.di-options a').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});

		$('.ov-filler2').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});

		$('a.logout').click(function() {
			console.log('click_logout');
			localStorage.clear();
			$('.overscreen2').show();
			setTimeout(function() {$('.overscreen2').addClass('active');}, 200);
		});

		// Cambiar coach
		$('.com2send').click(function() {
			$('.comment_pop').show();
			setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
			$('.comment_pop textarea').focus();
		});

		
		// Edit user
		$('.izquii').click(function() {
			$('.comment_pop').removeClass('active');
			setTimeout( function() {$('.comment_pop').hide();}, 500);
			$('.siono').removeClass('active');
			$('.siono.not').addClass('active');
		});


	// Cancelar subscripcion
	$('.btn_cancelar').click(function (e) {

		// alert('CANCELAR SUSCRIPTCION');

		if(!$('.cancel_subscription').is(':visible') ){
			$('.cancel_subscription').show();
			setTimeout(function() {$('.cancel_subscription').addClass('active');}, 200);
			} else {
				$('.cancel_subscription').removeClass('active');
				setTimeout(function() {$('.cancel_subscription').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');

		var customer_id = localStorage.getItem('customer_id');
		
		var response = apiRH.cancelarSuscripcion(customer_id);

		$('#accept_cancel').click(function(){
			$('.cancel_subscription').hide();
			$('#blur').toggleClass('blurred');

			if(!$('.cancel_subscription2').is(':visible') ){
				$('.cancel_subscription2').show();
				setTimeout(function() {$('.cancel_subscription2').addClass('active');}, 200);
				} else {
					$('.cancel_subscription2').removeClass('active');
					setTimeout(function() {$('.cancel_subscription2').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

				$('#accept_ccomment').click(function(){
					console.log('ventana para comentario');
					$('.cancel_subscription2').hide();
					if(!$('.comment_pop').is(':visible') ){
						$('.comment_pop').show();
						setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
					} else {
						$('.comment_pop').removeClass('active');
						setTimeout(function() {$('.comment_pop').hide();}, 800);
					}

					$('#write_ch_coach').click(function(){

						localStorage.setItem('cancel_subscription_cmt', $('#msg_ch_coach').val() );

						if(!$('.cancel_subscription3').is(':visible') ){
							$('.cancel_subscription3').show();
							$('.cancel_subscription2').hide();
							setTimeout(function() {$('.cancel_subscription3').addClass('active');}, 200);
							} else {
								$('.cancel_subscription3').removeClass('active');
								setTimeout(function() {$('.cancel_subscription3').hide();}, 800);
							}

							$('#accept_comment3').click(function(){
								console.log('click');
								$('.cancel_subscription3').hide();
								$('#blur').toggleClass('blurred');

								if(response){
									localStorage.clear();
									// TODO: Use render methods not hard loading
									window.location.assign('index.html');
								}	
							});


						// $('.cancel_subscription2').hide();
						// $('#blur').toggleClass('blurred');
					});
				});

				$('#cancelar2').click(function(){
					$('.cancel_subscription2').hide();
					$('#blur').toggleClass('blurred');
				});

				
			/*Llamar hasta estar segurisomo de querer cancelar la subscripccion*/
			// if(response){
			// window.location.assign('index.html');
			// localStorage.clear();
			// }	
		});

		$('#cancelar').click(function(){
			$('.cancel_subscription').hide();
		});

	});


	/*

		WEB VIEW BLOG
		
	*/
	// $('#blog').on('click',function(){
	// 	console.log("click");
	// 	cordova.InAppBrowser.open('https://gingerapp.mx/', '_blank', 'location=yes');
	// })

	// $('#terms_cond').on('click',function(){
	// 		console.log("click");
	// 		cordova.InAppBrowser.open('https://gingerapp.mx/', '_blank', 'location=yes');
	// 	})


	// $('#pol_priv').on('click',function(){
	// 		console.log("click");
	// 		cordova.InAppBrowser.open('https://gingerapp.mx/', '_blank', 'location=yes');
	// 	})

	}); //END WINDOW LOAD clicks

	
	
	/*
		CAMARA
	*/
	function setOptions(srcType) {
		var options = {
			// Some common settings are 20, 50, and 100
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			// In this app, dynamically set the picture source, Camera or photo gallery
			sourceType: srcType,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: true,
			correctOrientation: true  //Corrects Android orientation quirks
		}
		return options;
	}

	function openCamera(selection) {

		var srcType = Camera.PictureSourceType.CAMERA;
		var options = setOptions(srcType);
		var func = createNewFileEntry;

		navigator.camera.getPicture(function cameraSuccess(imageUri) {

			//displayImage(imageUri);
			// You may choose to copy the picture, save it somewhere, or upload.
			func(imageUri);

		}, function cameraError(error) {
			console.debug("Unable to obtain picture: " + error, "app");

		}, options);
	}

	function displayImage(imgUri) {

		var elem = document.getElementById('imageFile');
		elem.src = imgUri;
	}
	



	  

(function($){

	"use strict";

	$(function(){

		/**
		 * Validación de emails
		 */
		window.validateEmail = function (email) {
			var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regExp.test(email);
		};

		/**
		 * Regresa todos los valores de un formulario como un associative array 
		 */
		window.getFormData = function (selector) {
			var result = [],
				data   = $(selector).serializeArray();

			$.map(data, function (attr) {
				result[attr.name] = attr.value;
			});
			return result;
		}

	});



})(jQuery);