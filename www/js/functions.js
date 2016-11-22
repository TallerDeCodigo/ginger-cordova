var gridag;
var minval_age;

var gridej;
var minval_eje;
var anchot = document.documentElement.clientWidth;

$( function() {

	window.fbAsyncInit = function() {
		FB.init({
					appId      : '239633319765955',
					cookie     : true,
					xfbml      : true,
					version    : 'v2.7'
				});
	}

	

	if($('body').hasClass('has-finanzas')){

		var response = apiRH.getTransactions();
		var myString = '';

		$.each(response, function( key, value ) {
			$.each(value, function( key, value ) {
				
				console.log(key + ' ::' + value);

				if(key == 'body'){
					$.each(value, function( key, value ) {

						console.log(key + ' :::: ' + value);

						// INSERTAR HTML
						if(key == 'created_at'){
							var d = new Date(value * 1000);
							$('.miembro').append(d.getDate()+'-'+(d.getMonth()+1) +'-' + d.getFullYear());
						}

						if(key == 'trial_end'){
							var d = new Date(value * 1000);
							$('.suscripcion').append(d.getDate()+'-'+(d.getMonth()+1) +'-' + d.getFullYear());
						}
				
						if(key == 'amount'){
							myString += '<tr><td>$'+ value/100 +'.00</td>';	
						}

						if(key == 'paid_at'){
							var meses_year = ['Enero', 'Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ]
							var r = new Date();
							console.log( );
							var d = new Date(value * 1000);
							// $('._month').html(meses_year[r.getMonth()] + " " +d.getUTCFullYear() );

							myString += '<td> ' + meses_year[r.getMonth()+1] + " " +d.getUTCFullYear() + '</td></tr>';
						}
					});
				}
			});
		});
		$('#historial tbody').append(myString);

	}// END finanzas


	if($('body').hasClass('has-change-payment')){

		$('.enter').click(function () {

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
				var response = apiRH.changePayment(token.id);
				// Funcion de mensaje de bienvenida
				if(response){
					
					if(response)
					{
						app.toast('Los datos se han actualizado');
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
			
		});
			

	}


	


}); // END function


$(window).load(function(){

 

/*
	FEED HTML
*/
		if(app.keeper)
			if( app.keeper.getItem('avatar-admin') ){
				$('.circle-frame').find('img').attr('src', 'http://ginger-admin.cloudapp.net/pictures/' + app.keeper.getItem('avatar-admin'));
			}else{

				if( app.keeper.getItem('avatar') ){
					$('.circle-frame').find('img').attr('src', app.keeper.getItem('avatar') + '?type=large');
				}else{
					$('.circle-frame').find('img').remove();
				}

			}

		// Cambiar coach
		$('.com2send').click(function() {
			$('.comment_pop').show();
			setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
			$('.comment_pop textarea').focus();
		});


		// Cancelar subscripcion
		$('.btn_cancelar').click(function (e) {

			// alert('CANCELAR SUSCRIPTCION');

			if(!$('.cancel_subscription').is(':visible') ){
				$('.cancel_subscription').show();
				setTimeout(function() {$('.cancel_subscription').addClass('active');}, 200);
				} else {
					$('.cancel_subscription').removeClass('active');
					setTimeout(function() {$('.cancel_subscription').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

			var customer_id = localStorage.getItem('customer_id');
			
			var response = apiRH.cancelarSuscripcion(customer_id);

			$('#accept_cancel').click(function(){
				$('.cancel_subscription').hide();
				$('#blur').toggleClass('blurred');

				if(!$('.cancel_subscription2').is(':visible') ){
					$('.cancel_subscription2').show();
					setTimeout(function() {$('.cancel_subscription2').addClass('active');}, 200);
					} else {
						$('.cancel_subscription2').removeClass('active');
						setTimeout(function() {$('.cancel_subscription2').hide();}, 800);
					}
					$('#blur').toggleClass('blurred');

					$('#accept_ccomment').click(function(){
						console.log('ventana para comentario');
						$('.cancel_subscription2').hide();
						if(!$('.comment_pop').is(':visible') ){
							$('.comment_pop').show();
							setTimeout(function() {$('.comment_pop').addClass('active');}, 200);
						} else {
							$('.comment_pop').removeClass('active');
							setTimeout(function() {$('.comment_pop').hide();}, 800);
						}

						$('#write_ch_coach').click(function(){

							localStorage.setItem('cancel_subscription_cmt', $('#msg_ch_coach').val() );

							if(!$('.cancel_subscription3').is(':visible') ){
								$('.cancel_subscription3').show();
								$('.cancel_subscription2').hide();
								setTimeout(function() {$('.cancel_subscription3').addClass('active');}, 200);
								} else {
									$('.cancel_subscription3').removeClass('active');
									setTimeout(function() {$('.cancel_subscription3').hide();}, 800);
								}

								$('#accept_comment3').click(function(){
									console.log('click');
									$('.cancel_subscription3').hide();
									$('#blur').toggleClass('blurred');

									if(response){
										localStorage.clear();
										// TODO: Use render methods not hard loading
										window.location.assign('index.html');
									}	
								});


							// $('.cancel_subscription2').hide();
							// $('#blur').toggleClass('blurred');
						});
					});

					$('#cancelar2').click(function(){
						$('.cancel_subscription2').hide();
						$('#blur').toggleClass('blurred');
					});

					
				/*Llamar hasta estar segurisomo de querer cancelar la subscripccion*/
				// if(response){
				// window.location.assign('index.html');
				// localStorage.clear();
				// }	
			});

			$('#cancelar').click(function(){
				$('.cancel_subscription').hide();
			});

		});


	}); //END WINDOW LOAD clicks