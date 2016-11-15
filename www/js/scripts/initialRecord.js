	
window.initializeRecordEvents = function(){
	
	jQuery(document).ready(function($) {

		console.log("Initializing Initial Record events");
		var alto = document.documentElement.clientHeight;
		var ancho = document.documentElement.clientWidth;
		var tamano = $('.slide-coach').length;
		var csld = (tamano*ancho*0.8125)+(ancho*0.09375);
		var mediad = 300+(ancho*0.64);
		
		$(window).on("load resize",function(){ 

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

		});

		window.init_scripts.push("initial_record");
		// Globals
		var minval_age;
		var grid_exercise;
		var minval_eje;
		var maxval_eje;
		var rango_eje;
		var anchot = document.documentElement.clientWidth;


		/* MEASUREMENT CONTROLS */
		$('.genre-bt').click(function(){
			$(this).parent().find('a').removeClass('active');
			$(this).addClass('active');
			$('.sector-1').animate({opacity:'0'}, 200);
			setTimeout(function() {
				$('.sector-1').hide();
				$('.genre').show();
				$('.genre').animate({opacity:'1'}, 200);
			}, 210);
		});

		$('.age-bt').click(function(){
			console.log('click');
			$(this).parent().find('a').removeClass('active');
			$(this).addClass('active');
			$('.sector-1').animate({opacity:'0'}, 200);
			setTimeout(function() {
				$('.sector-1').hide();
				$('.age').show();
				$('.age').animate({opacity:'1'}, 200);
			}, 210);
		});

		$('.zip-bt').click(function(){
			$(this).parent().find('a').removeClass('active');
			$(this).addClass('active');
			$('.sector-1').animate({opacity:'0'}, 200);
			setTimeout(function() {
				$('.sector-1').hide();
				$('.zip').show();
				$('.zip').animate({opacity:'1'}, 200);
				$('.zip input').focus();
			}, 210);
		});

		$('.mido-bt').click(function(){
			$(this).parent().find('a').removeClass('active');
			$(this).addClass('active');
			$('.sector-2').animate({opacity:'0'}, 200);
			setTimeout(function() {
				$('.sector-2').hide();
				$('.mido').show();
				$('.mido').animate({opacity:'1'}, 200);
			}, 210);
		});

		$(".peso-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
				$(".sector-2").hide();
				$(".peso").show();
				$(".peso").animate({opacity:"1"}, 200);
			}, 210);
		});

		$(".ideal-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
				$(".sector-2").hide();
				$(".ideal").show();
				$(".ideal").animate({opacity:"1"}, 200);
			}, 210);
		});

		/** SELECT GENDER **/
		$("#hombre").click(function(){
			if ($(this).hasClass('edition')) {
				$('#mujer').attr("src","images/mujere.svg");
				$('#update_sexo').attr("value", '0');

			} else {
				$('#mujer').attr("src","images/mujer.svg");
				$('#mujer').attr("alt","");
			}
			$(this).attr({src: "images/hombreh.svg", alt: "1"});
			$('.type-def').attr("src","images/hombreh.svg");
			$('#update_sexo').attr("value", '1');
		});

 
		$("#mujer").click(function(){
			if ($(this).hasClass('edition')) {
				$('#hombre').attr("src","images/hombree.svg");
				$('#update_sexo').attr("value", '1');
			} else {
				$('#hombre').attr("src","images/hombre.svg");
				$('#hombre').attr("alt","");
			}
			$(this).attr({src: "images/mujerh.svg", alt: "0"});
			$('.type-def').attr("src","images/mujerh.svg");
			$('#update_sexo').attr("value", '0');
		});

		/* RECORD AGE */
		
		var gridag;
		minval_age 		= 15; 
		var maxval_age 	= 90;
		var rango_age 	= maxval_age - minval_age;

		/** Set up initial draggable values **/
		if ($('.pagina').hasClass('aboutyou')) {
			gridag = ((anchot*0.7)-30)/rango_age;
		} else {
			gridag = ($('.age .drag-parent').width()-30)/rango_age;
		}

		/** Set up actual draggable **/
		$('#age').draggable( 
							{ 
								containment:"parent",
								axis:"x",
								grid:[gridag,gridag],
								drag: function(){
									var percent = $('.age .drag-parent').width()-30;
									var donde = Math.round(((($('#age').position().left)*rango_age)/percent)+minval_age);
									$("#age-filler").css("width", $('#age').position().left+20);
									$('#age-dato').html(donde);
									$('#edad_value').attr("value", donde);
									return true;
								}
		});

		/** BINDING STICKY EVENTS **/
		var estatura;

		$("#estatura-up").bind('touchstart touchend', apiRH.stickyTouchHandler);

		$("#estatura-up").bind('mousedown', function(e){
			e.preventDefault();
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				estatura = Number($("#estatura-up").parent().parent().find('input').val());
				estatura = estatura+0.01;
				$("#estatura-up").parent().parent().find('input').val(estatura.toFixed(2));
				$('input[name="estatura"]').attr( "value", estatura );
				apiRH.timeoutFlag = true;
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);
		
		$("#estatura-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);

		$("#estatura-dw").bind('mousedown', function(e){
			e.preventDefault();
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				estatura = Number($("#estatura-dw").parent().parent().find('input').val());
				estatura=estatura-0.01;
				$("#estatura-dw").parent().parent().find('input').val(estatura.toFixed(2));
				$('input[name="estatura"]').attr("value", estatura);
				// return false;
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		var peso;
		
		$("#peso-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#peso-up").bind('mousedown', function(e){
			e.preventDefault();
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				peso = Number($("#peso-up").parent().parent().find('input').val());
				if (peso<99) {
					peso=peso+0.5;
					$("#peso-up").parent().parent().find('input').val(peso.toFixed(1));
					$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso+1;
					$("#peso-up").parent().parent().find('input').val(peso.toFixed(0));
				}
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		$("#peso-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#peso-dw").bind('mousedown', function(e){
			e.preventDefault();
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				peso = Number($("#peso-dw").parent().parent().find('input').val());
				if (peso<100.1) {
					peso=peso-0.5;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(1));
					$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso-1;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(0));
				}
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		var ideal;

		$("#ideal-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#ideal-up").bind('mousedown', function(e){
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				ideal = Number($("#ideal-up").parent().parent().find('input').val());
				if (ideal<99) {
					ideal=ideal+0.5;
					$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(1));
					$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal+1;
					$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(0));
				} 
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		$("#ideal-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
		$("#ideal-dw").bind('mousedown', function(e){
			if (apiRH.clickTimer == null) {
				apiRH.clickTimer = setTimeout(function () {
					apiRH.clickTimer = null;
				}, 320)
			} else {
				clearTimeout(apiRH.clickTimer);
				apiRH.clickTimer = null;
				e.preventDefault();
				e.stopPropagation();
				console.log("double");
				return false;
			}
			apiRH.timeout = setInterval(function(){
				ideal = Number($("#ideal-dw").parent().parent().find('input').val());
				if (ideal<100.1) {
					ideal=ideal-0.5;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(1));
					$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal-1;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(0));
				}
			}, apiRH.timer);
			return false;
		})
		 .bind('mouseup', apiRH.clearTimeoutLogic);

		/* Next step 1 */
		$('#next_step_one').click(function(){

			if($('#zipInput').val() == ''){
				$('.overscreenzip').show();
				$('.accept.zipcode').click(function(){
					$('.overscreenzip').hide().removeClass('active');;
				});
				setTimeout(function() {$('.overscreenzip').addClass('active');}, 200);
				return;
			}
			$('.aboutyou').animate({opacity:"0",left:"-40px"}, 200);
			$('.bpur').removeClass('active');
			$('.bgre').addClass('active');

			if($('#hombre').attr('alt') == '1' ){
				$('#genre_value').attr('value', 1);
			}else{
				$('#genre_value').attr('value', 0);
			}

			if($('input[name="zipcode"]').val() == '' || $('input[name="zipcode"]').val() == undefined){
				return;
			}
			app.keeper.setItem('zipcode', $('input[name="zipcode"]').val() );
			var _zipcode = app.keeper.getItem('zipcode');

			app.keeper.setItem('genero', $('#genre_value').val() );//hacerlo una condicional
			var _genero = app.keeper.getItem('genero');

			app.keeper.setItem('estatura', $('input[name="estatura"]').val() );
			var _estatura = app.keeper.getItem('estatura');

			app.keeper.setItem('peso', $('input[name="peso"]').val() );
			var _peso = app.keeper.getItem('peso');
			
			app.keeper.setItem('edad', $('#edad_value').val() );
			
			app.keeper.setItem('peso_ideal', $('input[name="ideal"]').val() );
			var _peso_ideal = app.keeper.getItem('peso_ideal');

			setTimeout(function() {
				$('.pagina').hide();
				$('.objetive').show();
				$('.objetive').css('left','40px');
				$('.objetive').animate({opacity:'1',left:'0px'}, 200);
				$('#container').resize();
			}, 250);

			$(".back").show();

		});//END Next step 1

		/*** SELECT OBJECTIVE ***/
		$('.pl-option').click(function() {

			var valor = $(this).find('.type').data('index');
			$('#plan').attr('value', valor);

			$('.pl-option').each(function() {
				if ($(this).find('img').attr('src').substr(-5, 1) == "2") {
					$(this).find('img').attr('src', $(this).find('img').attr('src').slice( 0, -5 )+'.png');
					$(this).removeClass('active');
					$(this).attr( 'value', '' );
				}
			});

			$(this).find('img').attr('src', $(this).find('img').attr('src').slice(0, -4)+'2.png');
			$(this).addClass('active');
			$(this).attr('value', valor);

		});

		/*** SELECT COACH ***/
		$('.co-option img:not(.question)').click(function() {
			var valor = $(this).parent().find('.type').attr('value');
			$('#coach_type').attr('value', valor);

			$('.co-option').each(function() {
				if ($(this).find('img:not(.question)').attr('src').substr(-5, 1)=="2") {
				  $(this).find('img:not(.question)').attr("src",$(this).find('img:not(.question)').attr('src').slice(0, -5)+".png");
				  $(this).removeClass('active');
				  $(this).attr("value", "");
				}
			}); 
			$(this).attr("src",$(this).attr('src').slice(0, -4)+"2.png");
			$(this).parent().addClass('active');
			$(this).parent().attr("value", valor);


			switch ( $('#coach_type').val() ) {
				case 'estricto' : 
					$('#coach_type').attr("value", "0");
					break;
				case 'innovador' :
					$('#coach_type').attr("value", "1");
					break;
				case 'animador' :
					$('#coach_type').attr("value", "2");
					break;
				case 'tradicional' :
					$('#coach_type').attr("value", "3");
					break;	
			}

		});

		/*** WHO IS THIS COACH ***/
		$('.question').click(function() {
			$('.overscreen2 h5').html($(this).attr("title"));
			$('.overscreen2 .dialog p').html($(this).attr("data"));
			$('.overscreen2').show();

			setTimeout(function() {$('.overscreen2').addClass('active');}, 200);
		});

		/* Next step 2 */
		$('#next_step_two').click(function(){

			$('.objetive').animate({opacity:"0",left:"-40px"}, 200);
			$('.bgre').removeClass('active');
			$('.bred').addClass('active');
			var coach_type 	= $('#coach_type').val();
			var plan 		= $('#plan').val();
			
			app.keeper.setItem('plan', plan );
			app.keeper.setItem('coach_type', coach_type );

			console.log(" plan > "+ plan);
			console.log(" coachType > "+ coach_type);

			setTimeout(function() {

				$(".pagina").hide();
				$(".exercise").show();
				$(".exercise").css("left","40px");
				$(".exercise").animate({opacity:"1",left:"0px"}, 200);
				$("#container").resize();
			}, 250);
		});

		/* RECORD EXERCISE FREQUENCY */
		minval_eje 	= 0; 
		maxval_eje 	= 7;
		rango_eje 	= maxval_eje-minval_eje;

		grid_exercise = Math.floor( ($('.exercise .drag-parent').width()-30)/rango_eje );
		
		if ($('.pagina').hasClass('aboutyou'))
			grid_exercise =  Math.floor( ( (anchot*0.7)-30 )/rango_eje );

		$('#ejercicio').draggable({ 
									containment	:"parent",
									axis		:"x",
									grid 		:[ grid_exercise, grid_exercise ],
									revert		: false,
									drag 		: function(){
													var percent = $('.exercise .drag-parent').width()-30;
													var donde 	= Math.round(((($('#ejercicio').position().left)*rango_eje)/percent)+minval_eje);
													console.log(donde);
													$("#ejercicio-filler").css("width",$('#ejercicio').position().left+20);
													$('#ejercicio-dato').html(donde);
													$('#days_per_week').attr("value", donde);
													return true;
												}
								 });


		$('#next_step_three').click(function(){
			
			var days_per_week = $('#days_per_week').val();
			app.keeper.setItem('dpw', days_per_week );

			$('.exercise').animate({opacity:"0",left:"-40px"}, 200);
			$('.bred').removeClass('active');
			$('.borg').addClass('active');
		
			setTimeout(function() {
				$(".pagina").hide();
				$(".restric").show();
				$(".restric").css("left","40px");
				$(".restric").animate({opacity:"1",left:"0px"}, 200);
			}, 250);
		});


		/*** ADD RESTRICTIONS TO REGISTRY ***/
		var restricciones 	= [];
		restricciones 		= app.keeper.getItem('restricciones');

		if(restricciones == null || restricciones === 'undefined'){
			restricciones = [];
		}else{
			restricciones = JSON.parse("["+restricciones+"]");
			console.log(restricciones.length);
			console.log(restricciones);
		}

		$('.re-option').click(function() {

			if(restricciones === 'undefined' ){
				restricciones = [];
			}
			else if(restricciones.length > 0){
				console.log(restricciones);
				console.log(restricciones.length);
			}

			var valor = $(this).find('.type').attr('value');
				console.log(valor);
			if (!$(this).hasClass('active')) {
				
				console.log("ADDED");

				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
				$(this).addClass('active');
				$(this).attr("value", valor);
				$('.restricciones').attr('value', valor);
				restricciones.push(valor);
				app.keeper.setItem('restricciones', JSON.stringify(restricciones) );

			} else {

				console.log('DELETED');

				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
				$(this).removeClass('active');
				$(this).attr("value", "");
				$('.restricciones').attr('value',"");
				for(var i=0; i<restricciones.length; i++){
					
					if( restricciones[i] == valor ){
						console.log('entro al loop');
						var index = restricciones.indexOf(valor);
						console.log(valor);
						console.log(restricciones.length);
						console.log(restricciones);
						restricciones.splice(i, 1);
						app.keeper.setItem('restricciones', JSON.stringify(restricciones));
					}

				}	
				console.log(restricciones);				
			}

			if(restricciones.length == 0 ){
				$('#next_step_four').attr('src', 'images/saltar.svg');
				$('#next_step_four').css('margin-left', '-65px');
			}else{
				$('#next_step_four').attr('src', 'images/enter.svg');
				$('#next_step_four').css('margin-left', '-25px');
			}
			console.log(restricciones);
		});

		$('#next_step_four').click(function(){
			setTimeout(function(){
				app.showLoader();
			}, 420);

			$('.restric').animate({opacity:"0",left:"-40px"}, 200);
			$('.borg').removeClass('active');
			$('.byel').addClass('active');

			var restricciones_ls2   = [];
			var genero 		  		= app.keeper.getItem('genero');
			var peso 		  		= app.keeper.getItem('peso');
			var estatura 	  		= app.keeper.getItem('estatura');
			var edad 		  		= app.keeper.getItem('edad');
			var peso_ideal 	  		= app.keeper.getItem('peso_ideal');
			var zipcode 	  		= app.keeper.getItem('zipcode');
			var plan 		  		= app.keeper.getItem('plan');
			var coach_type 	  		= app.keeper.getItem('coach_type');

			if (app.keeper.getItem('restricciones') == null) {
				console.log('Restricciones viene null');
				restricciones_ls2 = "";
			}else{
				restricciones_ls2 	= app.keeper.getItem('restricciones');
			}
			var dpw 		  		= app.keeper.getItem('dpw');
			var comentario 	  		= app.keeper.getItem('comentario');
			
			var ageyears = new Date();
			var _year =ageyears.getFullYear();
			var _mes = ageyears.getMonth() +1;
			var _dia = ageyears.getDate();
			var _yob = _year - edad;
			
			var fecha_born = _yob+"/"+ _mes +"/"+_dia;
			var born = new Date(fecha_born);
			
			/** JSON UPDATE STRUCTURE 	**/
			var json =  {
							"sexo" : genero,
							"fechaNacimiento" : _yob+"-"+ _mes +"-"+_dia,
							"perfil":{
								"fechaNacimiento" : _yob+"-"+ _mes +"-"+_dia,
								"sexo" : genero,
								"peso" : peso,
								"estatura" : estatura,
								"ejercicio" : dpw,
								"objetivo" : plan,
								"restricciones" : (restricciones_ls2 === 'undefined')?null:JSON.parse(restricciones_ls2),
								"personalidad" : coach_type
							},
							"cp": zipcode,
							"pesoDeseado": peso_ideal,
							"comentarios": comentario
						};

			var responsedata = apiRH.updatePerfil(json);
			console.log("PROFILE UPDATED! ::: "+JSON.stringify(responsedata));
			
			if(responsedata){
				app.toast("¡Estamos encontrando a tu Coach ideal!");
				/* REQUEST COACH OPTIONS */	
				var listCoach = apiRH.getCoachList();
				app.hideLoader();

				if(listCoach){

					var i = 1;
					var Name;
					var LastN;
					var short_description;
					var biografia;
					var rate_stars;
					var item = $('.initial').html();
					var coaches = [];
					var dietaKeep = null;
					var coachKeep = null;

					$.each( listCoach, function( key, value ) {
						
						$.each( value, function( key, value ) {
							
							console.log( key + " :: " + value );
							
							if (key == '_id')
								dietaKeep = (!dietaKeep || dietaKeep != value) ? value : dietaKeep;
							console.log("dietaKeep :: "+dietaKeep);

							if(key == 'coach'){	
								$.each( value, function( key, value ) {
									
									console.log( key + " ::: " + value );
									
									if (key == '_id') {
										
										var exists = false;

										for (var j = 0; j < coaches.length; j++)
											if (coaches[j] == value)
												exists = true;
											
										if (!exists) {
											coachKeep = (!coachKeep || coachKeep != value) ? value : coachKeep;
											coaches.push(value);
											$(".cslider .slide-coach:nth-of-type("+i+") img.la_foto").attr("src","https://gingerfiles.blob.core.windows.net/coaches/"+value+".png");
											$(".resena .img-frame:nth-of-type("+i+") img.la_foto").attr("src","https://gingerfiles.blob.core.windows.net/coaches/"+value+".png");
											$('.slide-coach:nth-of-type('+i+')').attr('coach', coachKeep);
											$('.slide-coach:nth-of-type('+i+')').attr('dieta_id', dietaKeep);
										}
									}
									if (key=='nombre') {
										Name = value;
									}
									if (key=='apellido') {
										LastN = value;
										var coach_name = Name +" "+LastN;
										$('.slide-coach:nth-of-type('+i+') .name.coach_name').html(coach_name);
										$('.slide-coach:nth-of-type('+i+')').attr("data-name",coach_name);
									}
									if (key=='frase')
										$(".slide-coach:nth-of-type("+i+") p.short-descrip b").html(value);

									if (key=='bio')
										$(".slide-coach:nth-of-type("+i+") textarea.short-descrip").html(value);

									if(key == 'rating'){

										rate_stars = value;
										rate_stars = Math.round(rate_stars);
										$(".slide-coach:nth-of-type("+i+")").attr("data-rate",rate_stars);
										for (var j = 1; j <= rate_stars; j++) {
											$(".slide-coach:nth-of-type("+i+") .rate-stars img:nth-of-type("+j+")").attr("src","images/starh.svg");
										}
									}

									if (key == 'calificaciones') {

										if (value == "1") {
											$(".slide-coach:nth-of-type("+i+") div.no-review").html(value+" valoración");
										} else {
											$(".slide-coach:nth-of-type("+i+") div.no-review").html(value+" valoraciones");
										}
									}

								});																
							}
						});
						i++;
					});


					$('.slide-coach').each(function() {
						if ($(this).attr('coach') === undefined) {
						  $(this).remove();
						}
					});

					$(window).resize();

					setTimeout(function() {
						$(".pagina").hide();
						$(".pcoach1").show();
						$(".pcoach1").css("left","40px");
						$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
						app.hideLoader();
					}, 250);
					
				}
			}else{
				alert('Error: No se pudieron guardar los datos');
				app.hideLoader();
			}
		});

		/*** Back behaviour ***/
		$('.back').click( function(){

			if( $('.aboutyou').is(':visible') )
				app.render_register_mail('crear.html');
			
			if($('.objetive').is(':visible')){
				$('.objetive').animate({opacity:"0",left:"40px"}, 200);
				$('.bgre').removeClass('active');
				$('.bpur').addClass('active');
				setTimeout(function() {
					$(".pagina").hide();
					$(".aboutyou").show();
					$(".aboutyou").animate({opacity:"1",left:"0px"}, 200);
				}, 250);

			} else if($('.exercise').is(':visible')){
				$('.exercise').animate({opacity:"0",left:"40px"}, 200);
				$('.bred').removeClass('active');
				$('.bgre').addClass('active');
				setTimeout(function() {
					$(".pagina").hide();
					$(".objetive").show();
					$(".objetive").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			} else if($('.restric').is(':visible')){
				$('.restric').animate({opacity:"0",left:"40px"}, 200);
				$('.borg').removeClass('active');
				$('.bred').addClass('active');
				setTimeout(function() {
					$(".pagina").hide();
					$(".exercise").show();
					$(".exercise").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			} else if($('.pcoach1').is(':visible')){
				$('.pcoach1').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').removeClass('active');
				$('.borg').addClass('active');
				setTimeout(function() {
					$(".pagina").hide();
					$(".restric").show();
					$(".restric").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			} else if($('.resena').is(':visible')){
				$('.resena').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
					$(".pagina").hide();
					$(".pcoach1").show();
					$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			} else if($('.discount').is(':visible')){
				$('.discount').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').addClass('active');
				setTimeout(function() {
					$(".pagina").hide();
					$(".pcoach1").show();
					$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			} else if($('.conekta').is(':visible')){
				$('.conekta').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
					$(".pagina").hide();
					$(".discount").show();
					$(".discount").animate({opacity:"1",left:"0px"}, 200);
				}, 250);
			}
		});

		$('.siono').click(function() {
			$('.siono').removeClass('active');
			$(this).addClass('active');
			if ($(this).hasClass('yes')) {
				$('.comment_pop').show();
				setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
				$('#comentar').focus();
			} else {
				$('.the-comment').html("");
				$('.the-comment').hide();
				$('.little-comment').show();
			}

		});

		$('#send_register_cmt').click(function() {
			
			$('.comment_pop').removeClass('active');
			setTimeout( function() {
				$('.comment_pop').hide(); 
			}, 500);
			
			$('.the-comment').html( $('#comentar').val() )
							  .show();

			$('li.comentario').show();
			
			var _cmt = $('#comentar').val();
			app.keeper.setItem( 'comentario', _cmt );

			$('.comment_pop textarea').focus();
		
			if( _cmt != "" ){
				app.toast("Tu comentario se ha agregado");
				$('#next_step_four').attr('src', 'images/enter.svg');
				$('#next_step_four').css('margin-left', '-25px');
			} else{
				app.toast("Comentario vacío");
				$('#next_step_four').attr('src', 'images/saltar.svg');
				$('#next_step_four').css('margin-left', '-65px');
			}
		});

		/** Close one option modal (Ok modal) **/
		$('body').on('click', '.modal_ok', function(e){
			e.preventDefault();
			console.log("Clicked ok");
			$(this).closest('.modal').hide().removeClass('active');
		});

		/** Close one option modal (Ok modal) **/
		$('body').on('click', '.modal_ok_cancel .cancel', function(e){
			e.preventDefault();
			console.log("Clicked cancel");
			$(this).closest('.modal').hide().removeClass('active');
		});

		$('#next_step_five').click(function(){
			console.log('click step five');
			if(!$('.overscreen4').is(':visible')){
				$('.overscreen4').show();
				setTimeout(function() {$('.overscreen4').addClass('active');}, 200);
			} else {
				$('.overscreen4').removeClass('active');
				setTimeout(function() {$('.overscreen4').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');
		});

		$('.bt-review').click(function(){

			$('.pcoach1').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
				$(".pagina").hide();
				$(".resena").show();
				$(".resena").css("left","40px");
				$(".resena").animate({opacity:"1",left:"0px"}, 200);
			}, 250);

			// if( $('div').hasClass('resena') ){
				var _aidi = $(this).parent().parent().attr('coach');
				var _co_name = $(this).parent().parent().attr('data-name');
				var _co_rate = $(this).parent().parent().attr('data-rate');
				var _co_rate = Math.round(_co_rate);
				$("img.la_foto_resena").attr("src","https://gingerfiles.blob.core.windows.net/coaches/"+_aidi+".png");
				$('.name_on').html(_co_name);

				for (var j = 1; j <= _co_rate; j++) {
					$(".rate-stars_inner img:nth-of-type("+j+")").attr("src","images/starh.svg");
				}
			// }

			var resenas = apiRH.getResenas(_aidi);

			console.log(resenas);
			
			$('.insert_stars').empty();
			var count = resenas.length;
			if(count){
				var verb = (count == 1) ? " valoración" : " valoraciones";
				$('.resena.pagina .no-review').html(count+verb);
			}else{
				$('.resena.pagina .no-review').html("sin valoraciones");
			}
			$.each(resenas, function(key, value){
				// console.log(key + ' :::: ' + JSON.stringify(value));
				var html_comment 	= "";
				var html_stars 		= "";
				$.each(value, function(inner_key, inner_value){
					// console.log(inner_key + ' ::--:: ' + JSON.stringify(inner_value));
					// TODO: Replace with template		
					if(inner_key == 'comment')
						html_comment = inner_value;

					if(inner_key == 'calificacion'){
						for (var i = 0; i < inner_value; i++)
							html_stars += '<img src="images/star.svg">';				
					}
				});
				$('.insert_stars').append('<div class="nombre_resena"><div class="rate-stars2">'+html_stars+'</div></div><div class="resena_cont">'+html_comment+'</div>');
			});
		});//END BT-REVIEW

		$('#aceptar').click(function(){

			$('#blur').toggleClass('blurred');
			
			/* JSON COACH SELECTED	**/
			console.log('Select coach');

			var coach = $('#next_step_five').attr('coach');
			var dieta = $('#next_step_five').attr('dieta_id');

			var json = {"coach" : coach,"dieta" : dieta};

			console.log(json);
			//Request update data
			var responsedata = apiRH.updatePerfil(json);
			console.log(responsedata);

			$('.bio').animate({opacity:"0",left:"-40px"}, 200);
			$('.byel').removeClass('active');
			setTimeout(function() {
				$(".pagina").hide();
				$(".discount").show();
				$(".discount").css("left","40px");
				$(".discount").animate({opacity:"1",left:"0px"}, 200);
			}, 250);
			$('.overscreen4').hide();
		});

		$('#cancelar').click(function(){
			$('#blur').toggleClass('blurred');
			$('.overscreen4').hide();
			$('.alert_tracking').hide();

		});

		$('.la_img').click(function(){
			if(!$('.overscreen5').is(':visible') ){
				$('.overscreen5').show();
			setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
			} else {
				$('.overscreen5').removeClass('active');
				setTimeout(function() {$('.overscreen5').hide();}, 800);
			}
			$('#blur').toggleClass('blurred');
		});

		$('#info_pay').click(function(){
			$('#blur').toggleClass('blurred');
			$('.overscreen5').hide();
		})


		$('.btn-pago').click(function(){
			$('.discount').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
				$(".pagina").hide();
				$(".conekta").show();
				$(".conekta").css("left","40px");
				$(".conekta").animate({opacity:"1",left:"0px"}, 200);
			}, 250);
		});


		/* SWIPE COACH */	
		var IMG_WIDTH = ancho*0.8125;
		var currentImg = 0;
		var maxImages = tamano;
		var speed = 500;

		var imgs;

		var swipeOptions = { triggerOnTouchEnd: true, swipeStatus: swipeStatus, allowPageScroll: "vertical", threshold: 75 };

		$(function createSwipe () {

			imgs = $(".cslider");
			imgs.swipe(swipeOptions);
		});//END createSwipe

		function swipeStatus(event, phase, direction, distance) {
			if (phase == "move" && (direction == "left" || direction == "right")) {
				
				var duration = 0;
				if (direction == "left") {
					scrollImages((IMG_WIDTH * currentImg) + distance, duration);
					
				} else if (direction == "right") {
					scrollImages((IMG_WIDTH * currentImg) - distance, duration);
				}

			} else if (phase == "cancel") {
				scrollImages(IMG_WIDTH * currentImg, speed);
			} else if (phase == "end") {
				if (direction == "right") {
					previousImage();
					$('#next_step_five').attr('coach', $('.slide-coach:nth-of-type('+(currentImg+1)+')').attr('coach'));
					$('#next_step_five').attr('dieta_id', $('.slide-coach:nth-of-type('+(currentImg+1)+')').attr('dieta_id'));
				} else if (direction == "left") {
					nextImage();
					$('#next_step_five').attr('coach', $('.slide-coach:nth-of-type('+(currentImg+1)+')').attr('coach'));
					$('#next_step_five').attr('dieta_id', $('.slide-coach:nth-of-type('+(currentImg+1)+')').attr('dieta_id'));
				}
			}
		} //end swipeStatus

		function previousImage() {
			currentImg = Math.max(currentImg - 1, 0);
			scrollImages(IMG_WIDTH * currentImg, speed);
		}//end previousImage

		function nextImage() {
			currentImg = Math.min(currentImg + 1, maxImages - 1);
			scrollImages(IMG_WIDTH * currentImg, speed);
		}//end nextImage

		function scrollImages(distance, duration) {
			imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");
			var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
			imgs.css("transform", "translate(" + value + "px,0)");
		}//end scrollImages

		$('#next_step_five').attr('coach', $('.slide-coach:nth-of-type(1)').attr('coach'));
		$('#next_step_five').attr('dieta_id', $('.slide-coach:nth-of-type(1)').attr('dieta_id'));
		

		var labelID;

		$('label').click(function() {
		   labelID = 'input[name="'+$(this).attr('for')+'"]';
		   $(labelID).focus();
		});

		$("input").focus(function() {
			labelID = 'label[for="'+$(this).attr('name')+'"]';
			$(labelID).addClass('focused');
		});


		/* PAGO CON TARJETA DE CREDITO*/
		$('#send_fPago').on('click', function(){

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
						"number"	: t_card,
						"name"		: t_nombre,
						"exp_year"	: t_ano,
						"exp_month"	: t_mes,
						"cvc"		: t_cvc
					  }
				};

				successResponseHandler = function(token){

					var response = apiRH.makePayment(token.id);
					// Funcion de mensaje de bienvenida
					if(response){
					
						if(!$('.overscreen6').is(':visible') ){
							$('.overscreen6').show();
						setTimeout(function() {$('.overscreen6').addClass('active');}, 200);
						} else {
							$('.overscreen6').removeClass('active');
							setTimeout(function() {$('.overscreen6').hide();}, 800);
						}
						$('#blur').toggleClass('blurred');

						$('#go_next').click(function(){
							$('.overscreen6').hide();
							$('#blur').toggleClass('blurred');
							app.render_myPlan('dieta.html');
						});
					
					}else{
						app.toast("Error al procesar tu pago");
					}
					return;
				};

				/* Después de recibir un error */

				errorResponseHandler = function(error) {
					return console.log(error.message);  //error de conectividad
					app.toast('Error al procesar tu pago, ' + error.message);
				};

				/* Tokenizar una tarjeta en Conekta */
				Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
		});


	});

}
