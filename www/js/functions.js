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
				"number": t_card,
				"name": t_nombre,
				"exp_year": t_ano,
				"exp_month": t_mes,
				"cvc": t_cvc
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

 	
	/*MEDIDAS*/
	var minval_med = 20; 
	var maxval_med = 250;
	var rango_med = maxval_med-minval_med;
	var gridme = ($('.medida .drag-parent').width()-30)/rango_med;

	var medida;
	
	$("#medida-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
	$("#medida-up").bind('mousedown', function(e){
		e.preventDefault();
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
			medida = Number($("#medida-up").parent().parent().find('input').val());
			if (medida<99) {
				medida=medida+0.1;
				$("#medida-up").parent().parent().find('input').val(medida.toFixed(1));
				$('input[name="medida"]').attr("value", medida);
			} else {
				medida=medida+1;
				$("#medida-up").parent().parent().find('input').val(medida.toFixed(0));
			}
		}, timer);
		return false;
	})
	 .bind('mouseup', apiRH.clearTimeoutLogic);

	$("#medida-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
	$("#medida-dw").bind('mousedown', function(e){
		e.preventDefault();
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
			medida = Number($("#medida-dw").parent().parent().find('input').val());
			if (medida<100.1) {
				medida=medida-0.1;
				$("#medida-dw").parent().parent().find('input').val(medida.toFixed(1));
				$('input[name="medida"]').attr("value", medida);
			} else {
				medida=medida-1;
				$("#medida-dw").parent().parent().find('input').val(medida.toFixed(0));
			}
		}, timer);
		return false;
	})
	 .bind('mouseup', apiRH.clearTimeoutLogic)
	 .dblclick(function(){
		console.log("Double click");
	});

	// $('#medida').draggable({ 
	// 		containment:"parent",axis:"x",grid:[gridme,gridme],drag:function(){
	// 			var percent = $('.medida .drag-parent').width()-30;
	// 			var donde = Math.round(((($('#medida').position().left)*rango_med)/percent)+minval_med);
	// 			$("#medida-filler").css("width",$('#medida').position().left+20);
	// 			$('#medida-dato-span').html(donde);
	// 			$('#medida-dato').attr('value',donde);
	// 		}
	// });


	if( $('body').hasClass('measures') ){
		$('#add_medidas').on('click', function(){
			/* localStorage MEDIDAS / MEASURED AREA */
			
			localStorage.setItem( 'medidas', $('#medida-dato').val() );
			localStorage.setItem( 'measured_area', $('#measured_area').val() )

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

				var medidas = localStorage.getItem('medidas');
				var area = localStorage.getItem('measured_area');
				var responsedata = apiRH.tracking(area, medidas);
				if(responsedata){
					console.log(area+" "+medidas);
					app.toast("Se han agregado tus medidas");
					//window.location.assign('dieta.html');
				}
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});
			$('#add_cancelar').click(function(){
				$('.alert_tracking').hide();
				$('#blur').toggleClass('blurred');
			});
	}//end if body has class measures


		/*HORAS MINUTOS*/
	var minval_hora = 0; 
	var maxval_hora = 16;
	var rango_hora = maxval_hora-minval_hora;
	var gridhr = ($('.horaeje .drag-parent').width()-30)/rango_hora;
	$('#horaeje').draggable({ containment:"parent",axis:"x",grid:[gridhr,gridhr],drag:function(){
		var percent = $('.horaeje .drag-parent').width()-30;
		var donde = Math.round(((($('#horaeje').position().left)*rango_hora)/percent)+minval_hora);
		$("#horaeje-filler").css("width",$('#horaeje').position().left+20);
		var hora = (donde/4);
		hora = hora.toString().substr(0,1);
		var minutos = (donde/4)*60;
		if (minutos>179) {
			minutos = minutos-180;
		} else if (minutos>119) {
			minutos = minutos-120;
		} else if (minutos>59) {
			minutos = minutos-60;
		}
		if (minutos==0 || minutos==60) {
			minutos="00";
		}
		$('#horaeje-dato').html(hora+":"+minutos);
		$('#duracion').attr("value", hora+":"+minutos);
	  }
	});

	var minval_int = 0; 
	var maxval_int = 3;
	var rango_int = maxval_int-minval_int;
	var gridin = ($('.inteje .drag-parent').width()-30)/rango_int;
	$('#inteje').draggable({ containment:"parent",axis:"x",grid:[gridin,gridin],drag:function(){
		var percent = $('.inteje .drag-parent').width()-30;
		var donde = Math.round(((($('#inteje').position().left)*rango_int)/percent)+minval_int);
		$("#inteje-filler").css("width",$('#inteje').position().left+20);
		var text_int;
		switch (donde) {
			case 0:
				text_int = "baja";
				break;
			case 1:
				text_int = "moderada";
				break;
			case 2:
				text_int = "alta";
				break;
			case 3:
				text_int = "extrema";
				break;
		}

		$('#intensidad').attr('value',text_int);

		switch ($('#intensidad').val() ) {
			case 'baja':
				$('#intensidad').attr('value','0');
				break;
			case 'moderada':
				$('#intensidad').attr('value','1');;
				break;
			case 'alta' :
				$('#intensidad').attr('value','2');
				break;
			case 'extrema' :
				$('#intensidad').attr('value','3');
				break;
		}
		$('#inteje-dato').html(text_int);
	  }
	});




/*
	FEED HTML
*/

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

	
	
	/*
		CAMARA
	*/
	function setOptions(srcType) {
		var options = {
			// Some common settings are 20, 50, and 100
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			// In this app, dynamically set the picture source, Camera or photo gallery
			sourceType: srcType,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: true,
			correctOrientation: true  //Corrects Android orientation quirks
		}
		return options;
	}

	function openCamera(selection) {

		var srcType = Camera.PictureSourceType.CAMERA;
		var options = setOptions(srcType);
		var func = createNewFileEntry;

		navigator.camera.getPicture(function cameraSuccess(imageUri) {

			//displayImage(imageUri);
			// You may choose to copy the picture, save it somewhere, or upload.
			func(imageUri);

		}, function cameraError(error) {
			console.debug("Unable to obtain picture: " + error, "app");

		}, options);
	}

	function displayImage(imgUri) {

		var elem = document.getElementById('imageFile');
		elem.src = imgUri;
	}
	
