/*
 *	Search for localStorage support
 *
 */

if (localStorage) {
	console.log("Local storage supported");
} else {
  console.log("Local storage not supported");
}

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
	var context = this;
	window.sdk_app_context = null;

	/* 
		Production API URL 
							*/

	window.api_base_url = "https://gingerservice.azure-mobile.net/";  //servicios ginger
	/* Development local API URL */
	// window.api_base_url = "http://dedalo.dev/rest/v1/";
	// window.api_base_url = "http://localhost/~manuelon/dedalo/rest/v1/";
	
	this.ls = window.localStorage;
	/* Constructor */
	this.construct = function(app_context){
					console.log('Initialized ginger api-sdk1.0');
					if(this.ls.getItem('request_token')) this.token = this.ls.getItem('request_token');
					sdk_app_context = app_context;
					/* For chaining purposes ::) */
					return this;
				};
				
		/*** Methods ***/
		/* 
		 * Manage pseudo Log in process to use protected API calls
		 * @param data_login JSON {user_login, user_password}
		 * @return status Bool true is successfully logged in; false if an error ocurred
		 */
		this.loginNative =  function(data_login){

		var email = data_login.mail;
		var pass = data_login.pass;
		var req = {
				method : 'post',
				url : api_base_url + 'api/login',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'Content-Type': 'application/json'
				},
				data : {
					"tipo" : "cliente",
					"mail" : email,
					"password" : pass
				}
			}
			var response = this.makeRequest('api/login', req);

			//console.log(response);

			/*
				GUARDA LOS DATOS DEL USUARIO EN LOCAL STORAGE 
			*/
			
			// if(token){
			localStorage.setItem('token', response.token);
			localStorage.setItem('mail', response.mail);
			localStorage.setItem('userId', response.userId);


			//this.token = response.token;

			var userId 	= localStorage.getItem('userId');
			var mail 	= localStorage.getItem('mail');
			var token 	= localStorage.getItem('token');

			console.log('TOKEN RESPONSE ' + token);
			// }
			//console.log(" ID > > "+userId + " MAIL > > " + mail + " TOKEN > > " + this.token);

			/*
				REGRESA LA RESPUESTA DEL SERVIDOR CON EL USER ID, MAIL Y TOKEN
			*/

			//console.log(token);

			if(token){
				var req = {
					method : 'post',
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

				var user = this.getRequest('tables/cliente/' + userId, req);

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
					
				
					console.log('here mother fucker');	

					return (userId) ? user : false;
				}
				return false;
				
			}

			return false;
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

			var req = {
					method : 'post',
					url : api_base_url + 'api/signup',
					headers: {
						'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
						'X-ZUMO-AUTH': '',
						'Content-Type': 'application/json'
					},
					data : {
						"nombre" : name,
						"apellido" :last_name,
						"mail" : email,
						"password" : pass
					}
				}

			var response = this.makeRequest('api/signup', req);

			console.log(response);  //llega aqui con la respuesta del servidor

			this.token = localStorage.getItem('token');

			console.log('TOKEN: ' + this.token );

			/*
				GUARDA LOS DATOS DEL USUARIO EN LOCAL STORAGE 
			*/

			localStorage.setItem('token', response.token);
			localStorage.setItem('mail', response.mail);
			localStorage.setItem('chatId', response.jid);
			localStorage.setItem('userId', response._id);

			console.log(JSON.stringify(response));

			var userId 	= localStorage.getItem('userId');
			var mail 	= localStorage.getItem('mail');
			var token 	= localStorage.getItem('token');

			console.log(" ID > > "+userId + " MAIL > > " + mail + " TOKEN > > " + token);


			// Function 

			var user = this.getRequest('api/cliente', req);

			console.log(JSON.stringify(user));

			localStorage.setItem('users', JSON.stringify(user));

			return (response.nuevo) ? response : false;
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
					'coach' : localStorage.getItem('coach_id')
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
			var req = {
				method : 'POST',
				url : api_base_url + 'api/history/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					'cliente' : localStorage.getItem('userId'),
					'card_token' : token
				}
			}
			console.log(req);

			var response = this.makeRequest('api/history', req);

			console.log("Request Data Cliente");

			console.log(response.responseText);
			console.log(response.statusText);

			return (response.responseText == "active_subscription") ? true : false;

		};



		this.changePayment = function(token){
			var req = {
				method : 'POST',
				url : api_base_url + 'api/change_payment/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					'cliente' : localStorage.getItem('userId'),
					'tokenId' : token
				}
			}
			console.log(req);

			var response = this.makeRequest('api/change_payment', req);

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

		/*
		 * registerUpTake Registrer event from diet of user
		 * @param data {}
		 * @return response
		 */	
		this.registerUpTake = function(data){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('tables/consumos', req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.updateUserSetting = function(data){
			var req = {
				method : 'patch',
				url : api_base_url + 'tables/cliente/' + data._id,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('tables/cliente/' + data._id, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};


		// GET PAYMENTS FOR USER
		
		this.getPaymentAccount = function(data){
			var req = {
				method : 'patch',
				url : api_base_url + 'api/history/' + data._id,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('api/history/' + data._id, req);

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

			var req = {
				method : 'POST',
				url : api_base_url + 'api/rating/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					"calificacion": data.calificacion,
   					"comment": data.comentarios,
    				"coach": data.coach,
    				"dieta": data.dieta 
				}
			};

			var response = this.makeRequest('tables/rating/', req);

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
		this.save_user_data_clientside = function(data){

			this.ls.setItem('', JSON.stringify({
								user_login: 	data.user_login,
								username: 		data.user_login,
								user_id: 		data.user_id,
								user_role: 		data.role,
								user_profile: 	data.profile_url,
							}));
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
		 * @return JSON encoded response
		 */
		this.makeRequest = function(endpoint, data){
			
			console.log('DATA SEND: ' + data); //llega a makerequest

			sdk_app_context.showLoader();
			var result = {};

			$.ajax({
			  type: 'POST',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				console.log('DONE ' + response);
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = e;
				console.log(JSON.stringify(e));
			});

			 console.log('resuelt ' + result);
			return result;
		};

		this.makePatchRequest = function(endpoint, data){
			
			console.log(data.data); //llega a makerequest

			sdk_app_context.showLoader();
			var result = {};

			console.log('datos' + data.data);

			$.ajax({
			  type: 'PATCH',
			  headers: data.headers,
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
			var result = {};
		
			$.ajax({
			  type: 'GET',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
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
				data : 
					data
				
			}
			console.log(req);
		
			$.ajax({
			  type: 'POST',
			  headers: req.headers,
			  url: req.url,
			  data: JSON.stringify(req.data),
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

		this.getConsumed = function(data){
			sdk_app_context.showLoader();
			var result = {};
			//"https://gingerservice.azure-mobile.net/tables/consumo?coach=\(FeedUserDefaults .coachId())&dieta=\(FeedUserDefaults .dietId())&inicio=\(formatter.stringFromDate(date))&fin=\(formatter.stringFromDate(date2))"
			$.ajax({
			  type: 'GET',
			  headers: data.headers,
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
												
												if(user.customerId !== undefined)
											 		window.location.assign('dieta.html');
											 	else
											 		window.location.assign('feed.html');

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

					 	var userId 	= localStorage.getItem('userId');
					  	var mail 	= localStorage.getItem('mail');
					  	var token 	= localStorage.getItem('token');

					  	console.log(" ID > > "+userId + " MAIL > > " + mail + " TOKEN > > " + token);
					  	
					  	/*
							GET REQUEST
					  	*/

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
					  		window.location.assign('feed.html');	
					  	}else{
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
									// app.toast("Imagen de perfil modificada");
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
									app.showLoader();
									this.transfer_options = new FileUploadOptions();
									this.transfer_options.fileUrl = fileURL;
									this.transfer_options.fileKey = "file";
									this.transfer_options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
									this.transfer_options.mimeType = "image/jpeg";
									console.log(this.transfer_options);
									var params = {};
										params.client = "app";
									this.transfer_options.params = params;
									this.upload_ready = true;
									console.log("prepareProfileTransfer");
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
													encodeURI(api_base_url+"transfers/"+user+"/profile/"), 
													context.profile_transfer_win, 
													context.transfer_fail, 
													this.transfer_options
												);
									}
								};

		/**
		 * Prepare params for Search File transfer
		 * @param fileURL
		 * @param source
		 */
		this.prepareSearchFileTransfer = function(fileURL, source){
									app.showLoader();
									console.log(fileURL);
									this.transfer_options = new FileUploadOptions();
									this.transfer_options.fileUrl 		= fileURL;
									this.transfer_options.fileLocal		= "file://"+fileURL;
									this.transfer_options.fileKey 		= "file";
									this.transfer_options.fileName 		= fileURL.substr(fileURL.lastIndexOf('/') + 1);
									this.transfer_options.httpMethod 	= "POST";
									this.transfer_options.mimeType 		= "image/jpeg";
									this.transfer_options.quality 		= 50;
									this.transfer_options.correctOrientation = true;
									this.transfer_options.chunkedMode 	= false;
									// this.transfer_options.headers 		= "{'Content-Type':'multipart/form-data'}";
									console.log(this.transfer_options);
									var params = {};
										params.client = "app";
									this.transfer_options.params = params;
									this.upload_ready = true;
									var image = {thumb: this.transfer_options.fileLocal};
									console.log(JSON.stringify(image));
									apiRH.addImageToStack(image);
									console.log("prepareSearchTransfer");
									app.hideLoader();
								};

		/*
		 * Initialize Search by image File transfer
		 * @param fileURL
		 * @see prepareProfileTransfer MUST be executed before
		 * Dedalo approved
		 */
		this.initializeSearchFileTransfer = function(params){
												user = (user) ? user : "not_logged";
												if(this.upload_ready){
													var ft = new FileTransfer();
													console.log(JSON.stringify(ft));
													this.transfer_options.params = params;
													ft.upload(  this.transfer_options.fileUrl, 
																encodeURI('https://gingerfiles.blob.core.windows.net/clientes/'), 
																context.search_transfer_win, 
																context.transfer_fail, 
																this.transfer_options
															);
													app.toast("Still processing...")
												}
											};
								


		this.fileselect_win = function (r) {
								if(!r && r == '')
									return;
								return context.prepareProfileFileTransfer(r);
							};

		this.search_fileselect_win = function (r) {
								setTimeout(function() {
									console.log("r ::: "+r);
									console.log("Seach file sent");
									if(!r && r == '')
										return;
									return context.prepareSearchFileTransfer(r);
								}, 0);
							};

		this.profileselect_win = function (r) {
								if(!r && r == '')
									
									return context.prepareProfileFileTransfer(r);
							};
		this.fileselect_fail = function (error) {
								app.toast("An error has occurred: " + error);
							};
		/**
		 * @param String destination Upload destination Options: "profile", "event"
		 * @param String source Source to get media file from Options: "camera", "gallery"
		 * @return void
		 */
		this.getFileFromDevice = function(destination, source){

			this.photoDestinationType = navigator.camera.DestinationType;
			var sourcetype =  navigator.camera.PictureSourceType.PHOTOLIBRARY;
			if(source == "camera") sourcetype =  navigator.camera.PictureSourceType.CAMERA;
			if(destination == 'profile')
				navigator.camera.getPicture(context.profileselect_win, context.fileselect_fail, { quality: 50,
					destinationType: this.photoDestinationType.FILE_URI,
					sourceType: sourcetype,
					mediaType: navigator.camera.MediaType.ALLMEDIA  });
			if(destination == 'search')
				navigator.camera.getPicture(context.search_fileselect_win, context.fileselect_fail, { quality: 100,
						destinationType: this.photoDestinationType.FILE_URI,
						sourceType: sourcetype,
						mediaType: navigator.camera.MediaType.ALLMEDIA  });
			return;
		};

		this.getProfile = function(){
			var token 	= localStorage.getItem('token');
			var userId 	= localStorage.getItem('userId');

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

				var user = this.getRequest('tables/cliente/' + userId, req);

				localStorage.setItem('user', JSON.stringify(user));
				console.log(JSON.stringify(user));
				console.log(user);

				if(user){
					localStorage.setItem('coach_type', user.perfil.personalidad);
					localStorage.setItem('user_name', user.nombre);
					localStorage.setItem('user_last_name', user.apellido);
					localStorage.setItem('genero', user.perfil.sexo);
					localStorage.setItem('customerId', user.customerId);

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
					
					
					console.log('AQUI MOTHER');	

					return (userId) ? user : false;
				}
				return false;
				
			}
		};


		
	}