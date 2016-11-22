   /*     _                        _     _           _   
	*    / \   _ __  _ __     ___ | |__ (_) ___  ___| |_ 
	*   / _ \ | '_ \| '_ \   / _ \| '_ \| |/ _ \/ __| __|
	*  / ___ \| |_) | |_) | | (_) | |_) | |  __/ (__| |_ 
	* /_/   \_\ .__/| .__/   \___/|_.__// |\___|\___|\__|
	*         |_|   |_|               |__/               
	*/

	var app = {
		app_context: this,
		initialized: false,
		// Application Constructor
		initialize: function() {

			this.bindEvents();
			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);
			window.firstTime = true;
			app.initialized = true;
			var is_home 	= window.is_home;
			var is_login 	= apiRH.has_token();
			var is_client 	= localStorage.getItem('customerId');
			var is_current 	= localStorage.getItem('valido');

			window.cordova_full_path = "";
			window.is_home = (window.is_access) ? true : false;

			/*** TODO: Get this shit into a catalogue ***/
			window.catalogues 						= [];
			window.catalogues.months 				= [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
			window.catalogues.coach_type 			= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
			window.catalogues.restricciones 		= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
			window.catalogues.objetivo 				= [ 'Adelgazar','Detox','Bienestar','Rendimiento' ];
			window.catalogues.sex 					= [ 'Hombre', 'Mujer'];
			window.catalogues.age 					= [ '15-24', '25-34', '35-44', '45-54', '55 o más' ];
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
			app.keeper 			= window.localStorage;
			
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
						console.log("Not set");
						if( app.keeper.getItem('email_verification') == 'false' ){
							console.log("No email verification");
							/*** Haven't validated email code ***/
							return app.render_validate_code();
						}
						
						/*! 
						 * Render Initial questions 
						 * TODO: Render chunk depending on information already provided
						 */
						 console.log("Initial record");
						return app.render_initial_record();
					}
					_user = JSON.parse( app.keeper.getItem('user') );
					if(window.is_home)
						return app.render_myPlan();
					return;
				}
				/* Render Home (myPlan) */
				if(window.is_home)
					return app.render_myPlan();
				return;
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
			var meInfo 	= window._user;
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
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Enter mode");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('entermode', data, '.view', url, 'inicio', false, false);
		},
		render_login : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Login");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('login', data, '.view', url, 'login');
		},
		render_login_email : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Login email");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('login-mail', data, '.view', url, 'login');
		},
		render_register : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Register landing");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('register', data, '.view', url, 'segundo');
		},
		render_register_mail : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Register by Email");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('register-mail', data, '.view', url, 'segundo');
		},
		render_validate_code : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Validation Code");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('code', data, '.view', url, 'login');
		},
		render_initial_record : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Initial Questions");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('record', data, '.view', url, 'initialRecord');
		},
		render_myPlan : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment(null, "Mi Plan");
			data.is_scrollable = false;
			return this.switchView('my-plan', data, '.view', url, 'dieta', true);
		},
		render_mainmenu : function( url ){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Main menu");
			var data = this.gatherEnvironment(null, "Menu principal");
			data.is_scrollable = false;
			return this.switchView('main-menu', data, '.view', url, 'perfil');
		},
		render_settings : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering User Profile");
			var extra_data = app.fetch_profile_data();
			var data = this.gatherEnvironment(extra_data, "Mi Perfil");
			console.log(data);
			data.is_scrollable = true;
			return this.switchView('user-profile', data, '.view', url, 'user-profile perfil');
		},
		render_edit_settings : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering User Profile (Editable)");
			var extra_data = app.fetch_profile_data();
			var data = this.gatherEnvironment(extra_data, "Editar Perfil");
			console.log(data);
			data.is_scrollable = true;
			return this.switchView('edit-profile', data, '.view', url, 'edit-profile perfil2');
		},
		render_change_coach : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Change coach");
			// var extra_data = app.fetch_profile_data();
			var data = this.gatherEnvironment(null, "Cambiar de Coach");
			data.is_scrollable = false;
			return this.switchView('change-coach', data, '.view', url, 'cambio-coach');
		},
		render_new_record : function(url, type){
			
			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering New Record");
			var name = "";
			var date = new Date();
			var date_today = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
			var water_val = app.keeper.getItem('agua_lastSaved');
			var agua_local = parseFloat(app.keeper.getItem('agua'));
			var agua_lastSaved = app.keeper.getItem('agua_lastSaved');
			var water_val = (agua_lastSaved != date_today ) ? 0 : agua_local;

			switch(type){
				case 'exercise':
					name = "Ejercicio";
					break;
				case 'water':
					name = "Agua";
					break;
				case 'weight':
					name = "Peso";
					break;
				case 'measures':
					name = "Medidas";
					break;
				case 'mood':
					name = "Ánimo";
					break;
				default:
					name = "";
					break;
			};
			console.log(type);
			console.log(name);
			var data = this.gatherEnvironment(null, name);
			data.is_scrollable = false;
			data.water_val = water_val;
			console.log(data);
			return this.switchView('record-'+type, data, '.view', url, 'record-info '+type);
		},
		render_coming_soon : function(url){
			
			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			console.log("Rendering Coming Soon");
			var data = this.gatherEnvironment(null, "Próximamente");
			data.is_scrollable = false;
			return this.switchView('coming-soon', data, '.view', url, 'coming_soon');
		},
		render_chat : function(){
			return app.showLoader();
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
					$(window).resize();
				}, 2000);
				
			return setTimeout(function(){
					if(window.firstTime)
						window.firstTime = false;				
					initializeEvents();
					$(window).resize();
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
			
			return apiRH.getRequest('tables/dieta?_id=' + dietId, null);		
		},
		fetch_profile_data: function(userId){

			var starMax 		= 5;
			var user_sexo 		= "Mujer";
			var age_range 		= catalogues.age[_user.perfil.edad.enum];
			var coach_type 		= catalogues.coach_type[_user.perfil.personalidad];
			var coach_status	= app.keeper.getItem('coach_status');
			var msg_ch_coach	= app.keeper.getItem('msg_ch_coach');
			var rating_object 	= { "stars": { "active": [], "inactive": [] }  };
			var star 			= Math.round(_user.coach.rating);
			var change_copy 	= (coach_status != 'pending_change') ? "Cambiar Coach" : "En revisión";
			var changed_status 	= (coach_status == 'pending_change') ? true : false;

			if ( _user.perfil.sexo == 1 ) {
				user_sexo = "Hombre";
				$('#hombre').attr('src', 'images/hombre.svg');
				$('#mujer').attr('src', 'images/mujere.svg');
			} else {
				$('#hombre').attr('src', 'images/hombreh.svg');
				$('#mujer').attr('src', 'images/mujere.svg');
			}

			if(_user.perfil.restricciones === 'undefined' || _user.perfil.restricciones == "" || _user.perfil.restricciones == null){
				restricciones_concat = "Ninguna";
			}else{
				var restricciones_cat = window.catalogues.restricciones;					
				var restricciones_concat = "";					
				if(_user.perfil.restricciones){
					for ( var i = 0; i < _user.perfil.restricciones.length; i++ ) {
						var separator = ", ";
						if(i == _user.perfil.restricciones.length - 1)
							separator = "";

						restricciones_concat = restricciones_cat[_user.perfil.restricciones[i]] + separator;
					};
				}else{
					restricciones_concat = "Ninguna";
				}
			}

			

			for (var i = 0; i < star; i++)
				rating_object.stars.active.push(1);
				
			for (var x = 0; x < starMax - star; x++)
				rating_object.stars.inactive.push(1);
			
			var info_profile =  {
									nombre_coach 	: app.keeper.getItem('nombre_coach'),
									coach_last 		: app.keeper.getItem('apellido_coach'),
									coach_name 		: app.keeper.getItem('nombre_coach'),
									coach_type 		: coach_type,
									coach_rating 	: rating_object,
									changed_status 	: changed_status,
									sexo 			: user_sexo,
									edad 			: _user.perfil.edad,
									cp 				: _user.cp,
									height 			: _user.perfil.estatura,
									objective 		: catalogues.objetivo[_user.perfil.objetivo],
									exercise_freq 	: _user.perfil.ejercicio,
									age_range 		: age_range,
									change_btn_copy : change_copy,
									restricciones_concat : restricciones_concat
								};
			return info_profile;
		}
	};
