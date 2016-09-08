   /*     _                        _     _           _   
	*    / \   _ __  _ __     ___ | |__ (_) ___  ___| |_ 
	*   / _ \ | '_ \| '_ \   / _ \| '_ \| |/ _ \/ __| __|
	*  / ___ \| |_) | |_) | | (_) | |_) | |  __/ (__| |_ 
	* /_/   \_\ .__/| .__/   \___/|_.__// |\___|\___|\__|
	*         |_|   |_|               |__/               
	*/

	var app = {
		app_context: this,
			// Application Constructor
		initialize: function() {
			this.bindEvents();
			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);

			
			var is_login = apiRH.has_token();
			var data_user = apiRH.getProfile();
			var is_client = localStorage.getItem('customerId');
			var is_current = localStorage.getItem('valido');
			console.log(is_login);

			/* IMPORTANT to set requests to be syncronous */
			/* TODO test all requests without the following code 'cause of deprecation */
			$.ajaxSetup({
				 async: false
			});

			window.loggedIn = false;
			this.ls 		= window.localStorage;
			if(is_login)
				loggedIn = true;
	
			/* Check if has a valid token */
			//var response = apiRH.has_valid_token();
			
			if(is_login){
				
				console.log('You okay, now you can start making calls');
				/* Take the user to it's timeline */
				var is_home = window.is_home;
				var is_feed = window.is_feed;
				
				if(is_home){
					console.log(is_client);
					if(is_client == 'not_set'){
						window.location.assign('feed.html');
					}else
						return;
				}else{
					
					if(is_feed){
						if(is_client == null)
							window.location.assign('feed.html');
						else	
							return;

					}else{
						console.log('Es cliente?' + is_client);
						if(is_client == null){
							window.location.assign('feed.html');
						}else{
							window.location.assign('dieta.html');
						}	

					}
				}	
				return;
			}else{
				
				// window.location.assign('feed.html');
				// return;

			}

		},
		registerHelpers : function() {
			Handlebars.registerHelper('if_eq', function(a, b, opts) {
				if (a == b) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			});
			Handlebars.registerHelper('if_module', function(a, b, opts) {
				if (a%b == 0) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			});
			return;
		},
		bindEvents: function() {
			document.addEventListener('deviceready', app.onDeviceReady, false);
			document.addEventListener('mobileinit', app.onDMobileInit, false);
		},
		onBackButton: function(){
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
		        // IOS DEVICE
		        history.go(-1);
		    } else if (userAgent.match(/Android/i)) {
		        // ANDROID DEVICE
		        navigator.app.backHistory();
		    } else {
		        // EVERY OTHER DEVICE
		        history.go(-1);
		    }
		    console.log("Back");
		},

		// deviceready Event Handler
		onDeviceReady: function() {
			app.receivedEvent('deviceready');

			/*   ___    _         _   _     
			*  / _ \  / \  _   _| |_| |__  
			* | | | |/ _ \| | | | __| '_ \ 
			* | |_| / ___ \ |_| | |_| | | |
			*  \___/_/   \_\__,_|\__|_| |_|
			*/
			try{
				OAuth.initialize('7-ipR3QS-__wrorRTpdedM8-_v8');
				console.log("Initialized Oauth");
			}
			catch(err){
				app.toast("Oauth error ocurred");
				console.log('OAuth initialize error: ' + err);
			}
			var backButtonElement = document.getElementById("backBtn");
			if(backButtonElement)
				backButtonElement.addEventListener("click", app.onBackButton, false);
			return;

			console.log(navigator.camera);
		},
		// deviceready Event Handler
		onMobileInit: function() {
			app.receivedEvent('mobileinit');
			console.log("mobileinit");
		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
			if(id == 'deviceready' && typeof navigator.splashscreen != 'undefined'){
				navigator.splashscreen.hide();
			}
		},
		getJsonCatalogue: function(catalogue_name) {
			var response = $.getJSON('compiled/catalogues/'+catalogue_name+'.json');
			return JSON.parse(response.responseText);
		},
		gatherEnvironment: function(optional_data, history_title) {
			/* Gather environment information */
			var meInfo 	= apiRH.ls.getItem('me');
			var logged 	= apiRH.ls.getItem('me.logged');
			var parsed 	= {me: JSON.parse(meInfo), logged_user: JSON.parse(logged)};
			
			if(optional_data){
				parsed['data'] = optional_data;
				//return parsed;
			}
			if(history_title)
				parsed['header_title'] = history_title;
			return parsed;

		},
		getUrlVars: function() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = value;
			});
			return vars;
		},
		/* Returns the values in a form as an associative array */
		/* IMPORTANT: Does NOT include password type fields */
		getFormData: function (selector) {
			return $(selector).serializeJSON();
		},
		isObjEmpty: function (obj) {

				if (obj == null) return true;
				if (obj.length > 0)    return false;
				if (obj.length === 0)  return true;

				for (var key in obj) 
					if (hasOwnProperty.call(obj, key)) return false;
				return true;
		},
		render_login : function(){
			app.showLoader();
			$(document).ready(function(){
				return app.hideLoader();
			});
		},
		render_settings : function(){
			return app.showLoader();
		},
		render_chat : function(){
			return app.showLoader();
		},
		render_myPlan : function(){
			return app.showLoader();
		},
		render_menu : function(){
			return app.showLoader();
		},
		render_search_results : function(search_term){
			$.getJSON(api_base_url+'content/search/'+search_term)
			 .done(function(response){
				console.log(response);
				var data 	 = app.gatherEnvironment(response);
					data.search_active = true;
					data.search_term = search_term;
					console.log(data);
				var template = Handlebars.templates['search_results'];
				$('.main').html( template(data) );
			})
			 .fail(function(error){
				console.log(error);
			 });
		},
		render_map : function(){
			
			var data = {explore_active: true};
			var map_template = Handlebars.templates['map'];
			$('.main').html( map_template(data) );
			app.showLoader();
			app.initMakersMap();
		},
		render_post : function(post_id){

			/* Send header_title for it renders history_header */
			$.getJSON(api_base_url+'content/'+post_id)
			 .done(function(response){
				var data = app.gatherEnvironment(response, "Now reading");

				var template = Handlebars.templates['post'];
				$('.main').html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			 .fail(function(error){
				console.log(error);
			 });
		},
		render_create_user : function(){

			/* Send header_title for it renders history_header */
			var data = app.gatherEnvironment(null, "Create account");
			var template = Handlebars.templates['create_account'];

			$('.main').html( template(data) );
			setTimeout(function(){
				app.hideLoader();
			}, 2000);
		},
		back_with_logout : function(event){
			var link = $(event.target).attr('href');
			localStorage.clear();
			window.location.assign(link);
			return;
		},
		get_file_from_device: function(destination, source) {
			apiRH.getFileFromDevice(destination, source);		
		},
		triggerSendAttachments: function(inputFile) {
		  // upload image
		  QB.content.createAndUpload({name: inputFile.name, file: inputFile, type:
		        inputFile.type, size: inputFile.size, 'public': false}, function(err, response){
		    if (err) {
		      console.log(err);
		    } else {
		    	// $('#image_stage').addClass("visible").append("<img src='cdvfile://"+inputFile+"' class='chat-img' >");
			    $("#progress").fadeOut(400, function() {
			        $(".input-group-btn_change_load").removeClass("visibility_hidden");
			    });
		      	var uploadedFile = response;

		      	sendMessage("[attachment]", uploadedFile.id);

		      $("input[type=file]").val('');
		    }
		  });
		},
		showLoader: function(){
			$('#spinner').show();
		},
		hideLoader: function(){
			$('#spinner').hide();
		},
		toast: function(message, bottom){
			try{
				if(!bottom){
					window.plugins.toast.showLongCenter(message);
				}else{
					window.plugins.toast.showLongBottom(message);
				}
			}
			catch(err){
				console.log('Toasting error: ' + JSON.stringify(err)); // imprime esto con un JSON vacio
				app.toast(message);
			}
			return;
		},

		/** INIT GINGER SERVICES REQUEST **/
		/* ---- TRACKING ACTIVITY USERS ---- */
		/* @param type: [ 'peso', 'animo', 'brazo', 'pierna', 'cintura', 'cadera', 'pecho', 'agua', 'ejercicio', 'recorrido', 'caminar', 'correr', 'pesas', 'cross' ],  //0..9 */

		register_activity: function(type, magnitude, client_id, coach_id){

			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					'tipo' : type,
					'magnitud' : magnitude,
					'cliente' : client_id,
					'coach' : coach_id
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});
		},  //END REGISTER ACTIVITY

		update_perfil: function(sexo,peso,pesoDeseado,personalidad,objetivo,ejercicio,edad,fechaNaciemiento,codigoPostal,comentarios,nombre,restricciones,estatura){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					'sexo' : sexo,
					'peso' : peso,
					'pesoDeseado' : pesoDeseado,
					'personalidad' : personalidad,
					'objetivo' : objetivo,
					'ejercicio' : ejercicio,
					'edad' : edad,
					'fechaNacimiento' : fechaNaciemiento,
					'cp' : codigoPostal,
					'comentarios' : comentarios,
					'nombre' : nombre,
					'restricciones' : restricciones,
					'estatura' : estatura
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});

		},//END UPDATE PERFIL
		feed_user_defaults: function(firstName,lastName,email,customerId,password,token,userId,chatId,chatPassword,coachId,coachQuickblox,dietId,user,exerciseValue,picture)
		{
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					'firstName' : firstName,
					'lastName' : lastName,
					'email' : email,
					'customerId' : customerId,
					'password' : password,
					'token' : token,
					'userId' : userId,
					'chatId' : chatId,
					'chatPassword' : chatPassword,
					'coachQuickblox' : coachQuickblox,
					'dietId' : dietId,
					'user' : user,
					'exerciseValue' : exerciseValue,
					'picture' : picture
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});
		}, //END feed_user_default

		update_platillo: function(plato, fecha, comida, platillo){
			var req = {
				method: 'post',
				url: api_base_url + 'tables/consumo/',	//definitr tabla
				headers:{
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data: {
					'plato': dishID,
					'fecha': fecha,
					'comida': comida,
					'platillo': platillo
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});
		},
		get_diet: function(dietId)
		{
			var req = {
				method : 'GET',
				url : api_base_url + 'tables/dieta/' + dietId,  //definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			$.ajax({
			  type: 'GET',
			  headers: req.headers,
			  url:  req.url,
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
			 	console.log(JSON.stringify(response));
				result = response;
				localStorage.setItem('dieta', response);
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			//console.log(result);
			return result;
		}//END GET DIET
	};

/*      _                                       _                        _       
 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
 *                                                                         |___/ 
 */
	jQuery(document).ready(function($) {
		/* 

			Create a new account the old fashioned way 

		*/
	

		if($('#create_account').length)
			$('#create_account').validate({
				rules: {
					user: "required",
					mail: {
							required: true,
							email: true
						},
					pass: {
						required:true,
						minlength:7
					},
					cpass: {
						required:true,
						equalTo:"#pass"
					},
				},
				messages: {
					user: "Debes proporcionar un nombre de usuario",
					mail: {
							required: "Debes proporcionar un correo",
							email: "Por favor proporciona un correo válido"
						},
					pass: "La contraseña debe ser de por lo menos siete caracteres",
					cpass: "Las contraseñas que proporcionaste no coinciden"
				},
				submitHandler: function(){
					console.log('creando usuario sin facebook');


					var data_login  	= app.getFormData('#create_account');

					console.log(data_login);

/*
	stores user name
*/
					localStorage.setItem('user_name', data_login.user);
					localStorage.setItem('user_last_name', data_login.last_name);

					data_login.pass 	= $('#pass').val();
					
					var responsedata 	= apiRH.registerNative(data_login);  
					
					//console.log(responsedata);						//llega hasta aqui con un valor FALSE

					if(responsedata) {
						//console.log(responsedata);
						
						apiRH.save_user_data_clientside(responsedata);
						
						window.location.assign('code.html');

						return;
					}else{
						app.toast('Lo sentimos, el nombre de usuario ya existe.'); //dispara el toast con el mensaje.
						//e.preventDefault();
					}
				}
			});

		/* Log Out from the API */
		$('#logout').on('click', function(e){
			/* Requesting logout from server */
			//var response = apiRH.logOut({user_login : user, request_token : apiRH.get_request_token() });
			//if(response.success){
				if(!$('.overscreen2').is(':visible') ){
					$('.overscreen2').show();
				setTimeout(function() {$('.overscreen2').addClass('active');}, 200);
				} else {
					$('.overscreen2').removeClass('active');
					setTimeout(function() {$('.overscreen2').hide();}, 800);
				}
				$('#container').toggleClass('blurred');
					//app.toast('Has cerrado la sesión, hasta pronto');
					//localStorage.clear();
					//window.location.assign('index.html');
				return;
			//}
			app.toast('No ha sido posible crear tu cuenta, inténtalo de nuevo por favor.');
			return;
		});

		$('.logout').click(function(){
			localStorage.clear();
			window.location.assign('index.html');
			return;
		});
		$('.logout_cancel').click(function(){
			$('.overscreen2').hide();
			$('#container').toggleClass('blurred');
			return;
		});

		$('.back_with_logout').click(function(e){
			return back_with_logout(e);
		});


// ----------------------------------------------------------------------

/*
	LOGIN WITHOUT FACEBOOK
							*/

	if($('#login_form').length){

		$('#login_form').validate({
			rules:{
				mail:{
					required:true,
					email:true
				},
				pass:"required"
			},
			messages:{
				mail:{
					required:"Debes proporcionar un correo",
					email:"Proporciona un correo válido"
				},
				pass:"Este campo es requerido para acceder a tu cuenta"
			},
			submitHandler:function(){

				console.log('login sin facebook');

				var data_login	= app.getFormData("#login_form");

				console.log(data_login.mail);

				data_login.pass = $('#pass').val();
				var responsedata = apiRH.loginNative(data_login);
			  	console.log("RESPUESTA: " + responsedata);

				 if(responsedata){
					
					localStorage.setItem('user', JSON.stringify(responsedata));

					var user = JSON.parse(localStorage.getItem('user'));

					console.log('USER: ' + user.customerId);

					if(user.customerId !== undefined)
				 		window.location.assign('dieta.html');
				 	else
				 		window.location.assign('feed.html');
				 	
				 	return;
				}else{
					app.toast('Error en la combinación de usuario / contraseña, por favor intenta de nuevo.');
				}
			}
		}); //END VALIDATE
	}


		//-----------------------------
		//
		// Validate code
		//
		//-----------------------------

		if($('#code_form').length)
			$('#code_form').validate({
				rules:{
					code:"required"
				},
				messages:{
					code:"Proporciona tu código de activación"
				},
				submitHandler:function(){
					// SERVICIO PARA OBTENER EL CODIGO DE VALIDACION
					
					window.location.assign('feed.html');


				}
		}); //END VALIDATE
		
		var initialViewHeight = document.documentElement.clientHeight;

		var fixWithKeyboard = function(){

			Keyboard.disableScrollingInShrinkView(false);
			Keyboard.shrinkView(true);
			$(window).resize();
			$(document).resize();
			// $('#container').addClass('conteclado');
			// $('#container').css('height',document.documentElement.clientHeight+"px");
			// var calculate = document.documentElement.clientHeight-43;
			// $('#mensaje-chat').focus();
			// $('#container').scrollTop($('#container').prop("scrollHeight"));
			// $('body').scrollTop(0);
			// $('#messages-list').trigger("click");
			// $('.escribir').css('top',calculate+"px");
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			console.log('keyboard did show');
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			console.log('keyboard did hide');
			window.openKeyboard = false;
			$('#container').removeClass('conteclado');
			$('#container').css('height', document.documentElement.clientHeight+"px");
			$('.escribir').css('top',"initial");
		});



		//-----------------------------
		//
		// Login Facebook
		//
		//-----------------------------

		$('.face').click(function () {
			
			console.log('CLICK FACEBOOK LOGIN');
			
			apiRH.loginOauth('facebook');
			
		});



		/*TARJETA DE CREDITO*/
		$('#send_fPago').on('click', function(){

		   		console.log("click to next");

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
		   			var response = apiRH.makePayment(token.id);
		   			// Funcion de mensaje de bienvenida
		   			if(response){
		   				
		   				if(response){

		   					if(!$('.overscreen6').is(':visible') ){
		   						$('.overscreen6').show();
		   					setTimeout(function() {$('.overscreen6').addClass('active');}, 200);
		   					} else {
		   						$('.overscreen6').removeClass('active');
		   						setTimeout(function() {$('.overscreen6').hide();}, 800);
		   					}
		   					$('#container').toggleClass('blurred');

		   					$('#go_next').click(function(){
		   						$('.overscreen6').hide();
		   						$('#container').toggleClass('blurred');
		   						window.location.assign('dieta.html');
		   					});

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
		});//endCLICK

		
	});

