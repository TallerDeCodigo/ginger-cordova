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

			e.stopPropagation();
		});

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
							app.keeper.setItem( 'user', _user );
							var verified = app.keeper.getItem( 'email_verification' );

							if(userInfo.customerId !== undefined){
								// TODO: Load interface via switch method
								app.keeper.setItem( 'email_verification', true );
						 		return app.render_myPlan('dieta.html');
							} else if(!verified){
						 		return app.render_code('code.html');
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
							app.keeper.setItem( 'user', _user );
							var verified = app.keeper.getItem( 'email_verification' );

							if(userInfo.customerId !== undefined){
								// TODO: Load interface via switch method
								app.keeper.setItem( 'email_verification', true );
						 		return app.render_myPlan('dieta.html');
							} else if(!verified){
						 		return app.render_code('code.html');
						 	}else{
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

		/********************************/
		/*  Initialize calendar/diet    */
		/********************************/
		if( $('.view').hasClass('dieta') ){
			
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
			var i=0;

			console.log(' --- estructura de la dieta ---');
			console.log(dieta);
			$.each( dieta.platillos, function( key, value ) {
				console.log(dieta.platillos[i]);
				losplatos[i] = [];
				$.each( value, function( key, value ) {
					console.log(key+":::"+value);
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
								}	
							});
						}else{
							console.log('sin ingredientes');
						}
						losplatos[i][3] = ing;
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

			for (var i=0; i<losplatos.length; i++) {
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
							if ( key=="b" && app.keeper.getItem("restricciones") ) {
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
				
				setTimeout(markConsumed, 2000);

			}); // END DIETA ESTRUCTURA
			
			$('.cancel').on('click', function(){
				$('.comment_pop').hide();
			});

		} /*** END BODY CLASS DIETA ***/

	});

}
