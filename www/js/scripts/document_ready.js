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

					var data_login	= app.getFormData("#login_form");
					data_login.pass = $('#pass').val();
					var responsedata = apiRH.loginNative(data_login);

					 if(responsedata){
						
						localStorage.setItem('user', JSON.stringify(responsedata));
						var user = JSON.parse(localStorage.getItem('user'));

						if(user.customerId !== undefined)
					 		window.location.assign('dieta.html');
					 	else
					 		window.location.assign('feed.html');
					 	
					 	return;
					}else{
						app.toast('Error en la combinación de usuario / contraseña, por favor intenta de nuevo.');
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
				submitHandler: function(){
					app.showLoader();
					console.log('Creating native user');
					var data_login  	= app.getFormData('#create_account');
					console.log(data_login);

					/* stores user name */
					localStorage.setItem('email_verification', false);
					localStorage.setItem('user_name', data_login.user);
					localStorage.setItem('user_last_name', data_login.last_name);

					data_login.pass 	= $('#pass').val();
					
					var responsedata 	= apiRH.registerNative(data_login);  
					console.log(responsedata);

					if(responsedata) {						

						apiRH.save_user_data_clientside(responsedata);
						app.render_validate_code();
						app.hideLoader();
						return;
					}else{
						return app.toast('Lo sentimos, el email o usuario ya existe.');
					}
				}
			});
		// END create_account



	});

}
