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

	}// END finanzas


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


	


}); // END function



/*INICIA ON LOAD RESIZE*/
$(window).on("load resize",function(){ 


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

		if( app.keeper.getItem('avatar-admin') ){
			$('.circle-frame').find('img').attr('src', 'http://ginger-admin.cloudapp.net/pictures/' + app.keeper.getItem('avatar-admin'));
		}else{

			if( app.keeper.getItem('avatar') ){
				$('.circle-frame').find('img').attr('src', app.keeper.getItem('avatar') + '?type=large');
			}else{
				$('.circle-frame').find('img').remove();
			}

		}


		
		

		

		// Cambiar coach
		$('.com2send').click(function() {
			$('.comment_pop').show();
			setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
			$('.comment_pop textarea').focus();
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
	
