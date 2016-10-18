/* 
 * Prototype: requestHandlerAPI 
 * @params token (optional if not executing auth requests) Locally saved user token
 *
 */
function requestHandlerAPI(){
	/*** Attributes ***/
	this.token = null;
	this.upload_ready = false;
	this.version = "1.3";
	this.app_build = "1.3.2";
	this.device_model = (typeof device != 'undefined') ? device.model : 'not set';
	this.device_platform = (typeof device != 'undefined') ? device.platform : 'not set';
	this.device_platform_version = (typeof device != 'undefined') ? device.version : 'not set';
	this.device_info = {
							sdk_version: this.version,
							build: this.app_build,
							model: this.device_model,
							platform: this.device_platform,
							version: this.device_platform_version
						};

	/*** Request headers ***/
	this.headers = 	{
						'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
						'X-ZUMO-AUTH': window.localStorage.getItem('token'),
						'Content-Type': 'application/json'
					};

	var context = this;
	window.sdk_app_context = null;

	/*  Production API URL  */
	window.api_base_url = "https://gingerservice.azure-mobile.net/";
	
	this.ls = window.localStorage;
	/* Constructor */
	this.construct = function(app_context){
					console.log('Initialized Ginger api-sdk1.0');
					if(this.ls.getItem('request_token')) this.token = this.ls.getItem('request_token');
					sdk_app_context = app_context;
					/* For chaining purposes ::) */
					return this;
				};
				
/***********************/
/*** API sdk Methods ***/
/***********************/
		
		/* 
		 * Manage pseudo Log in process to use protected API calls
		 * @param data_login JSON {user_login, user_password}
		 * @return status Bool true is successfully logged in; false if an error ocurred
		 */
		 
		this.loginNative =  function(data_login){

			var email 	= data_login.mail;
			var pass 	= data_login.pass;
			
			var data = {
							"tipo" 		: "cliente",
							"mail" 		: email,
							"password" 	: pass
						};
			var response = this.makeRequest('api/login', data, true);

			/*
				GUARDA LOS DATOS DEL USUARIO EN LOCAL STORAGE 
			*/
			localStorage.setItem('token', response.token);
			localStorage.setItem('mail', response.mail);
			localStorage.setItem('userId', response.userId);

			this.token = response.token;

			var userId 	= localStorage.getItem('userId');
			var mail 	= localStorage.getItem('mail');
			var token 	= localStorage.getItem('token');

			if(!token)
				return false;

			return this.token;
		};

		/**
		 * Get cosumed
		 **/
		this.getDietCosumed = function(data){

			var req = {
				method : 'get',
				url : api_base_url + 'tables/cliente/',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': token,
					'Content-Type': 'application/json'
				},
				data : {
					"tipo" : "cliente",
					"mail" : email,
					"password" : pass
				}
			}

		};

		/* 
		 * Register a new user account the old fashioned way
		 * @param data_login JSON {user_login, user_password}
		 * @return status Bool true is successfully logged in; false if an error ocurred (User already exists)
		 */
		this.registerNative = function(data_login){

			var name = data_login.user;
			var last_name = data_login.last_name;
			var email = data_login.mail;
			var pass = data_login.pass;
			var cPass = data_login.cpass;

			var data = {
						"nombre" : name,
						"apellido" :last_name,
						"mail" : email,
						"password" : pass
					};

			var created_response = this.makeRequest('api/signup', data, true);

			console.log("It's alive! ::: "+JSON.stringify(created_response));

			/* GUARDA LOS DATOS DEL USUARIO EN LOCAL STORAGE  */
			app.keeper.setItem('token', 	created_response.token);
			app.keeper.setItem('mail', 	created_response.mail);
			app.keeper.setItem('chatId', 	created_response.jid);
			app.keeper.setItem('userId', 	created_response._id);

			this.token = app.keeper.getItem('token');

			var userId 	= app.keeper.getItem('userId');
			var mail 	= app.keeper.getItem('mail');
			var token 	= app.keeper.getItem('token');

			return (created_response.nuevo) ? token : false;
		};

		this.validateRegistrationCode = function(code, email){
			var data = {
					'code'	: code, 
					'mail'	: email
				};
			console.log(data);
			return this.makeRequest('api/validatecode/', data);
		};

		/**
		  * Resgistro de tracking 
		  **/

		this.tracking = function(tipo, magnitud){
			
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					'tipo' : tipo,
					'magnitud' : magnitud,
					'cliente' : localStorage.getItem('userId'),
					'coach' : localStorage.getItem('coachId')
				}
			}
			console.log(req);
			var response = this.makeRequest('tables/medicion', req);
			console.log("Request Data Cliente");
			console.log(response);  //llega aqui con la respuesta del servidor
			return (response) ? response : false;
		};

		/**
		  * update perfil
		  **/

		this.updatePerfil = function(data){
			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/cliente/' + localStorage.getItem('userId') ,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}

			console.log(JSON.stringify(req));

			var response = this.makePatchRequest('tables/cliente/' + localStorage.getItem('userId'), req);

			console.log("Request Path Data Cliente");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.getCoachList = function(data){
			var req = {
				method : 'GET',
				url : api_base_url + 'tables/dieta?opciones=1',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}
			console.log(req);

			$.ajax({
			  type: 'GET',
			  headers: req.headers,
			  url:  req.url,
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			console.log(result);
			return result;
		};

		//Conekta

		this.makePayment = function(token)
		{
			var data = {
					'cliente' : localStorage.getItem('userId'),
					'card_token' : token
				};


			var response = this.makeRequest('api/history', data);

			console.log("Request Data Cliente");

			console.log(response.responseText);
			console.log(response.statusText);

			return (response.responseText == "active_subscription") ? true : false;

		};

		this.changePayment = function(token){
			var data = {
					'cliente' : localStorage.getItem('userId'),
					'tokenId' : token
				};
			console.log(req);

			var response = this.makeRequest('api/change_payment', data);

			if(response)
				return true;
			return false;
		};

		this.getTransactions = function(){
			var req = {
				method : 'GET',
				url : api_base_url + 'tables/transaction/?cliente=' + localStorage.getItem('userId'),	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			console.log(req);

			var response = this.getRequest('tables/transaction/?cliente=' + localStorage.getItem('userId'), req);

			console.log("Request Data Cliente Transaction");

			console.log(response);

			return response;

		};

		/**
		 * registerUpTake Registrer event from diet of user
		 * @param data {}
		 * @return response
		 */	
		this.registerUpTake = function(data){
			var data = {};

			var response = this.makeRequest('tables/consumos', data);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		/**
		 * Fetch user information from api
		 * @return JSON encoded object or false if api responds badly
		 */
		this.getInfoUser = function(){
			
			var user = this.getRequest('tables/cliente?_id=' + localStorage.getItem('userId'), null);
			this.save_user_data_clientside(user);
			return (typeof(user) != 'undefined') ? user : false;
		};

		/**
		 * Update user settings
		 * @return Boolean response
		 */
		this.updateUserSetting = function(data){
			var _data = {};

			var response = this.makeRequest('tables/cliente/' + data._id, _data);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};


		// GET PAYMENTS FOR USER
		
		this.getPaymentAccount = function(data){
			var _data = {};

			var response = this.makeRequest('api/history/' + data._id, _data);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.getResenas = function(idCoach){
			var req = {
				method : 'GET',
				url : api_base_url + 'api/rating/?coach=' + idCoach,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			};

			var response = this.getRequest('tables/rating/?coach=' + idCoach, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.makeResena = function(data){

			var _data = {
					"calificacion": data.calificacion,
					"comment": data.comentarios,
					"coach": data.coach,
					"dieta": data.dieta 
				};

			var response = this.makeRequest('tables/rating/', _data);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		/* 
		 * Creates an internal user to make calls to the API
		 * @param username String
		 * @param email String
		 * @param attrs array()
		 * TO DO: Within the attributes sent to this method we can send the profile image url
		 * @param token String
		 * @return status Bool true is successfully created a new user
		 * @return userdata JSON Contains the user info to be stored client side
		 * @see save_user_data_clientside()
		 */
		this.create_internal_user = function(data){
			localStorage.setItem('user', data);										
		};

		/* 
		 * Save user data client side to execute auth requests to the API
		 * @return null
		 * @see this.create_internal_user
		 */
		this.save_user_data_clientside = function(user){

			if(user){
				app.keeper.setItem('coach_type', user.perfil.personalidad);
				app.keeper.setItem('user_name', user.nombre);
				app.keeper.setItem('user_last_name', user.apellido);
				app.keeper.setItem('genero', user.perfil.sexo);

				if(user.perfil.edad !== undefined)
					app.keeper.setItem('edad', user.perfil.edad.real);
				else
					app.keeper.setItem('edad', 0);
					app.keeper.setItem('zipcode', user.cp);
					app.keeper.setItem('estatura', user.perfil.estatura);
					app.keeper.setItem('peso', user.perfil.peso);
					app.keeper.setItem('peso_ideal', user.pesoDeseado);
					app.keeper.setItem('dpw', user.perfil.ejercicio);
					app.keeper.setItem('restricciones', user.restricciones);
					app.keeper.setItem('comentarios', user.comentarios);
					app.keeper.setItem('customerId', user.customerId);
					app.keeper.setItem('chatId', user.chatId);
				if(user.dieta !== undefined)
					app.keeper.setItem('dietaId', user.dieta._id);
				else
					app.keeper.setItem('dietaId', 0);
				if(user.dieta !== undefined)
					app.keeper.setItem('dietaName', user.dieta.nombre);
				else
					app.keeper.setItem('dietaName', '');
				
				if(user.coach !== undefined){
					app.keeper.setItem('nombre_coach', user.coach.nombre);
					app.keeper.setItem('apellido_coach', user.coach.apellido);
					app.keeper.setItem('coach_rate', user.coach.rating);
					app.keeper.setItem('chatPassword', user.coach.chatPassword);
				}
				return;
			}
		};
		/* 
		 * Request new passive token from the API 
		 * @return new generated token
		 */
		this.request_token = function(){
								var response_data = this.getRequest('api/', null);
								/* Verify we got a nice token */
								if( response_data.success !== false){
									this.token = response_data.data.request_token;
									this.ls.setItem('request_token', response_data.data.request_token);
									return this;
								}
								return this;
							};

		/* 
		 * Set token user
		 * @return the token
		 */
		this.set_user_token = function(){
								
							};
		/* 
		 * Wrapper for the getRequest, makeRequest methods 
		 * @param type Request type (POST, GET, PUT, DELETE)
		 * @param endpoint String The API endpoint (See Documentation)
		 * @param data JSON Data to pass to the endpoint in a JSON format
		 * @return stored token, false if no token is stored
		 * TO DO: Manage put, delete methods
		 */
		this.execute = function(type, endpoint, data){
						if(type === 'POST') return this.makeRequest(endpoint, data);
						if(type === 'GET')  return this.getRequest(endpoint, data);
						if(type === 'PUT')  return this.putRequest(endpoint, data);
					};
		/* 
		 * Check if the Request object has a token
		 * @return stored token, false if no token is stored
		 * @see localStorage
		 */
		this.has_token = function(){
			return (typeof this.token != 'undefined' || this.token !== '') ? localStorage.getItem('token') : false;
		};
		/* 
		 * Check if the Request object has a valid token
		 * @return stored token, false if no token is stored
		 */
		this.has_valid_token = function(){
							if(this.token !== undefined || this.token !== ''){

								console.log("Looks like you already have a token, let's check if it is valid");
								var dedalo_log_info = (typeof this.ls.getItem('dedalo_log_info') != undefined) ? JSON.parse(this.ls.getItem('dedalo_log_info')) : null;
								if(!dedalo_log_info) return false;

									var user 		= dedalo_log_info.user_id;
									var data_object =   {
															user_id : user, 
															request_token : apiRH.get_request_token(),
															device_info: this.device_info
														};
									var response 	= this.makeRequest('auth/user/checkToken/', data_object);
									var var_return 	= (response.success) ? true : false;
							}
							return var_return;
						};
		/* 
		 * Request token getter
		 * @return stored token, null if no token is stored
		 */
		this.get_request_token = function(){
									return this.token;
								};
		/* 
		 * Executes a POST call
		 * @param endpoint API endpoint to make the call to
		 * @param data url encoded data
		 * @param noHeaders Boolean defaults to false
		 * @return JSON encoded response
		 */
		this.makeRequest = function( endpoint, data, noHeaders ){

			console.log(' ::: MAKE REQUEST ::: ');
			setTimeout(function(){
				app.showLoader();
			}, 420);
			var result = {};

			var options = 	{
								type 		: 'POST',
								url			: window.api_base_url+endpoint,
								data 		: JSON.stringify(data),
								dataType 	: 'json',
								async 		: false
							};
			var myHeaders = (!noHeaders || typeof(noHeaders) == 'undefined') ? apiRH.headers : null;
			if(myHeaders)
				options.headers = myHeaders;
			console.log(options);

			$.ajax(options)
			 .always( function(response){
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			 })
			 .done( function(response){
			 	console.log(response);
				result = response;
			 })
			 .fail( function(e){
				console.log(e);
				return false;
			});
			return result;
		};

		this.makePatchRequest = function(endpoint, data){
			
			sdk_app_context.showLoader();
			var result = {};

			console.log('datos' + data.data);

			$.ajax({
			  type: 'PATCH',
			  headers: apiRH.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});
			return result;
		};
		/* 
		 * Executes a GET call
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON encoded response
		 * @see API documentation about jsonp encoding
		 */
		this.getRequest = function(endpoint, data){
			sdk_app_context.showLoader();
			var myData = (!data) ? "" : JSON.stringify(data);
			var result = {};
		
			$.ajax({
			  type: 'GET',
			  headers: apiRH.headers,
			  url: window.api_base_url+endpoint,
			  data: myData,
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				// console.log('done');
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				console.log('fail');
				result = false;
				console.log(JSON.stringify(e));
				app.hideLoader();
			});

			return result;
		};

		/* 
		 * Executes a PUT call
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON success
		 * @see API documentation
		 */
		this.putRequest = function(endpoint, data){
							
							sdk_app_context.showLoader();
							var result = {};
							/* ContentType is important to parse the data server side since PUT doesn't handle multipart form data */
							$.ajax({
								type: 	'PUT',
								data: 	$.param(data),
								contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
								url: 	window.api_base_url+endpoint,
							})
							 .done(function(response){
								result = response;
								sdk_app_context.hideLoader();
							 })
							 .fail(function(e){
								result = false;
								console.log(e);
							 });
							 return result;
						};

		/**
		 * Executes a PATCH update
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON success or JSON encoded data
		 * @see API documentation
		 * @todo Actually make the request via PATCH method
		 */
		this.patchRequest = function(endpoint, data){
							sdk_app_context.showLoader();
							var userInfo = {};

							var xhr = new XMLHttpRequest();
							xhr.open('POST', window.api_base_url+endpoint);
							xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
							xhr.onload = function() {
								console.log(xhr.status);
								if (xhr.status === 200) {
									var userInfo = JSON.parse(xhr.responseText);
									console.log(userInfo);
									sdk_app_context.hideLoader();
								}
							};
							xhr.send(data);
							/* ContentType is important to parse the data server side since PUT doesn't handle multipart form data */
							 return userInfo;
						};

		this.makeCosume = function(data){
			sdk_app_context.showLoader();
			var result = {};

			var req = {
				method : 'POST',
				url : api_base_url + 'tables/consumo/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data :  data
			};
			
			console.log(req);
		
			$.ajax({
			  type: 'POST',
			  headers: apiRH.headers,
			  url: req.url,
			  data: JSON.stringify(req.data),
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
				console.log(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			return result;

		};

		this.getConsumed = function(FechaIni, FechaFin){
			sdk_app_context.showLoader();
			var result = {};

			var req = {
				method : 'GET',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			var user = JSON.parse(localStorage.getItem('user'));

			var idCoach = user.coach._id;

			$.ajax({
			  type: 'GET',
			  headers: req.headers,
			  url: 'https://gingerservice.azure-mobile.net/tables/consumo?coach=' + idCoach + '&dieta=' + localStorage.getItem('dietaId') + '&inicio=' + FechaIni + '&fin='+FechaFin,
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			return result;
		};

		this.cancelarSuscripcion = function(data){
			$.ajax({
					url: '',
					type: 'post',
					data: {}
			})
			.done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			.fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			return result;
		};				
		/* 
		 * Perform OAuth authentication 
		 * @param provider String Values: 'facebook', 'twitter', 'google_plus'
		 * @param callback function The callback function depending on the provider
		 * @return null
		 * @see loginCallbackTW, loginCallbackFB, loginCallbackGP
		 */
		this.loginOauth   =  function(provider){
			OAuth.initialize('a6JLuBGGgfFNhFvcQ2V0tCbdmWI');
			console.log('LOGIN OAUTH');
			sdk_app_context.showLoader();
			var fb_name;
			var fb_lastname;
			var fb_email;
			var fb_avatar;
			var fb_Id;
			
			OAuth.popup(provider)
				.done(function(result){
					console.log(result);
					result.me().done(function(data){

					 fb_name 		= data.firstname;
					 fb_lastname 	= data.lastname;
					 fb_email 		= data.email;
					 fb_avatar 		= data.avatar;
					 fb_Id 			= data.id;

					 console.log(data);

					 localStorage.setItem("avatar", fb_avatar);

					 var req = {
						method : 'post',
						url : api_base_url + 'api/signup',
						headers: {
							'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
							'X-ZUMO-AUTH': '',
							'Content-Type': 'application/json'
						},
						data : {
							"nombre" : fb_name,
							"apellido" :fb_lastname,
							"mail" : fb_email,
							"password" : fb_Id
						}
					 }

					 /*
						MAKE REQUEST
					 */
					 sdk_app_context.showLoader();
					 var result = {};

					 $.ajax({
					   type: 'POST',
					   headers: req.headers,
					   url: window.api_base_url+'api/signup',
					   data: JSON.stringify(req.data),
					   dataType: 'json',
					   async: false
					 })
					  .done(function(response){
						result = response;
						console.log(response);

						if(response.Status == "ERROR")
						{
							alert("El usuario ya se encuentra registrado, favor de hacer login");
							console.log('Error usuario registrado');

							var req = {
								method : 'post',
								url : api_base_url + 'api/login',
								headers: {
									'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
									'Content-Type': 'application/json'
								},
								data : {
									"tipo" : "cliente",
									"mail" : fb_email,
									"password" : fb_Id
								}
							}

							console.log(req.data);
							//REQUEST TO LOGIN
							$.ajax({
							   type: 'POST',
							   headers: req.headers,
							   url: window.api_base_url+'api/login',
							   data: JSON.stringify(req.data),
							   dataType: 'json',
							   async: false })
							  .done(function(response){
									
									console.log(req);

									localStorage.setItem('token', response.token);
									localStorage.setItem('mail', response.mail);
									localStorage.setItem('userId', response.userId);

									var userId 	= localStorage.getItem('userId');
									var mail 	= localStorage.getItem('mail');
									var token 	= localStorage.getItem('token');

									console.log('TOKEN RESPONSE ' + token);

									if(token){
										var req = {
											method : 'post',
											url : api_base_url + 'tables/cliente/',
											headers: {
												'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
												'X-ZUMO-AUTH': token,
												'Content-Type': 'application/json'
											}
										}

										$.ajax({
										   type: 'GET',
										   headers: req.headers,
										   url: window.api_base_url+'tables/cliente/'+ userId,
										   data: JSON.stringify(req.data),
										   dataType: 'json',
										   async: false })
										  .done(function(user){

											console.log(JSON.stringify(user));
											console.log(user);

											if(user){
												localStorage.setItem('coach_type', user.perfil.personalidad);
												localStorage.setItem('user_name', user.nombre);
												localStorage.setItem('user_last_name', user.apellido);
												localStorage.setItem('genero', user.perfil.sexo);

												if(user.perfil.edad !== 'undefined')
													localStorage.setItem('edad', user.perfil.edad.real);
												else{

													localStorage.setItem('edad', 0);
													localStorage.setItem('zipcode', user.cp);
													localStorage.setItem('estatura', user.perfil.estatura);
													localStorage.setItem('peso', user.perfil.peso);
													localStorage.setItem('peso_ideal', user.pesoDeseado);
													localStorage.setItem('dpw', user.perfil.ejercicio);
													localStorage.setItem('restricciones', user.restricciones);
													localStorage.setItem('comentarios', user.comentarios);
													localStorage.setItem('customerId', user.customerId);
													localStorage.setItem('chatId', user.chatId);
												}
												if(user.dieta !== 'undefined'){
													localStorage.setItem('dietaId', user.dieta._id);
												}else{
													localStorage.setItem('dietaId', 0);
												}
												if(user.dieta !== 'undefined'){
													localStorage.setItem('dietaName', user.dieta.nombre);
												}else{
													localStorage.setItem('dietaName', '');
												}
												if(user.coach !== 'undefined'){
													localStorage.setItem('nombre_coach', user.coach.nombre);
													localStorage.setItem('apellido_coach', user.coach.apellido);
													localStorage.setItem('coach_rate', user.coach.rating);
													localStorage.setItem('chatPassword', user.coach.chatPassword);
												}	
												if(user.customerId !== 'undefined'){
													// TODO: Use render methods not hard loading
													window.location.assign('dieta.html');
												}else{
													// TODO: Use render methods not hard loading
													window.location.assign('record.html');
												}
											}
											return ;

										  })
										  .fail(function(e){
												console.log('Error');	
										  });
									}
									return ;

							  })
							  .fail(function(e){
									console.log('-- -- -- Error -- -- --');
							  });
							  return;
						}

						localStorage.setItem('token', 	response.token);
						localStorage.setItem('mail', 	response.mail);
						localStorage.setItem('userId', 	response._id);
						
						sdk_app_context.hideLoader(response);

						var userId 	= localStorage.getItem('user_id');
						var mail 	= localStorage.getItem('mail');
						var token 	= localStorage.getItem('token');

						console.log(" ID > > "+userId + " MAIL > > " + mail + " TOKEN > > " + token);

						sdk_app_context.showLoader();

						var req = {
							method : 'post',
							url : api_base_url + 'api/signup',
							headers: {
								'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
								'X-ZUMO-AUTH': localStorage.getItem('token'),
								'Content-Type': 'application/json'
							}
						 }
						var result = {};
						
						$.ajax({
						  type: 'GET',
						  headers: req.headers,
						  url: window.api_base_url+'tables/cliente/'+userId,
						  dataType: 'json',
						  async: false
						})
						 .done(function(response){
							console.log('done');
							result = response;
							sdk_app_context.hideLoader(response);
						})
						 .fail(function(e){
							console.log('fail');
							result = false;
							console.log(JSON.stringify(e));
							alert(JSON.stringify(e));
							return;
						});

						console.log(JSON.stringify(result));

						localStorage.setItem('users', JSON.stringify(result));

						var u = JSON.parse(localStorage.getItem('users'));

						if(u.customerId == 'no_set'){
							// TODO: Use render methods not hard loading
							window.location.assign('record.html');	
						}else{
							// TODO: Use render methods not hard loading
							window.location.assign('dieta.html');	
						}

					 })
					.fail(function(e){
						result = e;
						console.log(result.responseText);
						console.log('Result: ' + result.responseText);
						console.log(JSON.parse(result.responseText));
						
						var m = JSON.parse(result.responseText);

						//----------------------------
						//
						//	Login si ya existe
						//
						//----------------------------


						if(m.code == 422){
							console.log('Error usuario registrado');

							var req = {
								method : 'post',
								url : api_base_url + 'api/login',
								headers: {
									'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
									'Content-Type': 'application/json'
								},
								data : {
									"tipo" : "cliente",
									"mail" : fb_email,
									"password" : fb_Id
								}
							}

							console.log(req.data);
							//REQUEST TO LOGIN
							$.ajax({
							   type: 'POST',
							   headers: req.headers,
							   url: window.api_base_url+'api/login',
							   data: JSON.stringify(req.data),
							   dataType: 'json',
							   async: false })
							  .done(function(response){
									
									console.log(req);

									localStorage.setItem('token', response.token);
									localStorage.setItem('mail', response.mail);
									localStorage.setItem('userId', response.userId);

									var userId 	= localStorage.getItem('userId');
									var mail 	= localStorage.getItem('mail');
									var token 	= localStorage.getItem('token');

									console.log('TOKEN RESPONSE ' + token);

									if(token){
										var req = {
											method : 'post',
											url : api_base_url + 'tables/cliente/',
											headers: {
												'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
												'X-ZUMO-AUTH': token,
												'Content-Type': 'application/json'
											}
										}

										$.ajax({
										   type: 'POST',
										   headers: req.headers,
										   url: window.api_base_url+'tables/cliente/'+ userId,
										   data: JSON.stringify(req.data),
										   dataType: 'json',
										   async: false })
										  .done(function(user){

											console.log(JSON.stringify(user));
											console.log(user);

											if(user){
												localStorage.setItem('coach_type', user.perfil.personalidad);
												localStorage.setItem('user_name', user.nombre);
												localStorage.setItem('user_last_name', user.apellido);
												localStorage.setItem('genero', user.perfil.sexo);

												if(user.perfil.edad !== undefined)
													localStorage.setItem('edad', user.perfil.edad.real);
												else
													localStorage.setItem('edad', 0);
												localStorage.setItem('zipcode', user.cp);
												localStorage.setItem('estatura', user.perfil.estatura);
												localStorage.setItem('peso', user.perfil.peso);
												localStorage.setItem('peso_ideal', user.pesoDeseado);
												localStorage.setItem('dpw', user.perfil.ejercicio);
												localStorage.setItem('restricciones', user.restricciones);
												localStorage.setItem('comentarios', user.comentarios);
												localStorage.setItem('customerId', user.customerId);
												localStorage.setItem('chatId', user.chatId);
												if(user.dieta !== undefined)
													localStorage.setItem('dietaId', user.dieta._id);
												else
													localStorage.setItem('dietaId', 0);
												if(user.dieta !== undefined)
													localStorage.setItem('dietaName', user.dieta.nombre);
												else
													localStorage.setItem('dietaName', '');
												
												if(user.coach !== undefined){
													localStorage.setItem('nombre_coach', user.coach.nombre);
													localStorage.setItem('apellido_coach', user.coach.apellido);
													localStorage.setItem('coach_rate', user.coach.rating);
													localStorage.setItem('chatPassword', user.coach.chatPassword);
												}	
												return (userId) ? user : false;
											}
											return ;

										  })
										  .fail(function(e){
												console.log('Error');	
										  });
									}
									return ;

							  })
							  .fail(function(e){
									console.log('-- -- -- Error -- -- --');
							  });
						}else{
							alert('Error al hacer el registro de usuario');
						}
						return;
					});

					});
					
				}).fail(function(error){
					alert('*** Error ***');
					console.log(error);
				});

			return;
		};


		/* 
		 * Log in callback for Facebook provider
		 * @return Bool TRUE if authentication was successful
		 * @see loginOauth
		 * @see API Documentation
		 */
		this.loginCallbackFB = function(response){
			console.log('LOGIN CALLBACK FB');
			response.me()
			 .done(function(response){
				console.log("en loginCallback FB");
				console.log(response);
				// var email = response.email;
				// var username = response.lastname+"_"+response.id;
				// var found = apiRH.create_internal_user(username, email, {fbId: response.id, avatar: response.avatar, name: response.firstname, last_name: response.lastname}, window.localStorage.getItem('request_token'));
				/* End handshake with server by validating token and getting 'me' data */
				// context.endHandshake(username);
				// console.log(email +"  "+ username);
			})
			 .fail(function(error){
				console.log(error);
			});
		};

		this.transfer_win = function (r) {
									app.toast("Se ha publicado una imagen");
									window.location.reload(true);
								};
		this.profile_transfer_win = function (r) {
									 app.toast("Imagen de perfil modificada");
									// window.location.reload(true);
									return true;
								};
		/*
		 * Advanced search success callback
		 * @param 
		 */
		this.search_transfer_win = function (r) {
			setTimeout(function() {
				app.toast("Thanks! Dedalo is processing your request.");
				app.registerTemplate('success_advanced_search');
				var template = Handlebars.templates['success_advanced_search'];
				console.log(JSON.parse(r.response));
				$('.main').html( template(JSON.parse(r.response)) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);

				return true;
			}, 0);
		};
		/*
		 * Advanced search fail callback
		 * @param 
		 */
		this.transfer_fail = function (error) {
			setTimeout(function() {
				console.log(JSON.stringify(error));
				alert("An error has occurred: Code = " + error.code);
				console.log("upload error source " + error.source);
				console.log("upload error target " + error.target);
			}, 0);
		};
		
		/*
		 * Prepare params for Profile File transfer
		 * @param fileURL
		 */
		this.prepareProfileFileTransfer = function(fileURL){

			console.log('destination enter');
			app.showLoader();
			this.transfer_options = new FileUploadOptions();
			this.transfer_options.fileUrl = fileURL;
			this.transfer_options.fileKey = "file";
			this.transfer_options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
			this.transfer_options.mimeType = "image/jpeg";
			console.log(this.transfer_options.fileUrl);

			console.log(this.transfer_options);
			var params = {};
				params.client = "app";
			this.transfer_options.params = params;
			this.upload_ready = true;
			console.log("prepareProfileTransfer");
			localStorage.setItem('avatar-admin', fileName);
			apiRH.initializeProfileFileTransfer();
			app.hideLoader();
		};
		
		/*
		 * Initialize Profile File transfer
		 * @param fileURL
		 * @see prepareProfileTransfer MUST be executed before
		 */
		this.initializeProfileFileTransfer = function(){
			if(this.upload_ready){
				var ft = new FileTransfer();
				ft.upload(  this.transfer_options.fileUrl, 
					encodeURI("http://ginger-admin.cloudapp.net/rogue.php"), 
					context.profile_transfer_win, 
					context.transfer_fail, 
					this.transfer_options
				);
			}
		};

		/**
		 * Prepare params for Chat File transfer
		 * @param fileURL
		 * @param source
		 */
		this.prepareChatFileTransfer = function(fileURL, source){
									app.showLoader();
									
									var xhr = new XMLHttpRequest();
									xhr.open('GET', fileUrl, true);
									xhr.onreadystatechange = function(){
										console.log(xhr.getResponseHeader('Content-Length'));
										if ( xhr.readyState == 4 ) {
										    if ( xhr.status == 200 ) {
										     	alert('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
												this.chat_upload_params = 	{
																				name: fileURL.substr(fileURL.lastIndexOf('/') + 1), 
																				file: fileURL, 
																				type: "image/jpeg", 
																				size: 123213, 
																				public: false
																			};

												// var image = {thumb: this.transfer_options.fileLocal};
												console.log(JSON.stringify(this.chat_upload_params));
												// $('#image_stage').addClass("visible").append("<img src='cdvfile://"+fileUrl+"' class='chat-img' >");
												return this.initializeChatFileTransfer(this.chat_upload_params);
												app.hideLoader();
										    } else {
										      alert('ERROR');
										    }
										}
									};
									xhr.send(null);
									
								};

		/*
		 * Initialize Search by image File transfer
		 * @param fileURL
		 * @see prepareProfileTransfer MUST be executed before
		 * Dedalo approved
		 */
		this.initializeChatFileTransfer = function(params){
			console.log("You make me laugh, shaddy man");
			QB.content.createAndUpload(params, function(err, response){
				console.log("Response :: "+JSON.stringify(response));
			  if (err) {
				console.log(err);
			  } else {
				var uploadedFileId = response.id;
			 
				// prepare a message
				//
				var msg = {
				  type: currentDialog.type == 3 ? 'chat' : 'groupchat',
				  body: "attachment",
				  extension: {
					save_to_history: 1,
				  }
				};
				msg["extension"]["attachments"] = [{id: uploadedFileId, type: 'photo'}];
			 
				// send a message
				// ...
			  }
			});
		};

		this.fileselect_win = function (r) {
			console.log('selected win: ' + r);
			if(!r && r == '')
				return;
			return context.prepareProfileFileTransfer(r);
		};

		this.chat_fileselect_win = function (r) {
			console.log('chat win: ' + r);
								setTimeout(function() {
									console.log("r ::: "+r);
									console.log("Chat file sent");
									if(!r && r == '')
										return;
									return context.prepareChatFileTransfer(r);
								}, 0);
							};

		this.profileselect_win = function (r) {
			console.log('profile win: ' + r);
			if(!r && r == '')
				return;
			
			console.log("IMAGE: " + r);

			if(r != '')
			{
				$('.profile.circle-frame.edition').html('<img src="'+ r +'"/>');
				console.log('archivo: ' + $('.profile.circle-frame').find('img').attr('src'));
			}

			return context.prepareProfileFileTransfer(r);
		};

		this.fileselect_fail = function (error) {
								app.toast("An error has occurred: " + error);
							};
		/**
		 * @param String destination Upload destination Options: "profile", "chat"
		 * @param String source Source to get media file from Options: "camera", "gallery"
		 * @return void
		 */
		this.getFileFromDevice = function(destination, source){

			this.photoDestinationType = navigator.camera.DestinationType;
			var sourcetype =  navigator.camera.PictureSourceType.PHOTOLIBRARY;
			if(source == "camera") sourcetype =  navigator.camera.PictureSourceType.CAMERA;
			console.log("Sourcetype ::: "+sourcetype);
			if(destination == 'profile')
				navigator.camera.getPicture(context.profileselect_win, context.fileselect_fail, { quality: 50,
					destinationType: this.photoDestinationType.FILE_URI,
					sourceType: sourcetype,
					mediaType: navigator.camera.MediaType.ALLMEDIA  });
			if(destination == 'chat')
				navigator.camera.getPicture(context.chat_fileselect_win, context.fileselect_fail, { quality: 50,
						destinationType: this.photoDestinationType.FILE_URI,
						sourceType: sourcetype,
						mediaType: navigator.camera.MediaType.ALLMEDIA  });
			return;
		};

		this.getProfile = function(){
			var token 	= localStorage.getItem('token');
			var userId 	= localStorage.getItem('userId');

			if(token && userId){
				var req = {
					method : 'post',
					url : api_base_url + 'tables/cliente/',
					headers: {
						'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
						'X-ZUMO-AUTH': token,
						'Content-Type': 'application/json'
					}
				}

				var user = this.getRequest('tables/cliente/' + userId, null);

				localStorage.setItem('user', JSON.stringify(user));
				// console.log(JSON.stringify(user));
				// console.log(user);

				if(user){
					localStorage.setItem('coach_type', user.perfil.personalidad);
					localStorage.setItem('user_name', user.nombre);
					localStorage.setItem('user_last_name', user.apellido);
					localStorage.setItem('genero', user.perfil.sexo);
					localStorage.setItem('customerId', user.customerId);

					if(user.perfil.edad !== undefined){
						localStorage.setItem('edad', user.perfil.edad.real);
					} else {
						localStorage.setItem('edad', 0);
					}
					localStorage.setItem('zipcode', user.cp);
					localStorage.setItem('estatura', user.perfil.estatura);
					localStorage.setItem('peso', user.perfil.peso);
					localStorage.setItem('peso_ideal', user.pesoDeseado);
					localStorage.setItem('dpw', user.perfil.ejercicio);
					localStorage.setItem('restricciones', user.restricciones);
					localStorage.setItem('comentarios', user.comentarios);
					localStorage.setItem('customerId', user.customerId);
					localStorage.setItem('chatId', user.chatId);
					if(user.dieta !== undefined){
						localStorage.setItem('dietaId', user.dieta._id);
					} else {
						localStorage.setItem('dietaId', 0);
					}
					if(user.dieta !== undefined){
						localStorage.setItem('dietaName', user.dieta.nombre);
					} else {
						localStorage.setItem('dietaName', '');
					}
					
					if(user.coach !== undefined){
						localStorage.setItem('nombre_coach', user.coach.nombre);
						localStorage.setItem('apellido_coach', user.coach.apellido);
						localStorage.setItem('coach_rate', user.coach.rating);
						localStorage.setItem('chatPassword', user.coach.chatPassword);
					}	
					
					return (userId) ? user : false;
				}
				return false;
				
			}
			return false;
		};

		/* MEASUREMENT CONTROLS */
		var timeout;
		var estatura;
		var timeoutFlag = null;
		var timer 		= 200;
		var clickTimer 	= null;

		this.stickyTouchHandler = function(event) {

			/*** Exit if trashy event ***/
			if(!event.originalEvent && !event.originalEvent.changedTouches)
				return false;

		    var touches = event.originalEvent.changedTouches,
		        first = touches[0],
		        type = "";
		    switch(event.type) {
		        case "touchstart": 
		        	type = "mousedown"; 	
		        	break;
		        case "touchmove":  
		        	type = "mousemove"; 	
		        	break;        
		        case "touchend":   
		        	type = "mouseup"; 	
		        	break;
		        default: 
		        	break;
		    }

		    var simulatedEvent = document.createEvent("MouseEvent");
		    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
		                              first.screenX, first.screenY, 
		                              first.clientX, first.clientY, false, 
		                              false, false, false, 0/*left*/, null);
		    first.target.dispatchEvent(simulatedEvent);
		    event.preventDefault();
		    return true;
		}

		this.clearTimeoutLogic = function(){
			console.log("Clear timeout logic");
			if(timeoutFlag){
				clearInterval(timeout);
		 	}else{
		 		setTimeout(function(){
		 			clearInterval(timeout);
		 			timeoutFlag = false;
		 			return true;
		 		}, timer);
		 	}
			timeoutFlag = false;
			return false;
		}
		
	}