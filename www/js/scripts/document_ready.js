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

			e.stopPropagation();
		});

		if($('#login_form').length){

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
							var coachInfo 	= JSON.parse( app.ls.getItem('user') );
							window._coach = (coachInfo) ? coachInfo : null;
							return window.location.assign('record.html');
							// return app.render_home();
						}
						
					}else{
						app.toast("Ocurrió un error, por favor revisa que tus datos sean correctos.")
					}

					if(login_response){
						
						app.ls.setItem( 'user', JSON.stringify( login_response ) );
						var user 	 = JSON.parse( localStorage.getItem('user') );
						var verified = app.ls.getItem( 'email_verification' );

						if(user.customerId !== undefined){
							// TODO: Load interface via switch method
							app.ls.setItem( 'email_verification', true );
					 		window.location.assign('dieta.html');
						} else if(!verified){
							// TODO: Load interface via switch method
					 		return app.render_code();
					 	}else{
					 		window.location.assign('record.html');
					 	} 	
					 	return;
					}else{
						app.toast('Tu usuario o contraseña son incorrectos, por favor intenta de nuevo.');
					}
					app.hideLoader();
				}
			});

		} // END login_form


		/*  Create a new account the Goog ol' fashion way  */
		if($('#create_account').length)
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
					app.ls.setItem('email_verification', false);
					app.ls.setItem('user_name', data_login.user);
					app.ls.setItem('user_last_name', data_login.last_name);
					
					var login_response 	= apiRH.registerNative(data_login);

					if( login_response ){
						apiRH.headers['X-ZUMO-AUTH'] = login_response;
						var userInfo = apiRH.getInfoUser();
						console.log(userInfo);
						if(userInfo){
							var coachInfo 	= JSON.parse( app.ls.getItem('user') );
							window._coach = (coachInfo) ? coachInfo : null;
							return app.render_validate_code();
						}
						
					}else{
						app.toast("Lo sentimos, el email o usuario ya existe.")
					}

				}
			});
		// END create_account

		/*  Email code validation  */
		if($('#code_form').length)
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
					var res 		= apiRH.validateRegistrationCode(form_data.code, localStorage.mail);
					if( res.length ){
						app.toast("Tu código ha sido validado correctamente!");
						app.ls.setItem('email_verification', true);
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

		/***************************/
		/*  Initial Record events  */
		/***************************/
		if( $('.view').hasClass('initialRecord') ){
	
			initializeRecordEvents();
	
		} // END initialRecord
		

	});

}
