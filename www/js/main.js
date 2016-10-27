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
			window.firstTime = true;
			
			var is_login 	= apiRH.has_token();
			var is_client 	= localStorage.getItem('customerId');
			var is_current 	= localStorage.getItem('valido');

			window.cordova_full_path = "";

			/*** TODO: Get this shit into a catalogue ***/
			window.catalogues 						= [];
			window.catalogues.months 				= [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
			window.catalogues.coach_type 			= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
			window.catalogues.restricciones 		= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
			window.catalogues.objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
			window.catalogues.sex 					= [ 'Hombre', 'Mujer'];
			window.catalogues.tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];


			/* IMPORTANT to set requests to be syncronous */
			/* TODO: test all requests without the following code 'cause of deprecation */
			$.ajaxSetup({
				 async: false
			});

			this.registerCompiledPartials();

			window.loggedIn 	= false;
			window.init_scripts = [];
			window._user 		= [];
			this.keeper 		= window.localStorage;
			

			/*----------------------- Routing user accordingly ---------------------------*/
			if(is_login){
				console.log('You okay, now you can start making calls');
				/* Take the user to it's timeline */
				loggedIn = true;
				var is_access 	= window.is_access;
				var is_feed 	= window.is_feed;
				_user 			= JSON.parse( app.keeper.getItem('user') );
				/*** Check referer ***/
				if(is_access){

					if(is_client == 'not_set'){
						/*** Still haven't paid ***/
						if( app.keeper.getItem('email_verification') == 'false' ){
							/*** Haven't validated email code ***/
							return app.render_validate_code();
						}
						
						/*! 
						 * Render Initial questions 
						 * TODO: Render chunk depending on information already provided
						 */
						return app.render_initial_record();
					}
					_user = JSON.parse( app.keeper.getItem('user') );
					return app.render_myPlan();

				}
				/* Render Home (myPlan) */
				return app.render_myPlan();
			}
			return app.render_entermode();
			/*-------------------- Code below this line won't run ------------------------*/
		},
		initPushNotifications: function() {
			console.log("Initilizing push notifications service");
			var notificationOpenedCallback = function(jsonData) {
				console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
			};

			window.plugins.OneSignal
									.startInit("6e792a4f-bf04-4f96-9d1e-98052526fafc")
									.handleNotificationOpened(notificationOpenedCallback())
									.endInit();
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
		registerTemplate : function(name) {
			$.ajax({
				url : 'views/' + name + '.hbs',
				success : function(response) {
						if (Handlebars.templates === undefined)
							Handlebars.templates = {};
					Handlebars.templates[name] = Handlebars.compile(response);
				}
			});
			return;
		},
		registerCompiledPartials: function() {
			/* Add files to be loaded here */
			var filenames = ['header', 'loader', 'footer_menu', 'footer_activities'];
			filenames.forEach(function (filename) {
					Handlebars.registerPartial(filename, Handlebars.templates[filename]);
			});
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
			window.cordova_full_path = (typeof(cordova) != 'undefined') 
									 ? cordova.file.applicationDirectory+"www/"
									 : '';
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

			try{
				app.initPushNotifications();
			}
			catch(err){
				app.toast("Push notifications error: "+JSON.stringify(err));
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
			var meInfo 	= app.keeper.getItem('user');
			var parsed 	= {me: meInfo};
			
			if(optional_data){
				parsed['data'] = optional_data;
			}
			if(history_title)
				parsed['header_title'] = history_title;
			if( typeof(cordova_full_path) != 'undefined' && cordova_full_path != '' )
				parsed['cordova_full_path'] = cordova_full_path;
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
		check_or_renderContainer : function(){
			/*** First time loading home ***/
			if(window.firstTime){
				console.log("Rendering first time");
				var container_template = Handlebars.templates['container'];
				var html 	 = container_template();
				$('.rootContainer').html( html );
			}
		},
		render_entermode : function(url){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Enter mode");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('entermode', data, '.view', url, 'inicio', false, false);
		},
		render_login : function(url){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Login");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('login', data, '.view', url, 'login');
		},
		render_login_email : function(url){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Login email");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('login-mail', data, '.view', url, 'login');
		},
		render_register : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Register landing");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('register', data, '.view', url, 'segundo');
		},
		render_register_mail : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Register by Email");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('register-mail', data, '.view', url, 'segundo');
		},
		render_validate_code : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Validation Code");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('code', data, '.view', url, 'login');
		},
		render_initial_record : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Initial Questions");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('record', data, '.view', url, 'initialRecord');
		},
		render_myPlan : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering My Plan");
			var data = this.gatherEnvironment(null, "Mi Plan");
			data.is_scrollable = false;
			return this.switchView('my-plan', data, '.view', url, 'dieta');
		},
		render_mainmenu : function( url ){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Main menu");
			var data = this.gatherEnvironment(null, "Menu principal");
			data.is_scrollable = false;
			return this.switchView('main-menu', data, '.view', url, 'main-menu');
		},
		render_modal : function(modalName, data, appendTarget){

			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering Modal: "+modalName);
			var data = this.gatherEnvironment(data, "");
			data.is_scrollable = false;
			var modalTemplate = Handlebars.templates[newTemplate];
			$(appendTarget).css("opacity", 0).append( modalTemplate(data) );

			$(appendTarget).html( modalTemplate(data) ).css("display", "block")
														 .animate(	{
															opacity: 1
														}, 360);
		},
		render_dialog : function(title, message, options){
			return app.showLoader();
		},
		render_settings : function(){
			return app.showLoader();
		},
		render_chat : function(){
			return app.showLoader();
		},
		render_menu : function(){
			return app.showLoader();
		},
		render_create_account : function(){
			return app.showLoader();
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
		switchView: function(newTemplate, data, targetSelector, recordUrl, targetClass, keepLoader, leNiceTransition){
			
			/* Push to history if url is supplied */
			if(recordUrl) window.history.pushState(newTemplate, newTemplate, '/'+recordUrl);
			
			leNiceTransition = (typeof(leNiceTransition) != 'undefined') ? leNiceTransition : true;
			var template = Handlebars.templates[newTemplate];
			if(!template){
				console.log("Template doesn't exist");
				return false;
			}
			$(targetSelector).fadeOut(360, function(){

				if(targetClass) $(targetSelector).attr('class','view').addClass(targetClass);

				if(!leNiceTransition){

					$(targetSelector).html( template(data) ).css({ "opacity": 0, "display": "block"})
															 .animate(	{
																opacity: 1
															}, 640);
				}else{

					$(targetSelector).html( template(data) ).css("opacity", 1)
															 .css("display", "block")
															 .css("margin-left", "20px")
															 .animate(	{
																			'margin-left': "0",
																			opacity: 1
																		}, 360);
				}
				
			});

			if(!keepLoader)
				return setTimeout(function(){
					if(window.firstTime)
						window.firstTime = false;				
					app.hideLoader();
					initializeEvents();
				}, 2000);
				
			return setTimeout(function(){
					if(window.firstTime)
						window.firstTime = false;				
					initializeEvents();
				}, 2000);
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
				alert(message);
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
		feed_user_defaults: function(firstName,lastName,email,customerId,password,token,userId,chatId,chatPassword,coachId,coachQuickblox,dietId,user,exerciseValue,picture){
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
		get_diet: function(dietId){
			
			return apiRH.getRequest('tables/dieta?_id=' + dietId, null)			
		}
	};

/*      _                                       _                        _       
 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
 *                                                                         |___/ 
 */
	jQuery(document).ready(function($) {
		
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
				$('#blur').toggleClass('blurred');
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
			$('#blur').toggleClass('blurred');
			return;
		});

		$('.back_with_logout').click(function(e){
			return back_with_logout(e);
		});


// ----------------------------------------------------------------------



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
			   		    "number"	: t_card,
			   		    "name"		: t_nombre,
			   		    "exp_year"	: t_ano,
			   		    "exp_month"	: t_mes,
			   		    "cvc"		: t_cvc
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
		   					$('#blur').toggleClass('blurred');

		   					$('#go_next').click(function(){
		   						$('.overscreen6').hide();
		   						$('#blur').toggleClass('blurred');
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
		   		  app.toast('Error al procesar tu pago, ' + error.message);
		   		};

		   		/* Tokenizar una tarjeta en Conekta */

		   		Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
		});//endCLICK


		
	});

