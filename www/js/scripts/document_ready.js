/*      _                                       _                        _       
 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
 *                                                                         |___/ 
 */
		
window.initializeEvents = function(){
	
	jQuery(document).ready(function($) {

		console.log("Initializing DocReady v0.1");
		$('body').removeClass("preventEvents");
		
		window.initHooks = function(){
			console.log("Initializing hooks");
			/* Hook soft links */
			$('.hook').on('click', function(e){
				e.preventDefault();
				app.showLoader();
				if( $(this).data('resource') == "entermode" )
					return app.render_entermode( $(this).attr('href') );
				if( $(this).data('resource') == "register" )
					return app.render_register( $(this).attr('href') );
					if( $(this).data('resource') == "register-mail" )
						return app.render_register_mail( $(this).attr('href') );
				
				if( $(this).data('resource') == "login" )
					return app.render_login( $(this).attr('href') );
					if( $(this).data('resource') == "login-mail" )
						return app.render_login_email( $(this).attr('href') );

				if( $(this).data('resource') == "my-plan" )
					return app.render_myPlan( $(this).attr('href') );
				if( $(this).data('resource') == "main-menu" )
					return app.render_mainmenu( $(this).attr('href') );
				if( $(this).data('resource') == "user-profile" )
					return app.render_settings( $(this).attr('href') );
				if( $(this).data('resource') == "change-coach" )
					return app.render_change_coach( $(this).attr('href') );
				if( $(this).data('resource') == "coming-soon" )
					return app.render_coming_soon( $(this).attr('href') );

				e.stopPropagation();
			});
		};
		initHooks();

		//-----------------------------
		//
		// Keyboard events for iOS
		//
		//-----------------------------
		console.log("Initializing keyboard events");
		var initialViewHeight = document.documentElement.clientHeight;
		var calculate = null;

		/*** Fix keyboard defaults ***/
		if(typeof Keyboard != 'undefined'){
			console.log("Keyboard not undefined");
			Keyboard.disableScrollingInShrinkView(false);
			Keyboard.shrinkView(false);
		}

		if($('#container').hasClass("chat")){
			/*** Fix keyboard chat specifics ***/
			if(typeof Keyboard != 'undefined'){
				Keyboard.disableScrollingInShrinkView(true);
				Keyboard.shrinkView(true);
			}
		}

		var fixWithKeyboard = function(){
			$('body').addClass("openkeyboard");
			if($('#container').hasClass("chat")){

				calculate = (!calculate) ? document.documentElement.clientHeight : calculate;			
				$('#container').animate({ height: calculate+"px"}, 240, 'swing', function(){
					$('.escribir').slideToggle('fast');
				});
				return;
			}

		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			
			$('.escribir').hide();
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			window.openKeyboard = false;
			$('body').removeClass("openkeyboard");
			$('body').scrollTop($('#messages-list').prop('scrollHeight'));
			$('.escribir').css('bottom', 0);
		});

		/*** Initializing chat api if not already did ***/
		if(!chatCore.isInitialized && loggedIn)
			setTimeout(function(){
				chatCore.init(_user);
			}, 420);


		/*** Window load and resize ***/
		$(window).on("load resize",function(){ 

			var alto = document.documentElement.clientHeight;
			var ancho = document.documentElement.clientWidth;
			var tamano = $('.slide-coach').length;
			var csld = (tamano*ancho*0.8125)+(ancho*0.09375);
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

			$(".slide-coach").css("width",ancho*0.8125);
			$(".slide-coach:first-of-type").css("margin-left",ancho*0.09375);
			$(".cslider").css("width",csld);

			// app.hideLoader();
		});/*** END load and resize ***/




		if($('#login_form').length){
			window.init_scripts.push("login_validate");
			$('#login_form').validate({
				rules:{
					mail :{
						required : true,
						email : true
					},
					pass :"required"
				},
				messages:{
					mail : {
						required: "Debes proporcionar un correo",
						email: "Proporciona un correo válido"
					},
					pass : "Este campo es requerido para ingresar"
				},
				submitHandler:function( form, event ){
					event.preventDefault();
					var data_login		= app.getFormData(form);
					var login_response 	= apiRH.loginNative(data_login);

					if(login_response){

						apiRH.headers['X-ZUMO-AUTH'] = login_response;
						var userInfo = apiRH.getInfoUser();

						if(userInfo){
							window._user = (userInfo) ? userInfo : null;
							app.keeper.setItem( 'user', JSON.stringify(_user) );
							var verified = app.keeper.getItem( 'email_verification' );
							if( typeof _user.customerId !== undefined && _user.customerId !== 'not_set' ){
								// TODO: Load interface via switch method
								app.keeper.setItem( 'email_verification', true );
								return app.render_myPlan('dieta.html');
							} else if(!verified){
								return app.render_validate_code('code.html');
							}else{
								return app.render_initial_record('record.html');
							} 	
						}

					}else{
						app.toast("Ocurrió un error, por favor revisa que tus datos sean correctos.")
					}
					return app.hideLoader();
				}
			});

		} // END login_form

		/* Log Out from the API */
		$('#logout').on('click', function(e){
			/* Requesting logout from server */
			if(!$('.overscreen2').is(':visible') ){
				$('.overscreen2').show();
			setTimeout(function() { $('.overscreen2').addClass('active'); }, 200);
			} else {
				$('.overscreen2').removeClass('active');
				setTimeout(function() { $('.overscreen2').hide(); }, 800);
			}
			$('#blur').toggleClass('blurred');
			return;
		});

		$('.logout').click(function(){
			app.keeper.clear();
			$('#blur').toggleClass('blurred');
			return app.render_entermode('inicio.html');
		});

		$('.logout_cancel').click(function(){
			$('.overscreen2').hide();
			$('#blur').toggleClass('blurred');
			return;
		});

		$('.back_with_logout').click(function(e){
			return back_with_logout(e);
		});

		/*  Create a new account the Goog ol' fashion way  */
		if($('#create_account').length){
			window.init_scripts.push("register_validate");
			$('#create_account').validate({
				rules: {
					user: "required",
					mail: {
							required: true,
							email: true
						},
					pass: {
						required: true,
						minlength: 7
					},
					cpass: {
						required: true,
						equalTo:"#pass"
					},
				},
				messages: {
					user: "Debes proporcionar un nombre de usuario",
					mail: {
							required: "Debes proporcionar un correo",
							email: "Por favor proporciona un correo válido"
					},
					pass: {
						required :"Debes registrar una contraseña",
						minlength :"Tu contraseña debe contener al menos siete caracteres"
					},
					cpass: "Las contraseñas que proporcionaste no coinciden"
				},
				submitHandler: function(form, event){
					event.preventDefault();
					app.showLoader();
					var data_login  	= app.getFormData(form);

					/* stores user name */
					app.keeper.setItem('email_verification', false);
					app.keeper.setItem('user_name', data_login.user);
					app.keeper.setItem('user_last_name', data_login.last_name);
					var login_response 	= apiRH.registerNative(data_login);

					if( login_response ){
						
						apiRH.headers['X-ZUMO-AUTH'] = login_response;
						var userInfo = apiRH.getInfoUser();
						if(userInfo){
							window._user = (userInfo) ? userInfo : null;
							console.log("_user");
							console.log(_user);
							app.keeper.setItem( 'user', JSON.stringify(_user) );
							var verified = app.keeper.getItem( 'email_verification' );
							console.log("verified :: "+ verified);
							if( typeof _user.customerId !== undefined && _user.customerId !== 'not_set' ){
								// TODO: Load interface via switch method
								app.keeper.setItem( 'email_verification', true );
								console.log("render plan");
								return app.render_myPlan('dieta.html');
							} else if(!verified){
								console.log("render validation code");
								return app.render_code('code.html');
							}else{
								console.log("render initial record");
								return app.render_initial_record('record.html');
							} 	
						}
						
					}else{
						app.toast("Lo sentimos, el email o usuario ya existe.")
					}

				}
			});
		} // END create_account

		/*  Email code validation  */
		if($('#code_form').length){
			window.init_scripts.push("code_validate");
			$('#code_form').validate({
				rules:{
					code:"required"
				},
				messages:{
					code:"Proporciona tu código de activación"
				},
				submitHandler:function(form, event){

					setTimeout(function(){
						app.showLoader();
					}, 420);
					event.preventDefault();

					var form_data 	= app.getFormData(form);
					var res 		= apiRH.validateRegistrationCode(form_data.code, app.keeper.mail);
					if( res.length ){
						app.toast("Tu código ha sido validado correctamente!");
						app.keeper.setItem('email_verification', true);
						return app.render_initial_record();
					} else {

						$('.overscreen7').show().addClass('active');
						$('#blur').toggleClass('blurred');
						$('#_alert_validate').on('click', function(){
							$('.overscreen7').hide().removeClass('active');
							$('#blur').toggleClass('blurred');
						});
						setTimeout(function(){
							app.hideLoader();
						}, 420);
						return;
					}

				}
			});
		}
			

		/***************************/
		/*  Initial Record events  */
		/***************************/
		if( $('.view').hasClass('initialRecord') && $.inArray( 'initial_record', window.init_scripts ) == -1 )
			return initializeRecordEvents();
		
		
		function markConsumed(){
			var date 		= new Date();
			var firstDay 	= new Date(date.getFullYear(), date.getMonth()+1, 1);
			var lastDay 	= new Date(date.getFullYear(), date.getMonth()+2, 0);
			var response 	= apiRH.getConsumed( firstDay.getFullYear()+'-'+firstDay.getMonth()+'-'+firstDay.getDate(), 
												 lastDay.getFullYear()+'-'+lastDay.getMonth()+'-'+lastDay.getDate() );

			if(!response.consumos){
				app.hideLoader();
			}else{
				$.each(response, function(key, value){
					
					// console.log(key + '::::' + value);

					if(key == 'consumos')

						$.each(value, function(key, value){
							//Fechas
							// console.log(key + ':::::::.' + value);

							var fecha =	key;
							var commentFlag = false;

							$.each(value, function(key, value){
								// console.log(key + ':::::::::::' + value);

								if(key == 'desayuno'){

									$.each(value, function(key, value){
										var platillo = '';
										$.each(value, function(key, value){
											// console.log(key + '------' + value );	

											if(key == 'plato'){
												platillo = value;
											}
											
											if(key == 'consumido'){
												// console.log('consumido::: ' + value);
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
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}

										});

										if(!commentFlag){
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('div').find('h6:nth-of-type(2)').remove();
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.desayuno [data="'+platillo+'"]').find('div').find('.plat-comentario').remove();
										}
										commentFlag = false;
									});
								}

								if(key == 'snack1'){
									// console.log('snack1');
									$.each(value, function(key, value){
										var platillo = '';
										var commentFlag = false;
										$.each(value, function(key, value){
											// console.log(key + '------' + value );	

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
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
											
										});

										if(!commentFlag){
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('div').find('h6:nth-of-type(2)').remove();
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack1 [data="'+platillo+'"]').find('div').find('.plat-comentario').remove();
										}
										commentFlag = false;
									});
								}

								if(key == 'comida'){
									// console.log('comida');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											// console.log(key + '------' + value );	

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
												commentFlag = true;
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
										});
										if(!commentFlag){
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('div').find('h6:nth-of-type(2)').remove();
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.comida [data="'+platillo+'"]').find('div').find('.plat-comentario').remove();
										}
										commentFlag = false;
									});
								}

								if(key == 'snack2'){
									// console.log('snack2');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											// console.log(key + '------' + value );	

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
												commentFlag = true;
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
										});
										if(!commentFlag){
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('div').find('h6:nth-of-type(2)').remove();
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.snack2 [data="'+platillo+'"]').find('div').find('.plat-comentario').remove();
										}
										commentFlag = false;
									});
								}

								if(key == 'cena'){
									// console.log('cena');
									$.each(value, function(key, value){

										var platillo = '';
										$.each(value, function(key, value){
											// console.log(key + '------' + value );	

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
												$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('div').find('p.plat-comentario').html(value);
											}
										});
										if(!commentFlag){
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('div').find('h6:nth-of-type(2)').remove();
											$('ul#toda_la_dieta').find('*[data="' + fecha+ '"]').find('div').find('div.cena [data="'+platillo+'"]').find('div').find('.plat-comentario').remove();
										}
										commentFlag = false;
									});
								}

							});
						});
				});
			}
		}

		/********************************/
		/*  Initialize calendar/diet    */
		/********************************/
		if( $('.view').hasClass('dieta') ){
			
			app.showLoader();

			initializeCalendar();
			var dietId = app.keeper.getItem('dietaId');
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

			console.log(' --- Setting up diet and dishes ---');

			var i = 0;
			$.each( dieta.platillos, function( key, value ) {

				losplatos[i] = [];
				$.each( value, function( key, value ) {

					if (key=="_id")
						losplatos[i][0]=value;

					if (key=="descripcion")
						losplatos[i][1]=value;

					if (key=="receta")
						losplatos[i][2]=value;

					/** Add ingredients if any **/
					if (key=="ingredientes") {

						var ing = '';
						if(value.length > 0){

							$.each(value, function(key, value){
								
								if(value._id != null)
									ing = ing + value._id.nombre;
							});
						}else{
							// console.log('sin ingredientes');
						}
						losplatos[i][3] = ing;
					}
				});
				i++;
			});

			var loscomentarios = [];
			var i=0;
			var j=0;

			$.each( dieta.comentarios, function( key, value ) {
				loscomentarios[i] = [];
				j=0;
				$.each( value, function( key, value ) {
					loscomentarios[i][j]=value;
					j++;
				});
				i++;
			});

			for (var i = 0; i < losplatos.length; i++) {

				losplatos[i][4]="";
				for (var j = 0; j < loscomentarios.length; j++) {
					if (losplatos[i][0]==loscomentarios[j][2]&&losplatos[i][4]=="") {
						losplatos[i][4]=loscomentarios[j][1];
					}
				}
			}

			var dieta_array = [];
			var dia_prueba=0;
			var dias = [];
			var _restricciones = _user.perfil.restricciones;
			console.log("restricciones ::: "+_restricciones);
			$.each( dieta.estructura, function( day_key, day_structure ) {
				
				if(day_key=="domingo"){dia_prueba=1;} else if (day_key=="lunes") {dia_prueba=2;} else if (day_key=="martes") {dia_prueba=3;} else if (day_key=="miercoles") {dia_prueba=4;} else if (day_key=="jueves") {dia_prueba=5;} else if (day_key=="viernes") {dia_prueba=6;} else if (day_key=="sabado") {dia_prueba=7;}
				var estoyen = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';
				
				$.each( day_structure, function( key, value ) {
					// desayuno, snack, comida,...
					var dentrode = estoyen+'.acc-content.'+key+' ';
					var i = 1;
					$.each( value, function( key, value ) {
						// tiempos (1,2,3..)
						var masadentro = dentrode+'div.platillo:nth-of-type('+i+')';
						i++;	
						$.each( value, function( key, value ) {
							
							if ( key == "b" && _restricciones && _restricciones != '' ) {
								console.log("Vegan option");
								/***** Vegan option (Restrictions applied) *****/
								$.each( value, function( key, value ) {

									if (key == "platillo") {

										for (var i = 0; i < losplatos.length; i++) {
											
											if (value == losplatos[i][0]) {
												
												$(masadentro).attr("data", losplatos[i][0]);
												$(masadentro).attr("platillo", i);
												$(masadentro+' h5').html(losplatos[i][1]);
												
												//Receta
												if (losplatos[i][2] != "") {
													$(masadentro+' p.receta').html(losplatos[i][2]);
												} else {
													$(masadentro+' p.receta').hide();
												}
												
												//Comentarios
												if (losplatos[i][4] != "") {
													$(masadentro+' p.comentario').html(losplatos[i][4]);
													//Comentarios del usuario
													$('.plat-comentario').html('');
												} else {
													$(masadentro+' p.comentario').hide();
												}

												if (losplatos[i][3] != "ingredientes") {
													
													$.each(losplatos[i][3], function(key, value){

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

								/***** Non vegan option *****/
								$.each( value, function( key, value ) {

									if ( key == "platillo" ) {
										for (var i = 0; i < losplatos.length; i++) {
											if (value==losplatos[i][0]) {
												// console.log($(masadentro));
												$(masadentro).attr("data", losplatos[i][0]);
												$(masadentro).attr("platillo", i);
												$(masadentro+' h5').html(losplatos[i][1]);
												if (losplatos[i][2] != "") {
													$(masadentro+' p.receta').html(losplatos[i][2]);
												} else {
													$(masadentro+'p.receta').hide();
												}
												if (losplatos[i][4] != "") {
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
				setTimeout(markConsumed, 1400);
				$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});
				$(window).resize();
			}); // END DIETA ESTRUCTURA


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
					console.log(result);
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
					console.log(result);
					//Llamar a consumidos
					//window.getConsumed();
				}

			});

			$('svg.commenn').click(function() {
				console.log('click');
				$('#comentar').val('');
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

				$('.comment_pop').attr('idPlatillo', 	idPlatillo)
								 .attr('nPlatillo', 	nPlatillo)
								 .attr('cosumoFecha', 	cosumoFecha)
								 .attr('comida', 		comida);

				setTimeout(function() { $('.comment_pop').addClass('active'); }, 200);
				
			});

			$('#send_dish_comment').click(function() {
				console.log("Send dish comments");
				$('.comment_pop').removeClass('active');
				setTimeout(function() {$('.comment_pop').hide();}, 500);
				// $('.comment_pop textarea').focus();
				var consumed_params = {
					"plato" 	: $('.comment_pop').attr('idplatillo'), 
					"fecha" 	: $('.comment_pop').attr('cosumoFecha'),
					"comida"  	: $('.comment_pop').attr('comida'),
					"platillo"	: $('.comment_pop').attr('nPlatillo'),
					"comment" 	: $('#comentar').val()
				};
				
				var result = apiRH.makeCosume(consumed_params);
				if(result)
					return app.toast("Tu comentario se ha agregado correctamente");
				return app.toast("Hubo un error insertando tu comentario, intenta nuevamente.");
			});


			$('.di-options a').click(function() {
				$('.overscreen2').removeClass('active');
				setTimeout(function() {$('.overscreen2').hide();}, 500);
			});

			$('.ov-filler2').click(function() {
				$('.overscreen2').removeClass('active');
				setTimeout(function() {$('.overscreen2').hide();}, 500);
			});

			
			$('.cancel').on('click', function(){
				$('.comment_pop').hide();
			});

			// Include this chunk on every page with footer menu
			$('.centro').click(function() {
				if(!$('.overscreen').is(':visible')){
					$('.overscreen').show();
					setTimeout(function() {$('.overscreen').addClass('active');}, 200);
				} else {
					$('.overscreen').removeClass('active');
					setTimeout(function() {$('.overscreen').hide();}, 800);
				}
				// $('#blur').toggleClass('blurred');
				$('a.centro img').toggleClass('onn');
			});

			$('.ov-filler').click(function() {
				$('.overscreen').removeClass('active');
				setTimeout(function() {$('.overscreen').hide();}, 800);
				// $('#blur').removeClass('blurred');
				$('a.centro img').removeClass('onn');
			});

			// Open more drawer (comments and ingredients)
			$('.open_more_drawer').click(function() {
				$(this).parent().find('.extra-info').toggle();
				$(this).toggleClass('presionado');
			});
			
			return app.hideLoader();
			
		} /*** END BODY CLASS DIETA ***/


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

		} /*** END BODY CLASS CHAT ***/

		$('.add_picture').click(function (e){
			app.get_file_from_device('profile', 'camera');
		});


		/*** Add water module ***/
		if($('body').hasClass('water') ){

			var date = new Date();
			var date_today = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
			var agua_local = parseFloat(app.keeper.getItem('agua'));
			var agua_lastSaved = app.keeper.getItem('agua_lastSaved');
			var agua = (agua_lastSaved != date_today ) ? 0 : agua_local;

			/*** Setting initial value if progress ***/
			$('input[name="litros"]').val(agua);
			$('.vaso p span').text(agua);

			$("#agua-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#agua-up").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
					agua = Number($('.vaso p span').html());
					agua = agua+0.25;

					if(agua == 10.00)
						agua = 10.00;	

					$('.vaso p span').html(agua.toFixed(2));
					$('input[name="litros"]').attr("value", agua);
					return false;
				}, apiRH.timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$("#agua-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#agua-dw").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
					agua = Number($('.vaso p span').html());
					if (agua>0) {
						agua = agua - 0.25;
						$('.vaso p span').html(agua.toFixed(2));
						$('input[name="litros"]').attr("value", agua);
					}
				}, apiRH.timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);


			/*
				app.keeper AGUA
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
				agua_local = parseFloat(app.keeper.getItem('agua'));
				agua_lastSaved = app.keeper.getItem('agua_lastSaved');
				agua = parseFloat($('input[name="litros"]').val());

				app.keeper.setItem('agua_lastSaved', date_today );
				app.keeper.setItem('agua', agua );

				var agua = app.keeper.getItem('agua');
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


		if( $('body').hasClass('mood') ){

			var valor = 0;
			var animo = [ 'increible', 'feliz', 'bien', 'regular', 'triste', 'cansado', 'hambriento', 'frustrado', 'motivado' ];

			$("#animo-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#animo-up").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
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

				}, apiRH.timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$("#animo-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#animo-dw").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
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

				}, apiRH.timer);
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

				app.keeper.setItem('track_animo', $('#track_animo').val() );

				var track_animo = app.keeper.getItem('track_animo');
					console.log(track_animo);

				if(app.keeper.getItem('track_animo') == ''){
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
				if(app.keeper.getItem('track_animo') >= 0){
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

			$(window).resize();

		} /*** END mood ***/



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
				app.keeper EJERCICIO / DURACION / INTENSIDAD
			 */
			$('#add_ejercicio').on('click', function(){

				app.keeper.setItem('track_ejercicio_type', 		$('#ejercicio_type').val() );
				app.keeper.setItem('track_ejercicio_duration',	$('#duracion').val() );
				app.keeper.setItem('track_ejercicio_intensidad', $('#intensidad').val() );

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
				
				var intensidad  = app.keeper.getItem('track_ejercicio_intensidad');
				var type 		= app.keeper.getItem('track_ejercicio_type');
				var duracion	= app.keeper.getItem('track_ejercicio_duration');
				
				var responsedata = apiRH.tracking(type, duracion);

				if(responsedata){
					app.toast("Se ha guardado tu progreso correctamente")
					return app.render_myPlan('dieta.html');
				}else{
					app.toast('error al insertar datos ');
				}
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});

			$(window).resize();
			app.hideLoader();

		} /*** END exercise ***/

		if( $('body').hasClass('weight') ){

			var r_peso;
			var usr_peso;
			var response = app.keeper.getItem('user');
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


			$('#add_peso').on('click', function(){
				app.keeper.setItem('track_peso', $('input[name="track_peso"]').val() );
				
				var track_peso = app.keeper.getItem('track_peso');
				
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

		}/*** END weight ***/


		if( $('.view').hasClass('user-profile-update') ) {

			var info_profile =  {
									nombre_coach 	: app.keeper.getItem('nombre_coach'),
									apellido_coach 	: app.keeper.getItem('apellido_coach'),
									nombre_coach 	: app.keeper.getItem('nombre_coach'),
									sexo 			: _user.perfil.sexo,
									edad 			: _user.perfil.edad,
									cp 				: _user.perfil.cp,
								};
			var nombre_coach	= app.keeper.getItem('nombre_coach');
			var apellido_coach	= app.keeper.getItem('apellido_coach');
			var sexo 			= _user.perfil.sexo;
			var edad 			= _user.perfil.fechaNacimiento;
			var cp 	 			= _user.cp;
			var estatura 		= _user.perfil.estatura;
			var peso 			= _user.perfil.peso;
			var ideal 			= _user.pesoDeseado;
			var coach_type 		= _user.perfil.personalidad;
			var frecuencia 		= _user.perfil.ejercicio;
			var restricciones 	= _user.perfil.restricciones;
			var plan 			= _user.perfil.objetivo;
			var comentario 		= _user.comentarios;
			var coach_rate		= app.keeper.getItem('coach_rate');
			var coach_status	= app.keeper.getItem('coach_status');
			var msg_ch_coach	= app.keeper.getItem('msg_ch_coach');
			app.keeper.setItem('restricciones', _user.perfil.restricciones);

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
			
			$('.profile.circle-frame').find('img').attr('src', app.keeper.getItem('avatar') + '?type=large');

			// $('.cpur').html(nombre +" "+ apellido);
			$('.edit-profile span').html(nombre +" "+ apellido);

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


			var suma = parseInt(plan) + 1;
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
				$('#restricciones_perfil').html("Ninguna");
			}else{

				var restricciones_cat = window.catalogues.restricciones;					
				$('#restricciones_perfil').text("");
				if(restricciones){
					for ( var i = 0; i < restricciones.length; i++ ) {
						var separator = ", ";
						if(i == restricciones.length - 1)
							separator = "";

						$('#restricciones_perfil').append(restricciones_cat[restricciones[i]] + separator);
					};
				}else{
					$('#restricciones_perfil').html("Ninguna");
				}
			}


			$('#age').css('left', gridag*(_edad_calc-minval_age));
			$('#age-filler').css('width', (gridag*(_edad_calc-minval_age))+20);

			$('#ejercicio').css('left', gridej*(frecuencia-minval_eje));
			$('#ejercicio-filler').css('width', (gridej*(frecuencia-minval_eje))+20);
			
			console.log(restricciones);

			if(restricciones === undefined || restricciones == null || restricciones == ""){
				console.log('está Indefinido');
			}else{

				for (var i = 0; i < _user.perfil.restricciones.length; i++) {
					
					switch(_user.perfil.restricciones[i]){
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
					_user.perfil.restricciones[i]++;
					$('.tipo_restric .re-option:nth-of-type('+_user.perfil.restricciones[i]+')').addClass('active');
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


			$('#confirm_coach_change').click(function(){
					
					var genero 				= $('#update_sexo').val();
					app.keeper.setItem( 'edad', $('#edad_value').val() );
					var edad 				= $('#edad_value').val();
					var zipcode 			= $('input[name="zipcode"]').val();
					var estatura 			= $('input[name="estatura"]').val();
					var peso 				= $('input[name="peso"]').val();
					var peso_ideal 			= $('input[name="ideal"]').val();
					var coach_type 			= $('#coach_type').val();
					var dpw 				= $('#days_per_week').val();
					var comentario 			= $('.the-comment').html();
					var plan 				= $('#plan').val();
					var restricciones 		= app.keeper.getItem('restricciones');
					var postal 				= $('input[name="zipcode"]').val();
					
					/*calcula fecha de naciemiento a partr de la edad del cliente*/
					var ageyears = new Date();
					var _year =ageyears.getFullYear();
					var _mes = ageyears.getMonth() +1;
					var _dia = ageyears.getDate();
					var _yob = _year - edad;
					var fecha_born = _yob+"/"+ _mes +"/"+_dia;
					var born = new Date(fecha_born);
					var manda_restricciones;

					if (restricciones.length < 0) {
						restricciones = [];
					} else {
						restricciones = restricciones;
					}

					var user_updated = {
											"sexo" 				: genero,
											"fechaNacimiento" 	: _yob+"-"+ _mes +"-"+_dia,
											"perfil"			: {
																	"fechaNacimiento" : _yob+"-"+ _mes +"-"+_dia,
																	"sexo" : genero,
																	"peso" : peso,
																	"estatura" : estatura,
																	"ejercicio" : dpw,
																	"objetivo" : plan,
																	"restricciones" :(restricciones.length>0||restricciones!="")?JSON.parse(restricciones):null,
																	"personalidad" : coach_type
																},
											"cp"				: zipcode,
											"pesoDeseado"		: peso_ideal,
											"comentario"		: comentario
										};

				var updated_response = apiRH.updatePerfil(user_updated);

				if(updated_response)
					return app.render_settings('userdata.html');

			});	// end click _alert_chCoach

			// $('#_cancel_chCoach').click(function(){
			// 	$('.overscreen7').hide();
			// 	$('#blur').toggleClass('blurred');
			// });

			app.hideLoader();

		} /*** END user-profile-update ***/

		
		/* Change my Coach */
		$('#send_ch_coach').on('click', function(){

			var msg = $('#espacio_comentario').val();

			if(!msg){

				if(!$('.alert_chCoach').is(':visible')){
					$('.alert_chCoach').show();
					setTimeout(function() {$('.alert_chCoach').addClass('active');}, 200);
				} else {
					$('.alert_chCoach').removeClass('active');
					setTimeout(function() {$('.alert_chCoach').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');
			}else{

				app.keeper.setItem('msg_ch_coach', msg);
				app.keeper.setItem('coach_status', "pending_change");
				/*Agregar otro alert con la leyenda: Tu mensaje ha sido enviado para revision, nos pondremos en contacto contigo*/
				if(!$('.alert_chCoach2').is(':visible')){
					$('.alert_chCoach2').show();
					setTimeout(function() {$('.alert_chCoach2').addClass('active');}, 200);
				} else {
					$('.alert_chCoach2').removeClass('active');
					setTimeout(function() {$('.alert_chCoach2').hide();}, 800);
				}

				$('#confirm_coach_change').on('click', function(){
					$('.alert_chCoach2').hide();
					$('#blur').toggleClass('blurred');
					app.render_settings('userdata.html');
				});
				$('#blur').toggleClass('blurred');
			}
			
			$('#accept_chCoach').on('click', function(){
				$('.alert_chCoach').hide();
				$('#blur').toggleClass('blurred');
			});

		}); /*** END Change my Coach ***/

	});

}
